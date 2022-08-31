import {
  ApplicationInsights,
  ITelemetryItem,
} from '@microsoft/applicationinsights-web';
import {ReactNativePlugin} from '@microsoft/applicationinsights-react-native';

const reactNativePlugin = new ReactNativePlugin();
// Simple inline constant implementation
const myDeviceInfoModule = {
  getModel: () => 'deviceModel',
  getDeviceType: () => 'deviceType',
  getUniqueId: () => 'deviceId',
};

reactNativePlugin.setDeviceInfoModule(myDeviceInfoModule);

const appInsights = new ApplicationInsights({
  config: {
    connectionString: 'YOUR CONNECTION STRING',
    extensions: [reactNativePlugin],
    extensionConfig: {},
    enableAutoRouteTracking: true,
    disableAjaxTracking: false,
    autoTrackPageVisitTime: true,
    enableCorsCorrelation: true,
    enableRequestHeaderTracking: true,
    enableResponseHeaderTracking: true,
  },
});
appInsights.loadAppInsights();

appInsights.addTelemetryInitializer((env: ITelemetryItem) => {
  env.tags = env.tags || [];
  env.tags['ai.cloud.role'] = 'testTag';
});
export {reactNativePlugin, appInsights};
