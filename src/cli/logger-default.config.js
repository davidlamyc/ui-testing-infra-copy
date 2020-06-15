export default {
  common: {
    level: "info",
    levels: ["error", "warn", "info", "verbose", "debug", "silly"],
    verboseLevelIndex: 3
  },
  wdio: {
    levels: ["error", "warn", "info", "debug", "trace", "silent"]
  },
  console: {
    active: true
  },
  file: {
    active: false,
    filename: "default-logger.log"
  }
};
