import { Pipe, PipeTransform } from '@angular/core';

/** Ficam minusculas, exceto quando sao a PRIMEIRA palavra. */
const LIGACAO = new Set([
  'a', 'as', 'o', 'os', 'ao', 'aos',
  'de', 'da', 'do', 'das', 'dos',
  'e', 'em', 'no', 'na', 'nos', 'nas',
  'com', 'para', 'por'
]);

/**
 * Um titlecase que sabe portugues. O pronto (titlecase) escreve "Semana De Tecnologia".
 *
 *   'semana de tecnologia da unijorge'  ->  Semana de Tecnologia da Unijorge
 *   'DE VOLTA AO CAMPUS'                ->  De Volta ao Campus
 *   '   '                               ->  ''   (so espacos)
 */
@Pipe({
  name: 'titulo'
})
export class TituloPipe implements PipeTransform {
  transform(texto: string | null | undefined): string {
    if (!texto || texto.trim() === '') return '';

    return texto
      .trim()
      .split(/\s+/)
      .map((palavra, posicao) => {
        const minuscula = palavra.toLowerCase();

        if (posicao > 0 && LIGACAO.has(minuscula)) return minuscula;

        return minuscula.charAt(0).toUpperCase() + minuscula.slice(1);
      })
      .join(' ');
  }
}
