Feature: Home page

    Scenario: Login page interactions
        Given I have a screen that is 1600 by 1200 pixels
        And I open the url "/car-insurance"
        When I land on the "axa" page
        And I pause for 3000ms
        Given I capture http requests
        When I click on the element "get a quote button"
        Then I expect a request with the "POST" method and the url "/axaweb/api/get-quote-price/Motor" to have a body of "post-axaweb-api-get-quote-price-Motor"