import fs from "fs";
import glob from "glob";
import path from "path";
import loggerModule from "./loggerModule";

const logger = loggerModule.getLogger();

export default function createWdioConfig (config, configDir, wdioConfigFile) {
  // Server config
  const serverConfig = config.user
    ? ""
    : `
  hostname: "${config.host}",
  port: ${config.port},
  path: "${config.path}",
  `;

  /*
   * Feature Files:
   * Take 'specs' array passed from project level config file
   * containing glob patterns to feature files
   */
  const specPaths = [];
  config.specs.forEach((spec) => {
    // Run 'if' block if a single file is found
    if(fs.existsSync(path.resolve(process.cwd(), spec))) {
      specPaths.push(JSON.stringify(path.resolve(process.cwd(), spec)));
    // Run 'else' block, which would be glob path from config file
    } else {
      const specGlob = path.resolve(process.cwd(), spec);
      const specs = glob.sync(specGlob);
      specs.forEach(spec => specPaths.push(JSON.stringify(spec)));
    }
  });
  if (specPaths.length === 0) {
    throw new Error("Specs not found. See warnings.");
  }

  /*
   * Capabilities
   */
  // Handle configuration properties specific to browser drivers
  // i.e. 'goog:chromeOptions' for chromedriver
  let browserOptions;

  switch (config.capabilities[0].browserName) {
    case 'chrome':
      browserOptions = `
      'goog:chromeOptions': { 
        args: ${JSON.stringify(config.capabilities[0]["goog:chromeOptions"].args)},
      }
      `
      break;
    case 'safari':
      browserOptions = ``
      break;
    case 'firefox':
      browserOptions = ``
      break;
    default:
      logger.error("create-wdio-config: browserName not valid");
      break;
  }

  const capabilities = `
    capabilities: [
      {
        maxInstances: ${config.capabilities[0].maxInstances}, 
        browserName: '${config.capabilities[0].browserName}',
        ${browserOptions}
      }
    ]
  `

  // Services
  let services;
  let browserService;

  switch (config.capabilities[0].browserName) {
    case 'chrome':
      browserService = 'chromedriver';
      break;
    case 'safari':
      browserService = 'safaridriver';
      break;
    case 'firefox':
      browserService = 'geckodriver';
      break;
    default:
      logger.error("create-wdio-config: browserName not valid");
  }

  services = `services: ['${browserService}', 'intercept'],`;


  // Reporters
  const reporters = `
  reporters: [
    ["allure", {
      disableWebdriverStepsReporting: ${
        config.allure
          ? config.allure.disableWebdriverStepsReporting
            ? config.allure.disableWebdriverStepsReporting
            : false
          : false
      },
      disableWebdriverScreenshotsReporting: ${
        config.allure
          ? config.allure.disableWebdriverScreenshotsReporting
            ? config.allure.disableWebdriverScreenshotsReporting
            : false
          : false
      },
      useCucumberStepReporter: true,
      outputDir: ${JSON.stringify(path.resolve(configDir, `${config.reportOutDir}/allure-results/`))}
    }],
    ["junit", {
      outputDir: ${JSON.stringify(path.resolve(configDir, `${config.reportOutDir}/junit-results/`))}
    }],
    "spec",
    ${config.reportportal ? `[reportportal, ${JSON.stringify(config.reportportal)}],` : ""}
  ],
  `;

  /*
   * Step definitions:
   * Take 'step_definitions' array passed from project level config file
   * containing glob patterns to  files
   */
  const stepPaths = [];
  // Framework predefined steps
  const stepDir = path.resolve(__dirname, "../step_definitions/");
  fs.readdirSync(stepDir)
    .filter(f => f.endsWith(".js"))
    .forEach(f => stepPaths.push(JSON.stringify(path.resolve(stepDir, f))));
  // Project custom steps
  config.stepDefinitions.forEach((step) => {
    const stepDefinitionsGlob = path.resolve(process.cwd(), step);
    glob.sync(stepDefinitionsGlob).forEach(x => stepPaths.push(JSON.stringify(path.resolve(x))));
  });

  /*
   * Pages (relativePagePath):
   * Take 'pages' array passed from project level config file
   * containing glob patterns to files
   */
  const relativePageFolderPath = `relativePageFolderPath: '${path.join(process.cwd(), config.pages)}'`
  const relativeHttpRequestsFolderPath = `relativeHttpRequestsFolderPath: '${path.join(process.cwd(), config.httpRequests)}'`

  logger.info("create-wdio-config: start creating wdio config object");
  const fileOut = `
const path = require("path");
const url = require("url");
const fs = require("fs")

// See https://webdriver.io/docs/configurationfile.html
exports.config = {
  // ====================
  // Custom Options
  // ====================
  //
  currentPage: {},
  ${relativePageFolderPath},
  ${relativeHttpRequestsFolderPath},
  //
  // ====================
  // Runner Configuration
  // ====================
  //
  // WebdriverIO allows it to run your tests in arbitrary locations (e.g. locally or
  // on a remote machine).
  runner: "local",
  //
  // =====================
  // Server Configurations
  // =====================
  // Host address of the running Selenium server. This information is usually obsolete as
  // WebdriverIO automatically connects to localhost. Also, if you are using one of the
  // supported cloud services like Sauce Labs, Browserstack, or Testing Bot you don't
  // need to define host and port information because WebdriverIO can figure that out
  // according to your user and key information. However, if you are using a private Selenium
  // backend you should define the host address, port, and path here.
  ${serverConfig}
  //
  // =================
  // Service Providers
  // =================
  // WebdriverIO supports Sauce Labs, Browserstack, and Testing Bot (other cloud providers
  // should work too though). These services define specific user and key (or access key)
  // values you need to put in here in order to connect to these services.
  //
  // If you run your tests on SauceLabs you can specify the region you want to run your tests
  // in via the 'region' property. Available short handles for regions are 'us' (default) and 'eu'.
  // These regions are used for the Sauce Labs VM cloud and the Sauce Labs Real Device Cloud.
  // If you don't provide the region it will default for the 'us'

  //
  // ==================
  // Specify Test Files
  // ==================
  // Define which test specs should run. The pattern is relative to the directory
  // from which 'wdio' was called. Notice that, if you are calling 'wdio' from an
  // NPM script (see https://docs.npmjs.com/cli/run-script) then the current working
  // directory is where your package.json resides, so 'wdio' will be called from there.
  //
  specs: [${specPaths.map(x => `\n    ${x}`).join(",")}]
  ,
  // Patterns to exclude.
  exclude: [],
  //
  // ============
  // Capabilities
  // ============
  // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
  // time. Depending on the number of capabilities, WebdriverIO launches several test
  // sessions. Within your capabilities you can overwrite the spec and exclude options in
  // order to group specific specs to a specific capability.
  //
  // First, you can define how many instances should be started at the same time. Let's
  // say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
  // set maxInstances to 1; wdio will spawn 3 processes. Therefore, if you have 10 spec
  // files and you set maxInstances to 10, all spec files will get tested at the same time
  // and 30 processes will get spawned. The property handles how many capabilities
  // from the same test should run tests.
  //
  maxInstances: ${config.maxInstances},
  //
  // If you have trouble getting all important capabilities together, check out the
  // Sauce Labs platform configurator - a great tool to configure your capabilities:
  // https://docs.saucelabs.com/reference/platforms-configurator
  //
  // maxInstances can get overwritten per capability. So if you have an in-house Selenium
  // grid with only 5 firefox instances available you can make sure that not more than
  // 5 instances get started at a time.
  //
  // If outputDir is provided WebdriverIO can capture driver session logs
  // it is possible to configure which logTypes to include/exclude.
  // excludeDriverLogs: ['*'], // pass '*' to exclude all driver session logs
  // excludeDriverLogs: ['bugreport', 'server'],
  ${capabilities},
  path: '/',
  //
  // ===================
  // Test Configurations
  // ===================
  // Define all options that are relevant for the WebdriverIO instance here
  //
  // By default WebdriverIO commands are executed in a synchronous way using
  // the wdio-sync package. If you still want to run your tests in an async way
  // e.g. using promises you can set the sync option to false.
  sync: true,
  //
  // Level of logging verbosity: trace | debug | info | warn | error | silent
  logLevel: "${config.logLevel}",
  //
  // Enables colors for log output.
  coloredLogs: true,
  //
  // Set specific log levels per logger
  // loggers:
  // - webdriver, webdriverio
  // - @wdio/applitools-service, @wdio/browserstack-service, @wdio/devtools-service, @wdio/sauce-service
  // - @wdio/mocha-framework, @wdio/jasmine-framework
  // - @wdio/local-runner, @wdio/lambda-runner
  // - @wdio/sumologic-reporter
  // - @wdio/cli, @wdio/config, @wdio/sync, @wdio/utils
  // Level of logging verbosity: trace | debug | info | warn | error | silent
  // logLevels: {
  //     webdriver: 'info',
  //     '@wdio/applitools-service': 'info'
  // },
  //
  // If you only want to run your tests until a specific amount of tests have failed use
  // bail (default is 0 - don't bail, run all tests).
  bail: 0,
  //
  // Saves a screenshot to a given path if a command fails.
  screenshotPath: ${JSON.stringify(path.resolve(configDir, config.errorshotsOutDir))},
  //
  // Set a base URL in order to shorten url command calls. If your 'url' parameter starts
  // with '/', the base url gets prepended, not including the path portion of your baseUrl.
  // If your 'url' parameter starts without a scheme or '/' (like 'some/path'), the base url
  // gets prepended directly.
  baseUrl: "${config.baseUrl}",
  //
  // Default timeout for all waitFor* commands.
  waitforTimeout: ${config.browserTimeouts},
  //
  // Default timeout in milliseconds for request
  // if Selenium Grid doesn't send response
  connectionRetryTimeout: 90000,
  //
  // Default request retries count
  connectionRetryCount: 3,
  //
  // Plugins
  // Initialize the browser instance with a WebdriverIO plugin. The object should have the
  // plugin name as key and the desired plugin options as property. Make sure you have
  // the plugin installed before running any tests.
  //
  // Test runner services
  // Services take over a specific job you don't want to take care of. They enhance
  // your test setup with almost no effort. Unlike plugins, they don't add new
  // commands. Instead, they hook themselves up into the test process.
  ${services}

  // Framework you want to run your specs with.
  // The following are supported: Mocha, Jasmine, and Cucumber
  // see also: https://webdriver.io/docs/frameworks.html
  //
  // Make sure you have the wdio adapter package for the specific framework installed
  // before running any tests.
  framework: "cucumber",
  //
  // The number of times to retry the entire specfile when it fails as a whole
  // specFileRetries: 1,
  //
  // Test reporter for stdout.
  // The only one supported by default is 'dot'
  // see also: https://webdriver.io/docs/dot-reporter.html
  ${reporters}
  //
  // If you are using Cucumber you need to specify the location of your step definitions.
  // See also: https://github.com/webdriverio/webdriverio/tree/master/packages/wdio-cucumber-framework#cucumberopts-options
  cucumberOpts: {
    // <string[]> (file/dir) require files before executing features
    require: [${stepPaths.map(x => `\n      ${x}`).join(",")}],
    // <string[]> module used for processing required features
    requireModule: ["@babel/register"],
    // <boolean> show full backtrace for errors
    backtrace: false,
    // <boolean> disable colors in formatter output
    colors: false,
    // <boolean> invoke formatters without executing steps
    dryRun: false,
    // <boolean> abort the run on first failure
    failFast: false,
    // <string[]> (type[:path]) specify the output format, optionally supply PATH to redirect formatter output (repeatable)
    format: ["pretty"],
    // <boolean> Enable this config to treat undefined definitions as warnings.
    ignoreUndefinedDefinitions: false,
    // <string[]> (name) specify the profile to use
    profile: [],
    // <boolean> hide step definition snippets for pending steps
    snippets: true,
    // <boolean> hide source uris
    source: true,
    // <boolean> fail if there are any undefined or pending steps
    strict: true,
    // <string> (expression) only execute the features or scenarios with
    // tags matching the expression, see https://docs.cucumber.io/tag-expressions/
    tagExpression: "${config.tags}",
    // <boolean> add cucumber tags to feature or scenario name
    tagsInTitle: false,
    // <number> timeout for step definitions
    timeout: ${config.cucumberOpts.timeout},
  },

  // Custom options
  customOpts: ${JSON.stringify(config.customOpts)},

  //
  // =====
  // Hooks
  // =====
  // WebdriverIO provides several hooks you can use to interfere with the test process in order to enhance
  // it and to build services around it. You can either apply a single function or an array of
  // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
  // resolved to continue.
  /**
   * Gets executed once before all workers get launched.
   * @param {Object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   */
  onPrepare: function(config, capabilities) {
  },
  /**
   * Gets executed just before initialising the webdriver session and test framework. It allows you
   * to manipulate configurations depending on the capability or spec.
   * @param {Object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that are to be run
   */
  // beforeSession: function(config, capabilities, specs) {
  // },
  /**
   * Gets executed before test execution begins. At this point you can access to all global
   * variables like 'browser'. It is the perfect place to define custom commands.
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that are to be run
   */
  before: function(capabilities, specs) {
    global.currentPage = {};

    browser.addCommand('setPage', function (page) {
        return global.currentPage = page;
    })

    ${
      config.beforeHookPath
        ? `
    const beforeHookFunc = require('${config.beforeHookPath}');
    beforeHookFunc(capabilities, specs);
    `
        : ""
    }
  },
  /**
   * Runs before a WebdriverIO command gets executed.
   * @param {String} commandName hook command name
   * @param {Array} args arguments that command would receive
   */
  // beforeCommand: function(commandName, args) {
  // },
  /**
   * Runs before a Cucumber feature
   * @param {Object} feature feature details
   */
  beforeFeature: function(uri, feature, scenarios) {
    ${
      config.beforeFeatureHookPath
        ? `
    const beforeFeatureHookFunc = require('${config.beforeFeatureHookPath}');
    beforeFeatureHookFunc(uri, feature, scenarios);
    `
        : ""
    }
  },
  /**
   * Runs before a Cucumber scenario
   * @param {Object} scenario scenario details
   */
  beforeScenario: function(uri, feature, scenario, sourceLocation) {
    ${
      config.beforeScenarioHookPath
        ? `
    const beforeScenarioHookFunc = require('${config.beforeScenarioHookPath}');
    beforeScenarioHookFunc(uri, feature, scenario, sourceLocation);
    `
        : ""
    }
  },
  /**
   * Runs before a Cucumber step
   * @param {Object} step step details
   */
  beforeStep: function(uri, feature, scenario, step) {
  },
  /**
   * Runs after a Cucumber step
   * @param {Object} stepResult step result
   */
  afterStep: function(uri, feature, { error, result }) {
  },
  /**
   * Runs after a Cucumber scenario
   * @param {Object} scenario scenario details
   */
  afterScenario: function(uri, feature, scenario, result, sourceLocation) {
    ${
      config.afterScenarioHookPath
        ? `
    const afterScenarioHookFunc = require('${config.afterScenarioHookPath}');
    afterScenarioHookFunc(uri, feature, scenario, result, sourceLocation);
    `
        : ""
    }
  },
  /**
   * Runs after a Cucumber feature
   * @param {Object} feature feature details
   */
  afterFeature: function(uri, feature, scenarios) {
    ${
      config.afterFeatureHookPath
        ? `
    const afterFeatureHookFunc = require('${config.afterFeatureHookPath}');
    afterFeatureHookFunc(uri, feature, scenarios);
    `
        : ""
    }
  },

  /**
   * Runs after a WebdriverIO command gets executed
   * @param {String} commandName hook command name
   * @param {Array} args arguments that command would receive
   * @param {Number} result 0 - command success, 1 - command error
   * @param {Object} error error object if any
   */
  // afterCommand: function(commandName, args, result, error) {
  // },
  /**
   * Gets executed after all tests are done. You still have access to all global variables from
   * the test.
   * @param {Number} result 0 - test pass, 1 - test fail
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that ran
   */
  after: function(result, capabilities, specs) {
    browser.pause(3000);
    ${
      config.afterHookPath
        ? `
    const afterHookFunc = require('${config.afterHookPath}');
    afterHookFunc(result, capabilities, specs);
    `
        : ""
    }
  },
  /**
   * Gets executed right after terminating the webdriver session.
   * @param {Object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that ran
   */
  afterSession: function(config, capabilities, specs) {
    // Workaround to make sure the chromedriver shuts down
    // https://github.com/webdriverio-boneyard/wdio-selenium-standalone-service/issues/28
    browser.pause(2000);
  },
  /**
   * Gets executed after all workers got shut down and the process is about to exit. An error
   * thrown in the onComplete hook will result in the test run failing.
   * @param {Object} exitCode 0 - success, 1 - fail
   * @param {Object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {<Object>} results object containing test results
   */
  //onComplete: function(exitCode, config, capabilities, results) {
  //},
  /**
   * Gets executed when a refresh happens.
   * @param {String} oldSessionId session ID of the old session
   * @param {String} newSessionId session ID of the new session
   */
  //onReload: function(oldSessionId, newSessionId) {
  //}
};
`;

  // Delete existing config (if exists) and create new config file
  const exists = fs.existsSync(wdioConfigFile);
  if (exists) {
    logger.verbose("create-wdio-config: %s already exists. deleting it", wdioConfigFile);
    fs.unlinkSync(wdioConfigFile);
  }

  logger.info("create-wdio-config: creating %s", wdioConfigFile);
  fs.writeFileSync(wdioConfigFile, fileOut);
};
