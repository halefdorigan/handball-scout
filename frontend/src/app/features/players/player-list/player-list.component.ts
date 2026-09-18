import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { combineLatest, map, Observable, startWith } from 'rxjs';
import { Player, PlayerMembership } from '../../../core/models/player.model';
import { Team } from '../../../core/models/team.model';
import * as MembershipsActions from '../../../state/memberships/memberships.actions';
import { selectAllMemberships } from '../../../state/memberships/memberships.selectors';
import * as PlayersActions from '../../../state/players/players.actions';
import { selectAllPlayers } from '../../../state/players/players.selectors';
import * as TeamsActions from '../../../state/teams/teams.actions';
import { selectAllTeams } from '../../../state/teams/teams.selectors';

type PlayerStatusFilter = 'ALL' | 'ACTIVE' | 'ARCHIVED';

interface PlayerListItem {
  player: Player;
  memberships: PlayerMembership[];
  teamNames: string[];
  positions: string[];
}

@Component({
  selector: 'app-player-list',
  templateUrl: './player-list.component.html',
  styleUrls: ['./player-list.component.scss'],
})
export class PlayerListComponent implements OnInit {
  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly teamFilterControl = new FormControl('ALL', { nonNullable: true });
  readonly statusFilterControl = new FormControl<PlayerStatusFilter>('ACTIVE', {
    nonNullable: true,
  });

  teams$: Observable<Team[]>;
  players$: Observable<PlayerListItem[]>;

  constructor(private store: Store) {
    this.teams$ = this.store.select(selectAllTeams);

    const search$ = this.searchControl.valueChanges.pipe(startWith(''));
    const teamFilter$ = this.teamFilterControl.valueChanges.pipe(
      startWith('ALL'),
    );
    const statusFilter$ = this.statusFilterControl.valueChanges.pipe(
      startWith('ACTIVE'),
    );

    this.players$ = combineLatest([
      this.store.select(selectAllPlayers),
      this.store.select(selectAllMemberships),
      this.teams$,
      search$,
      teamFilter$,
      statusFilter$,
    ]).pipe(
      map(([players, memberships, teams, search, teamFilter, statusFilter]) => {
        const normalizedSearch = search.trim().toLocaleLowerCase();

        return players
          .filter(
            (player) =>
              statusFilter === 'ALL' ||
              (statusFilter === 'ARCHIVED'
                ? player.isDeleted
                : !player.isDeleted),
          )
          .map((player) => {
            const playerMemberships = memberships.filter(
              (membership) =>
                membership.playerId === player._id && !membership.isDeleted,
            );
            const playerTeams = playerMemberships
              .map((membership) =>
                teams.find((team) => team._id === membership.teamId),
              )
              .filter((team): team is Team => Boolean(team && !team.isDeleted));

            return {
              player,
              memberships: playerMemberships,
              teamNames: [...new Set(playerTeams.map((team) => team.name))],
              positions: [
                ...new Set(
                  playerMemberships
                    .filter((membership) => membership.status === 'ACTIVE')
                    .map((membership) => membership.position || 'Não definida'),
                ),
              ],
            };
          })
          .filter(
            (item) =>
              !normalizedSearch ||
              item.player.name.toLocaleLowerCase().includes(normalizedSearch),
          )
          .filter(
            (item) =>
              teamFilter === 'ALL' ||
              item.memberships.some(
                (membership) => membership.teamId === teamFilter,
              ),
          );
      }),
    );
  }

  ngOnInit(): void {
    this.store.dispatch(TeamsActions.loadTeams());
    this.store.dispatch(PlayersActions.loadPlayers());
    this.store.dispatch(MembershipsActions.loadMemberships());
  }

  trackByPlayer(_: number, item: PlayerListItem): string {
    return item.player._id;
  }
}
