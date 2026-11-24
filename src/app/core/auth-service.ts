import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { API_URL } from './api';
import { PerfilUsuario, RespostaLogin } from './auth.model';

/** A chave onde o navegador guarda o token (o "crachá"). */
const CHAVE_TOKEN = 'token';

/**
 * LOGIN, PERFIL E TOKEN
 *
 * O token e um cracha: pega-se UMA vez no login, guarda-se no localStorage
 * e mostra-se em toda chamada. Quem MOSTRA e o authInterceptor.
 *
 * Repare que perfil() nao fala de token em nenhum momento.
 * O Angular nunca cria token: so guarda e manda. Quem cria e confere e o servidor.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  /** Chamada 1: manda usuario e senha, recebe o token e guarda. */
  entrar(usuario: string, senha: string): Observable<RespostaLogin> {
    return this.http
      .post<RespostaLogin>(`${API_URL}/auth/login`, {
        username: usuario,
        password: senha
      })
      .pipe(
        // "dar uma olhada sem mudar": a resposta passa adiante igual
        // e, no caminho, o token fica guardado. So a senha CERTA chega aqui.
        tap(resposta => localStorage.setItem(CHAVE_TOKEN, resposta.accessToken))
      );
  }

  /** Chamada 2: rota protegida. O header Authorization quem poe e o interceptor. */
  perfil(): Observable<PerfilUsuario> {
    return this.http.get<PerfilUsuario>(`${API_URL}/auth/me`);
  }

  token(): string | null {
    return localStorage.getItem(CHAVE_TOKEN);
  }

  sair(): void {
    localStorage.removeItem(CHAVE_TOKEN);
  }
}
