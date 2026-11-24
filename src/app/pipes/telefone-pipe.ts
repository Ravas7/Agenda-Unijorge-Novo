import { Pipe, PipeTransform } from '@angular/core';

/**
 * {{ p.telefone | telefone }}
 *
 *   '71988887777'      ->  (71) 98888-7777   celular: 11 digitos
 *   '7133334444'       ->  (71) 3333-4444    fixo: 10 digitos
 *   '(71) 98888-7777'  ->  (71) 98888-7777   ja formatado: limpa e formata de novo
 *   '123'              ->  123               nao reconhece: devolve como chegou
 *   null ou ''         ->  ''                a tela nao pode quebrar
 *
 * O pipe so muda o que aparece na tela: o dado guardado continua cru.
 */
@Pipe({
  name: 'telefone'
})
export class TelefonePipe implements PipeTransform {
  transform(valor: string | null | undefined): string {
    if (!valor) return '';

    const d = valor.replace(/\D/g, ''); // só dígitos

    if (d.length === 11) {
      return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    }

    if (d.length === 10) {
      return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    }

    return valor; // não sei: devolve igual, em vez de fazer o dado sumir
  }
}
