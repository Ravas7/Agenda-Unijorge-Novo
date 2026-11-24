/**
 * Como o ViaCEP responde (o "DTO": o formato do OUTRO lado).
 * Os nomes sao os deles: logradouro, localidade...
 */
export interface ViaCepDTO {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  /** CEP que nao existe volta com status 200 e { "erro": "true" } */
  erro?: boolean | string;
}

/** Como a NOSSA tela fala: rua, cidade... A traducao fica no CepService. */
export interface Endereco {
  rua: string;
  bairro: string;
  cidade: string;
  uf: string;
}
