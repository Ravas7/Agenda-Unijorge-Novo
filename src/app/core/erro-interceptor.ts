import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { AuthService } from './auth-service';

/**
 * O PORTEIRO DA VOLTA: o .pipe depois do next mexe na RESPOSTA, que ja chegou.
 *
 * 401 = cracha vencido ou falso: apaga o token e volta para o login.
 * Qualquer outro erro passa direto (senha errada, que e 400, quem mostra
 * e a propria tela de login).
 *
 * Avisa e devolve, como o correio com uma carta devolvida: avisa o morador
 * E entrega a carta. O throwError entrega o erro ao componente.
 */
export const erroInterceptor: HttpInterceptorFn = (req, next) => {
  // inject() sempre no topo: dentro do catchError daria NG0203
  const auth = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((erro: HttpErrorResponse) => {
      if (erro.status === 401) {
        // crachá vencido ou falso
        auth.sair();
        router.navigate(['/entrar']);
      }

      return throwError(() => erro); // a tela também precisa saber
    })
  );
};
