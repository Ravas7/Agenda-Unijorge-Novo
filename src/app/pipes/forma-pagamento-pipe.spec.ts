import { FormaPagamento } from '../participante/participante.model';
import { FormaPagamentoPipe } from './forma-pagamento-pipe';

describe('FormaPagamentoPipe', () => {
  const pipe = new FormaPagamentoPipe();

  it('pix -> Pix', () => {
    expect(pipe.transform('pix')).toBe('Pix');
  });

  it('cartao -> Cartão de crédito', () => {
    expect(pipe.transform('cartao')).toBe('Cartão de crédito');
  });

  it('boleto -> Boleto', () => {
    expect(pipe.transform('boleto')).toBe('Boleto');
  });

  it('dinheiro -> Dinheiro', () => {
    expect(pipe.transform('dinheiro')).toBe('Dinheiro');
  });

  it('vazio, null e undefined -> Não informado', () => {
    expect(pipe.transform('')).toBe('Não informado');
    expect(pipe.transform(null)).toBe('Não informado');
    expect(pipe.transform(undefined)).toBe('Não informado');
  });

  it('valor que não existe no tipo -> Não informado (a tela não quebra)', () => {
    expect(pipe.transform('cripto' as FormaPagamento)).toBe('Não informado');
  });
});
