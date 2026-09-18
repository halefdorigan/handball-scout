import { createAction, props } from '@ngrx/store';
import { Team } from '../../core/models/team.model';

export const loadTeams = createAction('[Teams] Load Teams');
export const loadTeamsSuccess = createAction(
  '[Teams] Load Teams Success',
  props<{ teams: Team[] }>(),
);
export const loadTeamsFailure = createAction(
  '[Teams] Load Teams Failure',
  props<{ error: any }>(),
);

export const addTeam = createAction(
  '[Teams] Add Team',
  props<{ team: Partial<Team> }>(),
);
export const updateTeam = createAction(
  '[Teams] Update Team',
  props<{ team: Team }>(),
);
export const deleteTeam = createAction(
  '[Teams] Delete Team',
  props<{ id: string }>(),
);

export const upsertTeamFromDb = createAction(
  '[Teams] Upsert Team From DB',
  props<{ team: Team }>(),
);
