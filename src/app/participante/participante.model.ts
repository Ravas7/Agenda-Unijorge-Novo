/**
 * MODELO DO PARTICIPANTE
 *
 * Aqui mora o FORMATO dos dados. Nada de regra, nada de tela.
 * Segue o mesmo desenho do padrao.model.ts:
 *
 *  1. A uniao de texto inclui '' porque o <select> comeca vazio.
 *  2. O que existe so enquanto se digita (o rascunho) nao tem id nem eventoId.
 *  3. O eventoId e a LIGACAO: um evento tem varios participantes,
 *     e cada participante aponta para o evento a que pertence.
 */

export type FormaPagamento = 'pix' | 'cartao' | 'boleto' | 'dinheiro' | '';

/**
 * As opcoes do <select>: so o CODIGO que se guarda ('' fica de fora, e o
 * "nada escolhido"). O texto que a pessoa le vem do pipe formaPagamento,
 * que e o unico lugar onde os rotulos moram.
 */
export const FORMAS_PAGAMENTO: Exclude<FormaPagamento, ''>[] = [
  'pix',
  'cartao',
  'boleto',
  'dinheiro'
];

/** O que fica guardado depois de salvar. */
export interface CadastroParticipante {
  id: number;
  eventoId: number;
  descricao: string;
  email: string;
  telefone: string;
  formaPagamento: FormaPagamento;
}

/** O que existe ENQUANTO SE DIGITA: sem id e sem eventoId (so nascem ao salvar). */
export type RascunhoParticipante = Omit<CadastroParticipante, 'id' | 'eventoId'>;

/** Os nomes dos campos, derivados do tipo acima. */
export type CampoParticipante = keyof RascunhoParticipante;

/** De cada campo para a sua mensagem. Formulario valido = objeto vazio: {}. */
export type ErrosParticipante = Partial<Record<CampoParticipante, string>>;

/** Em quais campos a pessoa ja entrou e saiu. */
export type CamposTocadosParticipante = Partial<Record<CampoParticipante, boolean>>;

/** Uma ficha zerada. Funcao, e nao constante, para cada chamada devolver um objeto novo. */
export function rascunhoParticipanteEmBranco(): RascunhoParticipante {
  return {
    descricao: '',
    email: '',
    telefone: '',
    formaPagamento: ''
  };
}
