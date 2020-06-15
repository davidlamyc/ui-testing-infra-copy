import { Given, When, Then } from 'cucumber';

import checkElementVisibility from './support/assertion/checkElementVisibility';
import checkElementEnabled from './support/assertion/checkElementEnabled';
import checkElementSelected from './support/assertion/checkElementSelected';
import checkTitle from './support/assertion/checkTitle'
import checkElementHasText from './support/assertion/checkElementHasText';
import checkElementContainsText from './support/assertion/checkElementContainsText';
import checkInputHasText from './support/assertion/checkInputHasText';
import checkInputContainsText from './support/assertion/checkInputContainsText';
import checkProperty from './support/assertion/checkProperty';
import checkElementCount from './support/assertion/checkElementCount';
 
Then(/^I( do not)* see the element "([^"]*)?"$/, checkElementVisibility)
Then(/^I check that the element "([^"]*)?" is( not)* enabled$/, checkElementEnabled);
Then(/^I check that the element "([^"]*)?" is( not)* selected$/, checkElementSelected);
Then(/^I check that the title is "([^"]*)?"$/, checkTitle);
Then(/^I check that the element "([^"]*)?" has the text "([^"]*)?"$/, checkElementHasText);
Then(/^I check that the element "([^"]*)?" contains the text "([^"]*)?"$/, checkElementContainsText);
Then(/^I check that the input "([^"]*)?" has the text "([^"]*)?"$/, checkInputHasText);
Then(/^I check that the input "([^"]*)?" contains the text "([^"]*)?"$/, checkInputContainsText);
Then(/^I check that the( css)* attribute "([^"]*)?" from element "([^"]*)?" is( not)* "([^"]*)?"$/, checkProperty)
Then(/^I check that the element "([^"]*)?" appears exactly ([\d]+) times$/, checkElementCount)

