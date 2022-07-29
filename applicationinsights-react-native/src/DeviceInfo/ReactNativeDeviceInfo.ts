// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import DeviceInfo from "react-native-device-info";
import { IDeviceInfoModule } from "../Interfaces/IDeviceInfoModule";

/**
 * Returns the "react-native-device-info" as the Device Info Module
 * @returns
 */
export function getReactNativeDeviceInfo(): IDeviceInfoModule {
    return DeviceInfo;
}