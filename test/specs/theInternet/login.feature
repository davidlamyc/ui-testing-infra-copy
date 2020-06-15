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

