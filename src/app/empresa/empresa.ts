
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface DadosEmpresa {
  nome: string;
  cnpj: string;
  logomarca: string;
  fundacao: string;
  descricao: string;
}

@Component({
  selector: 'app-empresa',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './empresa.html',
  styleUrl: './empresa.css'
})
export class Empresa {
  empresa: DadosEmpresa = this.empresaVazia();

  empresaEnviada: DadosEmpresa | null = null;
  mensagem = '';

  enviar(): void {
    this.empresaEnviada = { ...this.empresa };
    this.mensagem = 'Dados da empresa enviados com sucesso.';
  }

  limpar(): void {
    this.empresa = this.empresaVazia();
    this.empresaEnviada = null;
    this.mensagem = '';
  }

  private empresaVazia(): DadosEmpresa {
    return {
      nome: '',
      cnpj: '',
      logomarca: '',
      fundacao: '',
      descricao: ''
    };
  }
}
