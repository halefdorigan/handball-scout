import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, createFeatureSelector, createSelector } from '@ngrx/store';
import * as TeamsActions from '../../../state/teams/teams.actions';
import * as PlayersActions from '../../../state/players/players.actions';
import { Player } from '../../../core/models/player.model';
import { Observable, combineLatest, map } from 'rxjs';
import { adapter as teamsAdapter } from '../../../state/teams/teams.reducer';
import { adapter as playersAdapter } from '../../../state/players/players.reducer';

const selectTeamsState = createFeatureSelector<any>('teams');
const selectPlayersState = createFeatureSelector<any>('players');

const { selectEntities: selectTeamEntities } = teamsAdapter.getSelectors(selectTeamsState);
const { selectAll: selectAllPlayers } = playersAdapter.getSelectors(selectPlayersState);

@Component({
  selector: 'app-team-detail',
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.scss']
})
export class TeamDetailComponent implements OnInit {
  teamForm: FormGroup;
  playerForm: FormGroup;
  isNew = true;
  teamId: string | null = null;
  showDeleteModal = false;
  players$: Observable<Player[]>;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.teamForm = this.fb.group({
      name: ['', Validators.required],
      color: ['#0a7281'],
      tags: [[]]
    });

    this.playerForm = this.fb.group({
      name: ['', Validators.required],
      number: ['', Validators.required],
      position: ['Goleiro']
    });

    this.players$ = this.store.select(selectAllPlayers);
  }

  ngOnInit(): void {
    this.teamId = this.route.snapshot.paramMap.get('id');
    if (this.teamId && this.teamId !== 'new') {
      this.isNew = false;
      this.store.select(selectTeamEntities).pipe(
        map(entities => entities[this.teamId!])
      ).subscribe(team => {
        if (team) this.teamForm.patchValue(team);
      });
      this.store.dispatch(PlayersActions.loadPlayers({ teamId: this.teamId }));
    }
  }

  save() {
    if (this.teamForm.valid) {
      if (this.isNew) {
        this.store.dispatch(TeamsActions.addTeam({ team: this.teamForm.value }));
      } else if (this.teamId) {
        this.store.dispatch(TeamsActions.updateTeam({
          team: {
            _id: this.teamId,
            ...this.teamForm.value,
            updatedAt: Date.now(),
            isDeleted: false
          }
        }));
      }
      this.router.navigate(['/teams']);
    }
  }

  addPlayer() {
    if (this.playerForm.valid && this.teamId) {
      const player: Partial<Player> = {
        ...this.playerForm.value,
        teamId: this.teamId
      };
      this.store.dispatch(PlayersActions.addPlayer({ player }));
      this.playerForm.reset({ position: 'Goleiro' });
    }
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
