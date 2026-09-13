Feature: Account access
  In order to open the Scout Court workspace
  As a person who follows handball
  I want to create an account and authenticate securely

  Scenario: Discover the product and start registration
    Given I am on the Scout Court public page
    When I choose to get started
    Then I see the account creation form

  Scenario: Start login from the public page
    Given I am on the Scout Court public page
    When I choose to sign in with an existing account
    Then I see the login form

  Scenario: Create an account with valid details
    Given I am on the account creation form
    When I provide a name, email address, and confirmed valid password
    And I submit the registration
    Then I am taken to the login page
    And I see confirmation that the account was created

  Scenario: Prevent registration with mismatched password confirmation
    Given I am on the account creation form
    When I provide different passwords
    And I submit the registration
    Then I see that the passwords must match
    And I remain on the account creation form

  Scenario: Sign in with valid credentials
    Given I have a registered account
    And I am on the login form
    When I provide my valid email address and password
    And I submit the login
    Then I open the workspace overview

  Scenario: Report an authentication failure
    Given I am on the login form
    When I submit invalid credentials
    Then I see that the email address or password is incorrect
    And I remain on the login form
