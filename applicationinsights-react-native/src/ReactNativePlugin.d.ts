import { IDeviceInfoModule } from "./Interfaces/IDeviceInfoModule";
import { ReactNativeManualDevicePlugin } from "./ReactNativeManualDevicePlugin";
export declare class ReactNativePlugin extends ReactNativeManualDevicePlugin {
    protected getDeviceInfoModule(_deviceInfoModule: any): IDeviceInfoModule;
}
