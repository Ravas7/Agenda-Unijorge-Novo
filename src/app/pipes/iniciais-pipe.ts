import { Pipe, PipeTransform } from '@angular/core';

/** Palavras de ligacao nao contam como inicial: "Maria da Silva" e MS, nao MDS. */
const LIGACAO = new Set(['de', 'da', 'do', 'das', 'dos', 'e']);

/**
 * {{ p.descricao | iniciais }}   (o "avatar" redondo ao lado do nome)
 *
 *   'Maria da Silva Santos'       ->  MS   primeiro e ultimo
 *   '  joão   guedes de brito '   ->  JB   espacos sobrando e minusculas
 *   'Ana'                         ->  A    um nome so
 *   ''                            ->  ''
 */
@Pipe({
  name: 'iniciais'
})
export class IniciaisPipe implements PipeTransform {
  transform(nome: string | null | undefined): string {
    if (!nome) return '';

    const partes = nome
      .trim()
      .split(/\s+/) // um ou mais espaços
      .filter(parte => parte !== '' && !LIGACAO.has(parte.toLowerCase()));

    if (partes.length === 0) return '';

    const primeira = partes[0].charAt(0);

    if (partes.length === 1) return primeira.toUpperCase();

    const ultima = partes[partes.length - 1].charAt(0);

    return (primeira + ultima).toUpperCase();
  }
}
