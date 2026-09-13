Feature: Live scout
  In order to record what happens in a match
  As a scouter
  I want to track time, record events, and correct the latest entry

  Background:
    Given I am in the live scout for a match with home and away teams

  Scenario: Start and pause the timer
    When I start the timer
    Then match time starts advancing
    When I pause the timer
    Then match time stops advancing

  Scenario Outline: Record an action for a match participant
    When I select "<action>" for the "<participant>"
    And I identify the player who performed the action or choose a collective entry
    Then the event is included in the timeline with the match time
    And the event is associated with the selected participant

    Examples:
      | action               | participant |
      | goal                 | home team   |
      | goal                 | away team   |
      | missed shot          | home team   |
      | save                 | away team   |
      | yellow card          | home team   |
      | 2-minute suspension  | away team   |

  Scenario: Update the score only with goals
    Given the score is tied at zero
    When I record a goal for the home team
    Then the home score increases by one
    When I record an action that is not a goal
    Then the score does not change

  Scenario: Undo the most recent event
    Given events are recorded in the timeline
    When I undo the latest event
    Then the most recent event no longer appears in the timeline
    And the score is recalculated from the remaining goals
