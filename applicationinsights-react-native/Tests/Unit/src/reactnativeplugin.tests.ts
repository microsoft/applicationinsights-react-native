import { Assert, AITestClass } from "@microsoft/ai-test-framework";
import { AppInsightsCore, DiagnosticLogger, IAppInsightsCore, IConfiguration, IPlugin, ITelemetryItem, objForEachKey } from "@microsoft/applicationinsights-core-js";
import { ReactNativePlugin, INativeDevice, IReactNativePluginConfig } from '../../../src/index';
import dynamicProto from '@microsoft/dynamicproto-js';
import { DeviceInfoModule } from "react-native-device-info/lib/typescript/internal/privateTypes";
import { DeviceModule, DEVICE_MODEL, DEVICE_TYPE, UNIQUE_ID } from "../../../src/DeviceInfo/DeviceModule";
import { ITestContext } from "@microsoft/ai-test-framework/dist-esm/src/TestCase";

export class ReactNativePluginTests extends AITestClass {
    private plugin: ReactNativePlugin;
    private core: AppInsightsCore;
    private config: IReactNativePluginConfig;
    private item: ITelemetryItem;
    private deviceModule: DeviceModule;
    private coreConfig: IConfiguration;

    public testInitialize() {
        this._disableDynProtoBaseFuncs();
        this.core = new AppInsightsCore();
        this.core.logger = new DiagnosticLogger();
        this.plugin = new ReactNativePlugin();
        this.deviceModule = new DeviceModule();
        this.plugin.setDeviceInfoModule(this.deviceModule);
        this.config = {};
        this.coreConfig = {
            instrumentationKey: 'testIkey',
            endpointUrl: 'testEndpoint',
            extensionConfig: {}
        };
    }

    public testCleanup() {
        if (this.core && this.core.isInitialized()) {
            this.core.unload(false);
        }
        this.core = null;
        this.plugin = null;
        this.config = null;
    }

    public registerTests() {
        this.addConfigTests()
        this.addAPITests();
        this.addProcessTelemetryTests();
        this.addDynamicConfigTests();
    }

    private addDynamicConfigTests() {
        this.testCase({
            name: 'Test Dynamic Config Default Setting',
            useFakeTimers: true,
            test: () => {
                this.core.initialize(this.coreConfig, [ this.plugin, new ChannelPlugin() ]);
                Assert.equal(true, this.plugin.isInitialized());
                Assert.equal(false, this._getConfig(this.plugin).disableDeviceCollection, 'disableDeviceCollection is false');
                Assert.equal(false, this._getConfig(this.plugin).disableExceptionCollection, 'disableExceptionCollection is false');
            }
        });
        this.testCase({
            name: 'Test Dynamic Config Single Setting Change',
            useFakeTimers: true,
            test: () => {
                this.core.initialize(this.coreConfig, [ this.plugin, new ChannelPlugin() ]);
                Assert.equal(true, this.plugin.isInitialized());
                Assert.equal(false, this._getConfig(this.plugin).disableDeviceCollection, 'disableDeviceCollection is false');
                Assert.equal(false, this._getConfig(this.plugin).disableExceptionCollection, 'disableExceptionCollection is false');
                let id = this.plugin.identifier;
                 //change config
                this.core.config.extensionConfig[id].disableDeviceCollection  = true;
                this.core.config.extensionConfig[id].disableExceptionCollection  = true;
                this.clock.tick(1);
                Assert.equal(true, this._getConfig(this.plugin).disableDeviceCollection, 'disableDeviceCollection is changed to true');
                Assert.equal(true, this._getConfig(this.plugin).disableExceptionCollection, 'disableExceptionCollection is changed to true');
                 
            }
        });
        this.testCase({
            name: 'Test Dynamic Config Single Setting Change',
            useFakeTimers: true,
            test: () => {
                this.core.initialize(this.coreConfig, [ this.plugin, new ChannelPlugin() ]);
                Assert.equal(true, this.plugin.isInitialized());
                Assert.equal(false, this._getConfig(this.plugin).disableDeviceCollection, 'disableDeviceCollection is false');
                Assert.equal(false, this._getConfig(this.plugin).disableExceptionCollection, 'disableExceptionCollection is false');
                let id = this.plugin.identifier;
                 //change config
                this.core.config.extensionConfig[id].disableDeviceCollection  = true;
                this.core.config.extensionConfig[id].disableExceptionCollection  = true;
                this.clock.tick(1);
                Assert.equal(true, this._getConfig(this.plugin).disableDeviceCollection, 'disableDeviceCollection is changed to true');
                Assert.equal(true, this._getConfig(this.plugin).disableExceptionCollection, 'disableExceptionCollection is changed to true');
                 
            }
        });
        this.testCase({
            name: 'Test Dynamic Config Device Enabling Change',
            useFakeTimers: true,
            test: () => {
                const expectation: ITelemetryItem = {
                    name: 'a name',
                    ext: {
                        device: {
                            localId: 'theDeviceId',
                            model: 'theModel',
                            deviceClass: 'theClass'
                        }
                    }
                };
                const actual: ITelemetryItem = {
                    name: 'a name'
                };
                this.deviceModule[DEVICE_TYPE] = "theClass";
                this.deviceModule[DEVICE_MODEL] = "theModel";
                this.deviceModule[UNIQUE_ID] = "theDeviceId";

                let coreConfig:IConfiguration = {
                    instrumentationKey: "test",
                    extensionConfig: {
                        [this.plugin.identifier]: this.config
                    }
                };

                this.core.initialize(coreConfig, [ this.plugin, new ChannelPlugin() ]);

                Assert.equal(true, this.plugin.isInitialized());

                Assert.notDeepEqual(expectation, actual, 'Telemetry items are not equal yet');
                this.plugin.processTelemetry(actual);
                Assert.deepEqual(expectation, actual, 'Telemetry items are equal');
                 
            }
        });
    }

