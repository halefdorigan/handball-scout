# Handball Scout

An application that helps teams record training sessions and matches in order
to obtain general and specific metrics.

## Completed deliveries

### Homepage and authentication

- [x] Public landing page introducing Scout Court and its capabilities.
- [x] Navigation to login and registration screens.
- [x] Login and registration forms connected to the authentication service.
- [x] Preserved access to the internal dashboard at `/dashboard`.

## Roadmap

### Authentication

Authentication flow with JWT, Bearer token, frontend route guards, and backend
authentication middleware — complete.

### Deployment

- [x] Prepare the frontend and API for separate Railway services with private
  service networking and container healthchecks.
- [ ] Create and validate the production Railway project, services, domains,
  and managed MongoDB instance.

### New-user registration

Allow new users to create an account to access the application.

### Password reset

Allow users to reset their password securely when they cannot access their
account.

### Multi-tenancy

Each administrator user must have a database. The application must support a
migration from a single database to multiple databases.

### User roles

Admin, scouter, and player. Each role must be associated with a tenant.

### Simultaneous scouting

Allow two people to record the same match or training session: one records the
home team (starter) and the other records the away team (reserve). When there
is only one user in the match, that user must be able to record events for both
teams.

> **Offline-mode disclaimer:** in offline mode, simultaneous scouting does not
> guarantee real-time synchronization between devices. Events must synchronize
> when connectivity is restored, with possible conflicts handled.

### Privacy and governance

- Define the legal basis, privacy notice, consent when applicable, and the
  controller.
- Implement export, correction, anonymization, and physical deletion according
  to the organization's rules.
- Define access profiles, auditing, retention, and incident response.

### Player-registration evolution

- Evaluate photo support with consent and retention controls.
- Expand the preservation and viewing of player and team history.
- Add advanced evaluations and notes only after defining purpose, permissions,
  and retention policy.
