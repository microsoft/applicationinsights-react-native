// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { __extends } from "tslib";
import dynamicProto from "@microsoft/dynamicproto-js";
import { AnalyticsPluginIdentifier, eSeverityLevel } from "@microsoft/applicationinsights-common";
import { BaseTelemetryPlugin, _eInternalMessageId, _throwInternal, _warnToConsole, arrForEach, dumpObj, eLoggingSeverity, getExceptionName, onConfigChange } from "@microsoft/applicationinsights-core-js";
import { getGlobal, strShimUndefined } from "@microsoft/applicationinsights-shims";
import { isPromiseLike, isString, objDeepFreeze, scheduleTimeout } from "@nevware21/ts-utils";
var defaultReactNativePluginConfig = objDeepFreeze({
    disableDeviceCollection: false,
    disableExceptionCollection: false,
    uniqueIdPromiseTimeout: 5000
});
var ReactNativeManualDevicePlugin = /** @class */ (function (_super) {
    __extends(ReactNativeManualDevicePlugin, _super);
    function ReactNativeManualDevicePlugin(config) {
        var _this = _super.call(this) || this;
        _this.identifier = "AppInsightsReactNativePlugin";
        _this.priority = 140;
        // Automatic defaults, don't set values here only set in  _initDefaults()
        var _device;
        var _config;
        var _analyticsPlugin;
        var _defaultHandler;
        var _waitingForId;
        var _waitingTimer;
        var _waitingItems = null;
        var _deviceInfoModule;
        var _deviceInfoNeedsUpdate;
        var exceptionHandlerSet;
        dynamicProto(ReactNativeManualDevicePlugin, _this, function (_self, _base) {
            _initDefaults();
            _self.initialize = function (config, // need `| object` to coerce to interface
            core, extensions) {
                var identifier = _this.identifier;
                if (!_self.isInitialized()) {
                    _base.initialize(config, core, extensions);
                    _self._addHook(onConfigChange(config, function (details) {
                        var _a;
                        var ctx = _self._getTelCtx();
                        _config = ctx.getExtCfg(identifier, defaultReactNativePluginConfig);
                        if (!_config.disableDeviceCollection && _deviceInfoNeedsUpdate) {
                            _deviceInfoNeedsUpdate = !_self._collectDeviceInfo();
                        }
                        if (core && core.getPlugin) {
                            _analyticsPlugin = (_a = core.getPlugin(AnalyticsPluginIdentifier)) === null || _a === void 0 ? void 0 : _a.plugin;
                        }
                        else {
                            _analyticsPlugin = null;
                        }
                        if (exceptionHandlerSet) {
                            _resetGlobalErrorHandler();
                        }
                        if (!_config.disableExceptionCollection) {
                            _self._setExceptionHandler();
                            exceptionHandlerSet = true;
                        }
                    }));
                }
            };
            _self.processTelemetry = function (item, itemCtx) {
                if (!_waitingForId) {
                    _applyDeviceContext(item);
                    _self.processNext(item, itemCtx);
                }
                else {
                    // Make sure we have an array for the waiting items
                    _waitingItems = _waitingItems || [];
                    _waitingItems.push({
                        item: item,
                        itemCtx: itemCtx
                    });
                }
            };
            _self.setDeviceInfoModule = function (deviceInfoModule) {
                // Set the configured deviceInfoModule
                _deviceInfoModule = deviceInfoModule;
                _deviceInfoNeedsUpdate = true;
            };
            _self.setDeviceId = _setDeviceId;
            _self.setDeviceModel = function (newModel) {
                _device.model = newModel;
            };
            _self.setDeviceType = function (newType) {
                _device.deviceClass = newType;
            };
            /**
             * Automatically collects native device info for this device
             */
            _self._collectDeviceInfo = function () {
                try {
                    _deviceInfoModule = _this.getDeviceInfoModule(_deviceInfoModule);
                    if (!_deviceInfoModule) {
                        return false;
                    }
                    _device.deviceClass = _deviceInfoModule.getDeviceType();
                    _device.model = _deviceInfoModule.getModel();
                    var uniqueId = _deviceInfoModule.getUniqueId(); // Installation ID support different versions which return a promise vs string
                    if (isPromiseLike(uniqueId)) {
                        _waitingForId = true;
                        if (_waitingTimer) {
                            _waitingTimer.cancel();
                        }
                        _waitingTimer = scheduleTimeout(function () {
                            _waitingTimer = null;
                            _setDeviceId(_device.id);
                        }, 0);
                        _waitingTimer.unref();
                        uniqueId.then(function (value) {
                            _setDeviceId(value);
                        }, function (reason) {
                            _warnToConsole(_self.diagLog(), "Failed to get device id: " + dumpObj(reason));
                            // Just reuse the existing id (if any)
                            _setDeviceId(_device.id);
                        });
                    }
                    else if (isString(uniqueId)) {
                        _device.id = uniqueId;
                    }
                    return true;
                }
                catch (e) {
                    _warnToConsole(_self.diagLog(), "Failed to get DeviceInfo: " + getExceptionName(e) + " - " + dumpObj(e));
                }
            };
            _self._doTeardown = function (unloadCtx, unloadState, asyncCallback) {
                _resetGlobalErrorHandler();
                _initDefaults();
            };
            function _initDefaults() {
                _device = {};
                _config = {};
                _analyticsPlugin = null;
                _defaultHandler = null;
                _waitingForId = false;
                _deviceInfoModule = null;
                _deviceInfoNeedsUpdate = true;
                exceptionHandlerSet = false;
            }
            function _setDeviceId(newId) {
                _device.id = newId;
                _waitingForId = false;
                if (_waitingTimer) {
                    _waitingTimer.cancel();
                }
                if (!_waitingForId && _waitingItems && _waitingItems.length > 0 && _self.isInitialized()) {
                    var items = _waitingItems;
                    _waitingItems = null;
                    arrForEach(items, function (value) {
                        try {
                            _self.processTelemetry(value.item, value.itemCtx);
                        }
                        catch (e) {
                            // Just ignore
                        }
                    });
                }
            }
            function _applyDeviceContext(item) {
                if (_device) {
                    item.ext = item.ext || {};
                    item.ext.device = item.ext.device || {};
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
            function _getGlobal() {
                if (typeof global !== strShimUndefined && global) {
                    return global;
                }
                return getGlobal();
            }
            _self._setExceptionHandler = function () {
                var _global = _getGlobal();
                if (_global && _global.ErrorUtils) {
                    // intercept react-native error handling
                    _defaultHandler = (typeof _global.ErrorUtils.getGlobalHandler === "function" && _global.ErrorUtils.getGlobalHandler()) || _global.ErrorUtils._globalHandler;
                    _global.ErrorUtils.setGlobalHandler(_trackException);
                }
            };
            function _resetGlobalErrorHandler() {
                var _global = _getGlobal();
                if (_global && _global.ErrorUtils && _global.ErrorUtils.getGlobalHandler() === _trackException) {
                    _global.ErrorUtils.setGlobalHandler(_defaultHandler || null);
                }
            }
            // default global error handler syntax: handleError(e, isFatal)
            function _trackException(e, isFatal) {
                var exception = { exception: e, severityLevel: eSeverityLevel.Error };
                if (_analyticsPlugin) {
                    _analyticsPlugin.trackException(exception);
                }
                else {
                    _throwInternal(_self.diagLog(), eLoggingSeverity.CRITICAL, _eInternalMessageId.TelemetryInitializerFailed, "Analytics plugin is not available, ReactNative plugin telemetry will not be sent: ");
                }
                // call the _defaultHandler - react native also gets the error
                if (_defaultHandler) {
                    _defaultHandler.call(global, e, isFatal);
                }
            }
            // Test Hooks
            _self._config = _config;
            _self._getDbgPlgTargets = function () {
                return [_device, _deviceInfoModule, _config];
            };
        });
        return _this;
    }
    ReactNativeManualDevicePlugin.prototype.getDeviceInfoModule = function (_deviceInfoModule) {
        if (!_deviceInfoModule) {
            _warnToConsole(this.diagLog(), "Failed to get DeviceInfo. Provide DeviceInfo while init or turn it off by setting disableDeviceCollection flag to true");
            return null;
        }
        return _deviceInfoModule;
    };
    ReactNativeManualDevicePlugin.prototype.initialize = function (config, // need `| object` to coerce to interface
    core, extensions) {
        // @DynamicProtoStub -- DO NOT add any code as this will be removed during packaging
    };
    ReactNativeManualDevicePlugin.prototype.processTelemetry = function (env, itemCtx) {
        // @DynamicProtoStub -- DO NOT add any code as this will be removed during packaging
    };
    /**
     * Set the module that will be used during initialization when collecting device is enabled
     * (the default), automatic collection can be disabled via the `disableDeviceCollection`
     * config. If no `deviceInfoModule` is set and collection is enabled, an error will be thrown.
     * @param deviceInfoModule
     */
    ReactNativeManualDevicePlugin.prototype.setDeviceInfoModule = function (deviceInfoModule) {
        // @DynamicProtoStub -- DO NOT add any code as this will be removed during packaging
    };
    /**
     * Manually set the deviceId, if set before initialization and automatic device info collection
     * is enabled this value may get overwritten. If you want to keep this value disable auto
     * collection by setting the `disableDeviceCollection` config to true.
     * @param newId - The value to use as the device Id.
     */
    ReactNativeManualDevicePlugin.prototype.setDeviceId = function (newId) {
        // @DynamicProtoStub -- DO NOT add any code as this will be removed during packaging
    };
    /**
     * Manually set the device model, if set before initialization and automatic device info
     * collection is enabled this value may get overwritten. If you want to keep this value
     * disable auto collection by setting the `disableDeviceCollection` config to true.
     * @param newModel - The value to use as the device model.
     */
    ReactNativeManualDevicePlugin.prototype.setDeviceModel = function (newModel) {
        // @DynamicProtoStub -- DO NOT add any code as this will be removed during packaging
    };
    /**
     * Manually set the device type (class), if set before initialization and automatic device
     * info collection is enabled this value may get overwritten. If you want to keep this value
     * disable auto collection by setting the `disableDeviceCollection` config to true.
     * @param newType - The value to use as the device type
     */
    ReactNativeManualDevicePlugin.prototype.setDeviceType = function (newType) {
        // @DynamicProtoStub -- DO NOT add any code as this will be removed during packaging
    };
    return ReactNativeManualDevicePlugin;
}(BaseTelemetryPlugin));
export { ReactNativeManualDevicePlugin };
//# sourceMappingURL=ReactNativeManualDevicePlugin.js.map