import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { PlayerDetailComponent } from './player-detail/player-detail.component';
import { PlayerListComponent } from './player-list/player-list.component';

const routes: Routes = [
  { path: '', component: PlayerListComponent },
  { path: 'new', component: PlayerDetailComponent },
  { path: ':id', component: PlayerDetailComponent }
];

@NgModule({
  declarations: [PlayerListComponent, PlayerDetailComponent],
  imports: [CommonModule, ReactiveFormsModule, RouterModule.forChild(routes)]
})
export class PlayersModule {}
