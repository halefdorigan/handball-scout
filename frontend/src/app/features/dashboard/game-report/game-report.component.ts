import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, createFeatureSelector } from '@ngrx/store';
import { Subject, Observable, filter, map, switchMap, takeUntil } from 'rxjs';
import { Game } from '../../../core/models/game.model';
import { Team } from '../../../core/models/team.model';
import { Player } from '../../../core/models/player.model';
import * as GamesActions from '../../../state/games/games.actions';
import * as TeamsActions from '../../../state/teams/teams.actions';
import * as PlayersActions from '../../../state/players/players.actions';
import { adapter as gamesAdapter } from '../../../state/games/games.reducer';
import { adapter as teamsAdapter } from '../../../state/teams/teams.reducer';
import { adapter as playersAdapter } from '../../../state/players/players.reducer';

const selectGamesState = createFeatureSelector<any>('games');
const { selectEntities: selectGameEntities } = gamesAdapter.getSelectors(selectGamesState);

const selectTeamsState = createFeatureSelector<any>('teams');
const { selectEntities: selectTeamEntities } = teamsAdapter.getSelectors(selectTeamsState);

const selectPlayersState = createFeatureSelector<any>('players');
const { selectAll: selectAllPlayers } = playersAdapter.getSelectors(selectPlayersState);

@Component({
  selector: 'app-game-report',
  templateUrl: './game-report.component.html',
  styleUrls: ['./game-report.component.scss']
})
export class GameReportComponent implements OnInit, OnDestroy {
  private readonly _destroy$ = new Subject<void>();
  game$: Observable<Game | undefined>;
  teamA$: Observable<Team | undefined>;
  teamB$: Observable<Team | undefined>;
  players$: Observable<Player[]>;

  constructor(private route: ActivatedRoute, private store: Store) {
    const gameId$ = this.route.params.pipe(map((p: any) => p['id']));

    this.game$ = gameId$.pipe(
      switchMap(id => this.store.select(selectGameEntities).pipe(map((entities: any) => entities[id])))
    );

    this.teamA$ = this.game$.pipe(
      filter(g => !!g),
      switchMap(g => this.store.select(selectTeamEntities).pipe(map((entities: any) => entities[g!.teamAId])))
    );

    this.teamB$ = this.game$.pipe(
      filter(g => !!g),
      switchMap(g => this.store.select(selectTeamEntities).pipe(map((entities: any) => entities[g!.teamBId])))
    );

    this.players$ = this.store.select(selectAllPlayers);
  }

  ngOnInit(): void {
    this.store.dispatch(GamesActions.loadGames());
    this.store.dispatch(TeamsActions.loadTeams());
    
    this.game$.pipe(
      takeUntil(this._destroy$),
      filter(g => !!g),
      map(g => {
        this.store.dispatch(PlayersActions.loadPlayers({ teamId: (g as any).teamAId }));
        this.store.dispatch(PlayersActions.loadPlayers({ teamId: (g as any).teamBId }));
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  getStats(teamId: string, type: string, events: any[] | undefined): number {
    if (!events) return 0;
    return events.filter(e => e.teamId === teamId && e.type === type).length;
  }

  getPlayerGoals(playerId: string, events: any[] | undefined): number {
    if (!events) return 0;
    return events.filter(e => e.playerId === playerId && e.type === 'GOAL').length;
  }
}
