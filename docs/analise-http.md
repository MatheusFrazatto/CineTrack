# ANP 01 - HTTP de verdade

**Aluno:** Matheus Frazatto - RA 138269  
**Disciplina:** Programação de Sistemas Web - UEM  
**Professor:** Lucas de Oliveira Teixeira  
**Coleta:** 15/10/2026, entre 18h41min31s e 18h41min35s (America/Sao_Paulo).

## Como a observação foi feita

Site observado: MDN Web Docs, em uma sessão nova do Chromium 143, sem login e com o cache desabilitado.
As requisições e os cabeçalhos de resposta foram coletados automaticamente pelo domínio `Network`
do **Chrome DevTools Protocol**, o protocolo usado pelo DevTools. Não houve transcrição manual da interface.
O arquivo [requisicoes.har](evidencias/anp01/requisicoes.har) preserva as requisições selecionadas e
pode ser importado na aba **Network** pelo botão **Import HAR** para conferência em **Headers**.
O HAR não inclui corpos de resposta, cookies ou cabeçalhos de autenticação.

Para repetir manualmente: abra o site abaixo, pressione F12, selecione Network, marque Disable cache
(com o DevTools aberto), recarregue e consulte as linhas Document, CSS, JS e Img. Depois, filtre por
Fetch/XHR, abra a busca pelo botão “Search the site” e digite “HTTP”. Por fim, navegue para o caminho
inexistente registrado na tabela. Os nomes dos arquivos estáticos podem mudar em novas versões do site.

## Primeira requisição e recursos estáticos

A navegação começou em `https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview`.
A primeira resposta foi **301**, com `Location: /en-US/docs/Web/HTTP/Guides/Overview`;
o navegador seguiu esse redirecionamento e recebeu **200** na URL final do artigo.
As linhas abaixo registram os valores efetivamente observados; `Content-Type` foi lido dos cabeçalhos,
e não inferido pela extensão do arquivo.

| Tipo no Network | Método | URL | Status | Content-Type da resposta |
| --- | --- | --- | --- | --- |
| Document | `GET` | `https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview` | **301** | `text/html; charset=utf-8` |
| Document | `GET` | `https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview` | **200** | `text/html` |
| Stylesheet | `GET` | `https://developer.mozilla.org/static/client/styles-global.13616ebb1fc8ee2f.css` | **200** | `text/css` |
| Script | `GET` | `https://developer.mozilla.org/static/client/1216.2fdb44f0bb574bc2.js` | **200** | `text/javascript` |
| Image | `GET` | `https://developer.mozilla.org/static/client/chevron-down.7c923b7054da305b.svg` | **200** | `image/svg+xml` |
| Fetch | `GET` | `https://developer.mozilla.org/api/v1/whoami` | **200** | `application/json` |
| Fetch | `GET` | `https://developer.mozilla.org/en-US/search-index.json` | **200** | `application/json` |
| Document | `GET` | `https://developer.mozilla.org/en-US/docs/Web/HTTP/cinetrack-anp01-pagina-inexistente` | **404** | `text/html` |

O HTML é o documento principal. O CSS define a apresentação, o JavaScript contém código da página
e o SVG é um recurso de imagem. Todos os três recursos estáticos selecionados retornaram **200**.
O navegador fez requisições separadas para esses arquivos; eles não vieram dentro da resposta HTML.

## O 404 provocado

Foi aberto o caminho `/en-US/docs/Web/HTTP/cinetrack-anp01-pagina-inexistente` no mesmo domínio.
A resposta mudou de **200** para **404**, e o corpo passou a mostrar “Page not found” e um link de
volta para a página inicial, em vez do conteúdo do artigo. O `Content-Type` continuou sendo
`text/html`: uma página de erro também pode ter um documento HTML como corpo. Portanto,
o tipo do conteúdo não substitui o código de status para identificar o resultado da requisição.

## Fetch/XHR e comparação com o CineTrack

A própria página dinâmica da MDN chamou a API **`GET /api/v1/whoami`**, com status **200** e
`Content-Type: application/json`. Na sessão sem login, o corpo era um objeto com informações da sessão;
por exemplo, `username` e `email` tinham valor `null`. Nenhuma conta pessoal foi utilizada.
Essa rota consulta o estado da sessão, enquanto a rota do CineTrack consulta a coleção de filmes.
Ambas expressam leitura pelo método `GET` e identificam o recurso pelo caminho da URL.

Ao abrir a busca da MDN e digitar “HTTP”, também foi observado o Fetch
**`GET /en-US/search-index.json`**, com status **200** e `Content-Type: application/json`.
Ele carrega o índice de pesquisa: as sugestões observadas são calculadas a partir desse índice,
sem uma nova chamada de busca por termo a cada digitação. O sufixo `.json` não transforma essa
requisição em um documento HTML; no Network ela aparece como `Fetch`.

Comparação com a tabela de [requisitos](requisitos.md):

| Ação do CineTrack | Método | Rota | Resultado esperado na Parte 2 |
| --- | --- | --- | --- |
| Listar filmes | GET | `/filmes` | Coleção de filmes em JSON |
| Buscar por ID | GET | `/filmes/:id` | Um filme em JSON |
| Cadastrar | POST | `/filmes` | Criação com os dados enviados no corpo |
| Editar | PUT | `/filmes/:id` | Atualização do recurso indicado |
| Remover | DELETE | `/filmes/:id` | Exclusão do recurso indicado |

A URL identifica o recurso e o método expressa a operação. Assim, não é preciso criar caminhos
como `/listarFilmes` e `/removerFilme`: `GET /filmes` lista, enquanto `DELETE /filmes/:id` remove.
As rotas acima são o planejamento da Parte 2; a Parte 1 atual usa `localStorage`.

## Conclusão

Na Parte 2, o CineTrack usará **`GET /filmes`** para listar os filmes. Em uma consulta bem-sucedida,
o servidor deverá responder com **200**, `Content-Type: application/json` e um corpo contendo
um array de objetos de filme, com identificador e os sete campos definidos nos requisitos:
título, ano, gênero, pôster, status, nota e comentário. Se a coleção estiver vazia, o corpo esperado
é `[]`. Esse formato permite ao cliente receber os dados e renderizar os cards sem tratar a
resposta como uma página HTML pronta.

## Referências

- [MDN: visão geral do HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview).
- [Chrome DevTools: inspecionar atividade de rede e importar HAR](https://developer.chrome.com/docs/devtools/network).
- [Chrome DevTools Protocol: domínio Network](https://chromedevtools.github.io/devtools-protocol/tot/Network/).
