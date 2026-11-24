import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { Endereco } from './cep.model';
import { CepService } from './cep-service';

describe('CepService', () => {
  let servico: CepService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    servico = TestBed.inject(CepService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('CEP que existe: traduz logradouro/localidade para rua/cidade', () => {
    const recebidos: (Endereco | null)[] = [];

    servico.buscar('40140-110').subscribe(e => recebidos.push(e));

    // o traço some: o ViaCEP recebe só os dígitos
    http.expectOne('https://viacep.com.br/ws/40140110/json/').flush({
      logradouro: 'Avenida Sete de Setembro',
      bairro: 'Barra',
      localidade: 'Salvador',
      uf: 'BA'
    });

    expect(recebidos).toEqual([
      { rua: 'Avenida Sete de Setembro', bairro: 'Barra', cidade: 'Salvador', uf: 'BA' }
    ]);
  });

  it('CEP que não existe: vem 200 com erro, e o serviço devolve null', () => {
    const recebidos: (Endereco | null)[] = [];

    servico.buscar('99999-999').subscribe(e => recebidos.push(e));

    http.expectOne('https://viacep.com.br/ws/99999999/json/').flush({ erro: 'true' });

    expect(recebidos).toEqual([null]);
  });

  it('CEP com formato errado: o 400 do ViaCEP chega como erro', () => {
    const erros: HttpErrorResponse[] = [];

    servico.buscar('4014011').subscribe({
      error: (e: HttpErrorResponse) => erros.push(e)
    });

    http
      .expectOne('https://viacep.com.br/ws/4014011/json/')
      .flush('<html>Bad Request</html>', { status: 400, statusText: 'Bad Request' });

    expect(erros.length).toBe(1);
    expect(erros[0].status).toBe(400);
  });
});
