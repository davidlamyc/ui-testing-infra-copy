Feature: Add remove buttons page

  Scenario: Add and remove buttons
    Given I open the url "/add_remove_elements/"
    When I land on the "add_remove_elements" page
    Then I click on the element "add element button"
    Then I click on the element "add element button"
    Then I click on the element "add element button"
    Then I check that the element "manually added buttons" appears exactly 3 times
