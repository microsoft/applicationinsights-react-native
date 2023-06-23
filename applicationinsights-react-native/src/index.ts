// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ReactNativePlugin } from "./ReactNativePlugin";
import { INativeDevice, IReactNativePluginConfig } from "./Interfaces";
import { IDeviceInfoModule } from "./Interfaces/IDeviceInfoModule";
import { getReactNativeDeviceInfo } from "./DeviceInfo/ReactNativeDeviceInfo";
import { ReactNativeBasePlugin } from "./ReactNativeBasePlugin";

export { ReactNativePlugin, ReactNativeBasePlugin, INativeDevice, IReactNativePluginConfig, IDeviceInfoModule };
export { getReactNativeDeviceInfo };
