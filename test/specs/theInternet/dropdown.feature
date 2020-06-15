Feature: Dropdown page
  Test dropdown interactions

  Scenario: Dropdown options are correctly enabled or disabled
    Given I open the url "/dropdown"
    When I land on the "dropdown" page
    Then I click on the element "dropdown"
    And I check that the element "placeholder option" is not enabled
    And I check that the element "option one" is enabled
    And I check that the element "option two" is enabled

  Scenario: Dropdown option is correctly selected
    Given I open the url "/dropdown"
    When I land on the "dropdown" page
    And I select the option "Option 2" from the select input "dropdown"
    Then I check that the element "option one" is not selected
    Then I check that the element "option two" is selected
   
