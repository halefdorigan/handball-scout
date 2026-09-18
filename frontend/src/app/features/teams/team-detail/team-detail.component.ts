import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, createFeatureSelector, createSelector } from '@ngrx/store';
import * as TeamsActions from '../../../state/teams/teams.actions';
import * as MembershipsActions from '../../../state/memberships/memberships.actions';
import * as PlayersActions from '../../../state/players/players.actions';
import { Player, PlayerMembership } from '../../../core/models/player.model';
import { Observable, combineLatest, map } from 'rxjs';
import { adapter as teamsAdapter } from '../../../state/teams/teams.reducer';
import { selectAllPlayers } from '../../../state/players/players.selectors';
import { selectAllMemberships } from '../../../state/memberships/memberships.selectors';

const selectTeamsState = createFeatureSelector<any>('teams');
const { selectEntities: selectTeamEntities } = teamsAdapter.getSelectors(selectTeamsState);

interface TeamPlayer {
  player: Player;
  membership: PlayerMembership;
}

@Component({
  selector: 'app-team-detail',
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.scss'],
})
export class TeamDetailComponent implements OnInit {
  teamForm: FormGroup;
  playerForm: FormGroup;
  isNew = true;
  teamId: string | null = null;
  showDeleteModal = false;
  players$: Observable<TeamPlayer[]> = new Observable<TeamPlayer[]>();
  availablePlayers$: Observable<Player[]> = new Observable<Player[]>();

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.teamForm = this.fb.group({
      name: ['', Validators.required],
      color: ['#0a7281'],
      tags: [[]],
    });

    this.playerForm = this.fb.group({
      playerId: ['', Validators.required],
      number: ['', [Validators.min(0), Validators.max(99)]],
      position: ['Goleiro'],
    });
  }

  ngOnInit(): void {
    this.teamId = this.route.snapshot.paramMap.get('id');
    this.store.dispatch(TeamsActions.loadTeams());
    if (this.teamId && this.teamId !== 'new') {
      this.isNew = false;
      this.store
        .select(selectTeamEntities)
        .pipe(map((entities) => entities[this.teamId!]))
        .subscribe((team) => {
          if (team) this.teamForm.patchValue(team);
        });
      this.store.dispatch(MembershipsActions.loadMemberships());
      this.store.dispatch(PlayersActions.loadPlayers());
      this.players$ = combineLatest([
        this.store.select(selectAllPlayers),
        this.store.select(selectAllMemberships),
      ]).pipe(
        map(([players, memberships]) =>
          memberships
            .filter((membership) => membership.teamId === this.teamId && !membership.isDeleted)
            .map((membership) => {
              const player = players.find((item) => item._id === membership.playerId);
              return player ? { player, membership } : undefined;
            })
            .filter((item): item is TeamPlayer => Boolean(item)),
        ),
      );
      this.availablePlayers$ = combineLatest([
        this.store.select(selectAllPlayers),
        this.store.select(selectAllMemberships),
      ]).pipe(
        map(([players, memberships]) =>
          players.filter(
            (player) =>
              !player.isDeleted &&
              !memberships.some(
                (membership) =>
                  membership.playerId === player._id && membership.teamId === this.teamId && !membership.isDeleted,
              ),
          ),
        ),
      );
    } else {
      this.players$ = new Observable<TeamPlayer[]>();
    }
  }

  save() {
    if (this.teamForm.valid) {
      if (this.isNew) {
        this.store.dispatch(TeamsActions.addTeam({ team: this.teamForm.value }));
      } else if (this.teamId) {
        this.store.dispatch(
          TeamsActions.updateTeam({
            team: {
              _id: this.teamId,
              ...this.teamForm.value,
              updatedAt: Date.now(),
              isDeleted: false,
            },
          }),
        );
      }
      this.router.navigate(['/teams']);
    }
  }

  addPlayer() {
    if (this.playerForm.valid && this.teamId) {
      this.store.dispatch(
        MembershipsActions.addMembership({
          membership: {
            playerId: this.playerForm.value.playerId,
            teamId: this.teamId,
            ...(this.playerForm.value.number !== '' && this.playerForm.value.number !== null
              ? { number: Number(this.playerForm.value.number) }
              : {}),
            ...(this.playerForm.value.position ? { position: this.playerForm.value.position } : {}),
            status: 'ACTIVE',
            isDeleted: false,
          },
        }),
      );
      this.playerForm.reset({ playerId: '', number: '', position: 'Goleiro' });
    }
  }

  toggleMembership(membership: PlayerMembership) {
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

  removeMembership(membership: PlayerMembership) {
    this.store.dispatch(MembershipsActions.archiveMembership({ id: membership._id }));
  }

  openDeleteModal() {
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
  }

  confirmDelete() {
    if (!this.teamId) return;

    this.store.dispatch(TeamsActions.deleteTeam({ id: this.teamId }));
    this.closeDeleteModal();
    this.router.navigate(['/teams']);
  }

  @HostListener('document:keydown.escape')
  handleEscapeKey() {
    if (this.showDeleteModal) {
      this.closeDeleteModal();
    }
  }
}
