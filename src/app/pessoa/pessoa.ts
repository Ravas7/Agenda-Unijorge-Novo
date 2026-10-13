import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface PessoaForm {
  nomeCompleto: string; dataNascimento: string; cpf: string; rg: string; nomeMae: string; nomePai: string;
  paisOrigem: string; ufOrigem: string; cidadeOrigem: string;
}
interface Pais { nome: string; populacao: number; }
interface CadastroPessoa extends PessoaForm { id: number; }

@Component({ selector: 'app-pessoa', imports: [FormsModule], templateUrl: './pessoa.html', styleUrl: './pessoa.css' })
export class Pessoa implements OnInit {
  readonly titulo = 'Cadastro de Pessoa';
  pessoa: PessoaForm = this.pessoaEmBranco();
  paises: Pais[] = [];
  paisesFiltrados: Pais[] = [];
  ufs: string[] = [];
  ufsFiltradas: string[] = [];
  cidades: string[] = [];
  salvou = false;
  cadastradas: CadastroPessoa[] = [];

  paisBusca = '';
  ufBusca = '';
  dropdownAberto: 'pais' | 'uf' | 'cidade' | '' = '';

  @HostListener('document:click', ['$event'])
  fecharDropdownAoClicarFora(evento: MouseEvent): void {
    const alvo = evento.target as HTMLElement | null;
    if (!alvo?.closest('.cascata')) {
      this.dropdownAberto = '';
    }
  }

  async ngOnInit(): Promise<void> {
    await this.carregarPaises();
    await this.carregarPessoas();
  }

  async carregarPaises(): Promise<void> {
    this.paises = await this.get<Pais[]>('/api/paises');
    this.paisesFiltrados = this.paises;
  }

  filtrarPaises(): void {
    const termo = this.normalizar(this.paisBusca);
    this.paisesFiltrados = !termo
      ? this.paises
      : this.paises.filter(p => this.normalizar(p.nome).includes(termo));
    this.dropdownAberto = 'pais';
  }

  abrirPaises(): void {
    this.paisesFiltrados = this.paises;
    this.dropdownAberto = 'pais';
  }

  async selecionarPais(nome: string): Promise<void> {
    this.pessoa.paisOrigem = nome;
    this.paisBusca = nome;
    this.dropdownAberto = '';
    await this.paisMudou();
  }

  async paisMudou(): Promise<void> {
    this.pessoa.ufOrigem = '';
    this.pessoa.cidadeOrigem = '';
    this.ufBusca = '';
    this.cidades = [];
    this.ufs = await this.get<string[]>(`/api/ufs?pais=${encodeURIComponent(this.pessoa.paisOrigem)}`);
    this.ufsFiltradas = this.ufs;

    if (this.ufs.length === 0) {
      this.pessoa.ufOrigem = 'País sem UF';
      this.ufBusca = 'País sem UF';
    }
  }

  filtrarUfs(): void {
    const termo = this.normalizar(this.ufBusca);
    this.ufsFiltradas = !termo
      ? this.ufs
      : this.ufs.filter(uf => this.normalizar(uf).includes(termo));
    this.dropdownAberto = 'uf';
  }

  abrirUfs(): void {
    if (!this.pessoa.paisOrigem || this.ufs.length === 0) return;
    this.ufsFiltradas = this.ufs;
    this.dropdownAberto = 'uf';
  }

  async selecionarUf(uf: string): Promise<void> {
    this.pessoa.ufOrigem = uf;
    this.ufBusca = uf;
    this.dropdownAberto = '';
    await this.ufMudou();
  }

  async ufMudou(): Promise<void> {
    this.pessoa.cidadeOrigem = '';
    this.cidades = [];
    if (!this.pessoa.paisOrigem || !this.pessoa.ufOrigem || this.pessoa.ufOrigem === 'País sem UF') return;
    this.cidades = await this.get<string[]>(`/api/cidades?pais=${encodeURIComponent(this.pessoa.paisOrigem)}&uf=${encodeURIComponent(this.pessoa.ufOrigem)}`);
  }

  alternarCidade(): void {
    if (!this.pessoa.ufOrigem || this.pessoa.ufOrigem === 'País sem UF') return;
    this.dropdownAberto = this.dropdownAberto === 'cidade' ? '' : 'cidade';
  }

  selecionarCidade(cidade: string): void {
    this.pessoa.cidadeOrigem = cidade;
    this.dropdownAberto = '';
  }

  async salvar(): Promise<void> {
    if (!this.pessoa.cidadeOrigem || !this.pessoa.ufOrigem || !this.pessoa.paisOrigem) return;
    const salvo = await this.post<CadastroPessoa>('/api/pessoas', this.pessoa);
    this.cadastradas = [...this.cadastradas, salvo];
    this.salvou = true;
    this.pessoa = this.pessoaEmBranco();
    this.paisBusca = '';
    this.ufBusca = '';
    this.ufs = [];
    this.ufsFiltradas = [];
    this.cidades = [];
    this.dropdownAberto = '';
  }

  async remover(id: number): Promise<void> {
    await fetch(`http://localhost:3000/api/pessoas/${id}`, { method: 'DELETE' });
    this.cadastradas = this.cadastradas.filter(p => p.id !== id);
  }

  limpar(): void {
    this.pessoa = this.pessoaEmBranco();
    this.paisBusca = '';
    this.ufBusca = '';
    this.salvou = false;
    this.ufs = [];
    this.ufsFiltradas = [];
    this.cidades = [];
    this.dropdownAberto = '';
  }

  private normalizar(valor: string): string {
    return valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  }

  private async carregarPessoas(): Promise<void> { this.cadastradas = await this.get<CadastroPessoa[]>('/api/pessoas'); }
  private async get<T>(rota: string): Promise<T> { const r = await fetch(`http://localhost:3000${rota}`); if (!r.ok) throw new Error('Erro ao consultar servidor'); return r.json(); }
  private async post<T>(rota: string, dados: unknown): Promise<T> { const r = await fetch(`http://localhost:3000${rota}`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(dados) }); if (!r.ok) throw new Error('Erro ao salvar pessoa'); return r.json(); }
  private pessoaEmBranco(): PessoaForm { return { nomeCompleto:'', dataNascimento:'', cpf:'', rg:'', nomeMae:'', nomePai:'', paisOrigem:'', ufOrigem:'', cidadeOrigem:'' }; }
}
