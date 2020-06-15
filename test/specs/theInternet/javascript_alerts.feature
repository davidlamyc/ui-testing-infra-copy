Feature: Javascript Alert

    Scenario: Alert interactions
        Given I open the url "/javascript_alerts"
        When I land on the "javascript_alerts" page
        Then I click on the element "alert button"
        When I accept the alert box
        