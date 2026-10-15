# Verificações das ANPs 01 a 05

Verificações realizadas em 15/10/2026. Aplicação servida pela raiz do repositório em HTTP,
com sessões novas do Chromium 143.0.7499.4. Os testes não usaram a coleção pessoal salva pelo autor.

| ANP | Evidência observada | Resultado e limite |
| --- | --- | --- |
| 01 - HTTP | [Análise](analise-http.md) e [HAR](evidencias/anp01/requisicoes.har) com 12 registros reais, referentes a oito combinações únicas de URL/status. As repetições são recursos carregados novamente pela página 404. | Métodos, URLs, status e Content-Type conferem com o HAR. Foram observados redirecionamento 301, artigo 200, CSS/JS/imagem 200, APIs Fetch JSON 200 e página inexistente 404. A coleta ocorreu por CDP, não por transcrição manual de Headers na UI do DevTools. Essa exigência literal do procedimento permanece uma ressalva da entrega. |
| 02 - Sobre | Navegação index → sobre → index; tabela com seis filmes; details abriu pelo controle nativo; sete campos; imagem local carregada com sucesso. | Passou. Página sem JavaScript próprio. A tabela usa rolagem horizontal em telas estreitas para preservar a leitura das colunas; o documento não transborda. |
| 03 - Formulário | Largura do card até 480 px, sete pares de rótulo/campo, select e textarea com fonte herdada, Cancelar e Salvar alinhados à direita. | Passou em 360, 768 e 1280 px. O modal cadastrou um filme sem navegar e o cadastro persistiu após recarregar. |
| 04 - Impressão | Mídia print em tema claro e escuro, inclusive com modal aberto. PDFs A4 temporários renderizados para inspeção. | Passou: fundo branco, texto preto, controles/modal/rodapé ocultos, sombras removidas e cards inteiros. A mídia screen manteve o tema e os controles. Nos testes, pôsteres remotos foram substituídos pelo fallback real da aplicação. |
| 05 - Módulos | Página carregada por HTTP, três imports funcionando e quatro mensagens no console. | Passou: média 4,5; contagem `{ assistido: 3, assistindo: 1, quero: 2 }`; notas ordenadas `[5, 5, 5, 4, 4, 4]`; array original preservado. O exercício não usa o localStorage da Parte 1. |

## Validação HTML oficial

Os arquivos foram enviados ao W3C Nu com autorização explícita do autor.

| Arquivo | Erros | Avisos |
| --- | --- | --- |
| `parte1/sobre.html` | 0 | 0 |
| `parte1/adicionar.html` | 0 | 0 |
| `parte1/index.html` | 0 | 1 aviso preexistente de section sem título, pois os cards são renderizados por JavaScript. |
| `exercicios/anp05/index.html` | 0 | 0 |

## Testes das funções ES6

Comando: `node exercicios/anp05/estatisticas.test.mjs` (Node.js 22).

Quatro testes passaram: média/arredondamento/lista vazia; contagem com os três status/lista vazia;
ordenação decrescente sem mutação; resultados dos seis filmes canônicos. As funções receberam
coleção e objetos congelados nos testes de pureza. Também foram executadas no navegador,
sem exceções de página e com os quatro resultados esperados no console.

A ANP 05 foi criada inteiramente em `exercicios/anp05/`, sem alterar a Parte 1 no commit dessa atividade.
A alteração posterior do `app.js` corresponde à ordenação exigida pela ANP 06.

## Revisão

Uma revisão independente conferiu as entregas e não encontrou regressões de código nas ANPs 02 a 05.
A ressalva metodológica da ANP 01 está registrada acima. O roteiro da ANP 06, com a decisão de manter
16 filmes na primeira visita, está em [testes-parte1.md](testes-parte1.md).
