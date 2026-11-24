import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { API_URL } from '../../core/api';
import { Perfil } from './perfil';

const EMILY = {
  id: 1,
  username: 'emilys',
  email: 'emily.johnson@x.dummyjson.com',
  firstName: 'Emily',
  lastName: 'Johnson'
};

describe('Perfil', () => {
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
    http.verify(); // garante que nenhuma chamada ficou sem resposta
    localStorage.clear();
  });

  /** Abre a tela e responde o GET /auth/me que ela faz ao nascer. */
  function criar(): ComponentFixture<Perfil> {
    const fixture = TestBed.createComponent(Perfil);
    fixture.detectChanges(); // ngOnInit: pede o perfil

    http.expectOne(`${API_URL}/auth/me`).flush(EMILY);
    fixture.detectChanges();

    return fixture;
  }

  it('should create', () => {
    expect(criar().componentInstance).toBeTruthy();
  });

  it('mostra "Olá, Emily Johnson" depois de carregar o perfil', () => {
    const fixture = criar();

    expect(fixture.nativeElement.textContent).toContain('Olá, Emily Johnson');
  });

  it('falha de servidor ao carregar o perfil: mostra aviso', () => {
    const fixture = TestBed.createComponent(Perfil);
    fixture.detectChanges();

    http
      .expectOne(`${API_URL}/auth/me`)
      .flush('erro', { status: 500, statusText: 'Server Error' });

    expect(fixture.componentInstance.erroPerfil()).toBe(
      'Não foi possível carregar o seu perfil.'
    );
  });

  it('CEP que existe: mostra o endereço traduzido', () => {
    const tela = criar().componentInstance;
    tela.cep.set('40140-110');

    tela.buscarCep();

    http.expectOne('https://viacep.com.br/ws/40140110/json/').flush({
      logradouro: 'Avenida Sete de Setembro',
      bairro: 'Barra',
      localidade: 'Salvador',
      uf: 'BA'
    });

    expect(tela.endereco()).toEqual({
      rua: 'Avenida Sete de Setembro',
      bairro: 'Barra',
      cidade: 'Salvador',
      uf: 'BA'
    });
    expect(tela.mensagemCep()).toBe('');
  });

  it('CEP que não existe (200 com erro): mostra "CEP não encontrado."', () => {
    const tela = criar().componentInstance;
    tela.cep.set('99999-999');

    tela.buscarCep();

    http.expectOne('https://viacep.com.br/ws/99999999/json/').flush({ erro: 'true' });

    expect(tela.endereco()).toBeNull();
    expect(tela.mensagemCep()).toBe('CEP não encontrado.');
  });

  it('CEP com tamanho errado: avisa na hora, sem chamar o ViaCEP', () => {
    const tela = criar().componentInstance;
    tela.cep.set('4014011');

    tela.buscarCep();

    // o http.verify() do afterEach reprova se alguma chamada tivesse saído
    expect(tela.mensagemCep()).toBe('Digite um CEP com 8 números.');
    expect(tela.buscando()).toBe(false);
  });

  it('sair: apaga o token e vai para /entrar', () => {
    localStorage.setItem('token', 'abc');
    const navegar = spyOn(router, 'navigate').and.resolveTo(true);
    const tela = criar().componentInstance;

    tela.sair();

    expect(localStorage.getItem('token')).toBeNull();
    expect(navegar).toHaveBeenCalledWith(['/entrar']);
  });
});
