import { ResumoPipe } from './resumo-pipe';

describe('ResumoPipe', () => {
  const pipe = new ResumoPipe();
  const longo = 'Semana de Tecnologia da Unijorge com palestras e oficinas';

  it('sem parâmetro, corta em 30 sem partir palavra', () => {
    expect(pipe.transform(longo)).toBe('Semana de Tecnologia da…');
  });

  it('com parâmetro, corta no limite dado', () => {
    expect(pipe.transform(longo, 40)).toBe('Semana de Tecnologia da Unijorge com…');
  });

  it('texto que já cabe sai igual, sem reticências', () => {
    expect(pipe.transform('Semana de Tecnologia')).toBe('Semana de Tecnologia');
  });

  it('palavra que termina exatamente no limite é mantida inteira', () => {
    expect(pipe.transform('Semana de Tecnologia da Unijorge', 23)).toBe(
      'Semana de Tecnologia da…'
    );
  });

  it('uma palavra só maior que o limite é cortada no limite', () => {
    expect(pipe.transform('Anticonstitucionalissimamente', 10)).toBe('Anticonsti…');
  });

  it('vazio, null e undefined devolvem vazio', () => {
    expect(pipe.transform('')).toBe('');
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });
});