    private addProcessTelemetryTests() {
        this.testCase({
            name: 'processTelemetry appends device fields',
            test: () => {

                const expectation: ITelemetryItem = {
                    name: 'a name',
                    ext: {
                        device: {
                            localId: 'some id',
                            model: 'some model',
                            deviceClass: 'some type'
                        }
                    }
                };
                const actual: ITelemetryItem = {
                    name: 'a name'
                };
              
                this.core.initialize(this.coreConfig, [this.plugin, new ChannelPlugin()]);
                Assert.equal(true, this.plugin.isInitialized());

              
                objForEachKey({
                    id: 'some id',
                    model: 'some model',
                    deviceClass: 'some type'
                }, (name, value) => {
                    this._getDevice(this.plugin)[name] = value;
                });
                Assert.notDeepEqual(expectation, actual, 'Telemetry items are not equal yet');
                this.plugin.processTelemetry(actual);
                Assert.deepEqual(expectation, actual, 'Telemetry items are equal');
            }
        });

        this.testCase({
            name: 'processTelemetry appends device fields from collecting device info synchronously',
            test: () => {
                const expectation: ITelemetryItem = {
                    name: 'a name',
                    ext: {
                        device: {
                            localId: 'theDeviceId',
                            model: 'theModel',
                            deviceClass: 'theClass'
                        }
                    }
                };
                const actual: ITelemetryItem = {
                    name: 'a name'
                };
                this.deviceModule[DEVICE_TYPE] = "theClass";
                this.deviceModule[DEVICE_MODEL] = "theModel";
                this.deviceModule[UNIQUE_ID] = "theDeviceId";

                let coreConfig:IConfiguration = {
                    instrumentationKey: "test",
                    extensionConfig: {
                        [this.plugin.identifier]: this.config
                    }
                };

                this.core.initialize(coreConfig, [ this.plugin, new ChannelPlugin() ]);

                Assert.equal(true, this.plugin.isInitialized());

                Assert.notDeepEqual(expectation, actual, 'Telemetry items are not equal yet');
                this.plugin.processTelemetry(actual);
                Assert.deepEqual(expectation, actual, 'Telemetry items are equal');
            }
        });

        this.testCaseAsync({
            name: 'processTelemetry appends device fields from collecting device info asynchronously',
            useFakeTimers: true,
            stepDelay: 100,
            steps: [(testContext) => {
                let actual: ITelemetryItem = {
                    name: 'a name'
                };
                
                let ctx = testContext!.context;
                ctx.actual = actual;
                let promise = new Promise((resolve, reject) => {
                    ctx.resolve = resolve;
                    ctx.reject = reject;
                });
                this.deviceModule[DEVICE_TYPE] = "theClass";
                this.deviceModule[DEVICE_MODEL] = "theModel";
                this.deviceModule[UNIQUE_ID] = promise;

                let coreConfig:IConfiguration = {
                    instrumentationKey: "test",
                    extensionConfig: {
                        [this.plugin.identifier]: this.config
                    }
                };

                this.core.initialize(coreConfig, [ this.plugin, new ChannelPlugin() ]);
                Assert.equal(true, this.plugin.isInitialized());

                Assert.equal(undefined, (actual.ext || {}).device, "Device should not be populated yet.");
                this.plugin.processTelemetry(actual);
                Assert.equal(undefined, (actual.ext || {}).device, "Device should still not be populated yet.");
            },
            (testContext) => {
                let ctx = testContext!.context;

                // The event should still not have been processed
                Assert.equal(undefined, (ctx.actual.ext || {}).device, "Device should still not be populated yet.");
                // Cause the device id to be resolved
                ctx.resolve("theDeviceId");
            },
            (testContext) => {
                let ctx = testContext!.context;

                const expectation: ITelemetryItem = {
                    name: 'a name',
                    ext: {
                        device: {
                            localId: 'theDeviceId',
                            model: 'theModel',
                            deviceClass: 'theClass'
                        }
                    }
                };

                Assert.deepEqual(expectation, ctx.actual, 'Telemetry items are equal');
            }]
        });
    }

