// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.


import { getReactNativeDeviceInfo } from "./DeviceInfo/ReactNativeDeviceInfo";
import { IDeviceInfoModule } from "./Interfaces/IDeviceInfoModule";
import { ReactNativeBasePlugin } from "./ReactNativeBasePlugin";


export class ReactNativePlugin extends ReactNativeBasePlugin {
    protected getDeviceInfoModule(_deviceInfoModule): IDeviceInfoModule {
        return _deviceInfoModule || getReactNativeDeviceInfo();
    }
}
