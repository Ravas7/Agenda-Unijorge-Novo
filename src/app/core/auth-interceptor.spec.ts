import {
  HttpClient,
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { API_URL } from './api';
import { authInterceptor } from './auth-interceptor';

describe('authInterceptor', () => {
  let cliente: HttpClient;
  let http: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting()
      ]
    });

    cliente = TestBed.inject(HttpClient);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    localStorage.clear();
  });

  it('com token, para a nossa API: manda Authorization: Bearer', () => {
    localStorage.setItem('token', 'abc123');

    cliente.get(`${API_URL}/auth/me`).subscribe();

    const req = http.expectOne(`${API_URL}/auth/me`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer abc123');
    req.flush({});
  });

  it('com token, para o ViaCEP (outro site): NÃO manda o token', () => {
    localStorage.setItem('token', 'abc123');

    cliente.get('https://viacep.com.br/ws/40140110/json/').subscribe();

    const req = http.expectOne('https://viacep.com.br/ws/40140110/json/');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('domínio que só começa igual ao nosso NÃO recebe o token', () => {
    localStorage.setItem('token', 'abc123');

    cliente.get('https://dummyjson.com.site-falso.com/auth/me').subscribe();

    const req = http.expectOne('https://dummyjson.com.site-falso.com/auth/me');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('sem token, para a nossa API: passa como veio (é o caso do login)', () => {
    cliente.post(`${API_URL}/auth/login`, {}).subscribe();

    const req = http.expectOne(`${API_URL}/auth/login`);
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });
});