    private addAPITests() {
        this.testCase({
            name: `setDeviceId sets this device's id`,
            test: () => {
                const expectation = 'something';
                Assert.notEqual(expectation, this._getDevice(this.plugin).id, 'Initial not set');
                this.plugin.setDeviceId(expectation);
                Assert.equal(expectation, this._getDevice(this.plugin).id, 'Value set');
            }
        });

        this.testCase({
            name: `setDeviceModel sets this device's model`,
            test: () => {
                const expectation = 'something';
                Assert.notEqual(expectation, this._getDevice(this.plugin).model, 'Initial not set');
                this.plugin.setDeviceModel(expectation);
                Assert.equal(expectation, this._getDevice(this.plugin).model, 'Value set');
            }
        });

        this.testCase({
            name: `setDeviceType sets this device's type`,
            test: () => {
                const expectation = 'something';
                Assert.notEqual(expectation, this._getDevice(this.plugin).deviceClass, 'Initial not set');
                this.plugin.setDeviceType(expectation);
                Assert.equal(expectation, this._getDevice(this.plugin).deviceClass, 'Value set');
            }
        });
    }

    private addConfigTests() {
        this.testCase({
            name: 'Autocollection is enabled by default',
            test: () => {
                const autoCollectStub = this.sandbox.stub(this.plugin as any, '_collectDeviceInfo');
                const autoCollectExceptionStub = this.sandbox.stub(this.plugin as any, '_setExceptionHandler').callsFake(() => true);
                this.core.initialize(this.coreConfig, [ this.plugin, new ChannelPlugin() ]);
    
                Assert.equal(false, this._getConfig(this.plugin).disableDeviceCollection, 'disableDeviceCollection is false');
                Assert.equal(false, this._getConfig(this.plugin).disableExceptionCollection, 'disableExceptionCollection is false');
                Assert.ok(autoCollectStub.calledOnce);
                Assert.ok(autoCollectExceptionStub.calledOnce);
            }
        });

        this.testCase({
            name: 'Autocollection does not run when disabled from constructor config',
            test: () => {
                this.plugin = new ReactNativePlugin({disableDeviceCollection: true, disableExceptionCollection: true});
                const autoCollectStub = this.sandbox.stub(this.plugin as any, '_collectDeviceInfo');
                const autoCollectExceptionStub = this.sandbox.stub(this.plugin as any, '_setExceptionHandler').callsFake(() => true);
                let reactNativeConfig : IReactNativePluginConfig = {
                    disableDeviceCollection : true,
                    disableExceptionCollection : true
                }
                let config = this.coreConfig;
                config.extensionConfig = config.extensionConfig || {};
                config.extensionConfig[this.plugin.identifier] = reactNativeConfig;
               
                this.core.initialize(config, [ this.plugin, new ChannelPlugin() ]);
                
                Assert.equal(true, this._getConfig(this.plugin).disableDeviceCollection, 'disableDeviceCollection is true');
                Assert.equal(true, this._getConfig(this.plugin).disableExceptionCollection, 'disableExceptionCollection is true');
                Assert.ok(autoCollectStub.notCalled);
                Assert.ok(autoCollectExceptionStub.notCalled);
            }
        });

        this.testCase({
            name: 'Autocollection runs when empty config is passed',
            test: () => {
                this.plugin = new ReactNativePlugin({} as any);
                const autoCollectStub = this.sandbox.stub(this.plugin as any, '_collectDeviceInfo');
                const autoCollectExceptionStub = this.sandbox.stub(this.plugin as any, '_setExceptionHandler').callsFake(() => true);
                this.core.initialize(this.coreConfig, [ this.plugin, new ChannelPlugin() ]);

                Assert.equal(false, this._getConfig(this.plugin).disableDeviceCollection, 'disableDeviceCollection is false');
                Assert.equal(false, this._getConfig(this.plugin).disableExceptionCollection, 'disableExceptionCollection is false');
                Assert.ok(autoCollectStub.calledOnce);
                Assert.ok(autoCollectExceptionStub.calledOnce);
            }
        });

        this.testCase({
            name: 'Autocollection runs when random config is passed',
            test: () => {
                this.plugin = new ReactNativePlugin({foo: 'bar'} as any);
                const autoCollectStub = this.sandbox.stub(this.plugin as any, '_collectDeviceInfo');
                const autoCollectExceptionStub = this.sandbox.stub(this.plugin as any, '_setExceptionHandler').callsFake(() => true);
                this.core.initialize(this.coreConfig, [ this.plugin, new ChannelPlugin() ]);

                Assert.deepEqual(false, this._getConfig(this.plugin).disableDeviceCollection, 'disableDeviceCollection is false');
                Assert.deepEqual(false, this._getConfig(this.plugin).disableExceptionCollection, 'disableExceptionCollection is false');
                Assert.ok(autoCollectStub.calledOnce);
                Assert.ok(autoCollectExceptionStub.calledOnce);
            }
        });
    }

