# Microsoft Application Insights JavaScript SDK - React Native Plugin

React Native Plugin for the Application Insights Javascript SDK

<tags
    ms.service="application-insights"
    ms.workload="tbd"
    ms.tgt_pltfrm="ibiza"
    ms.devlang="na"
    ms.topic="article"
    ms.date="08/24/2015"/>

## Getting Started

> By Default: **This plugin relies on [`react-native-device-info`](https://github.com/rebeccahughes/react-native-device-info). You must install and link this package. Keep `react-native-device-info` up-to-date to collect the latest device names using your app.**
>
> Since v3, support for accessing the DeviceInfo has been abstracted into an interface ```IDeviceInfoModule``` to enable you to use / set your own device info module. This interface uses the same function names and result `react-native-device-info`.

```zsh
npm install --save @microsoft/applicationinsights-react-native @microsoft/applicationinsights-web
npm install --save react-native-device-info
react-native link react-native-device-info
```

## Initializing the Plugin Without Device Package
Noticed that react-native-device-info package have conflicts with Expo, a second entry point is created, please see [`Manual-readme`](https://github.com/rebeccahughes/readme) for further details.

## Initializing the Plugin

To use this plugin, you only need to construct the plugin and add it as an `extension` to your existing Application Insights instance.

```ts
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ReactNativePlugin } from '@microsoft/applicationinsights-react-native';

var RNPlugin = new ReactNativePlugin();
var appInsights = new ApplicationInsights({
    config: {
        instrumentationKey: 'YOUR_INSTRUMENTATION_KEY_GOES_HERE',
        extensions: [RNPlugin]
    }
});
appInsights.loadAppInsights();
```

### Disabling automatic device info collection

```ts
import { ApplicationInsights } from '@microsoft/applicationinsights-web';

var RNPlugin = new ReactNativePlugin();
var appInsights = new ApplicationInsights({
    config: {
        instrumentationKey: 'YOUR_INSTRUMENTATION_KEY_GOES_HERE',
        disableDeviceCollection: true,
        extensions: [RNPlugin]
    }
});
appInsights.loadAppInsights();
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

var RNPlugin = new ReactNativePlugin();
RNPlugin.setDeviceInfoModule(myDeviceInfoModule);

var appInsights = new ApplicationInsights({
    config: {
        instrumentationKey: 'YOUR_INSTRUMENTATION_KEY_GOES_HERE',
        extensions: [RNPlugin]
    }
});

appInsights.loadAppInsights();
```
## Requirements
You must be using a version `>=2.0.0` of `@microsoft/applicationinsights-web`. This plugin will only work in react-native apps, e.g. it will not work with `expo`.

## Device Information Collected

By default, this plugin automatically collects
 - **Unique Device ID** (also known as Installation ID)
 - **Device Model Name** (iPhone XS, etc.)
 - **Device Type** (Handset, Tablet, etc.)

## IDeviceInfoModule

```typescript
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
```

If events are getting "blocked" because the `Promise` returned via `getUniqueId` is never resolved / rejected
you can call `setDeviceId()` on the plugin to "unblock" this waiting state. There is also an automatic timeout
configured via `uniqueIdPromiseTimeout` (defaults to 5 seconds), which will internally call `setDeviceId()` with
any previously configured value.

## Compatibility Matrix

| Version |  Application Insights | React Native         | Branch
|---------|-----------------------|----------------------|-----------
| TBD     | TBD (^3.x)            |                      | [main](https://github.com/microsoft/applicationinsights-react-native)
| 3.0.3   | ^2.8.14               | *<br/>dev:^0.69.9    | [release3.x](https://github.com/microsoft/applicationinsights-react-native/tree/release3.x)
| 3.0.2   | ^2.8.12               | *<br/>dev:^0.69.9    | [main](https://github.com/microsoft/applicationinsights-react-native)
| 3.0.1   | ^2.8.10               | *<br/>dev:^0.69.8    | [main](https://github.com/microsoft/applicationinsights-react-native)
| 3.0.0   | ^2.8.5                | *<br/>dev:^0.69.3    | [main](https://github.com/microsoft/applicationinsights-react-native)
| 2.5.6   | ^2.8.5                | *<br/>dev:^0.68.0    | [main](https://github.com/microsoft/applicationinsights-react-native) <-- First release from this repo
| 2.5.5   | 2.8.5                 | *<br/>dev:^0.68.0    | [main](https://github.com/microsoft/applicationinsights-react-native) and [AI master](https://github.com/microsoft/ApplicationInsights-JS/tree/master/extensions/
| 2.5.4   | 2.8.4                 | *<br/>dev:^0.68.0    | [AI master](https://github.com/microsoft/ApplicationInsights-JS/tree/master/extensions/
| 2.5.3   | 2.8.3                 | *<br/>dev:^0.68.0    | [AI master](https://github.com/microsoft/ApplicationInsights-JS/tree/master/extensions/
| 2.5.2   | 2.8.2                 | *<br/>dev:^0.68.0    | [AI master](https://github.com/microsoft/ApplicationInsights-JS/tree/master/extensions/
| 2.5.1   | 2.8.1                 | *<br/>dev:^0.68.0    | [AI master](https://github.com/microsoft/ApplicationInsights-JS/tree/master/extensions/
| 2.5.0   | 2.8.0                 | *<br/>dev:^0.68.0    | [AI master](https://github.com/microsoft/ApplicationInsights-JS/tree/master/extensions/
| 2.4.4   | 2.7.4                 | *<br/>dev:^0.64.2    | [AI master](https://github.com/microsoft/ApplicationInsights-JS/tree/master/extensions/
| 2.4.3   | 2.7.3                 | *<br/>dev:^0.64.2    | [AI master](https://github.com/microsoft/ApplicationInsights-JS/tree/master/extensions/
| 2.4.2   | 2.7.2                 | *<br/>dev:^0.64.2    | [AI master](https://github.com/microsoft/ApplicationInsights-JS/tree/master/extensions/
| 2.4.1   | 2.7.1                 | *<br/>dev:^0.64.2    | [AI master](https://github.com/microsoft/ApplicationInsights-JS/tree/master/extensions/
| 2.4.0   | 2.7.0                 | *<br/>dev:^0.64.2    | [AI master](https://github.com/microsoft/ApplicationInsights-JS/tree/master/extensions/
| 2.3.5   | ^2.6.5                | *<br/>dev:0.64.2     | [AI master](https://github.com/microsoft/ApplicationInsights-JS/tree/master/extensions/
| 2.3.4   | ^2.6.4                | *<br/>dev:0.64.2     | [AI master](https://github.com/microsoft/ApplicationInsights-JS/tree/master/extensions/
| 2.3.3   | ^2.6.3                | *<br/>dev:0.64.2     | [AI master](https://github.com/microsoft/ApplicationInsights-JS/tree/master/extensions/
| 2.3.2   | ^2.6.2                | *<br/>dev:0.63.2     | [AI master](https://github.com/microsoft/ApplicationInsights-JS/tree/master/extensions/
| 2.3.1   | ^2.6.2                | *<br/>dev:0.59.8     | [AI master](https://github.com/microsoft/ApplicationInsights-JS/tree/master/extensions/
| 2.3.0   | ^2.6.0                | *<br/>dev:0.59.8     | [AI master](https://github.com/microsoft/ApplicationInsights-JS/tree/master/extensions/

## Nightly Builds

To aid with testing and validation we also produce and publish nightly builds whenever there is a change from the previous build. These builds are published to the [NpmJs registry](https://www.npmjs.com/package/@microsoft/applicationinsights-react-native) on a successful build / test pass.

This process also [tags the source code](https://github.com/microsoft/applicationInsights-react-native/tags) so that we can track the specific changes included using a nightly build specific version number which is the format "nightly-yymm-##" eg. ```nightly-2208-02```

These nightly builds will not be retained indefinitely and should only be used for __pre-production__ testing and/or validation of any changes that have not yet been released.

### NPM

The NPM builds are tagged as "nightly" and can by downloaded using this as the version number ```npm install @microsoft/applicationinsights-react-native@nightly``` or using the nightly specific version number which is "nightly.yyyymm-###" (```npm install @microsoft/applicationinsights-react-native@2.7.3-nightly.2112-08```) where ## is the specific build number for the month (Note, slightly different version from the source code tag due to compatibility issues between the different systems).

### Deployment process

When a new release is deployed the following occurs as part of the release

- NPM packages are created and published to [NpmJs](https://www.npmjs.com/package/@microsoft/applicationinsights-react-native)

## Contributing

This project welcomes contributions and suggestions. Most contributions require you to
agree to a Contributor License Agreement (CLA) declaring that you have the right to,
and actually do, grant us the rights to use your contribution. For details, visit
https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need
to provide a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the
instructions provided by the bot. You will only need to do this once across all repositories using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/)
or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Data Collection

As this SDK is designed to enable applications to perform data collection which is sent to the Microsoft collection endpoints the following is required to identify our privacy statement.

The software may collect information about you and your use of the software and send it to Microsoft. Microsoft may use this information to provide services and improve our products and services. You may turn off the telemetry as described in the repository. There are also some features in the software that may enable you and Microsoft to collect data from users of your applications. If you use these features, you must comply with applicable law, including providing appropriate notices to users of your applications together with a copy of Microsoft's privacy statement. Our privacy statement is located at https://go.microsoft.com/fwlink/?LinkID=824704. You can learn more about data collection and use in the help documentation and our privacy statement. Your use of the software operates as your consent to these practices.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft trademarks or logos is subject to and must follow [Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general). Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship. Any use of third-party trademarks or logos are subject to those third-party's policies.

## License

[MIT](LICENSE)
