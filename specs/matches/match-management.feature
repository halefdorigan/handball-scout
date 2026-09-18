Feature: Match management
  In order to prepare a scout
  As a scouter
  I want to create a match between two teams and open its details

  Scenario: Create a match
    Given a home team and an away team exist
    And I am on the match list
    When I choose to create a new match
    And I provide its name, date, and time
    And I select the home team and away team
    And I save the match
    Then I return to the match list
    And the new match appears with its status

  Scenario: Require match participants and date
    Given I am on the new match form
    When I omit its name, date and time, home team, or away team
    Then I cannot save the match

  Scenario: Edit a registered match
    Given a match exists
    When I open its details
    And I change its details
    And I save the match
    Then the match list shows the updated details

  Scenario: Classify a match with tags
    Given I am creating or viewing a match
    When I add a tag
    Then the tag is associated with the match
    When I remove the tag
    Then the tag is no longer associated with the match

  Scenario: Display the match date and time in the local format
    Given matches exist
    When I open the match list
    Then I see each match date and time in my device's local timezone

  Scenario: Preserve the scheduled time across timezones
    Given a match is scheduled on a date and time
    When I view the match from a device in another timezone
    Then I see the date and time converted to the device's local timezone

  Scenario: Open the scout for a registered match
    Given a match exists
    When I open its details
    And I choose to open the scout
    Then I enter the live scout for that match
