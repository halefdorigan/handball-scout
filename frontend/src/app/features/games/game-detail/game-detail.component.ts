import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, createFeatureSelector } from '@ngrx/store';
import { Observable, filter, take } from 'rxjs';
import { Team } from '../../../core/models/team.model';
import * as TeamsActions from '../../../state/teams/teams.actions';
import * as GamesActions from '../../../state/games/games.actions';
import { adapter as teamsAdapter } from '../../../state/teams/teams.reducer';
import { adapter as gamesAdapter } from '../../../state/games/games.reducer';

const selectTeamsState = createFeatureSelector<any>('teams');
const { selectAll: selectAllTeams } =
  teamsAdapter.getSelectors(selectTeamsState);
const selectGamesState = createFeatureSelector<any>('games');
const { selectEntities: selectGameEntities } =
  gamesAdapter.getSelectors(selectGamesState);

@Component({
  selector: 'app-game-detail',
  templateUrl: './game-detail.component.html',
  styleUrls: ['./game-detail.component.scss'],
})
export class GameDetailComponent implements OnInit {
  gameForm: FormGroup;
  teams$: Observable<Team[]>;
  isNew = true;
  gameId: string | null = null;
  tagInput: string = '';

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.gameForm = this.fb.group({
      name: ['', Validators.required],
      dateTime: [
        new Date().toISOString().substring(0, 16),
        Validators.required,
      ],
      teamAId: ['', Validators.required],
      teamBId: ['', Validators.required],
      tags: [[]],
    });
    this.teams$ = this.store.select(selectAllTeams);
  }

  ngOnInit(): void {
    this.store.dispatch(TeamsActions.loadTeams());
    this.store.dispatch(GamesActions.loadGames());
    this.gameId = this.route.snapshot.paramMap.get('id');
    if (this.gameId && this.gameId !== 'new') {
      this.isNew = false;
      this.store
        .select(selectGameEntities)
        .pipe(
          filter((entities) => Boolean(entities[this.gameId!])),
          take(1),
        )
        .subscribe((entities) => {
          const game = entities[this.gameId!];
          if (game) this.gameForm.patchValue(game);
        });
    }
  }

  addTag(event: any) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      const val = event.target.value.trim();
      if (val) {
        const currentTags = this.gameForm.get('tags')?.value || [];
        if (!currentTags.includes(val)) {
          this.gameForm.patchValue({ tags: [...currentTags, val] });
        }
        event.target.value = '';
      }
    }
  }

  removeTag(tag: string) {
    const currentTags = this.gameForm.get('tags')?.value || [];
    this.gameForm.patchValue({
      tags: currentTags.filter((t: string) => t !== tag),
    });
  }

  save() {
    if (this.gameForm.valid) {
      this.store.dispatch(GamesActions.addGame({ game: this.gameForm.value }));
      this.router.navigate(['/games']);
    }
  }
}
