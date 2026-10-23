# expo-manual-demo
This example is built on https://docs.expo.dev/tutorial/create-your-first-app/
This demo shows how to use ApplicationInsights with ReactNativeManualDevicePlugin.

# Start

Use the patched Node.js tooling runtime selected by the repository's root
`.nvmrc` (22.23.4), or a newer patched Node.js 22 release. Select it before
installing dependencies or starting Expo/Metro; `.nvmrc` alone does not change
the runtime. See [contributor setup](../CONTRIBUTING.md#clone-and-setup).

From this `sample` directory, using that same Node.js environment:

```sh
npm install

npm run start
```

android user press 'a'
web user press 'w'

This sample retains Expo 48, React 18, and React Native 0.71.8. Its Metro and
web tooling compatibility must be checked on the patched Node.js runtime;
do not fall back to an unpatched/EOL Node.js version to work around a tooling
failure. Updating Node.js does not update or establish a vulnerability in
the mobile Hermes/JavaScriptCore engine.

The checked-in `App.js` selects the `/manual` import marked "for web". The
Android-specific import is commented out there; an Android Metro export of
the unchanged web configuration fails to resolve `/manual`. That existing
platform configuration is separate from the Node.js security update.
