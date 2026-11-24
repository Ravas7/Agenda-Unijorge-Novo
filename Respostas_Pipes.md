# Respostas — Tarefa de Pipes

Desenvolvimento Dinâmico · Projeto `agenda-unijorge`

## Questões

**1. Por que não basta trocar `'cartao'` por `'Cartão de crédito'` dentro do objeto antes de mostrar? O que aconteceria ao editar esse participante e salvar?**

Porque o dado guardado deixaria de ser o código. Ao editar e salvar, o texto `'Cartão de crédito'` seguiria para a API e o banco, que esperam `'cartao'`. O valor não bateria com o tipo `FormaPagamento`, o `<select>` não marcaria nenhuma opção e o banco ficaria com dados misturados. O pipe evita isso porque muda só o que aparece na tela: o objeto continua com `'cartao'`.

**2. Leia em voz alta a linha `{{ evento.titulo | slice:0:10 | uppercase }}`. Qual é a saída para `'Semana de Tecnologia'`?**

"Pegue `evento.titulo`, passe por `slice` de 0 a 10, depois passe por `uppercase`." O `slice` devolve `Semana de ` (10 caracteres, com o espaço no final) e o `uppercase` transforma em `SEMANA DE ` (o espaço final continua lá, só não dá para ver).

**3. O `telefone` devolve o valor original quando não reconhece o formato. Por que isso é melhor do que devolver `''` ou `'inválido'`?**

Porque o pipe só formata, não valida. Devolver `''` faz o dado sumir da tela sem nenhum erro, e `'inválido'` é uma conclusão que o pipe não tem autoridade para tirar (pode ser um número com DDI, por exemplo). Devolvendo o original, a pessoa vê o que está guardado e consegue perceber e corrigir. Validar é papel do `validacao.ts`.

**4. Por que o `diasPara` recebe o `hoje` como parâmetro? O que ficaria impossível de testar sem isso?**

Sem o parâmetro, o pipe chamaria `new Date()` por dentro e dependeria do relógio da máquina. O resultado mudaria a cada dia e a tabela da tarefa ("hoje é 10/11/2026") só passaria nesse dia. Passando `new Date(2026, 10, 10)` no teste, `Hoje`, `Amanhã`, `Faltam N dias` e `Encerrado` ficam testáveis em qualquer data do ano.

**5. Por que um evento marcado como "Hoje" não muda para "Encerrado" à meia-noite com a tela aberta?**

Porque é um pipe puro: o Angular só chama o `transform` de novo quando o valor de entrada muda. A string da data do evento continua a mesma, e o `hoje` nem é passado na tela, então nada dispara o recálculo. O texto "Hoje" fica até a data mudar ou a página ser recarregada. (Um pipe impuro, `pure: false`, recalcularia a cada ciclo, mas é mais caro.)

**6. Mostrar só os participantes que pagaram por Pix: pipe ou `computed`? Justifique.**

`computed`. Pipe é para formatar um valor; filtrar uma lista é lógica de dados. Um pipe puro compara a referência da lista, então um `push` não o faz rodar de novo e o filtro ficaria desatualizado. Com `computed(() => participantes().filter(p => p.formaPagamento === 'pix'))`, o resultado se recalcula quando a lista muda e ainda dá para testar na própria classe.

## Desafio

**3. `mascaraEmail`: por que isso tem a ver com a LGPD, e por que o pipe não protege o dado de verdade?**

O e-mail é dado pessoal, e a LGPD pede tratar só o mínimo necessário (princípio da necessidade, art. 6º, III): numa lista pública, quem vê não precisa do e-mail inteiro. Mas o pipe é só aparência: o e-mail completo continua chegando ao navegador na resposta da API e aparece na aba *Network* do DevTools. A proteção de verdade é o servidor não enviar o e-mail completo para quem não precisa dele.
