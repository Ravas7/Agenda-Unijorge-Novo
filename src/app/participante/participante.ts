import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { Evento } from '../models/evento';
import { EventoService } from '../services/evento.service';
import {
  CadastroParticipante,
  CampoParticipante,
  CamposTocadosParticipante,
  ErrosParticipante,
  FORMAS_PAGAMENTO,
  FormaPagamento,
  RascunhoParticipante,
  rascunhoParticipanteEmBranco,
  rotuloFormaPagamento
} from './participante.model';
import { validarRascunhoParticipante } from './participante.validacao';

/**
 * PARTICIPANTES DE UM EVENTO
 *
 * Rota: /eventos/:id/participantes
 *
 * Mesmo desenho do Padrao: a classe so guarda o estado e conversa com a
 * tela; quem sabe validar e o participante.validacao.ts.
 *
 *   rascunho  o que esta sendo digitado agora
 *   tocados   em quais campos a pessoa ja entrou e saiu
 *   erros     GETTER, recalculado a cada verificacao de tela
 *   salvar()  o que acontece quando o formulario e enviado
 *
 * A ligacao com o evento vem da URL (:id) e dos dados do EventoService.
 */
@Component({
  selector: 'app-participante',
  imports: [FormsModule, RouterLink],
  templateUrl: './participante.html',
  styleUrl: './participante.css'
})
export class Participante {
  private readonly rota = inject(ActivatedRoute);
  private readonly servico = inject(EventoService);

  readonly formas = FORMAS_PAGAMENTO;

  /** o id do evento, lido da URL */
  readonly eventoId = Number(this.rota.snapshot.paramMap.get('id'));

  rascunho: RascunhoParticipante = rascunhoParticipanteEmBranco();

  tocados: CamposTocadosParticipante = {};

  /** undefined quando o id da URL nao corresponde a nenhum evento */
  get evento(): Evento | undefined {
    return this.servico.obterEvento(this.eventoId);
  }

  get participantes(): CadastroParticipante[] {
    return this.servico.participantesDoEvento(this.eventoId);
  }

  get vagasRestantes(): number {
    return (this.evento?.vagas ?? 0) - this.participantes.length;
  }

  /** Nao cabe mais ninguem: o evento tem um limite de vagas. */
  get lotado(): boolean {
    return this.vagasRestantes <= 0;
  }

  get erros(): ErrosParticipante {
    return validarRascunhoParticipante(this.rascunho, this.participantes);
  }

  get quantidadeDeErros(): number {
    return Object.keys(this.erros).length;
  }

  get temErro(): boolean {
    return this.quantidadeDeErros > 0;
  }

  /** So mostra a mensagem se a pessoa JA SAIU do campo. */
  deveMostrar(campo: CampoParticipante): boolean {
    return this.tocados[campo] === true && this.erros[campo] !== undefined;
  }

  mensagem(campo: CampoParticipante): string {
    return this.erros[campo] ?? '';
  }

  marcarTocado(campo: CampoParticipante): void {
    this.tocados[campo] = true;
  }

  /** Ao enviar, todo campo passa a ser "tocado". */
  mostrarTudo(): void {
    const campos = Object.keys(this.rascunho) as CampoParticipante[];
    for (const campo of campos) {
      this.tocados[campo] = true;
    }
  }

  salvar(): void {
    if (this.evento === undefined || this.lotado) {
      return;
    }

    if (this.temErro) {
      this.mostrarTudo();
      return;
    }

    this.servico.adicionarParticipante(this.eventoId, {
      descricao: this.rascunho.descricao.trim(),
      email: this.rascunho.email.trim(),
      telefone: this.rascunho.telefone.trim(),
      formaPagamento: this.rascunho.formaPagamento
    });

    this.limpar();
  }

  limpar(): void {
    this.rascunho = rascunhoParticipanteEmBranco();
    this.tocados = {};
  }

  remover(id: number): void {
    this.servico.removerParticipante(id);
  }

  rotuloPagamento(forma: FormaPagamento): string {
    return rotuloFormaPagamento(forma);
  }
}
