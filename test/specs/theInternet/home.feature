Feature: Home page

    Scenario: Page title has correct copy
        Given I open the url "/"
        When I land on the "home" page
        Then I check that the element "title" has the text "Welcome to the-internet"
        Then I check that the element "title" contains the text "Welcome"
    
    Scenario: Scroll to correct element
        Given I open the url "/"
        When I land on the "home" page
        Then I scroll to the element "WYSIWYG Editor link"