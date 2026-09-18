import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, filter, map, Observable, take } from 'rxjs';
import { Player, PlayerMembership } from '../../../core/models/player.model';
import { Team } from '../../../core/models/team.model';
import * as MembershipsActions from '../../../state/memberships/memberships.actions';
import { selectAllMemberships } from '../../../state/memberships/memberships.selectors';
import * as PlayersActions from '../../../state/players/players.actions';
import {
  selectAllPlayers,
  selectPlayerById,
} from '../../../state/players/players.selectors';
import * as TeamsActions from '../../../state/teams/teams.actions';
import { selectAllTeams } from '../../../state/teams/teams.selectors';

@Component({
  selector: 'app-player-detail',
  templateUrl: './player-detail.component.html',
  styleUrls: ['./player-detail.component.scss'],
})
export class PlayerDetailComponent implements OnInit {
  playerForm: FormGroup;
  membershipForm: FormGroup;
  teams$: Observable<Team[]>;
  memberships$: Observable<PlayerMembership[]>;
  availableTeams$: Observable<Team[]>;
  isNew = true;
  playerId: string | null = null;
  currentPlayer?: Player;
  membershipError: string | null = null;
  showArchiveModal = false;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.playerForm = this.fb.group({
      name: ['', Validators.required],
      birthDate: [''],
      heightCm: ['', [Validators.min(1), Validators.max(260)]],
      weightKg: ['', [Validators.min(1), Validators.max(400)]],
      dominantHand: [''],
    });
    this.membershipForm = this.fb.group({
      teamId: ['', Validators.required],
      number: ['', [Validators.min(0), Validators.max(99)]],
      position: ['Goleiro'],
    });
    this.teams$ = this.store.select(selectAllTeams);
    this.memberships$ = this.store
      .select(selectAllMemberships)
      .pipe(
        map((memberships) =>
          memberships.filter(
            (membership) =>
              membership.playerId === this.playerId && !membership.isDeleted,
          ),
        ),
      );
    this.availableTeams$ = combineLatest([
      this.teams$,
      this.store.select(selectAllMemberships),
    ]).pipe(
      map(([teams, memberships]) =>
        teams.filter(
          (team) =>
            !team.isDeleted &&
            !memberships.some(
              (membership) =>
                membership.playerId === this.playerId &&
                membership.teamId === team._id &&
                !membership.isDeleted,
            ),
        ),
      ),
    );
  }

  ngOnInit(): void {
    this.store.dispatch(TeamsActions.loadTeams());
    this.store.dispatch(PlayersActions.loadPlayers());
    this.store.dispatch(MembershipsActions.loadMemberships());
    this.playerId = this.route.snapshot.paramMap.get('id');

    if (this.playerId && this.playerId !== 'new') {
      this.isNew = false;
      this.store
        .select(selectPlayerById(this.playerId))
        .pipe(
          filter((player): player is Player => Boolean(player)),
          take(1),
        )
        .subscribe((player) => {
          this.currentPlayer = player;
          this.playerForm.patchValue(player);
        });
    }
  }

  save(): void {
    if (this.playerForm.invalid) {
      this.playerForm.markAllAsTouched();
      return;
    }

    const value = this.playerForm.value;
    const player = {
      name: value.name.trim(),
      ...(value.birthDate ? { birthDate: value.birthDate } : {}),
      ...(value.heightCm !== '' && value.heightCm !== null
        ? { heightCm: Number(value.heightCm) }
        : {}),
      ...(value.weightKg !== '' && value.weightKg !== null
        ? { weightKg: Number(value.weightKg) }
        : {}),
      ...(value.dominantHand ? { dominantHand: value.dominantHand } : {}),
      isDeleted: this.currentPlayer?.isDeleted ?? false,
    };

    if (this.isNew) {
      this.store.dispatch(PlayersActions.addPlayer({ player }));
    } else if (this.currentPlayer) {
      this.store.dispatch(
        PlayersActions.updatePlayer({
          player: {
            ...this.currentPlayer,
            ...player,
            updatedAt: Date.now(),
          },
        }),
      );
    }

    this.router.navigate(['/players']);
  }

  addMembership(): void {
    this.membershipError = null;
    if (
      this.membershipForm.invalid ||
      !this.playerId ||
      this.playerId === 'new'
    ) {
      this.membershipForm.markAllAsTouched();
      return;
    }

    const membership = this.membershipForm.value;
    this.store
      .select(selectAllMemberships)
      .pipe(take(1))
      .subscribe((memberships) => {
        const duplicate = memberships.some(
          (item) =>
            item.playerId === this.playerId &&
            item.teamId === membership.teamId &&
            !item.isDeleted,
        );
        if (duplicate) {
          this.membershipError =
            'Este jogador já possui um vínculo ativo com esse time.';
          return;
        }

        this.store.dispatch(
          MembershipsActions.addMembership({
            membership: {
              playerId: this.playerId!,
              teamId: membership.teamId,
              ...(membership.number !== '' && membership.number !== null
                ? { number: Number(membership.number) }
                : {}),
              ...(membership.position ? { position: membership.position } : {}),
              status: 'ACTIVE',
              isDeleted: false,
            },
          }),
        );
        this.membershipForm.reset({
          teamId: '',
          number: '',
          position: 'Goleiro',
        });
      });
  }

  toggleMembership(membership: PlayerMembership): void {
    this.store.dispatch(
      MembershipsActions.updateMembership({
        membership: {
          ...membership,
          status: membership.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
          updatedAt: Date.now(),
        },
      }),
    );
  }

  removeMembership(membership: PlayerMembership): void {
    this.store.dispatch(
      MembershipsActions.archiveMembership({ id: membership._id }),
    );
  }

  openArchiveModal(): void {
    this.showArchiveModal = true;
  }

  closeArchiveModal(): void {
    this.showArchiveModal = false;
  }

  confirmArchive(): void {
    if (!this.playerId) return;
    this.store.dispatch(PlayersActions.archivePlayer({ id: this.playerId }));
    this.closeArchiveModal();
    this.router.navigate(['/players']);
  }

  getTeamName(teamId: string, teams: Team[]): string {
    return teams.find((team) => team._id === teamId)?.name || 'Time removido';
  }
}
