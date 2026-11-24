import { IniciaisPipe } from './iniciais-pipe';

describe('IniciaisPipe', () => {
  const pipe = new IniciaisPipe();

  it('pega o primeiro e o último nome', () => {
    expect(pipe.transform('Maria da Silva Santos')).toBe('MS');
  });

  it('aguenta espaços sobrando e minúsculas', () => {
    expect(pipe.transform('  joão   guedes de brito ')).toBe('JB');
  });

  it('um nome só devolve uma letra', () => {
    expect(pipe.transform('Ana')).toBe('A');
  });

  it('vazio, null e undefined devolvem vazio', () => {
    expect(pipe.transform('')).toBe('');
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });

  it('só espaços e só palavras de ligação devolvem vazio', () => {
    expect(pipe.transform('   ')).toBe('');
    expect(pipe.transform('de da')).toBe('');
  });
});
