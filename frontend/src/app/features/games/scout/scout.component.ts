import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, createFeatureSelector } from '@ngrx/store';
import { Observable, Subscription, combineLatest, interval, map } from 'rxjs';
import { Game, GameEvent } from '../../../core/models/game.model';
import { Team } from '../../../core/models/team.model';
import { Player, PlayerMembership } from '../../../core/models/player.model';
import * as GamesActions from '../../../state/games/games.actions';
import * as TeamsActions from '../../../state/teams/teams.actions';
import * as PlayersActions from '../../../state/players/players.actions';
import { adapter as gamesAdapter } from '../../../state/games/games.reducer';
import * as MembershipsActions from '../../../state/memberships/memberships.actions';
import { selectActiveMembershipsForTeam } from '../../../state/memberships/memberships.selectors';
import { selectActivePlayersForTeam } from '../../../state/players/players.selectors';
import { selectTeamEntities } from '../../../state/teams/teams.selectors';
import { v4 as uuidv4 } from 'uuid';

const selectGamesState = createFeatureSelector<any>('games');

const { selectEntities: selectGameEntities } =
  gamesAdapter.getSelectors(selectGamesState);

interface ScoutPlayer {
  player: Player;
  membership: PlayerMembership;
}

@Component({
  selector: 'app-scout',
  templateUrl: './scout.component.html',
  styleUrls: ['./scout.component.scss'],
})
export class ScoutComponent implements OnInit, OnDestroy {
  game$?: Observable<Game | undefined>;
  teamA$?: Observable<Team | undefined>;
  teamB$?: Observable<Team | undefined>;
  playersA$?: Observable<ScoutPlayer[]>;
  playersB$?: Observable<ScoutPlayer[]>;

  timerSeconds = 0;
  isTimerRunning = false;
  private timerSub?: Subscription;

  gameId: string | null = null;
  selectedTeamId: string | null = null;
  pendingAction: string | null = null;
  showPlayerSelection = false;

  constructor(
    private route: ActivatedRoute,
    private store: Store,
  ) {}

  ngOnInit(): void {
    this.gameId = this.route.snapshot.paramMap.get('id');
    if (this.gameId) {
      this.store.dispatch(GamesActions.loadGames()); // Ensure games are loaded
      this.game$ = this.store
        .select(selectGameEntities)
        .pipe(map((entities) => entities[this.gameId!]));

      this.game$.subscribe((game) => {
        if (game) {
          this.store.dispatch(TeamsActions.loadTeams());
          this.store.dispatch(PlayersActions.loadPlayers());
          this.store.dispatch(MembershipsActions.loadMemberships());

          this.teamA$ = this.store
            .select(selectTeamEntities)
            .pipe(map((entities) => entities[game.teamAId]));
          this.teamB$ = this.store
            .select(selectTeamEntities)
            .pipe(map((entities) => entities[game.teamBId]));

          this.playersA$ = this.getPlayersForTeam(game.teamAId);
          this.playersB$ = this.getPlayersForTeam(game.teamBId);
        }
      });
    }
  }

  private getPlayersForTeam(teamId: string): Observable<ScoutPlayer[]> {
    return combineLatest([
      this.store.select(selectActivePlayersForTeam(teamId)),
      this.store.select(selectActiveMembershipsForTeam(teamId)),
    ]).pipe(
      map(([players, memberships]) =>
        memberships
          .map((membership) => {
            const player = players.find(
              (item) => item._id === membership.playerId,
            );
            return player ? { player, membership } : undefined;
          })
          .filter((item): item is ScoutPlayer => Boolean(item)),
      ),
    );
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
      realTime: new Date().toISOString(),
    };

    this.store.dispatch(
      GamesActions.logGameEvent({ gameId: this.gameId, event }),
    );

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
    return events.filter((e) => e.teamId === teamId && e.type === 'GOAL')
      .length;
  }

  ngOnDestroy(): void {
    this.timerSub?.unsubscribe();
  }
}