    private _getDevice(plugin: any): any {
        return plugin._getDbgPlgTargets()[0];
    }

    private _getDeviceInfoModule(plugin: any): any {
        return plugin._getDbgPlgTargets()[1];
    }

    private _getConfig(plugin: any): any {
        return plugin._getDbgPlgTargets()[2];
    }
}

export function runTests() {
    new ReactNativePluginTests().registerTests();
}


class ChannelPlugin implements IPlugin {
    public isFlushInvoked = false;
    public isTearDownInvoked = false;
    public isResumeInvoked = false;
    public isPauseInvoked = false;

    public identifier = "Sender";

    public priority: number = 1001;

    constructor() {
        this.processTelemetry = this._processTelemetry.bind(this);
    }
    public pause(): void {
        this.isPauseInvoked = true;
    }

    public resume(): void {
        this.isResumeInvoked = true;
    }

    public teardown(): void {
        this.isTearDownInvoked = true;
    }

    public flush(async?: boolean, callBack?: () => void): void {
        this.isFlushInvoked = true;
        if (callBack) {
            callBack();
        }
    }

    public processTelemetry(env: ITelemetryItem) {
        // Mocked - Do Nothing
    }

    public setNextPlugin(next: any) {
        // no next setup
    }

    public initialize = (config: IConfiguration, core: IAppInsightsCore, plugin: IPlugin[]) => {
        // Mocked - Do Nothing
    }

    private _processTelemetry(env: ITelemetryItem) {
        // Mocked - Do Nothing
    }
}