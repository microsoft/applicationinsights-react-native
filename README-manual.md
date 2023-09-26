# Microsoft Application Insights JavaScript SDK - React Native Manual Device Plugin

# Purpose
This optional plugin is designed because expo could not run with device-info packages

## Getting Started
```zsh
npm install --save @microsoft/applicationinsights-react-native @microsoft/applicationinsights-web
```
## Initializing the Plugin

To use this plugin, you only need to construct the plugin and add it as an `extension` to your existing Application Insights instance.

However, different from the default react native plugin, this plugin needs to have device info provided, or set to be disabled manually.


### Disabling automatic device info collection

```ts
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import {ReactNativeManualDevicePlugin} from '@microsoft/applicationinsights-react-native/manual';
var RNMPlugin = new ReactNativeManualDevicePlugin();
var appInsights = new ApplicationInsights({
    config: {
        instrumentationKey: 'YOUR_INSTRUMENTATION_KEY_GOES_HERE',
        disableDeviceCollection: true,
        extensions: [RNMPlugin]
    }
});
appInsights.loadAppInsights();
```
#### Note for Android/iOS Expo Users
Due to the specific internal logic in Expo, importing the ReactNativeManualDevicePlugin for the app might fail. If you encounter this issue, manually import the plugin using the following approach:
```ts
import {ReactNativeManualDevicePlugin} from '@microsoft/applicationinsights-react-native/dist-esm/manualIndex';
```

### Using your own device info collection class

```ts
import { ApplicationInsights } from '@microsoft/applicationinsights-web';

// Simple inline constant implementation
const myDeviceInfoModule = {
    getModel: () => "deviceModel",
    getDeviceType: () => "deviceType",
    // v5 returns a string while latest returns a promise
    getUniqueId: () => "deviceId",         // This "may" also return a Promise<string>
};

var RNMPlugin = new ReactNativeManualDevicePlugin();
RNMPlugin.setDeviceInfoModule(myDeviceInfoModule);

var appInsights = new ApplicationInsights({
    config: {
        instrumentationKey: 'YOUR_INSTRUMENTATION_KEY_GOES_HERE',
        extensions: [RNMPlugin]
    }
});

appInsights.loadAppInsights();
```
## Requirements
You must be using a version `>=2.0.0` of `@microsoft/applicationinsights-web`. This plugin will only work in react-native apps, e.g. it will not work with `expo`.