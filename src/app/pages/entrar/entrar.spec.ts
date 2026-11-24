import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { API_URL } from '../../core/api';
import { Entrar } from './entrar';

describe('Entrar', () => {
  let http: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()]
    });

    http = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  function criar(): Entrar {
    const fixture = TestBed.createComponent(Entrar);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  it('should create', () => {
    expect(criar()).toBeTruthy();
  });

  it('senha errada: mostra a mensagem e não guarda token', () => {
    const tela = criar();
    tela.usuario.set('emilys');
    tela.senha.set('errada');

    tela.entrar();

    http
      .expectOne(`${API_URL}/auth/login`)
      .flush({ message: 'Invalid credentials' }, { status: 400, statusText: 'Bad Request' });

    expect(tela.erro()).toBe('Usuário ou senha inválidos.');
    expect(localStorage.getItem('token')).toBeNull();
    expect(tela.carregando()).toBe(false);
  });

  it('senha certa: guarda o token e vai para /perfil', () => {
    const navegar = spyOn(router, 'navigate').and.resolveTo(true);
    const tela = criar();
    tela.usuario.set('emilys');
    tela.senha.set('emilyspass');

    tela.entrar();

    http.expectOne(`${API_URL}/auth/login`).flush({ accessToken: 'eyJ.token.certo' });

    expect(localStorage.getItem('token')).toBe('eyJ.token.certo');
    expect(navegar).toHaveBeenCalledWith(['/perfil']);
    expect(tela.erro()).toBe('');
  });

  it('servidor fora do ar: a mensagem não culpa a senha', () => {
    const tela = criar();
    tela.usuario.set('emilys');
    tela.senha.set('emilyspass');

    tela.entrar();

    http
      .expectOne(`${API_URL}/auth/login`)
      .flush('erro', { status: 500, statusText: 'Server Error' });

    expect(tela.erro()).toBe('Não foi possível entrar agora. Tente de novo.');
  });

  it('campos vazios: nem chama a API', () => {
    const tela = criar();

    tela.entrar();

    http.expectNone(`${API_URL}/auth/login`);
    expect(tela.carregando()).toBe(false);
  });
});
