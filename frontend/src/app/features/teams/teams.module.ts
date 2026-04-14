import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TeamListComponent } from './team-list/team-list.component';
import { TeamDetailComponent } from './team-detail/team-detail.component';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: TeamListComponent },
  { path: 'new', component: TeamDetailComponent },
  { path: ':id', component: TeamDetailComponent }
];

@NgModule({
  declarations: [
    TeamListComponent,
    TeamDetailComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class TeamsModule { }
