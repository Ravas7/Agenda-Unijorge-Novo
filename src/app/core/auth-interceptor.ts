import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { API_URL } from './api';
import { AuthService } from './auth-service';

/**
 * O PORTEIRO DA IDA: toda chamada do HttpClient passa por aqui, de qualquer servico.
 * Ele faz duas perguntas:
 *
 *   1. Tem cracha (token)?
 *   2. Vai para a NOSSA API?
 *
 * Sim e sim: manda uma COPIA com o header Authorization.
 * Qualquer outra coisa: passa como veio.
 *
 * Por que a pergunta 2? O cracha da UNIJORGE nao se mostra na portaria de
 * outro predio. Mandar o token para o ViaCEP e entregar a credencial a um estranho.
 *
 * Sem o withInterceptors([...]) no app.config.ts, este arquivo existe e
 * NAO RODA, sem erro nenhum.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Tem crachá?
  const token = inject(AuthService).token();

  // 2. Vai para a NOSSA API?
  // A barra no fim evita que 'https://dummyjson.com.site-falso.com' passe
  // por engano: ele comecaria com o mesmo texto, mas e outro dominio.
  const ehNossaApi = req.url.startsWith(`${API_URL}/`);

  if (!token || !ehNossaApi) {
    return next(req); // passa como veio
  }

  // A chamada chega LACRADA: nao da para altera-la. Faz-se uma copia com o carimbo.
  const comToken = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });

  return next(comToken); // a CÓPIA, não o req original
};
