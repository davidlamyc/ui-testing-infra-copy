import { Given, When, Then } from 'cucumber';

import openWebsite from './support/navigation/openWebsite';
import resizeScreenSize from './support/navigation/resizeScreenSize';
import pause from './support/navigation/pause';
import landOnPage from './support/navigation/landOnPage';
import debug from './support/navigation/debug';

Given(/^I open the (url|site) "([^"]*)?"$/, openWebsite)
Given(/^I have a screen that is ([\d]+) by ([\d]+) pixels$/, resizeScreenSize)
When(/^I land on the "([^"]*)?" page$/, landOnPage);
Then(/^I pause for (\d+)ms$/, pause);
Given("I debug", debug)