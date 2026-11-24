import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { Endereco, ViaCepDTO } from './cep.model';

/**
 * CHAMADA 3: o CEP dos Correios (ViaCEP, grátis e sem cadastro).
 *
 * E de OUTRO site, entao o authInterceptor deixa passar SEM o token.
 *
 * Pegadinha: CEP que nao existe volta com status 200 e { "erro": "true" }.
 * Para o Angular, "deu certo". Se o servico nao olhar o campo erro, a tela
 * mostra um endereco em branco. Por isso o map devolve null nesse caso.
 */
@Injectable({ providedIn: 'root' })
export class CepService {
  private readonly http = inject(HttpClient);

  buscar(cep: string): Observable<Endereco | null> {
    const digitos = cep.replace(/\D/g, ''); // tira o traço

    return this.http
      .get<ViaCepDTO>(`https://viacep.com.br/ws/${digitos}/json/`)
      .pipe(
        map(dto =>
          dto.erro
            ? null // CEP não existe
            : {
                // a API chama de "localidade"; a nossa tela, de "cidade"
                rua: dto.logradouro,
                bairro: dto.bairro,
                cidade: dto.localidade,
                uf: dto.uf
              }
        )
      );
  }
}
