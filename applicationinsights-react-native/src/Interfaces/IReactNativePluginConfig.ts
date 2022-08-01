// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export interface IReactNativePluginConfig {
    /**
     * Disable automatic device collection
     */
    disableDeviceCollection?: boolean;

    /**
     * Disable automatic exception collection
     */
    disableExceptionCollection?: boolean;

    /**
     * Timeout value to unblock the processing of events if the DeviceInfoModule
     * returns a Promise.
     */
    uniqueIdPromiseTimeout?: number;
}
