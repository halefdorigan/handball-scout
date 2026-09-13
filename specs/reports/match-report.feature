Feature: Match report
  In order to analyze a recorded match
  As a scouter
  I want to view the score and statistics produced by the scout

  Scenario: View the overview summary
    Given matches exist
    When I open the overview
    Then I see the number of catalogued matches
    And I see the number of goals recorded across all matches
    And I see up to five recent matches

  Scenario: Open a recent match report
    Given a match appears among recent matches
    When I select the match
    Then I see its report
    And I see the score between the home and away teams
    And I see the number of recorded events

  Scenario: Calculate the score from recorded goals
    Given a match has goals for both participants
    When I view its report
    Then each participant's score equals its number of goals

  Scenario: View general statistics and player goals
    Given a match has save, missed-shot, and 2-minute-suspension events
    And it has goals identified by player
    When I view its report
    Then I see general statistics separated by home and away teams
    And I see each participating player's goal count

  Scenario: Resume the scout from the report
    Given I am viewing a match report
    When I choose to open the scout
    Then I enter the live scout for the same match
