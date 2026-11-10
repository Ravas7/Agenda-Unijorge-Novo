import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { EventoService } from '../services/evento.service';
import { Participante } from './participante';

describe('Participante', () => {
  let servico: EventoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'eventos/:id/participantes', component: Participante }
        ])
      ]
    });

    servico = TestBed.inject(EventoService);
  });

  function novoEvento(vagas: number) {
    return servico.adicionarEvento({
      titulo: 'Semana de Tecnologia',
      data: '2099-12-01',
      local: 'Auditório',
      emailResponsavel: 'responsavel@exemplo.com',
      vagas
    });
  }

  it('should create', async () => {
    const harness = await RouterTestingHarness.create();
    const componente = await harness.navigateByUrl(
      '/eventos/1/participantes',
      Participante
    );

    expect(componente).toBeTruthy();
  });

  it('associa o participante salvo ao evento da URL', async () => {
    const evento = novoEvento(2);
    const harness = await RouterTestingHarness.create();
    const componente = await harness.navigateByUrl(
      `/eventos/${evento.id}/participantes`,
      Participante
    );

    componente.rascunho = {
      descricao: 'Maria Souza',
      email: 'maria@exemplo.com',
      telefone: '(71) 90000-0000',
      formaPagamento: 'pix'
    };
    componente.salvar();

    expect(servico.participantesDoEvento(evento.id).length).toBe(1);
    expect(servico.participantesDoEvento(evento.id)[0].eventoId).toBe(evento.id);
  });

  it('nao salva quando o evento esta lotado', async () => {
    const evento = novoEvento(1);
    const harness = await RouterTestingHarness.create();
    const componente = await harness.navigateByUrl(
      `/eventos/${evento.id}/participantes`,
      Participante
    );

    componente.rascunho = {
      descricao: 'Maria Souza',
      email: 'maria@exemplo.com',
      telefone: '(71) 90000-0000',
      formaPagamento: 'pix'
    };
    componente.salvar();

    componente.rascunho = {
      descricao: 'João Lima',
      email: 'joao@exemplo.com',
      telefone: '(71) 91111-1111',
      formaPagamento: 'boleto'
    };
    componente.salvar();

    expect(servico.participantesDoEvento(evento.id).length).toBe(1);
  });
});
