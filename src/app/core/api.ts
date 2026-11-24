/**
 * A NOSSA API: a unica que recebe o token.
 *
 * Hoje e a DummyJSON (API de treino, com login de verdade).
 * No projeto final, e so trocar por o endereco do backend Spring.
 *
 * O ViaCEP (CEP dos Correios) e de OUTRO site: nao esta aqui de proposito,
 * porque o authInterceptor nao pode mandar o token para ele.
 */
export const API_URL = 'https://dummyjson.com';
