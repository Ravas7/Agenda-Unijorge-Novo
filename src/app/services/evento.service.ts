import { Injectable } from '@angular/core';

import { Evento } from '../models/evento';
import {
  CadastroParticipante,
  RascunhoParticipante
} from '../participante/participante.model';

/**
 * SERVICO DE EVENTOS E PARTICIPANTES
 *
 * Por que um servico? Os eventos eram guardados dentro do componente
 * CadastroEvento, e um componente e destruido quando se troca de tela.
 * Como o Participante precisa enxergar os mesmos eventos, o estado sobe
 * para um servico unico (providedIn: 'root'), que vive enquanto a
 * aplicacao estiver aberta.
 *
 * Os dados ficam so na memoria: recarregar a pagina (F5) apaga tudo.
 *
 * A relacao e: um evento tem VARIOS participantes.
 * Cada participante guarda o eventoId do evento a que pertence.
 */
@Injectable({ providedIn: 'root' })
export class EventoService {
  eventos: Evento[] = [];
  participantes: CadastroParticipante[] = [];

  private proximoIdEvento = 1;
  private proximoIdParticipante = 1;

  // ------------------------------ eventos ------------------------------

  adicionarEvento(dados: Omit<Evento, 'id'>): Evento {
    const evento: Evento = { id: this.proximoIdEvento++, ...dados };
    this.eventos = [...this.eventos, evento];
    return evento;
  }

  obterEvento(id: number): Evento | undefined {
    return this.eventos.find(e => e.id === id);
  }

  /** Excluir o evento leva junto os participantes dele. */
  excluirEvento(id: number): void {
    this.eventos = this.eventos.filter(e => e.id !== id);
    this.participantes = this.participantes.filter(p => p.eventoId !== id);
  }

  // --------------------------- participantes ---------------------------

  participantesDoEvento(eventoId: number): CadastroParticipante[] {
    return this.participantes.filter(p => p.eventoId === eventoId);
  }

  quantidadeDeParticipantes(eventoId: number): number {
    return this.participantesDoEvento(eventoId).length;
  }

  adicionarParticipante(
    eventoId: number,
    dados: RascunhoParticipante
  ): CadastroParticipante {
    // o spread faz uma COPIA: o cartao nao muda enquanto se digita outro
    const participante: CadastroParticipante = {
      id: this.proximoIdParticipante++,
      eventoId,
      ...dados
    };
    this.participantes = [...this.participantes, participante];
    return participante;
  }

  removerParticipante(id: number): void {
    this.participantes = this.participantes.filter(p => p.id !== id);
  }
}
