// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import dynamicProto from "@microsoft/dynamicproto-js";
import {
    AnalyticsPluginIdentifier, ConfigurationManager, IAppInsights, IDevice, IExceptionTelemetry, eSeverityLevel
} from "@microsoft/applicationinsights-common";
import {
    BaseTelemetryPlugin, IAppInsightsCore, IPlugin, IProcessTelemetryContext, IProcessTelemetryUnloadContext, ITelemetryItem,
    ITelemetryPlugin, ITelemetryUnloadState, _eInternalMessageId, _throwInternal, _warnToConsole, arrForEach, dumpObj, eLoggingSeverity,
    getExceptionName,  isUndefined, objForEachKey
} from "@microsoft/applicationinsights-core-js";
import { getGlobal, strShimUndefined } from "@microsoft/applicationinsights-shims";
import { INativeDevice, IReactNativePluginConfig } from "./Interfaces";
import { isPromiseLike, isString } from "@nevware21/ts-utils";
import { IDeviceInfoModule } from "./Interfaces/IDeviceInfoModule";
import { getReactNativeDeviceInfo } from "./DeviceInfo/ReactNativeDeviceInfo";

declare var global: Window;

export class ReactNativePlugin extends BaseTelemetryPlugin {

    identifier: string = "AppInsightsReactNativePlugin";
    priority: number = 140;
    _nextPlugin?: ITelemetryPlugin;

    private _setExceptionHandler: () => void;
    private _collectDeviceInfo: () => void;

    constructor(config?: IReactNativePluginConfig) {
        super();

        // Automatic defaults, don't set values here only set in  _initDefaults()
        let _device: INativeDevice;
        let _config: IReactNativePluginConfig;
        let _analyticsPlugin: IAppInsights;
        let _defaultHandler;
        let _waitingForId: boolean;
        let _waitingTimer: number;
        let _waitingItems: { item: ITelemetryItem, itemCtx?: IProcessTelemetryContext }[] = null;
        let _deviceInfoModule: IDeviceInfoModule;
    
        dynamicProto(ReactNativePlugin, this, (_self, _base) => {
            _initDefaults();

            _self.initialize = (
                config?: IReactNativePluginConfig | object, // need `| object` to coerce to interface
                core?: IAppInsightsCore,
                extensions?: IPlugin[]
            ) => {
                if (!_self.isInitialized()) {
                    _base.initialize(config, core, extensions);

                    const inConfig = config || {};
                    const defaultConfig = _getDefaultConfig();
                    objForEachKey(defaultConfig, (option, value) => {
                        _config[option] = ConfigurationManager.getConfig(
                            inConfig as any,
                            option,
                            _self.identifier,
                            !isUndefined(_config[option]) ? _config[option] : value
                        );
                    });
        
                    if (!_config.disableDeviceCollection) {
                        _self._collectDeviceInfo();
                    }
        
                    if (core && core.getPlugin) {
                        _analyticsPlugin = core.getPlugin<any>(AnalyticsPluginIdentifier)?.plugin as IAppInsights;
                    }
        
                    if (!_config.disableExceptionCollection) {
                        _self._setExceptionHandler();
                    }
                }
            };

            _self.processTelemetry = (item: ITelemetryItem, itemCtx?: IProcessTelemetryContext) => {
                if (!_waitingForId) {
                    _applyDeviceContext(item);
                    _self.processNext(item, itemCtx);
                } else {
                    // Make sure we have an array for the waiting items
                    _waitingItems = _waitingItems || [];
                    _waitingItems.push({
                        item,
                        itemCtx
                    });
                }
            };
        
            _self.setDeviceInfoModule = (deviceInfoModule: IDeviceInfoModule) => {
                // Set the configured deviceInfoModule
                _deviceInfoModule = deviceInfoModule;
            };

            _self.setDeviceId =_setDeviceId;
        
            _self.setDeviceModel = (newModel: string) => {
                _device.model = newModel;
            };
        
            _self.setDeviceType = (newType: string) => {
                _device.deviceClass = newType;
            };
            
            /**
             * Automatically collects native device info for this device
             */
            _self._collectDeviceInfo = () => {
                try {
                    let deviceInfoModule = _deviceInfoModule || getReactNativeDeviceInfo();

                    _device.deviceClass = deviceInfoModule.getDeviceType();
                    _device.model = deviceInfoModule.getModel();
                    let uniqueId = deviceInfoModule.getUniqueId(); // Installation ID support different versions which return a promise vs string
                    if (isPromiseLike(uniqueId)) {
                        _waitingForId = true;
                        if (_waitingTimer) {
                            clearTimeout(_waitingTimer);
                        }
                        _waitingTimer = setTimeout(() => {
                            _waitingTimer = null;
                            _setDeviceId(_device.id);
                        });
                        uniqueId.then((value) => {
                            _setDeviceId(value);
                        }, (reason) => {
                            _warnToConsole(_self.diagLog(), "Failed to get device id: " + dumpObj(reason));
                            // Just reuse the existing id (if any)
                            _setDeviceId(_device.id);
                        });
                    } else if (isString(uniqueId)) {
                        _device.id = uniqueId;
                    }
                } catch (e) {
                    _warnToConsole(_self.diagLog(), "Failed to get DeviceInfo: " + getExceptionName(e) + " - " + dumpObj(e));
                }
            }

            _self._doTeardown = (unloadCtx?: IProcessTelemetryUnloadContext, unloadState?: ITelemetryUnloadState, asyncCallback?: () => void): void | boolean => {
                _resetGlobalErrorHandler();
                _initDefaults();
            };

            function _initDefaults() {
                _device = {};
                _config = config || _getDefaultConfig();
                _analyticsPlugin = null;
                _defaultHandler = null;
                _waitingForId = false;
                _deviceInfoModule = null;
            }

            function _setDeviceId(newId: string) {
                _device.id = newId;
                _waitingForId = false;
                if (_waitingTimer) {
                    clearTimeout(_waitingTimer);
                }

                if (!_waitingForId && _waitingItems && _waitingItems.length > 0 && _self.isInitialized()) {
                    let items = _waitingItems;
                    _waitingItems = null;
                    arrForEach(items, (value) => {
                        try {
                            _self.processTelemetry(value.item, value.itemCtx);
                        } catch (e) {
                            // Just ignore
                        }
                    });
                }
            }

            function _applyDeviceContext(item: ITelemetryItem) {
                if (_device) {
                    item.ext = item.ext || {};
                    item.ext.device = item.ext.device || ({} as IDevice);
                    if (isString(_device.id)) {
                        item.ext.device.localId = _device.id;
                    }
                    if (isString(_device.model)) {
                        item.ext.device.model = _device.model;
                    }
                    if (isString(_device.deviceClass)) {
                        item.ext.device.deviceClass = _device.deviceClass;
                    }
                }
            }

            function _getGlobal(): any {
                if (typeof global !== strShimUndefined && global) {
                    return global as any;
                }

                return getGlobal() as any;
            }

            _self._setExceptionHandler = () => {
                const _global = _getGlobal();
                if (_global && _global.ErrorUtils) {
                    // intercept react-native error handling
                    _defaultHandler = (typeof _global.ErrorUtils.getGlobalHandler === "function" && _global.ErrorUtils.getGlobalHandler()) || _global.ErrorUtils._globalHandler;
                    _global.ErrorUtils.setGlobalHandler(_trackException);
                }
            }

            function _resetGlobalErrorHandler() {
                const _global = _getGlobal();
                if (_global && _global.ErrorUtils && _global.ErrorUtils.getGlobalHandler() === _trackException) {
                    _global.ErrorUtils.setGlobalHandler(_defaultHandler || null);
                }
            }

            // default global error handler syntax: handleError(e, isFatal)
            function _trackException(e, isFatal) {
                const exception: IExceptionTelemetry = { exception: e, severityLevel: eSeverityLevel.Error };

                if (_analyticsPlugin) {
                    _analyticsPlugin.trackException(exception);
                } else {
                    _throwInternal(_self.diagLog(),
                        eLoggingSeverity.CRITICAL, _eInternalMessageId.TelemetryInitializerFailed, "Analytics plugin is not available, ReactNative plugin telemetry will not be sent: ");
                }

                // call the _defaultHandler - react native also gets the error
                if (_defaultHandler) {
                    _defaultHandler.call(global, e, isFatal);
                }
            }

            // Test Hooks
            (_self as any)._config = _config;
            (_self as any)._getDbgPlgTargets = () => {
                return [_device, _deviceInfoModule];
            }
        });

        function _getDefaultConfig(): IReactNativePluginConfig {
            return {
                // enable auto collection by default
                disableDeviceCollection: false,
                disableExceptionCollection: false,
                uniqueIdPromiseTimeout: 5000
            };
        }
    }

