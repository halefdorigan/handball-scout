import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, createFeatureSelector } from '@ngrx/store';
import { Observable, combineLatest, filter, map, switchMap } from 'rxjs';
import { Game } from '../../../core/models/game.model';
import { Team } from '../../../core/models/team.model';
import { Player, PlayerMembership } from '../../../core/models/player.model';
import * as GamesActions from '../../../state/games/games.actions';
import * as TeamsActions from '../../../state/teams/teams.actions';
import * as PlayersActions from '../../../state/players/players.actions';
import * as MembershipsActions from '../../../state/memberships/memberships.actions';
import { adapter as gamesAdapter } from '../../../state/games/games.reducer';
import { selectAllPlayers } from '../../../state/players/players.selectors';
import { selectAllMemberships } from '../../../state/memberships/memberships.selectors';
import { selectTeamEntities } from '../../../state/teams/teams.selectors';

const selectGamesState = createFeatureSelector<any>('games');
const { selectEntities: selectGameEntities } = gamesAdapter.getSelectors(selectGamesState);

interface PlayerReportEntry {
  player: Player;
  membership: PlayerMembership;
  teamLabel: string;
}

@Component({
  selector: 'app-game-report',
  templateUrl: './game-report.component.html',
  styleUrls: ['./game-report.component.scss'],
})
export class GameReportComponent implements OnInit {
  game$: Observable<Game | undefined>;
  teamA$: Observable<Team | undefined>;
  teamB$: Observable<Team | undefined>;
  players$: Observable<PlayerReportEntry[]>;

  constructor(
    private route: ActivatedRoute,
    private store: Store,
  ) {
    const gameId$ = this.route.params.pipe(map((p: any) => p['id']));

    this.game$ = gameId$.pipe(
      switchMap((id) => this.store.select(selectGameEntities).pipe(map((entities: any) => entities[id]))),
    );

    this.teamA$ = this.game$.pipe(
      filter((g) => !!g),
      switchMap((g) => this.store.select(selectTeamEntities).pipe(map((entities: any) => entities[g!.teamAId]))),
    );

    this.teamB$ = this.game$.pipe(
      filter((g) => !!g),
      switchMap((g) => this.store.select(selectTeamEntities).pipe(map((entities: any) => entities[g!.teamBId]))),
    );

    this.players$ = this.game$.pipe(
      filter((game): game is Game => Boolean(game)),
      switchMap((game) =>
        combineLatest([this.store.select(selectAllPlayers), this.store.select(selectAllMemberships)]).pipe(
          map(([players, memberships]) =>
            players
              .map((player) => {
                const membership = memberships.find(
                  (item) =>
                    item.playerId === player._id && (item.teamId === game.teamAId || item.teamId === game.teamBId),
                );
                if (!membership) return undefined;

                return {
                  player,
                  membership,
                  teamLabel: membership.teamId === game.teamAId ? 'CASA' : 'VISITANTE',
                };
              })
              .filter((item): item is PlayerReportEntry => Boolean(item)),
          ),
        ),
      ),
    );
  }

  ngOnInit(): void {
    this.store.dispatch(GamesActions.loadGames());
    this.store.dispatch(TeamsActions.loadTeams());
    this.store.dispatch(PlayersActions.loadPlayers());
    this.store.dispatch(MembershipsActions.loadMemberships());
  }

  getStats(teamId: string, type: string, events: any[] | undefined): number {
    if (!events) return 0;
    return events.filter((e) => e.teamId === teamId && e.type === type).length;
  }

  getPlayerGoals(playerId: string, events: any[] | undefined): number {
    if (!events) return 0;
    return events.filter((e) => e.playerId === playerId && e.type === 'GOAL').length;
  }
}
