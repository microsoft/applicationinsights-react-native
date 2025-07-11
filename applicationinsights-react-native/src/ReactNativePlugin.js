// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { __extends } from "tslib";
import { getReactNativeDeviceInfo } from "./DeviceInfo/ReactNativeDeviceInfo";
import { ReactNativeManualDevicePlugin } from "./ReactNativeManualDevicePlugin";
var ReactNativePlugin = /** @class */ (function (_super) {
    __extends(ReactNativePlugin, _super);
    function ReactNativePlugin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ReactNativePlugin.prototype.getDeviceInfoModule = function (_deviceInfoModule) {
        return _deviceInfoModule || getReactNativeDeviceInfo();
    };
    return ReactNativePlugin;
}(ReactNativeManualDevicePlugin));
export { ReactNativePlugin };
//# sourceMappingURL=ReactNativePlugin.js.map