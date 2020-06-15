import { Given, When, Then } from 'cucumber';

import clickElement from './support/interaction/clickElement';
import selectInputOption from './support/interaction/selectInputOption';
import pressEnter from './support/interaction/pressEnter';
import fillInput from './support/interaction/fillInput';
import acceptAlert from './support/interaction/acceptAlert';
import scrollToElement from './support/interaction/scrollToElement';
import captureRequests from './support/interaction/captureRequests';
import compareRequest from './support/interaction/compareRequest';

Then(/^I (click|doubleclick) on the element "([^"]*)?"$/, clickElement);
Then(/^I select the option "([^"]*)?" from the select input "([^"]*)?"$/, selectInputOption);
Then(/^I press enter$/, pressEnter);
Then(/^I fill the input "([^"]*)?" with text "([^"]*)?"$/, fillInput);
Then(/^I accept the alert box$/, acceptAlert);
Then(/^I scroll to the element "([^"]*)?"$/, scrollToElement);
Then(/^I capture http requests$/, captureRequests);
Then(/^I expect a request with the "([^"]*)?" method and the url "([^"]*)?" to have a body of "([^"]*)?"$/, compareRequest);



