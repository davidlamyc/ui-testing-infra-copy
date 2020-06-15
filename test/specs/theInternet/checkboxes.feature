Feature: Checkbox page
  Test checkbox interactions

  Scenario: Checkboxes are correctly selected
    Given I open the url "/checkboxes"
    When I land on the "checkboxes" page
    Then I check that the element "checkbox one" is not selected
    Then I check that the element "checkbox two" is selected

  Scenario: Checkboxes are correctly selected after clicking on them
    Given I open the url "/checkboxes"
    When I land on the "checkboxes" page
    Then I click on the element "checkbox one"
    Then I check that the element "checkbox one" is selected
    Then I click on the element "checkbox two"
    Then I check that the element "checkbox two" is not selected
