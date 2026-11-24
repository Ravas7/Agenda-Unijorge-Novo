import {
  ApplicationConfig,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

// Carrega os dados de português (nomes de mês, dia da semana, vírgula decimal...).
// Sem este registro, o LOCALE_ID abaixo faz a tela quebrar com NG0701.
registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    // Uma vez, vale para a aplicação inteira: date, currency e number saem em pt-BR.
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ]
};
