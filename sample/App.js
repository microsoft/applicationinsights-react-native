import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { ApplicationInsights } from '@microsoft/applicationinsights-web';

// import {ReactNativeManualDevicePlugin} from '@microsoft/applicationinsights-react-native/dist-esm/manualIndex'; // for android
import {ReactNativeManualDevicePlugin} from '@microsoft/applicationinsights-react-native/manual'; // for web

var RNPlugin = new ReactNativeManualDevicePlugin();
var appInsights = new ApplicationInsights({
    config: {
        disableDeviceCollection: true,
        instrumentationKey: '814a172a-92fd-4950-9023-9cf13bb65696',
        extensions: [RNPlugin]
    }
});
appInsights.loadAppInsights();
appInsights.trackPageView();
appInsights.trackEvent({name: 'some event'});
console.log("current app", appInsights.context);
export default function App() {
  return (
    <View style={styles.container}>
      <Text>Click F12 and see network, there would be track flow there</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
