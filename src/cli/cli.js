import figlet from "figlet";
import fs from "fs";
import path from "path";
import yargs from "yargs";

import createWdioConfigFile from "./create-wdio-config";
import loggerModule from "./loggerModule";
import defaultConfig from "./default-test.config";
import wdioRunner from "./wdio-runner";

const DEFAULT_OVERRIDE_CONFIG_PATH = "./test/config.json";
const CLI_OPTIONS = ["baseUrl", "specs", "tags"];
const logger = loggerModule.getLogger();

/*
 * Parse CLI arguments and create override object for launcher
 */

const usageMsg = `
==========================
UI Test Infrastructure
==========================
Usage: ui-testing-infra
Usage: ui-testing-infra config

Config file defaults to './test/config.json'
wdio.conf.js will be created/overwritten whenever the test runner is run. Do not manually edit this file.
The [options] object will override all options from the config file and in wdio.conf.js.
`;

const options = {
  baseUrl: {
    alias: "b",
    describe: "Shortern URL command calls by setting a base URL"
  },
  specs: {
    describe: "Run only the feature(s) specified (accepts glob)"
  },
  tags: {
    describe: "To run only the tests with the specified tag(s)"
  }
};

/*
 * Parse cli perimeters with yargs.
 * First perimeter is the relative path to project config file.
 * i.e. npm run test:sample -- --baseUrl="www.google.com" --specs="./test/abtest.feature" --tags="@sample"
 */
const args = yargs
  .usage(usageMsg)
  .option(options)
  .help().argv;

/*
  * Parse path to config override file
  */
if (!args._[0]) {
  logger.info("cli: No config file specified! Looking for config file at default path.");
} else if (!fs.existsSync(args._[0])) {
  logger.info("cli: Config file at %s not found! Looking for config file at default path. %s", args._[0]);
}
const overrideFilePath = fs.existsSync(args._[0]) ? args._[0] : DEFAULT_OVERRIDE_CONFIG_PATH;
logger.info("cli: Looking for config file at %s", overrideFilePath);

/*
  * Set first argument to "config" if no default config file is found or path is specified
  * If config file exists, load it up
  */
let overrideOpts;
if (!fs.existsSync(overrideFilePath)) {
  logger.error("cli: No config file found, please create configuration file.");
} else {
  try {
    overrideOpts = JSON.parse(fs.readFileSync(overrideFilePath, { encoding: "utf8" }));
    Object.assign(defaultConfig, overrideOpts);
    logger.info("cli: Successfully imported config file %s", overrideFilePath);
  } catch (err) {
    logger.error("cli: Unable to import config file at %s", overrideFilePath);
  }
}

/**
 * Parse CLI arguments, and use this to override default & app config keys)
 */
CLI_OPTIONS.forEach(key => {
  if (args[key]) {
    defaultConfig[key] = key === "specs" ? [args[key]] : args[key];
    logger.info("cli: CLI override of %s (new value: %s)", key);
  }
});

loggerModule.overrideDefaultLogger(defaultConfig);

/**
 * Launch wdio
 */
const configDir = path.dirname(overrideFilePath);
const wdioConfigFile = path.resolve(configDir, "./wdio.conf.js");
createWdioConfigFile(defaultConfig, configDir, wdioConfigFile);
console.log(figlet.textSync("UI-TESTING-INFRA", { font: "Standard" }));
wdioRunner(wdioConfigFile);

