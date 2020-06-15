Feature: Challenging DOM page

  Scenario: Check element properties
    Given I open the url "/abtest"
    When I land on the "abtest" page
    Given I have a screen that is 300 by 300 pixels
    Then I check that the attribute "id" from element "content div" is "content"
    Then I check that the attribute "id" from element "content div" is not "fake text"
    Then I check that the css attribute "color" from element "content div" is "rgba(34,34,34,1)"
    Then I check that the css attribute "color" from element "content div" is not "fake text"