export default {
  baseUrl: "",
  browserTimeouts: 10000,
  capabilities: [
    {
      browserName: "chrome",
      "goog:chromeOptions": {
        args: ["--headless", "--disable-gpu", "--disable-web-security"]
      },
      maxInstances: 1
    }
  ],
  cucumberOpts: {
    timeout: 180000
  },
  customOpts: {},
  errorshotsOutDir: "errorShots",
  host: "localhost",
  httpRequestOptions: {},
  maxInstances: 1,
  pageMeta: [],
  path: "/wd/hub",
  port: 4444,
  httpResponsesOutDir: "httpResponses",
  reportOutDir: "reports",
  screenshotsOutDir: "screenshots",
  seleniumStandalone: false,
  specs: [],
  steps: [],
  tags: "not @Pending",
  logLevel: "error"
};
