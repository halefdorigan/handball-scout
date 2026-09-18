import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';
import { GuestGuard } from './core/auth/guest.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/landing/landing.module').then((m) => m.LandingModule),
  },
  {
    path: 'login',
    canActivate: [GuestGuard],
    loadChildren: () => import('./features/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'register',
    canActivate: [GuestGuard],
    loadChildren: () => import('./features/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'teams',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/teams/teams.module').then((m) => m.TeamsModule),
  },
  {
    path: 'players',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/players/players.module').then((m) => m.PlayersModule),
  },
  {
    path: 'games',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/games/games.module').then((m) => m.GamesModule),
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () => import('./features/dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
