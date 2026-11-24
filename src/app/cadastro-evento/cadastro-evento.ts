import { DatePipe, DecimalPipe, UpperCasePipe} from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Evento } from '../models/evento';
import { EventoService } from '../services/evento.service';
import * as ValidacoesEvento from '../models/evento.validacao';

@Component({
  selector: 'app-cadastro-evento',
  standalone: true,
  imports: [FormsModule, RouterLink, DatePipe, UpperCasePipe, DecimalPipe],
  templateUrl: './cadastro-evento.html',
  styleUrl: './cadastro-evento.css'
})
export class CadastroEvento {
  titulo = '';
  data = '';
  local = '';
  emailResponsavel = '';
  vagas: number | null = null;

  /** Os eventos moram no servico: assim o Participante enxerga os mesmos. */
  readonly servico = inject(EventoService);

  readonly validacoes = ValidacoesEvento;

  readonly locais: string[] = [
    'Auditório',
    'Laboratório 1',
    'Laboratório 2',
    'Sala 101'
  ];

  get eventos(): Evento[] {
    return this.servico.eventos;
  }

  get formularioValido(): boolean {
    return (
      ValidacoesEvento.validarTitulo(this.titulo) === null &&
      ValidacoesEvento.validarData(this.data) === null &&
      ValidacoesEvento.validarLocal(this.local) === null &&
      ValidacoesEvento.validarEmailResponsavel(
        this.emailResponsavel
      ) === null &&
      ValidacoesEvento.validarVagas(
        this.vagas,
        this.local
      ) === null
    );
  }

  salvarEvento(formulario: NgForm): void {
    if (!this.formularioValido) {
      return;
    }

    this.servico.adicionarEvento({
      titulo: this.titulo.trim(),
      data: this.data,
      local: this.local,
      emailResponsavel: this.emailResponsavel.trim(),
      vagas: this.vagas
    });

    this.limparFormulario(formulario);
  }

  limparFormulario(formulario?: NgForm): void {
    this.titulo = '';
    this.data = '';
    this.local = '';
    this.emailResponsavel = '';
    this.vagas = null;

    formulario?.resetForm({
      titulo: '',
      data: '',
      local: '',
      emailResponsavel: '',
      vagas: null
    });
  }

  excluirEvento(id: number): void {
    this.servico.excluirEvento(id);
  }
}