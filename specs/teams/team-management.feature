Feature: Team management
  In order to organize the rosters that take part in matches
  As a scouter
  I want to create, edit, and delete teams

  Scenario: Create a team
    Given I am on the team list
    When I choose to create a new team
    And I provide the team name and identifying color
    And I save the team
    Then I return to the team list
    And the new team appears as a registered roster

  Scenario: Require the team name
    Given I am on the new team form
    When I do not provide the team name
    Then I cannot save the team

  Scenario: Change an existing team's details
    Given a team exists
    When I open its details
    And I change its details
    And I save the team
    Then the team list shows the updated details

  Scenario: Soft-delete a team after confirmation
    Given I am viewing an existing team's details
    When I choose to delete the team
    And I confirm the deletion
    Then I return to the team list
    And the team no longer appears among active rosters

  Scenario: Cancel team deletion
    Given I am confirming a team's deletion
    When I cancel the confirmation
    Then I remain on the team's details
    And the team remains available among active rosters
