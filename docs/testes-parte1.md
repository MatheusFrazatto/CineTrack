# ANP 06 - Testes da Parte 1

**Aluno:** Matheus Frazatto - RA 138269  
**Data:** 15/10/2026  
**Ambiente:** Chromium 143.0.7499.4, servidor HTTP local e contexto de navegador descartável.

O roteiro foi executado na interface real do aplicativo, de forma automatizada com Playwright.
A sessão de teste não usou o armazenamento pessoal do navegador do autor. As imagens remotas foram
bloqueadas nos testes de regressão para exercitar o pôster substituto local e evitar dependência de
serviços externos. Isso não testa a disponibilidade dos servidores de pôsteres.

## Roteiro obrigatório

| Caso e procedimento | Resultado esperado no enunciado | Resultado observado | Situação | Correção feita |
| --- | --- | --- | --- | --- |
| 1. Abrir Adicionar e salvar “Teste ANP 06”, ano 2020, gênero Drama, nota 4 e status Quero assistir. | Novo card aparece sem recarregar. | A coleção passou de 16 para 17 cards; houve apenas a navegação inicial do documento. | Passou | Nenhuma necessária. |
| 2. Tentar salvar com os anos 1887 e 2031, mantendo os outros campos válidos. | Erro visível e nenhum cadastro inválido salvo. | A interface exibiu o intervalo 1888 a 2030. A grade e o localStorage continuaram com 17 filmes nas duas tentativas. | Passou | Nenhuma necessária. |
| 3. Editar o filme de teste, mudando o título para “Teste ANP 06 editado” e a nota para 5. | Só o card correto muda; não há duplicação. | A coleção continuou com 17 filmes, o título anterior desapareceu e houve exatamente um card com o novo título. | Passou | Nenhuma necessária. |
| 4. Clicar em Remover no filme de teste e cancelar a confirmação. | O filme permanece. | A confirmação foi cancelada; o card permaneceu e a contagem continuou em 17. | Passou | Nenhuma necessária. |
| 5. Buscar “duna”, aguardar o debounce e combinar com Assistindo; depois mudar para Assistido. | A busca e o status são aplicados juntos. | “Duna: Parte Dois” apareceu em Assistindo; com a mesma busca e Assistido, a lista ficou vazia. | Passou | Nenhuma necessária. |
| 6. Recarregar após cadastrar e editar. | A coleção persiste. | Os 17 filmes foram restaurados, incluindo o título e a nota alterados do filme de teste. | Passou | Nenhuma necessária. |
| 7. Abrir o modal, pressionar Esc, abrir novamente e clicar em Cancelar. | As duas ações fecham o modal. | O modal ficou oculto nos dois caminhos. | Passou | Nenhuma necessária. |
| 8. Abrir em uma sessão nova, sem `cinetrack:filmes`. | Carregar os seis filmes canônicos. | Foram carregados 16 filmes: os seis canônicos e os dez títulos pessoais já existentes no projeto. | Divergência autorizada | O autor escolheu manter os 16 e documentar a diferença; não foi feita uma redução do catálogo. |

**Resultado:** sete casos passaram conforme o enunciado; o oitavo apresenta uma divergência deliberada,
registrada por solicitação do autor. Não foram encontrados defeitos funcionais que exigissem commits
`fix:` nesse roteiro. A ordenação nova tem seu próprio commit `feat: ordenacao`.

## Ordenação adicional

O seletor `#ordenar` aparece ao lado dos filtros. A variável `ordemAtual` guarda a escolha durante a
sessão; `atualizar()` aplica primeiro a busca e o status e, em seguida, ordena uma cópia do resultado.
A escolha volta ao padrão Título ao recarregar; persistir essa preferência não foi um requisito da ANP.

| Verificação | Resultado real |
| --- | --- |
| Títulos com acentos | A entrada `Zebra, Épico, Ação` foi ordenada como `Ação, Épico, Zebra`, com `localeCompare` em `pt-BR`. |
| Ano | A entrada `2000, 2024, 2010` foi exibida como `2024, 2010, 2000`. |
| Nota | A entrada `3, 5, 4` foi exibida como `5, 4, 3`. |
| Não mutação | Uma coleção e seus objetos congelados puderam ser ordenados; a ordem original foi preservada e a função retornou outro array. A coleção real também permaneceu idêntica após as interações de ordenação e filtro. |
| Nota + Quero assistir | A lista ficou `Interestelar, Cidade de Deus, Obsessão, O Fim da Rua`, em notas decrescentes. |
| Busca + status + ordenação | Com a combinação anterior, buscar “rua” mostrou apenas “O Fim da Rua”. Trocar a ordenação para Ano manteve a busca e o status. |
| Troca de filtro | A opção Nota permaneceu selecionada ao trocar o filtro de status. |
| Responsividade | Sem transbordamento horizontal do documento em 320, 360, 768 e 1280 px. |
| JavaScript | Nenhuma exceção de página nos testes do roteiro e da ordenação. |

## Como repetir

1. Sirva a raiz do repositório com Live Server ou `python3 -m http.server 8000`.
2. Use uma janela/perfil de teste e abra `parte1/index.html`.
3. Execute os oito procedimentos da tabela na ordem indicada, aguardando a busca atualizar antes de trocar o status.
4. Repita a ordenação por título, ano e nota, em combinação com a busca e os filtros.
5. Para repetir a primeira visita, use outro contexto limpo ou remova `cinetrack:filmes` na aba Application e recarregue. O resultado esperado **nesta versão aprovada pelo autor** é 16, embora o enunciado peça seis.

Não limpe o armazenamento da sua coleção pessoal para executar esse roteiro. O filme de teste pode
ser removido na sessão descartável ao terminar.

## Verificações complementares

- W3C Nu: `parte1/index.html`, `parte1/adicionar.html`, `parte1/sobre.html` e `exercicios/anp05/index.html` sem erros. Apenas `index.html` mantém o aviso preexistente de seção sem título no HTML inicial, que recebe os cards pelo JavaScript.
- ANP 05: quatro testes automatizados aprovados com `node exercicios/anp05/estatisticas.test.mjs`.
- Impressão: temas claro e escuro com fundo branco, texto preto e ausência de busca, filtros, ordenação, ações e rodapé; o modal também fica oculto se estiver aberto. Os 16 cards ficaram inteiros em oito páginas A4 nos testes com pôster substituto. A paginação pode variar com o papel, as margens e as imagens.
- O Lighthouse não foi reexecutado nesta revisão. Os números de acessibilidade de revisões anteriores não constituem medição da versão atual.

## Entrega e tag

A tag `v1.0` deve apontar para o commit final desta entrega, incluindo este roteiro e o README revisado.
Para conferir o apontamento local, compare `git rev-parse HEAD` e `git rev-parse 'v1.0^{commit}'`.
O histórico de commits registra separadamente as funcionalidades das ANPs.
