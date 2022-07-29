// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { objDefineAccessors } from "@microsoft/applicationinsights-core-js";
import { IDeviceInfoModule } from "../Interfaces/IDeviceInfoModule";

export const DEVICE_MODEL = "model";
export const DEVICE_TYPE = "type";
export const UNIQUE_ID = "id";

export class DeviceModule implements IDeviceInfoModule {
    public getModel: () => string;
    public getDeviceType: () => string;
    public getUniqueId: () => string | Promise<string>;

    constructor() {
        let _self = this;
        let _model: string = null;
        let _deviceType: string = null;
        let _uniqueId: string | Promise<string> = null;

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
        _self.getUniqueId = _getUniqueId

        // Provide setters (for testing) and re-use the functions for minification
        objDefineAccessors(_self, DEVICE_MODEL, _getModel, (value) => _model = value);
        objDefineAccessors(_self, DEVICE_TYPE, _getDeviceType, (value) => _deviceType = value);
        objDefineAccessors(_self, UNIQUE_ID, _getUniqueId, (value) => _uniqueId = value);
    }
}