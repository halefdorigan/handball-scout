Feature: Workspace synchronization
  In order to preserve local work in the remote copy
  As a scouter with connectivity and authorized access
  I want to explicitly synchronize workspace data

  Scenario: Synchronize local data
    Given I have local changes to teams, players, rosters, matches, or scouting sessions
    And I have connectivity and am authorized to synchronize
    When I choose to synchronize from the team list
    Then local data is sent to the remote copy
    And data returned from the remote copy updates the local workspace

  Scenario: Keep work available without automatic synchronization
    Given I am working without connectivity
    When I create or change workspace data
    Then the changes remain available locally
    And synchronization starts only when I choose it
