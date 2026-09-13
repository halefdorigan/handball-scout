import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./features/landing/landing.module').then(m => m.LandingModule) },
  { path: 'login', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
  { path: 'register', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
  { path: 'teams', loadChildren: () => import('./features/teams/teams.module').then(m => m.TeamsModule) },
  { path: 'players', loadChildren: () => import('./features/players/players.module').then(m => m.PlayersModule) },
  { path: 'games', loadChildren: () => import('./features/games/games.module').then(m => m.GamesModule) },
  { 
    path: 'dashboard', 
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule) 
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
