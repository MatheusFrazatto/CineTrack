# CineTrack

O CineTrack é um sistema web desenvolvido como projeto integrador da disciplina de Programação de Sistemas Web na Universidade Estadual de Maringá (UEM). A aplicação funciona como um catálogo pessoal para acompanhar filmes assistidos, em andamento ou que o usuário ainda deseja assistir.

## Autoria

- Aluno: [Matheus Frazatto](https://github.com/MatheusFrazatto).
- RA: 138269.
- Disciplina: Programação de Sistemas Web - UEM.
- Professor: Lucas de Oliveira Teixeira.

## Funcionalidades da versão 1.0

- Listagem de filmes em cards responsivos.
- Cadastro, edição e remoção sem recarregar a página.
- Filtros por status combinados com busca por título.
- Busca em tempo real com `debounce` de 300 ms.
- Validação dos dados do formulário.
- Nota obrigatória de 1 a 5 no cadastro e na edição; erros exibidos no formulário, sem `alert()`.
- Pôster substituto local quando a URL não é informada ou a imagem não carrega.
- Persistência no `localStorage` com a chave `cinetrack:filmes`.
- Tema claro ou escuro conforme a preferência do sistema.

## Como executar

Recomenda-se servir a pasta `parte1` com a extensão Live Server e acessar `index.html` em um navegador moderno. Use sempre o mesmo endereço e porta para preservar o acesso aos dados do `localStorage`.

O botão **+ Adicionar** abre o formulário em modal. A página `adicionar.html` também permite cadastrar: ela salva no mesmo catálogo e retorna à página principal, sem enviar um `POST` ao servidor. As duas páginas devem ser abertas na mesma origem (como a mesma instância do Live Server).

Os 16 filmes ficam reunidos na constante `catalogoFilmes`: seis exemplos da disciplina e dez títulos adicionados à coleção pessoal. Os novos títulos também são importados uma única vez em navegadores que já possuem um catálogo salvo, preservando os cadastros e as avaliações existentes. Depois de adicionar, editar ou remover um filme, a lista fica armazenada no navegador e é restaurada nos próximos acessos. Filmes importados que forem removidos não reaparecem ao recarregar.

Para voltar ao catálogo inicial completo, remova as chaves `cinetrack:filmes` e `cinetrack:importacao-filmes-2026-10` na seção **Application > Local Storage** das ferramentas de desenvolvimento do navegador e recarregue a página.

Os dez filmes adicionais usam títulos em português, dados públicos de cinema e pôsteres disponibilizados pelo MetaHub. Não há consulta a uma API durante a execução do aplicativo. Esses títulos já incluem notas iniciais de 1 a 5, que podem ser alteradas pelo usuário; os comentários começam em branco. Os dados existentes são preservados, mas ao cadastrar ou editar um filme é obrigatório informar uma nota de 1 a 5.

## Estrutura principal

- `parte1/index.html`: página principal, filtros e formulário em modal.
- `parte1/style.css`: estilos responsivos, temas e estados visuais.
- `parte1/app.js`: dados, renderização, eventos, busca e persistência.
- `parte1/adicionar.html`: formulário alternativo, com cadastro persistente pelo mesmo `app.js`.
- `parte1/poster-placeholder.svg`: imagem local usada quando um filme não possui pôster disponível.

## Tecnologias

HTML5, CSS3 e JavaScript puro, sem bibliotecas externas.

## Acessibilidade

A interface utiliza HTML semântico, rótulos associados aos campos, textos alternativos nos pôsteres, navegação por teclado e indicação visual de foco. Na revisão da versão 1.0, a página principal alcançou **95/100** na categoria de acessibilidade do Lighthouse.

Na revisão das correções finais, as páginas `index.html` e `adicionar.html` alcançaram **100/100** em acessibilidade no Lighthouse, nos perfis de 320 e 1920 px. Os dois arquivos também passaram no validador local `html-validate` com o conjunto de regras `standard`, sem erros ou avisos. Esses resultados não substituem a revisão manual de acessibilidade.

Os dois HTMLs foram conferidos no validador W3C Nu, sem erros. Em `index.html`, permanece apenas o aviso de que a seção `#lista` não possui título no HTML inicial: ela começa vazia conforme os slides e recebe os cards com seus títulos via JavaScript.
