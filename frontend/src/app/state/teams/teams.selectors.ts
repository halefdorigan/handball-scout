import { createFeatureSelector } from '@ngrx/store';
import { adapter, TeamsState } from './teams.reducer';

export const selectTeamsState = createFeatureSelector<TeamsState>('teams');
export const { selectAll: selectAllTeams, selectEntities: selectTeamEntities } = adapter.getSelectors(selectTeamsState);
