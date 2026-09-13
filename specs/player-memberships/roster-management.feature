Feature: Roster management
  In order to define who can represent each team
  As a scouter
  I want to link players to teams and manage their memberships

  Scenario: Link an existing player to a team
    Given a team and an active player who is not linked to it exist
    When I add the player to the team's roster
    And I provide the shirt number and position when applicable
    Then the player appears as active in the roster
    And the shirt number and position are associated with that team

  Scenario: Prevent a duplicate membership in the same team
    Given a player already has an active membership in a team
    When I try to link the player to the same team again
    Then the system does not create another active membership for that player and team

  Scenario: Deactivate and reactivate a roster membership
    Given a player has an active membership in a team
    When I deactivate the membership
    Then the player is no longer available as an active member of that roster
    When I reactivate the membership
    Then the player is available again as an active member of that roster

  Scenario: Remove a roster membership
    Given a player has a membership in a team
    When I remove the membership
    Then the player no longer appears in the team's roster

  Scenario: View a player's linked teams in the player profile
    Given a player has roster memberships
    When I open the player's profile
    Then I see the linked teams, shirt numbers, and positions
