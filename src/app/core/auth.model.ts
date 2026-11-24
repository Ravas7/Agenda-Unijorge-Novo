/** O que o POST /auth/login devolve quando usuario e senha estao certos. */
export interface RespostaLogin {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  accessToken: string;
  refreshToken: string;
}

/** O que o GET /auth/me devolve (so os campos que a tela usa). */
export interface PerfilUsuario {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image?: string;
}
