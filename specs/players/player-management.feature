Feature: Player management
  In order to maintain a reusable athlete base
  As a scouter
  I want to create, find, edit, and archive players

  Scenario: Create a player
    Given I am on the player list
    When I choose to create a new player
    And I provide the full name and optional profile details
    And I save the profile
    Then I return to the player list
    And the player appears as active

  Scenario: Require the player's full name
    Given I am on the new player form
    When I do not provide the full name
    Then I cannot save the profile

  Scenario: Save a weight entered with a Brazilian decimal comma
    Given I am on the new player form
    When I provide the full name
    And I provide a weight such as "72,5" using a comma as the decimal separator
    And I save the profile
    Then the player is registered with the weight 72.5

  Scenario: Reject an invalid numeric value for height or weight
    Given I am on the new player form
    When I provide a height or weight that is not a valid number
    Then I cannot save the profile
    And I see a validation message in Portuguese explaining the invalid value

  Scenario: Edit a player profile
    Given a player exists
    When I open the player's profile
    And I change the details
    And I save the profile
    Then the player list shows the updated details

  Scenario: Find a player by name
    Given players exist
    When I search by a player's name
    Then I see only players that match the search

  Scenario: Filter players by team and status
    Given active and archived players are linked to teams
    When I filter by a team and status
    Then I see only players that match the filters

  Scenario: Archive a player after confirmation
    Given I am viewing an active player's profile
    When I choose to archive the player
    And I confirm the archive
    Then I return to the player list
    And the player is identified as archived
