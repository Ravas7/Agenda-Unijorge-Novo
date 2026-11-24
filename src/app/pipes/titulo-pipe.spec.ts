import { TituloPipe } from './titulo-pipe';

describe('TituloPipe', () => {
  const pipe = new TituloPipe();

  it('mantém as palavras de ligação em minúsculas', () => {
    expect(pipe.transform('semana de tecnologia da unijorge')).toBe(
      'Semana de Tecnologia da Unijorge'
    );
  });

  it('arruma texto todo em maiúsculas', () => {
    expect(pipe.transform('DE VOLTA AO CAMPUS')).toBe('De Volta ao Campus');
  });

  it('a primeira palavra sempre começa em maiúscula, mesmo sendo de ligação', () => {
    expect(pipe.transform('da silva')).toBe('Da Silva');
  });

  it('só espaços devolve vazio', () => {
    expect(pipe.transform('   ')).toBe('');
  });

  it('vazio, null e undefined devolvem vazio', () => {
    expect(pipe.transform('')).toBe('');
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });

  it('espaços sobrando entre as palavras são aparados', () => {
    expect(pipe.transform('  semana   de  tecnologia ')).toBe('Semana de Tecnologia');
  });
});
