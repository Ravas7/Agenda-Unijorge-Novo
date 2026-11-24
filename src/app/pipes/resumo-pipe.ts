import { Pipe, PipeTransform } from '@angular/core';

/**
 * {{ descricao | resumo:40 }}
 *
 * Corta em `limite` caracteres SEM partir palavra e termina com "…".
 * Sem parametro, o limite e 30. Texto que ja cabe sai igual.
 *
 *   'Semana de Tecnologia da Unijorge com palestras e oficinas' | resumo
 *       ->  Semana de Tecnologia da…
 */
@Pipe({
  name: 'resumo'
})
export class ResumoPipe implements PipeTransform {
  transform(texto: string | null | undefined, limite: number = 30): string {
    if (!texto) return '';

    const original = texto.trim();

    if (original.length <= limite) return original;

    let corte = original.slice(0, limite);

    // a palavra so esta inteira se o caractere seguinte for um espaço;
    // senão, descarta a palavra que ficou pela metade
    const terminouNoMeioDaPalavra = !/\s/.test(original.charAt(limite));
    const ultimoEspaco = corte.search(/\s\S*$/);

    if (terminouNoMeioDaPalavra && ultimoEspaco > 0) {
      corte = corte.slice(0, ultimoEspaco);
    }

    return corte.trimEnd() + '…';
  }
}
