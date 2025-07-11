import { BaseTelemetryPlugin, IAppInsightsCore, IPlugin, IProcessTelemetryContext, ITelemetryItem, ITelemetryPlugin } from "@microsoft/applicationinsights-core-js";
import { IReactNativePluginConfig } from "./Interfaces";
import { IDeviceInfoModule } from "./Interfaces/IDeviceInfoModule";
export declare class ReactNativeManualDevicePlugin extends BaseTelemetryPlugin {
    identifier: string;
    priority: number;
    _nextPlugin?: ITelemetryPlugin;
    private _setExceptionHandler;
    private _collectDeviceInfo;
    constructor(config?: IReactNativePluginConfig);
    protected getDeviceInfoModule(_deviceInfoModule: any): IDeviceInfoModule;
    initialize(config?: IReactNativePluginConfig | object, // need `| object` to coerce to interface
    core?: IAppInsightsCore, extensions?: IPlugin[]): void;
    processTelemetry(env: ITelemetryItem, itemCtx?: IProcessTelemetryContext): void;
    /**
     * Set the module that will be used during initialization when collecting device is enabled
     * (the default), automatic collection can be disabled via the `disableDeviceCollection`
     * config. If no `deviceInfoModule` is set and collection is enabled, an error will be thrown.
     * @param deviceInfoModule
     */
    setDeviceInfoModule(deviceInfoModule: IDeviceInfoModule): void;
    /**
     * Manually set the deviceId, if set before initialization and automatic device info collection
     * is enabled this value may get overwritten. If you want to keep this value disable auto
     * collection by setting the `disableDeviceCollection` config to true.
     * @param newId - The value to use as the device Id.
     */
    setDeviceId(newId: string): void;
    /**
     * Manually set the device model, if set before initialization and automatic device info
     * collection is enabled this value may get overwritten. If you want to keep this value
     * disable auto collection by setting the `disableDeviceCollection` config to true.
     * @param newModel - The value to use as the device model.
     */
    setDeviceModel(newModel: string): void;
    /**
     * Manually set the device type (class), if set before initialization and automatic device
     * info collection is enabled this value may get overwritten. If you want to keep this value
     * disable auto collection by setting the `disableDeviceCollection` config to true.
     * @param newType - The value to use as the device type
     */
    setDeviceType(newType: string): void;
}
