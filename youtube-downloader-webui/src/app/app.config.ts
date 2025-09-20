import {
  ApplicationConfig,
  provideAppInitializer,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { signalRInitializer } from './service/signalr.service';
import { provideHttpClient } from '@angular/common/http';
import { provideState, provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { SongsEffects } from './store/song/songs.effects';
import { songReducer } from './store/song/song.reducer';
import { songFeatureKey } from './store/state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAppInitializer(signalRInitializer),
    provideStore(),
    provideState({ name: songFeatureKey, reducer: songReducer }),
    provideEffects(SongsEffects),
  ],
};
