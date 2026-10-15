# CineTrack

O CineTrack é um catálogo pessoal de filmes desenvolvido como projeto integrador da disciplina de Programação de Sistemas Web da Universidade Estadual de Maringá (UEM). Permite acompanhar filmes assistidos, em andamento ou que o usuário deseja assistir.

## Autoria

- Aluno: [Matheus Frazatto](https://github.com/MatheusFrazatto).
- RA: 138269.
- Disciplina: Programação de Sistemas Web - UEM.
- Professor: Lucas de Oliveira Teixeira.

## Como executar

Abra **a raiz do repositório** no VS Code e use o Live Server. Acesse `parte1/index.html` para o catálogo e `exercicios/anp05/index.html` para o exercício de módulos ES6. Servir a raiz também permite que a página Sobre carregue a imagem de `docs/rascunho-tela.jpg`.

Outra opção, com Python instalado, é executar na raiz:

```sh
python3 -m http.server 8000
```

Depois, abra [o catálogo](http://localhost:8000/parte1/index.html) ou [o exercício ES6](http://localhost:8000/exercicios/anp05/index.html). Os módulos exigem HTTP; não abra o exercício com `file://`.

Use sempre o mesmo endereço e porta: o `localStorage` pertence à origem da página. O botão **+ Adicionar** abre o modal; `parte1/adicionar.html` também cadastra no mesmo catálogo e volta à página principal. O cadastro é tratado pelo JavaScript, sem enviar um `POST` ao servidor.

## Funcionalidades

- Cards responsivos com pôster, título, ano, gênero, nota e status.
- Cadastro, edição e remoção sem recarregar a página; remoção com confirmação.
- Busca por título com `debounce` de 300 ms, combinada com filtro de status.
- Ordenação por título (A a Z, respeitando acentos em português), ano mais recente ou maior nota. A ordenação preserva o array original e continua ativa ao buscar ou trocar o filtro.
- Validação de título, gênero e status, ano inteiro entre 1888 e 2030 e nota inteira de 1 a 5. Os erros aparecem no formulário.
- Pôster substituto local quando a URL não é informada ou a imagem falha.
- Persistência do catálogo no `localStorage`.
- Tema claro/escuro conforme o sistema e estilo de impressão em papel branco, sem controles ou rodapé.
- Página Sobre com os seis filmes canônicos da disciplina, rascunho da interface e descrição dos sete campos.

## Catálogo inicial e persistência

A primeira visita carrega **16 filmes**: seis canônicos da disciplina e dez da coleção pessoal. **Por decisão do autor, os 16 foram mantidos na ANP 06**, embora o roteiro original peça apenas seis na primeira visita. Essa divergência está registrada em [testes-parte1.md](docs/testes-parte1.md).

A constante `catalogoFilmes` reúne os dados iniciais. Os dez títulos adicionais também são importados uma única vez para navegadores com um catálogo antigo, preservando cadastros e avaliações. Filmes adicionais removidos não voltam depois que essa importação foi marcada como concluída.

O catálogo usa `cinetrack:filmes`, e a importação usa `cinetrack:importacao-filmes-2026-10`. Para restaurar os **16 filmes iniciais**, remova essas duas chaves em **DevTools > Application > Local Storage** e recarregue. Isso apaga os cadastros e avaliações locais dessa origem; faça esse teste em um perfil descartável para preservar sua coleção.

Os dez títulos adicionais usam dados públicos e pôsteres do MetaHub; não há consulta a uma API durante a execução. As notas iniciais podem ser editadas. A API REST de filmes está planejada para a Parte 2 em [requisitos.md](docs/requisitos.md).

## Entregas das ANPs

| ANP | Entrega |
| --- | --- |
| 01 | [Análise HTTP](docs/analise-http.md) e [captura HAR](docs/evidencias/anp01/requisicoes.har). A coleta real foi automatizada via Chrome DevTools Protocol; o relatório explica essa diferença em relação ao procedimento manual no DevTools. |
| 02 | [Página Sobre](parte1/sobre.html), com tabela, figure, details e navegação. |
| 03 | Formulário como card de até 480 px, campos em coluna e ações à direita. |
| 04 | Bloco `@media print` no CSS compartilhado, com cores por variáveis e cards sem corte. |
| 05 | [Exercício isolado de módulos ES6](exercicios/anp05/index.html): média 4,5, contagem 3/1/2 e ordenação sem mutação. |
| 06 | Ordenação combinada com busca/status e [roteiro com resultados reais](docs/testes-parte1.md), incluindo a divergência autorizada de 16 filmes. |

## Estrutura

```text
parte1/
  index.html              Catálogo, filtros, ordenação e modal
  adicionar.html          Formulário alternativo de cadastro
  sobre.html              Conteúdo sobre o projeto e dados canônicos
  style.css               Estilos compartilhados e impressão
  app.js                  Dados, DOM, eventos, validação e persistência
  poster-placeholder.svg  Pôster local de substituição
exercicios/anp05/
  index.html              Página do exercício
  filmes.js               Seis filmes canônicos exportados
  estatisticas.js         Funções puras exportadas
  main.js                 Imports e quatro resultados no console
  estatisticas.test.mjs    Testes das funções e dos dados canônicos
```

A Parte 1 mantém um `app.js` único, sem `type="module"`, como nos slides. Os módulos ES6 da ANP 05 ficam separados, sem usar ou alterar o armazenamento do aplicativo.

## Verificação

Os testes das estatísticas podem ser executados com Node.js 22:

```sh
node exercicios/anp05/estatisticas.test.mjs
```

O roteiro do aplicativo, os resultados e as limitações estão em [docs/testes-parte1.md](docs/testes-parte1.md). As verificações das ANPs 01 a 05 estão em [docs/verificacoes-anps.md](docs/verificacoes-anps.md).

A interface usa HTML semântico, rótulos nos campos, textos alternativos, foco visível e navegação por teclado. Os HTMLs foram enviados ao validador oficial W3C com autorização do autor. Os resultados Lighthouse anteriores às ANPs são históricos; o Lighthouse não foi reexecutado nesta entrega.

## Tecnologias

HTML5, CSS3 e JavaScript puro, sem bibliotecas externas na aplicação. O exercício usa o executor de testes nativo do Node.js apenas para verificação.