    public initialize(
        config?: IReactNativePluginConfig | object, // need `| object` to coerce to interface
        core?: IAppInsightsCore,
        extensions?: IPlugin[]) {

        // @DynamicProtoStub -- DO NOT add any code as this will be removed during packaging
    }

    public processTelemetry(env: ITelemetryItem, itemCtx?: IProcessTelemetryContext) {
        // @DynamicProtoStub -- DO NOT add any code as this will be removed during packaging
    }

    /**
     * Set the module that will be used during initialization when collecting device is enabled
     * (the default), automatic collection can be disabled via the `disableDeviceCollection`
     * config. The `react-native-device-info` module will be used by default if no
     * `deviceInfoModule` is set and collection is enabled.
     * @param deviceInfoModule
     */
    public setDeviceInfoModule(deviceInfoModule: IDeviceInfoModule) {
        // @DynamicProtoStub -- DO NOT add any code as this will be removed during packaging
    }

    /**
     * Manually set the deviceId, if set before initialization and automatic device info collection
     * is enabled this value may get overwritten. If you want to keep this value disable auto
     * collection by setting the `disableDeviceCollection` config to true.
     * @param newId - The value to use as the device Id.
     */
    public setDeviceId(newId: string) {
        // @DynamicProtoStub -- DO NOT add any code as this will be removed during packaging
    }

    /**
     * Manually set the device model, if set before initialization and automatic device info
     * collection is enabled this value may get overwritten. If you want to keep this value
     * disable auto collection by setting the `disableDeviceCollection` config to true.
     * @param newModel - The value to use as the device model.
     */
    public setDeviceModel(newModel: string) {
        // @DynamicProtoStub -- DO NOT add any code as this will be removed during packaging
    }

    /**
     * Manually set the device type (class), if set before initialization and automatic device
     * info collection is enabled this value may get overwritten. If you want to keep this value
     * disable auto collection by setting the `disableDeviceCollection` config to true.
     * @param newType - The value to use as the device type
     */
    public setDeviceType(newType: string) {
        // @DynamicProtoStub -- DO NOT add any code as this will be removed during packaging
    }
}
