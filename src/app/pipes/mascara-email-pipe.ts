import { Pipe, PipeTransform } from '@angular/core';

/**
 * {{ p.email | mascaraEmail }}
 *
 * Mostra as duas primeiras letras, um * para cada letra escondida e o
 * dominio inteiro. Se o usuario tiver so 1 ou 2 letras, aparece menos
 * (senao nao haveria nada escondido).
 *
 *   'joaosilva@gmail.com'  ->  jo*******@gmail.com
 *   'ab@dominio.com'       ->  a*@dominio.com
 *   'sem arroba'           ->  sem arroba   (nao e e-mail: devolve igual)
 *
 * ATENCAO: isto e so APARENCIA. O e-mail completo continua chegando ao
 * navegador (aba Network do DevTools). Proteger de verdade e no servidor.
 */
@Pipe({
  name: 'mascaraEmail'
})
export class MascaraEmailPipe implements PipeTransform {
  transform(email: string | null | undefined): string {
    if (!email) return '';

    const arroba = email.lastIndexOf('@');

    if (arroba < 1) return email; // sem @, ou @ no começo: não é e-mail

    const usuario = email.slice(0, arroba);
    const dominio = email.slice(arroba); // já inclui o @

    const visiveis = Math.min(2, usuario.length - 1);
    const escondidas = usuario.length - visiveis;

    return usuario.slice(0, visiveis) + '*'.repeat(escondidas) + dominio;
  }
}
