// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

/**
 * Interface to abstract how the plugin can access the Device Info, this is a stripped
 * down version of the "react-native-device-info" interface and is mostly supplied for
 * testing.
 */
export interface IDeviceInfoModule {
    /**
     * Returns the Device Model
     */
    getModel: () => string;

    /**
     * Returns the device type
     */
    getDeviceType: () => string;

    /**
     * Returns the unique Id for the device, to support both the current version and previous
     * versions react-native-device-info, this may return either a `string` or `Promise<string>`,
     * when a promise is returned the plugin will "wait" for the promise to `resolve` or `reject`
     * before processing any events. This WILL cause telemetry to be BLOCKED until either of these
     * states, so when returning a Promise it MUST `resolve` or `reject` it can't just never resolve.
     * There is a default timeout configured via `uniqueIdPromiseTimeout` to automatically unblock
     * event processing when this issue occurs.
     */
    getUniqueId: () => Promise<string> | string;
}

