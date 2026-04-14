import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Team } from '../../../core/models/team.model';
import * as TeamsActions from '../../../state/teams/teams.actions';
import * as SyncActions from '../../../state/sync/sync.actions';
import { adapter } from '../../../state/teams/teams.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';

const selectTeamsState = createFeatureSelector<any>('teams');
const { selectAll } = adapter.getSelectors(selectTeamsState);

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss']
})
export class TeamListComponent implements OnInit {
  teams$: Observable<Team[]>;

  constructor(private store: Store) {
    this.teams$ = this.store.select(selectAll);
  }

  ngOnInit(): void {
    this.store.dispatch(TeamsActions.loadTeams());
  }

  sync() {
    this.store.dispatch(SyncActions.syncAll());
  }
}
