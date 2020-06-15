# [@staizen/ui-testing-infra]

> This framework is a wrapper around [webdriverIO](https://v5.webdriver.io/) and [cucumberJS](https://cucumber.io/docs/guides/), adding opinionated features to write more tests with less code.


- [Quick Start](#quick-start)
  - [Sample project](#sample-project)
  - [In your project](#in-your-project)
- [Development](#development)
  - [npm linking](#npm-linking)

## Quick Start

The quick start guide uses [the-internet](https://the-internet.herokuapp.com/) as the application under test.


### Sample Project

Clone this repository.

Do the following in the root of the project:

```sh
npm install

npm run build

npm run test:sample
```
Watch the tests run.

### In Your Project

First install via npm:

```sh
npm i @staizen/ui-testing-framework --save-dev
```


Then, set up the following folder structure.

The *pages* folder will contain maps of your page selectors.

The *spec* folder will contain your application's specification files.


```
.
+-- test
    +-- pages
        +-- <page js files to go here>
    +-- specs
        +-- <specification feature files to go here>
    +-- config.json
```

In *config.json*, add the following:

```json
{
  "seleniumStandalone": true,
  "maxInstances": "1",
  "logLevel": "trace",
  "baseUrl": "https://the-internet.herokuapp.com",
  "capabilities": [
    {
      "maxInstances": 5, 
      "browserName": "chrome",
      "goog:chromeOptions": {
        "args": []
      }
    }
  ],
  "browserTimeouts": 5000,
  "specs": [
    "./test/specs/**/*.feature"
  ],
  "stepDefinitions": [
    "./test/step_definitions/**/*.js"
  ],
  "pages": "./test/pages"
}
```

Add *login.js* into the *pages* folder with the following code

```js
module.exports = {
    'username input': '//input[@id="username"]',
    'password input': '//input[@id="password"]',
    'error status bar': '//div[@id="flash"]'
}
```

Add *login.feature* into the *spec* folder with the following code

```feature
Feature: Login page

    Scenario: Login page interactions
        Given I open the url "/login"
        When I land on the "login" page
        Then I do not see the element "error status bar"
        Then I fill the input "username input" with text "username"
        Then I fill the input "password input" with text "password"
        Then I check that the input "username input" has the text "username"
        Then I check that the input "password input" has the text "password"
        Then I press enter
        Then I see the element "error status bar"
```

In *package.json*, add the following into the *scripts* object

```json
{
  ...
  "scripts": {
    "test:": "ui-testing-infra ./test/config.json"
  }
}

```
Run the following:

```sh
npm run test
```

Watch the tests run.

## Development


### npm linking

To dev locally use [npm link](https://docs.npmjs.com/cli/link) to symlink to another folder:

```sh
npm link
```

Then in your testing project:

```sh
npm link @staizen/ui-testing-infra
```


> Don't forget to unlink as required! `npm unlink @staizen/ui-testing-infra`

