import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../core/auth-service';

/**
 * TELA DE LOGIN  (rota /entrar)
 *
 * Senha errada: mostra a mensagem. Senha certa: o AuthService guarda o token
 * e esta tela vai para /perfil.
 *
 * Os campos sao signals: o [(ngModel)] do template le e grava neles.
 */
@Component({
  selector: 'app-entrar',
  imports: [FormsModule],
  templateUrl: './entrar.html',
  styleUrl: './entrar.css'
})
export class Entrar {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly usuario = signal('');
  readonly senha = signal('');
  readonly erro = signal('');
  readonly carregando = signal(false);

  entrar(): void {
    if (this.carregando() || !this.usuario().trim() || !this.senha()) {
      return;
    }

    this.erro.set('');
    this.carregando.set(true);

    this.auth.entrar(this.usuario().trim(), this.senha()).subscribe({
      next: () => {
        this.carregando.set(false);
        this.router.navigate(['/perfil']);
      },
      error: (e: HttpErrorResponse) => {
        this.carregando.set(false);

        // 400 = usuário ou senha que o servidor não aceitou.
        // Outro status (0 = sem rede, 500...) não é culpa da senha.
        this.erro.set(
          e.status === 400 || e.status === 401
            ? 'Usuário ou senha inválidos.'
            : 'Não foi possível entrar agora. Tente de novo.'
        );
      }
    });
  }
}
