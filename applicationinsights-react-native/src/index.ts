// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ReactNativePlugin } from "./ReactNativePlugin";
import { INativeDevice, IReactNativePluginConfig } from "./Interfaces";
import { IDeviceInfoModule } from "./Interfaces/IDeviceInfoModule";
import { getReactNativeDeviceInfo } from "./DeviceInfo/ReactNativeDeviceInfo";
import { ReactNativeManualDevicePlugin } from "./ReactNativeManualDevicePlugin";

export { ReactNativePlugin, ReactNativeManualDevicePlugin, INativeDevice, IReactNativePluginConfig, IDeviceInfoModule };
export { getReactNativeDeviceInfo };
