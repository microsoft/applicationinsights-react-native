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
>**This plugin relies on [`react-native-device-info`](https://github.com/rebeccahughes/react-native-device-info). You must install and link this package. Keep `react-native-device-info` up-to-date to collect the latest device names using your app.**

```zsh
npm install --save @microsoft/applicationinsights-react-native @microsoft/applicationinsights-web
npm install --save react-native-device-info
react-native link react-native-device-info
```

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

## Requirements
You must be using a version `>=2.0.0` of `@microsoft/applicationinsights-web`. This plugin will only work in react-native apps, e.g. it will not work with `expo`.

## Device Information Collected
By default, this plugin automatically collects
 - **Unique Device ID** (also known as Installation ID)
 - **Device Model Name** (iPhone XS, etc.)
 - **Device Type** (Handset, Tablet, etc.)

## Compatibility Maxtrix

| Version |  Application Insights | React Native         | Branch
|---------|-----------------------|----------------------|-----------
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

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## License

[MIT](LICENSE)
