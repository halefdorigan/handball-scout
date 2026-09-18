import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { Team } from '../../core/models/team.model';
import * as TeamsActions from './teams.actions';

export interface TeamsState extends EntityState<Team> {
  loading: boolean;
  error: any;
}

export const adapter: EntityAdapter<Team> = createEntityAdapter<Team>({
  selectId: (team: Team) => team._id,
});

export const initialState: TeamsState = adapter.getInitialState({
  loading: false,
  error: null,
});

export const teamsReducer = createReducer(
  initialState,
  on(TeamsActions.loadTeams, (state) => ({ ...state, loading: true })),
  on(TeamsActions.loadTeamsSuccess, (state, { teams }) => adapter.setAll(teams, { ...state, loading: false })),
  on(TeamsActions.loadTeamsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(TeamsActions.deleteTeam, (state, { id }) => adapter.removeOne(id, state)),
  on(TeamsActions.upsertTeamFromDb, (state, { team }) => adapter.upsertOne(team, state)),
);

export const { selectIds, selectEntities, selectAll, selectTotal } = adapter.getSelectors();
