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

Na primeira execução, o catálogo apresenta seis filmes de exemplo. Depois de adicionar, editar ou remover um filme, a lista fica armazenada no navegador e é restaurada nos próximos acessos.

Para voltar aos dados iniciais, remova a chave `cinetrack:filmes` na seção **Application > Local Storage** das ferramentas de desenvolvimento do navegador e recarregue a página.

## Estrutura principal

- `parte1/index.html`: página principal, filtros e formulário em modal.
- `parte1/style.css`: estilos responsivos, temas e estados visuais.
- `parte1/app.js`: dados, renderização, eventos, busca e persistência.
- `parte1/adicionar.html`: formulário alternativo criado no módulo HTML.

## Tecnologias

HTML5, CSS3 e JavaScript puro, sem bibliotecas externas.

## Acessibilidade

A interface utiliza HTML semântico, rótulos associados aos campos, textos alternativos nos pôsteres, navegação por teclado e indicação visual de foco. Na revisão da versão 1.0, a página principal alcançou **95/100** na categoria de acessibilidade do Lighthouse.
