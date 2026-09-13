Feature: Workspace navigation
  In order to quickly access scouting work
  As a workspace user
  I want to navigate between the overview, teams, players, and matches

  Background:
    Given I am in the Scout Court workspace

  Scenario Outline: Open a primary area from navigation
    When I select "<area>" in the primary navigation
    Then I see the "<screen>" area
    And "<area>" is identified as active in navigation

    Examples:
      | area     | screen     |
      | Overview | Overview   |
      | Teams    | My teams   |
      | Players  | Players    |
      | Matches  | My matches |

  Scenario: Use the appropriate navigation on a mobile device
    Given I access the workspace on a small screen
    When I select an area in bottom navigation
    Then I see the selected area
    And I can continue navigating through the primary areas
