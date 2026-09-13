import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { teamsReducer } from './state/teams/teams.reducer';
import { TeamsEffects } from './state/teams/teams.effects';
import { playersReducer } from './state/players/players.reducer';
import { PlayersEffects } from './state/players/players.effects';
import { gamesReducer } from './state/games/games.reducer';
import { GamesEffects } from './state/games/games.effects';
import { SyncEffects } from './state/sync/sync.effects';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    StoreModule.forRoot({ 
      teams: teamsReducer, 
      players: playersReducer,
      games: gamesReducer 
    }),
    EffectsModule.forRoot([TeamsEffects, PlayersEffects, GamesEffects, SyncEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
