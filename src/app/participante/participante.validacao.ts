import {
  CadastroParticipante,
  ErrosParticipante,
  RascunhoParticipante
} from './participante.model';

/**
 * VALIDACOES DO PARTICIPANTE
 *
 * O contrato de TODA funcao daqui e o mesmo do padrao.validacao.ts:
 *
 *     string  -> ha erro, e este texto e a mensagem que o usuario le
 *     null    -> passou, nada a dizer
 */

// ---------------------------------------------------------------
// 1. GENERICAS
// ---------------------------------------------------------------

export function obrigatorio(valor: string, campo: string): string | null {
  return valor.trim().length === 0 ? `${campo} não pode ficar em branco.` : null;
}

export function tamanhoEntre(
  valor: string,
  min: number,
  max: number,
  campo: string
): string | null {
  const texto = valor.trim();
  // vazio e problema do obrigatorio, nao deste aqui
  if (texto.length === 0) {
    return null;
  }
  if (texto.length < min || texto.length > max) {
    return `${campo} deve ter entre ${min} e ${max} caracteres.`;
  }
  return null;
}

/** Escolhe a PRIMEIRA mensagem: cada campo mostra um erro por vez. */
export function primeiroErro(...verificacoes: Array<string | null>): string | null {
  return verificacoes.find(mensagem => mensagem !== null) ?? null;
}

export function apenasDigitos(valor: string): string {
  return valor.replace(/\D/g, '');
}

// ---------------------------------------------------------------
// 2. ESPECIFICAS
// ---------------------------------------------------------------

export function validarDescricao(descricao: string): string | null {
  return primeiroErro(
    obrigatorio(descricao, 'A descrição'),
    tamanhoEntre(descricao, 3, 100, 'A descrição')
  );
}

export function validarEmail(email: string): string | null {
  const formato = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return primeiroErro(
    obrigatorio(email, 'O e-mail'),
    email.trim().length > 0 && !formato.test(email.trim())
      ? 'E-mail em formato inválido.'
      : null
  );
}

/** DDD + numero: 10 digitos (fixo) ou 11 digitos (celular). */
export function validarTelefone(telefone: string): string | null {
  const digitos = apenasDigitos(telefone).length;
  return primeiroErro(
    obrigatorio(telefone, 'O telefone'),
    digitos > 0 && digitos !== 10 && digitos !== 11
      ? 'O telefone deve ter 10 ou 11 dígitos, com DDD.'
      : null
  );
}

export function validarFormaPagamento(forma: string): string | null {
  return obrigatorio(forma, 'A forma de pagamento');
}

// ---------------------------------------------------------------
// 3. O MAPA DE ERROS
// ---------------------------------------------------------------

/**
 * Devolve SO os campos com problema. Ficha valida = objeto vazio: {}.
 *
 * `jaCadastrados` sao os participantes DO MESMO EVENTO.
 * [CRUZADA] o e-mail nao pode repetir dentro do evento: a regra depende
 * da lista, e por isso mora aqui e nao numa funcao que recebe so o e-mail.
 */
export function validarRascunhoParticipante(
  rascunho: RascunhoParticipante,
  jaCadastrados: CadastroParticipante[]
): ErrosParticipante {
  const erros: ErrosParticipante = {};

  const defina = (campo: keyof ErrosParticipante, mensagem: string | null): void => {
    if (mensagem !== null) {
      erros[campo] = mensagem;
    }
  };

  defina('descricao', validarDescricao(rascunho.descricao));
  defina('telefone', validarTelefone(rascunho.telefone));
  defina('formaPagamento', validarFormaPagamento(rascunho.formaPagamento));

  const jaExiste = jaCadastrados.some(
    p => p.email.trim().toLowerCase() === rascunho.email.trim().toLowerCase()
  );
  defina(
    'email',
    primeiroErro(
      validarEmail(rascunho.email),
      jaExiste ? 'Já existe um participante com este e-mail neste evento.' : null
    )
  );

  return erros;
}
