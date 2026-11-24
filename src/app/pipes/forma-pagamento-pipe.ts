import { Pipe, PipeTransform } from '@angular/core';

import { FormaPagamento } from '../participante/participante.model';

/**
 * Traduz o CODIGO guardado para o TEXTO que a pessoa le.
 *
 * Record<FormaPagamento, string> obriga a ter UMA linha para cada valor do
 * tipo: se alguem acrescentar uma forma nova no tipo e esquecer aqui, o
 * TypeScript acusa na hora. Com uma sequencia de if, nao acusaria.
 */
const ROTULOS: Record<FormaPagamento, string> = {
  pix: 'Pix',
  cartao: 'Cartão de crédito',
  boleto: 'Boleto',
  dinheiro: 'Dinheiro',
  '': 'Não informado'
};

/**
 * {{ p.formaPagamento | formaPagamento }}
 *
 *   'cartao'  ->  Cartão de crédito
 *   ''/null   ->  Não informado
 *
 * No banco continua 'cartao'. So a tela mudou.
 */
@Pipe({
  name: 'formaPagamento'
})
export class FormaPagamentoPipe implements PipeTransform {
  transform(valor: FormaPagamento | null | undefined): string {
    if (!valor) return ROTULOS['']; // null, undefined ou ''

    return ROTULOS[valor] ?? ROTULOS['']; // valor fora do tipo (dado antigo)
  }
}
