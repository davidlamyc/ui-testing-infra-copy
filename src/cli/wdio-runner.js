import Launcher from "@wdio/cli";
import loggerModule from "./loggerModule";

const logger = loggerModule.getLogger();

export default (wdioConfigFile) => {
  const wdio = new Launcher(wdioConfigFile, {});
  logger.info("wdio-runner: new launcher initalized");
  logger.info("wdio-runner: run");

  wdio.run().then(
    (code) => {
      logger.info("wdio-runner: finished");
      process.exit(code);
    },
    (error) => {
      logger.info("wdio-runner: error");
      process.exit(1);
      throw new Error(`Launcher failed to start the test: ${error.stacktrace}`);
    }
  );
};
