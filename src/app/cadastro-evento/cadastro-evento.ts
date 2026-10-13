import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { Evento } from '../models/evento';
import * as ValidacoesEvento from '../models/evento.validacao';

@Component({
  selector: 'app-cadastro-evento',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './cadastro-evento.html',
  styleUrl: './cadastro-evento.css'
})
export class CadastroEvento {
  titulo = '';
  data = '';
  local = '';
  emailResponsavel = '';
  vagas: number | null = null;

  proximoId = 1;
  eventos: Evento[] = [];

  readonly validacoes = ValidacoesEvento;

  readonly locais: string[] = [
    'Auditório',
    'Laboratório 1',
    'Laboratório 2',
    'Sala 101'
  ];

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

    const evento: Evento = {
      id: this.proximoId,
      titulo: this.titulo.trim(),
      data: this.data,
      local: this.local,
      emailResponsavel: this.emailResponsavel.trim(),
      vagas: this.vagas
    };

    this.eventos.push(evento);

    this.proximoId++;

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
    this.eventos = this.eventos.filter(
      evento => evento.id !== id
    );
  }
}