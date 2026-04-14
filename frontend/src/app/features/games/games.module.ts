import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { GameListComponent } from './game-list/game-list.component';
import { GameDetailComponent } from './game-detail/game-detail.component';
import { ScoutComponent } from './scout/scout.component';

const routes: Routes = [
  { path: '', component: GameListComponent },
  { path: 'new', component: GameDetailComponent },
  { path: ':id', component: GameDetailComponent },
  { path: ':id/scout', component: ScoutComponent }
];

@NgModule({
  declarations: [
    GameListComponent,
    GameDetailComponent,
    ScoutComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class GamesModule { }
