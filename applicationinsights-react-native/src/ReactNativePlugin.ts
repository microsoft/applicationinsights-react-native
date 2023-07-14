// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.


import { getReactNativeDeviceInfo } from "./DeviceInfo/ReactNativeDeviceInfo";
import { IDeviceInfoModule } from "./Interfaces/IDeviceInfoModule";
import { ReactNativeManualDevicePlugin } from "./ReactNativeManualDevicePlugin";


export class ReactNativePlugin extends ReactNativeManualDevicePlugin {
    protected getDeviceInfoModule(_deviceInfoModule): IDeviceInfoModule {
        return _deviceInfoModule || getReactNativeDeviceInfo();
    }
}
