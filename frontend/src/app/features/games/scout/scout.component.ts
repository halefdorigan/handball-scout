import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, createFeatureSelector, createSelector } from '@ngrx/store';
import { Observable, Subscription, interval, map, take } from 'rxjs';
import { Game, GameEvent } from '../../../core/models/game.model';
import { Team } from '../../../core/models/team.model';
import { Player } from '../../../core/models/player.model';
import * as GamesActions from '../../../state/games/games.actions';
import * as TeamsActions from '../../../state/teams/teams.actions';
import * as PlayersActions from '../../../state/players/players.actions';
import { adapter as teamsAdapter } from '../../../state/teams/teams.reducer';
import { adapter as playersAdapter } from '../../../state/players/players.reducer';
import { adapter as gamesAdapter } from '../../../state/games/games.reducer';
import { v4 as uuidv4 } from 'uuid';

const selectTeamsState = createFeatureSelector<any>('teams');
const selectPlayersState = createFeatureSelector<any>('players');
const selectGamesState = createFeatureSelector<any>('games');

const { selectEntities: selectTeamEntities } = teamsAdapter.getSelectors(selectTeamsState);
const { selectAll: selectAllPlayers } = playersAdapter.getSelectors(selectPlayersState);
const { selectEntities: selectGameEntities } = gamesAdapter.getSelectors(selectGamesState);

@Component({
  selector: 'app-scout',
  templateUrl: './scout.component.html',
  styleUrls: ['./scout.component.scss']
})
export class ScoutComponent implements OnInit, OnDestroy {
  game$?: Observable<Game | undefined>;
  teamA$?: Observable<Team | undefined>;
  teamB$?: Observable<Team | undefined>;
  playersA$?: Observable<Player[]>;
  playersB$?: Observable<Player[]>;

  timerSeconds = 0;
  isTimerRunning = false;
  private timerSub?: Subscription;

  gameId: string | null = null;
  selectedTeamId: string | null = null;
  pendingAction: string | null = null;
  showPlayerSelection = false;

  constructor(
    private route: ActivatedRoute,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.gameId = this.route.snapshot.paramMap.get('id');
    if (this.gameId) {
      this.store.dispatch(GamesActions.loadGames()); // Ensure games are loaded
      this.game$ = this.store.select(selectGameEntities).pipe(map(entities => entities[this.gameId!]));
      
      this.game$.subscribe(game => {
        if (game) {
          this.store.dispatch(TeamsActions.loadTeams());
          this.store.dispatch(PlayersActions.loadPlayers({ teamId: game.teamAId }));
          this.store.dispatch(PlayersActions.loadPlayers({ teamId: game.teamBId }));

          this.teamA$ = this.store.select(selectTeamEntities).pipe(map(entities => entities[game.teamAId]));
          this.teamB$ = this.store.select(selectTeamEntities).pipe(map(entities => entities[game.teamBId]));
          
          this.playersA$ = this.store.select(selectAllPlayers).pipe(map(players => players.filter(p => p.teamId === game.teamAId)));
          this.playersB$ = this.store.select(selectAllPlayers).pipe(map(players => players.filter(p => p.teamId === game.teamBId)));
        }
      });
    }
  }

  toggleTimer() {
    this.isTimerRunning = !this.isTimerRunning;
    if (this.isTimerRunning) {
      this.timerSub = interval(1000).subscribe(() => {
        this.timerSeconds++;
      });
    } else {
      this.timerSub?.unsubscribe();
    }
  }

  formatTime(seconds: number): string {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }

  onAction(type: string, teamId: string) {
    this.pendingAction = type;
    this.selectedTeamId = teamId;
    this.showPlayerSelection = true;
  }

  logEvent(playerId: string | null = null) {
    if (!this.gameId || !this.selectedTeamId || !this.pendingAction) return;

    const event: GameEvent = {
      id: uuidv4(),
      type: this.pendingAction,
      teamId: this.selectedTeamId,
      playerId: playerId || undefined,
      gameTime: this.timerSeconds,
      realTime: new Date().toISOString()
    };

    this.store.dispatch(GamesActions.logGameEvent({ gameId: this.gameId, event }));
    
    this.showPlayerSelection = false;
    this.pendingAction = null;
    this.selectedTeamId = null;
  }

  undo() {
    if (!this.gameId) return;
    this.store.dispatch(GamesActions.undoGameEvent({ gameId: this.gameId }));
  }

  getScore(teamId: string, events: GameEvent[] | undefined): number {
    if (!events) return 0;
    return events.filter(e => e.teamId === teamId && e.type === 'GOAL').length;
  }

  ngOnDestroy(): void {
    this.timerSub?.unsubscribe();
  }
}
