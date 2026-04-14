import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GameReportComponent } from './game-report/game-report.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'report/:id', component: GameReportComponent }
];

@NgModule({
  declarations: [
    DashboardComponent,
    GameReportComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class DashboardModule { }
