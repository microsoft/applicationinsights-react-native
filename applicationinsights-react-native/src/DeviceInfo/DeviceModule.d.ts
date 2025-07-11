import { IDeviceInfoModule } from "../Interfaces/IDeviceInfoModule";
export declare const DEVICE_MODEL = "model";
export declare const DEVICE_TYPE = "type";
export declare const UNIQUE_ID = "id";
export declare class DeviceModule implements IDeviceInfoModule {
    getModel: () => string;
    getDeviceType: () => string;
    getUniqueId: () => string | Promise<string>;
    constructor();
}
