import {
  ApplicationConfig,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { authInterceptor } from './core/auth-interceptor';
import { erroInterceptor } from './core/erro-interceptor';

// Carrega os dados de português (nomes de mês, dia da semana, vírgula decimal...).
// Sem este registro, o LOCALE_ID abaixo faz a tela quebrar com NG0701.
registerLocaleData(localePt);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    // Sem o withInterceptors, os interceptors existem e NÃO rodam, sem erro nenhum.
    // Ordem: authInterceptor na ida (põe o crachá), erroInterceptor na volta (trata o 401).
    provideHttpClient(withInterceptors([authInterceptor, erroInterceptor])),

    // Uma vez, vale para a aplicação inteira: date, currency e number saem em pt-BR.
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ]
};
