import {
  HttpClient,
  HttpErrorResponse,
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { API_URL } from './api';
import { erroInterceptor } from './erro-interceptor';

describe('erroInterceptor', () => {
  let cliente: HttpClient;
  let http: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([erroInterceptor])),
        provideHttpClientTesting()
      ]
    });

    cliente = TestBed.inject(HttpClient);
    http = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  it('401: apaga o token, manda para o login e ainda repassa o erro', () => {
    localStorage.setItem('token', 'vencido');
    const navegar = spyOn(router, 'navigate').and.resolveTo(true);
    const erros: HttpErrorResponse[] = [];

    cliente.get(`${API_URL}/auth/me`).subscribe({
      error: (e: HttpErrorResponse) => erros.push(e)
    });

    http
      .expectOne(`${API_URL}/auth/me`)
      .flush({ message: 'Token Expired!' }, { status: 401, statusText: 'Unauthorized' });

    expect(localStorage.getItem('token')).toBeNull();
    expect(navegar).toHaveBeenCalledWith(['/entrar']);
    expect(erros.length).toBe(1);
    expect(erros[0].status).toBe(401);
  });

  it('400 (senha errada) passa direto: não apaga o token nem redireciona', () => {
    localStorage.setItem('token', 'valido');
    const navegar = spyOn(router, 'navigate').and.resolveTo(true);
    const erros: HttpErrorResponse[] = [];

    cliente.post(`${API_URL}/auth/login`, {}).subscribe({
      error: (e: HttpErrorResponse) => erros.push(e)
    });

    http
      .expectOne(`${API_URL}/auth/login`)
      .flush({ message: 'Invalid credentials' }, { status: 400, statusText: 'Bad Request' });

    expect(localStorage.getItem('token')).toBe('valido');
    expect(navegar).not.toHaveBeenCalled();
    expect(erros.length).toBe(1);
    expect(erros[0].status).toBe(400);
  });

  it('resposta de sucesso passa sem ser mexida', () => {
    const navegar = spyOn(router, 'navigate').and.resolveTo(true);
    const recebidos: unknown[] = [];

    cliente.get(`${API_URL}/auth/me`).subscribe(r => recebidos.push(r));

    http.expectOne(`${API_URL}/auth/me`).flush({ firstName: 'Emily' });

    expect(recebidos).toEqual([{ firstName: 'Emily' }]);
    expect(navegar).not.toHaveBeenCalled();
  });
});
