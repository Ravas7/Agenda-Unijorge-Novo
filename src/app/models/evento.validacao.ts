export function validarTitulo(titulo: string): string | null {
  const valor = titulo.trim();

  if (valor.length < 5 || valor.length > 80) {
    return 'O título deve ter entre 5 e 80 caracteres.';
  }

  return null;
}

export function validarData(data: string): string | null {
  if (!data) {
    return 'A data é obrigatória.';
  }

  const hoje = new Date();

  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia = String(hoje.getDate()).padStart(2, '0');

  const dataAtual = `${ano}-${mes}-${dia}`;

  if (data < dataAtual) {
    return 'A data não pode estar no passado.';
  }

  return null;
}

export function validarLocal(local: string): string | null {
  if (!local || !local.trim()) {
    return 'O local não pode ficar em branco.';
  }

  return null;
}

export function validarEmailResponsavel(
  email: string
): string | null {
  const valor = email.trim();

  if (!valor) {
    return 'O e-mail do responsável é obrigatório.';
  }

  const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!formatoEmail.test(valor)) {
    return 'E-mail em formato inválido.';
  }

  return null;
}

export function validarVagas(
  vagas: number | null,
  local: string
): string | null {
  if (
    vagas === null ||
    !Number.isInteger(vagas) ||
    vagas < 1 ||
    vagas > 200
  ) {
    return 'As vagas devem ser um número inteiro de 1 a 200.';
  }

  if (
    (local === 'Laboratório 1' ||
      local === 'Laboratório 2') &&
    vagas > 30
  ) {
    return 'Nos laboratórios, o máximo é de 30 vagas.';
  }

  return null;
}