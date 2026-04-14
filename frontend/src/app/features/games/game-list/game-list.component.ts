import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Game } from '../../../core/models/game.model';
import * as GamesActions from '../../../state/games/games.actions';
import { selectAll } from '../../../state/games/games.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';

const selectGamesState = createFeatureSelector<any>('games');
const selectAllGames = createSelector(selectGamesState, selectAll);

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss']
})
export class GameListComponent implements OnInit {
  games$: Observable<Game[]>;

  constructor(private store: Store) {
    this.games$ = this.store.select(selectAllGames);
  }

  ngOnInit(): void {
    this.store.dispatch(GamesActions.loadGames());
  }

  getStatusClass(status: string): string {
    return `status--${status.toLowerCase()}`;
  }
}
