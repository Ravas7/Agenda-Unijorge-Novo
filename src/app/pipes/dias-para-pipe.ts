import { Pipe, PipeTransform } from '@angular/core';

const MS_POR_DIA = 24 * 60 * 60 * 1000;

/**
 * {{ evento.data | diasPara }}
 *
 * Recebe a data no formato do <input type="date"> ('aaaa-mm-dd') e diz quanto falta.
 *
 * Duas decisoes importantes:
 *
 *  1. NAO usa new Date('2026-11-20'): data so com dia e lida como meia-noite
 *     em UTC e, em Salvador (UTC-3), isso e dia 19 as 21h. Aqui as partes sao
 *     separadas na mao e as DUAS datas sao montadas com Date.UTC, entao
 *     nenhuma sofre fuso nem horario de verao.
 *
 *  2. O "hoje" e PARAMETRO. Na tela ninguem passa o segundo argumento e vale a
 *     data real; no teste passa-se new Date(2026, 10, 10) e a tabela vale em
 *     qualquer dia do ano. (O mes do Date comeca em 0: novembro e 10.)
 *
 * Supondo que hoje e 10/11/2026:
 *
 *   '2026-11-10'  ->  Hoje
 *   '2026-11-11'  ->  Amanhã
 *   '2026-11-20'  ->  Faltam 10 dias
 *   '2026-12-01'  ->  Faltam 21 dias
 *   '2026-11-09'  ->  Encerrado
 *   ''            ->  ''
 */
@Pipe({
  name: 'diasPara'
})
export class DiasParaPipe implements PipeTransform {
  transform(data: string | null | undefined, hoje: Date = new Date()): string {
    if (!data) return '';

    const [ano, mes, dia] = data.split('-').map(Number);

    const dataInvalida =
      !Number.isInteger(ano) || !Number.isInteger(mes) || !Number.isInteger(dia) ||
      mes < 1 || mes > 12 || dia < 1 || dia > 31;

    if (dataInvalida) return '';

    const alvo = Date.UTC(ano, mes - 1, dia);
    const base = Date.UTC(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
    const dias = Math.round((alvo - base) / MS_POR_DIA);

    if (dias < 0) return 'Encerrado';
    if (dias === 0) return 'Hoje';
    if (dias === 1) return 'Amanhã';

    return `Faltam ${dias} dias`;
  }
}
