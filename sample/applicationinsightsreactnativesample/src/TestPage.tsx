import React from 'react';
import {SeverityLevel} from '@microsoft/applicationinsights-web';
import {appInsights} from './ApplicationInsightsService';
import {Button, ScrollView, StyleSheet, Text} from 'react-native';

function TestPage() {
  function trackException() {
    appInsights.trackException({
      error: new Error('some error'),
      severityLevel: SeverityLevel.Error,
    });
  }

  function trackTrace() {
    appInsights.trackTrace({
      message: 'some trace',
      severityLevel: SeverityLevel.Information,
    });
  }

  function trackEvent() {
    appInsights.trackEvent({name: 'some event'});
  }

  function flush() {
    appInsights.flush();
  }

  function throwError() {
    throw new Error('test error');
  }

  function ajaxRequest() {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://httpbin.org/status/200');
    xhr.send();
  }

  function fetchRequest() {
    fetch('https://httpbin.org/status/200');
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={styles.container}>
      <Text style={styles.pageTitle}>Test Page</Text>
      <Text>Flush</Text>
      <Button onPress={flush} title="Flush" color="#a9a9a9" />
      <Text>Test TrackEvent</Text>
      <Button onPress={trackEvent} title="Track Event" color="#a9a9a9" />
      <Text>Track Trace</Text>
      <Button onPress={trackTrace} title="Test TrackTrace" color="#a9a9a9" />
      <Text>Test Track AjaxRequest</Text>
      <Button
        onPress={ajaxRequest}
        title="Autocollect a Dependency (XMLHttpRequest)"
        color="#a9a9a9"
      />
      <Text>Test Track FetchRequest</Text>
      <Button
        onPress={fetchRequest}
        title="Autocollect a dependency (Fetch)"
        color="#a9a9a9"
      />
      <Text>Test trackException</Text>
      <Button
        onPress={trackException}
        title="Track Exception"
        color="#a9a9a9"
      />
      <Text>Test track Throw Error</Text>
      <Button
        onPress={throwError}
        title="Autocollect an Error"
        color="#a9a9a9"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
});

export default TestPage;
