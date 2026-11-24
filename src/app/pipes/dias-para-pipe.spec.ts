import { DiasParaPipe } from './dias-para-pipe';

describe('DiasParaPipe', () => {
  const pipe = new DiasParaPipe();

  // "hoje" fixo: 10/11/2026 (o mês do Date começa em 0, então novembro é 10)
  const HOJE = new Date(2026, 10, 10);

  it('mesmo dia -> Hoje', () => {
    expect(pipe.transform('2026-11-10', HOJE)).toBe('Hoje');
  });

  it('dia seguinte -> Amanhã', () => {
    expect(pipe.transform('2026-11-11', HOJE)).toBe('Amanhã');
  });

  it('daqui a 10 dias -> Faltam 10 dias', () => {
    expect(pipe.transform('2026-11-20', HOJE)).toBe('Faltam 10 dias');
  });

  it('virando o mês -> Faltam 21 dias', () => {
    expect(pipe.transform('2026-12-01', HOJE)).toBe('Faltam 21 dias');
  });

  it('dia anterior -> Encerrado', () => {
    expect(pipe.transform('2026-11-09', HOJE)).toBe('Encerrado');
  });

  it('vazio, null e undefined -> vazio', () => {
    expect(pipe.transform('', HOJE)).toBe('');
    expect(pipe.transform(null, HOJE)).toBe('');
    expect(pipe.transform(undefined, HOJE)).toBe('');
  });

  it('texto que não é data -> vazio (a tela não quebra)', () => {
    expect(pipe.transform('amanhã', HOJE)).toBe('');
    expect(pipe.transform('2026-13-01', HOJE)).toBe('');
  });

  it('a hora do "hoje" não muda a conta: 23h59 ainda é o mesmo dia', () => {
    const noite = new Date(2026, 10, 10, 23, 59);
    expect(pipe.transform('2026-11-10', noite)).toBe('Hoje');
    expect(pipe.transform('2026-11-11', noite)).toBe('Amanhã');
  });

  it('atravessa a virada de ano', () => {
    expect(pipe.transform('2027-01-01', new Date(2026, 11, 31))).toBe('Amanhã');
  });
});
