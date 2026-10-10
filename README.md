# CineTrack

O CineTrack é um sistema web desenvolvido como projeto integrador da disciplina de Programação de Sistemas Web na Universidade Estadual de Maringá (UEM). A aplicação funciona como um catálogo pessoal para acompanhar filmes assistidos, em andamento ou que o usuário ainda deseja assistir.

## Funcionalidades da versão 1.0

- Listagem de filmes em cards responsivos.
- Cadastro, edição e remoção sem recarregar a página.
- Filtros por status combinados com busca por título.
- Busca em tempo real com `debounce` de 300 ms.
- Validação dos dados do formulário.
- Persistência no `localStorage` com a chave `cinetrack:filmes`.
- Tema claro ou escuro conforme a preferência do sistema.

## Como executar

Abra o arquivo `parte1/index.html` em um navegador moderno. Também é possível servir a pasta `parte1` com uma extensão como Live Server.

Os 16 filmes ficam reunidos na constante `catalogoFilmes`: seis exemplos da disciplina e dez títulos adicionados à coleção pessoal. Os novos títulos também são importados uma única vez em navegadores que já possuem um catálogo salvo, preservando os cadastros e as avaliações existentes. Depois de adicionar, editar ou remover um filme, a lista fica armazenada no navegador e é restaurada nos próximos acessos. Filmes importados que forem removidos não reaparecem ao recarregar.

Para voltar ao catálogo inicial completo, remova as chaves `cinetrack:filmes` e `cinetrack:importacao-filmes-2026-10` na seção **Application > Local Storage** das ferramentas de desenvolvimento do navegador e recarregue a página.

Os dez filmes adicionais usam títulos em português, dados públicos de cinema e pôsteres disponibilizados pelo MetaHub. Não há consulta a uma API durante a execução do aplicativo. Esses títulos já incluem notas iniciais de 1 a 5, que podem ser alteradas pelo usuário; os comentários começam em branco.

## Estrutura principal

- `parte1/index.html`: página principal, filtros e formulário em modal.
- `parte1/style.css`: estilos responsivos, temas e estados visuais.
- `parte1/app.js`: dados, renderização, eventos, busca e persistência.
- `parte1/adicionar.html`: formulário alternativo criado no módulo HTML.

## Tecnologias

HTML5, CSS3 e JavaScript puro, sem bibliotecas externas.

## Acessibilidade

A interface utiliza HTML semântico, rótulos associados aos campos, textos alternativos nos pôsteres, navegação por teclado e indicação visual de foco. Na revisão da versão 1.0, a página principal alcançou **95/100** na categoria de acessibilidade do Lighthouse.
