// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { objDefineAccessors } from "@microsoft/applicationinsights-core-js";
export var DEVICE_MODEL = "model";
export var DEVICE_TYPE = "type";
export var UNIQUE_ID = "id";
var DeviceModule = /** @class */ (function () {
    function DeviceModule() {
        var _self = this;
        var _model = null;
        var _deviceType = null;
        var _uniqueId = null;
        function _getModel() {
            return _model;
        }
        function _getDeviceType() {
            return _deviceType;
        }
        function _getUniqueId() {
            return _uniqueId;
        }
        // Provide the public interface methods for accessing the values
        _self.getModel = _getModel;
        _self.getDeviceType = _getDeviceType;
        _self.getUniqueId = _getUniqueId;
        // Provide setters (for testing) and re-use the functions for minification
        objDefineAccessors(_self, DEVICE_MODEL, _getModel, function (value) { return _model = value; });
        objDefineAccessors(_self, DEVICE_TYPE, _getDeviceType, function (value) { return _deviceType = value; });
        objDefineAccessors(_self, UNIQUE_ID, _getUniqueId, function (value) { return _uniqueId = value; });
    }
    return DeviceModule;
}());
export { DeviceModule };
//# sourceMappingURL=DeviceModule.js.map