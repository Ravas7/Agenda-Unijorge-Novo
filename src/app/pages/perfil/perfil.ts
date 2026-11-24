import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../core/auth-service';
import { PerfilUsuario } from '../../core/auth.model';
import { CepService } from '../../core/cep-service';
import { Endereco } from '../../core/cep.model';

/**
 * PERFIL  (rota /perfil)
 *
 * Duas chamadas diferentes, e o porteiro (interceptor) decide quem leva o cracha:
 *
 *   GET dummyjson.com/auth/me    ->  COM  Authorization  (nossa API)
 *   GET viacep.com.br/ws/...     ->  SEM  Authorization  (outro site)
 *
 * Esta tela nao fala de token em nenhum momento.
 * Se o token estiver vencido ou falso, o erroInterceptor manda para /entrar.
 */
@Component({
  selector: 'app-perfil',
  imports: [FormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class Perfil implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly ceps = inject(CepService);
  private readonly router = inject(Router);

  readonly perfil = signal<PerfilUsuario | null>(null);
  readonly erroPerfil = signal('');

  readonly cep = signal('');
  readonly endereco = signal<Endereco | null>(null);
  readonly mensagemCep = signal('');
  readonly buscando = signal(false);

  ngOnInit(): void {
    this.auth.perfil().subscribe({
      next: dados => this.perfil.set(dados),
      error: (e: HttpErrorResponse) => {
        // 401 o erroInterceptor já tratou (volta para o login).
        if (e.status !== 401) {
          this.erroPerfil.set('Não foi possível carregar o seu perfil.');
        }
      }
    });
  }

  buscarCep(): void {
    const digitos = this.cep().replace(/\D/g, '');

    this.endereco.set(null);

    // o ViaCEP responde 400 (e uma página HTML) para CEP com tamanho errado:
    // melhor avisar aqui do que gastar uma chamada
    if (digitos.length !== 8) {
      this.mensagemCep.set('Digite um CEP com 8 números.');
      return;
    }

    this.mensagemCep.set('');
    this.buscando.set(true);

    this.ceps.buscar(digitos).subscribe({
      next: encontrado => {
        this.buscando.set(false);

        if (encontrado === null) {
          this.mensagemCep.set('CEP não encontrado.');
        } else {
          this.endereco.set(encontrado);
        }
      },
      error: () => {
        this.buscando.set(false);
        this.mensagemCep.set('Não foi possível consultar o CEP agora.');
      }
    });
  }

  sair(): void {
    this.auth.sair();
    this.router.navigate(['/entrar']);
  }
}
