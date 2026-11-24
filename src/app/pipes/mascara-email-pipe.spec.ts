import { MascaraEmailPipe } from './mascara-email-pipe';

describe('MascaraEmailPipe', () => {
  const pipe = new MascaraEmailPipe();

  it('mostra 2 letras, esconde o resto com * e mantém o domínio', () => {
    expect(pipe.transform('joaosilva@gmail.com')).toBe('jo*******@gmail.com');
  });

  it('um * para cada letra escondida', () => {
    expect(pipe.transform('joaoandrade@gmail.com')).toBe('jo*********@gmail.com');
  });

  it('usuário de 2 letras mostra só 1 (algo precisa ficar escondido)', () => {
    expect(pipe.transform('ab@dominio.com')).toBe('a*@dominio.com');
  });

  it('usuário de 1 letra fica todo escondido', () => {
    expect(pipe.transform('a@dominio.com')).toBe('*@dominio.com');
  });

  it('texto que não é e-mail sai igual', () => {
    expect(pipe.transform('sem arroba')).toBe('sem arroba');
    expect(pipe.transform('@dominio.com')).toBe('@dominio.com');
  });

  it('vazio, null e undefined devolvem vazio', () => {
    expect(pipe.transform('')).toBe('');
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });
});
