# Personal data and responsibilities

This document describes personal-data processing in the global player-profile
MVP. It is product technical guidance and does not replace legal review, a
privacy notice, or the procedures of the organization operating the system.

## Collected data and purpose

| Data | Purpose | Required |
| --- | --- | --- |
| Name | Identify the player in registration and scouting | Yes |
| Date of birth | Support identity and roster organization | No |
| Height and weight | Provide sporting-profile context | No |
| Dominant hand | Provide sporting-profile context | No |
| Team, number, position, and status | Represent the player's membership in each team | For a membership |
| `playerId` in events | Preserve the historical attribution of match events | Technical |

The MVP does not collect photos, advanced evaluations, free-form notes, or
detailed history. These items require a new review before inclusion.

## Storage and synchronization

- The profile is saved locally on the device as part of the offline-first flow.
- Synchronization with the API sends data entered by the user to the
  environment configured by the organization.
- The identity profile (`Player`) is separate from team memberships
  (`PlayerMembership`). Therefore, number and position are not global player
  attributes.
- Identifier-based synchronization must be idempotent and respect the soft
  deletion marker (`isDeleted` locally and `deleted` in the API).

## Retention, archiving, and events

Archiving a player or membership is a soft deletion. The archived player and
inactive memberships no longer appear in active registrations and lineups, but
existing events continue to reference `playerId` to preserve historical
reports. The MVP does not implement automatic physical deletion.

## MVP risks and limits

- Data about minors can be entered, especially when the date of birth is
  filled in; the organization must define appropriate rules for collection,
  access, and consent.
- The product must not receive sensitive data categories, documents, medical
  information, or contact details in this registration.
- Local storage can exist on shared or lost devices; the operations owner must
  apply appropriate locking, access control, and device management.
- Transport, authentication, authorization, backups, and retention of the API
  environment must be configured and reviewed outside this MVP.

## Outstanding legal and operational work

Before production use, the product owner must confirm the legal basis, privacy
notice, retention period, access profiles, consent record when applicable, and
incident procedure. The controller and the way data subjects can exercise
their rights must also be defined. This document does not implement these
definitions.

## Privacy, governance, and requests

The organization owner must limit access by role, periodically review data,
and instruct users to enter only what is necessary. Exporting, responding to
access or correction requests, physical deletion, and anonymization are not
yet part of the MVP. Archiving in the interface preserves events and must be
treated as an operational measure, not as automatic fulfillment of a legal
deletion request.
