import { Component, OnInit } from '@angular/core';
import { Store, createFeatureSelector, createSelector } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { Game } from '../../../core/models/game.model';
import * as GamesActions from '../../../state/games/games.actions';
import { adapter as gamesAdapter } from '../../../state/games/games.reducer';

const selectGamesState = createFeatureSelector<any>('games');
const { selectAll: selectAllGames } = gamesAdapter.getSelectors(selectGamesState);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  games$: Observable<Game[]>;
  totalGames$: Observable<number>;
  totalGoals$: Observable<number>;

  constructor(private store: Store) {
    this.games$ = this.store.select(selectAllGames);
    this.totalGames$ = this.games$.pipe(map(games => games.length));
    this.totalGoals$ = this.games$.pipe(
      map(games => games.reduce((acc, g) => acc + (g.events?.filter(e => e.type === 'GOAL').length || 0), 0))
    );
  }

  ngOnInit(): void {
    this.store.dispatch(GamesActions.loadGames());
  }
}
