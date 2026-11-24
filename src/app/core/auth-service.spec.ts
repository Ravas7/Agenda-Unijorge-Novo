import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { API_URL } from './api';
import { AuthService } from './auth-service';

describe('AuthService', () => {
  let servico: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    servico = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify(); // nenhuma chamada pendente sem resposta
    localStorage.clear();
  });

  it('entrar: faz POST no login e guarda o accessToken', () => {
    servico.entrar('emilys', 'emilyspass').subscribe();

    const req = http.expectOne(`${API_URL}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username: 'emilys', password: 'emilyspass' });

    req.flush({ accessToken: 'eyJ.token.certo' });

    expect(localStorage.getItem('token')).toBe('eyJ.token.certo');
  });

  it('entrar com senha errada: repassa o erro e não guarda token', () => {
    const erros: HttpErrorResponse[] = [];

    servico.entrar('emilys', 'errada').subscribe({
      error: (e: HttpErrorResponse) => erros.push(e)
    });

    http
      .expectOne(`${API_URL}/auth/login`)
      .flush({ message: 'Invalid credentials' }, { status: 400, statusText: 'Bad Request' });

    expect(erros.length).toBe(1);
    expect(erros[0].status).toBe(400);
    expect(localStorage.getItem('token')).toBeNull();
  });

  it('perfil: faz GET em /auth/me', () => {
    servico.perfil().subscribe();

    const req = http.expectOne(`${API_URL}/auth/me`);
    expect(req.request.method).toBe('GET');
    req.flush({ id: 1, firstName: 'Emily' });
  });

  it('token: null antes do login e o valor guardado depois', () => {
    expect(servico.token()).toBeNull();

    localStorage.setItem('token', 'abc');

    expect(servico.token()).toBe('abc');
  });

  it('sair: apaga o token', () => {
    localStorage.setItem('token', 'abc');

    servico.sair();

    expect(servico.token()).toBeNull();
  });
});
