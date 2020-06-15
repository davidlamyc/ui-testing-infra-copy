import winston from "winston";
import defaultLoggerConfig from "./logger-default.config";

export default (function () {
  let logger;
  let initialized = false;
  const format = winston.format.printf(nfo => {
    return `${nfo.timestamp} ${nfo.level} ${nfo.message}`;
  });

  /**
   * Setup default logger
   */
  function setupDefaultLogger() {
    logger = winston.createLogger({
      level: defaultLoggerConfig.common.level,
      format: winston.format.combine(
        winston.format.splat(),
        winston.format.timestamp(),
        winston.format(info => {
          info.level = info.level.toUpperCase();
          return info;
        })()
      )
    });

    // Log to console
    if (defaultLoggerConfig.console && defaultLoggerConfig.console.active) {
      logger.add(
        new winston.transports.Console({
          format: winston.format.combine(winston.format.colorize(), format)
        })
      );
      logger.verbose("logger (default): Logging to console");
    }

    // Log to file
    if (defaultLoggerConfig.file && defaultLoggerConfig.file.active) {
      logger.add(
        new winston.transports.File({
          filename: defaultLoggerConfig.file.filename,
          format: winston.format.combine(format)
        })
      );
      logger.verbose("logger (default): Logging to file %s", defaultLoggerConfig.file.filename);
    }

    logger.verbose("logger (default): Logging level: %s", logger.level);
  }

  /**
   * Override default logger configuration
   * @param config the testconfig file
   */
  function overrideDefaultLogger(config) {
    // Override logToFile
    if (config.logToFile) {
      // Remove existing file transports if any
      logger.transports
        .filter(transport => transport instanceof winston.transports.File)
        .map(transport => transport)
        .forEach(transport => {
          logger.verbose("logger (override): Removing file transport: %s", (transport).filename);
          logger.remove(transport);
        });
      // Add file transport
      logger.add(
        new winston.transports.File({
          filename: config.logToFile,
          format: winston.format.combine(format)
        })
      );
      logger.info("logger (override): Logging to file: %s", config.logToFile);
    }

    // Override logLevel
    if (config.logLevel) {
      if (defaultLoggerConfig.common.levels.includes(config.logLevel)) {
        logger.info("logger (override): Logging level: %s", config.logLevel);
        logger.level = config.logLevel;
      } else if (defaultLoggerConfig.wdio.levels.includes(config.logLevel)) {
        logger.info("logger (override): Logging level: %s", config.logLevel);
        logger.silent = config.logLevel === "silent";
        logger.level = config.logLevel;
        defaultLoggerConfig.wdio.levels.forEach((v, i) => (logger.levels[v] = i));
      } else {
        logger.warn("logger (override): Logging level [%s] is not recognized.", config.logLevel);
      }
    }
    logger.info("logger (override): finished override");
  }

  /**
   * Init logger
   */
  function init() {
    setupDefaultLogger();
    logger.verbose("logger (default): finished initialization");
  }

  function getLogger() {
    if (!initialized) {
      init();
      initialized = true;
    }
    return logger;
  }

  return {
    getLogger,
    init,
    overrideDefaultLogger
  };
})();
