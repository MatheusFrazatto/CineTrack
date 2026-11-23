# API do CineTrack

**Aluno:** Matheus Frazatto - RA 138269  
**Base local:** `http://localhost:3000` (configurável em `backend/.env`).

Execute a preparação e os dois serviços conforme o [README](../README.md). A API usa Express, aceita JSON e habilita CORS, inclusive o preflight necessário ao frontend.

## Dados do filme

| Campo | Tipo e regra |
| --- | --- |
| `id` | Inteiro gerado pelo servidor no POST e preservado no PUT. Valores enviados pelo cliente são ignorados. |
| `titulo` | Texto obrigatório, sem ficar vazio após remover espaços nas extremidades. |
| `ano` | Número inteiro entre 1888 e 2030. |
| `genero` | Texto obrigatório, sem ficar vazio após remover espaços nas extremidades. |
| `poster` | Texto com URL HTTP/HTTPS ou vazio. Opcional no POST; padrão `""`. |
| `status` | `assistido`, `assistindo` ou `quero`. |
| `nota` | Número inteiro de 1 a 5. |
| `comentario` | Texto opcional no POST; padrão `""`. |

Os quatro campos de texto são normalizados com `trim()`. Campos desconhecidos não são gravados. Números devem ser enviados como números JSON, não como strings.

## GET /filmes

| Método | Caminho | Parâmetros opcionais | Resposta | Códigos |
| --- | --- | --- | --- | --- |
| GET | `/filmes` | `q`: substring do título, sem distinguir maiúsculas/minúsculas; `status`: valor de status | Array de filmes | 200; 500 se houver falha ao ler os dados |

Os dois parâmetros se combinam. Sem correspondências, retorna `[]` com 200. `q` vazio não restringe a lista. Um status desconhecido não encontra filmes. A busca não remove acentos.

Exemplos com o seed:

- `/filmes?q=du`: Duna: Parte Dois.
- `/filmes?q=DU`: o mesmo resultado.
- `/filmes?q=a&status=quero`: Interestelar e Cidade de Deus.
- `/filmes?q=du&status=assistido`: `[]`.

## GET /filmes/:id

| Método | Caminho | Parâmetros | Resposta | Códigos |
| --- | --- | --- | --- | --- |
| GET | `/filmes/:id` | `id` na URL | Objeto do filme | 200; 404 se não existir; 500 se houver falha ao ler os dados |

`/filmes/4` consulta Duna no seed. `/filmes/99` retorna `{"erro":"Filme não encontrado."}` com 404.

## GET /stats

| Método | Caminho | Parâmetros | Resposta | Códigos |
| --- | --- | --- | --- | --- |
| GET | `/stats` | Nenhum | `total`, `porStatus` e `mediaNotas` | 200; 500 se houver falha ao ler os dados |

As estatísticas abrangem todo o catálogo atual, sem filtro. Contagens e soma das notas são calculadas com `reduce`. Com o seed:

```json
{
  "total": 6,
  "porStatus": { "assistido": 3, "assistindo": 1, "quero": 2 },
  "mediaNotas": 4.5
}
```

A média é um número arredondado a uma casa decimal; JSON pode representar um resultado inteiro como `4`, sem o zero decimal. Para catálogo vazio, total, três contagens e média são zero. Alterações do CRUD aparecem na consulta seguinte.

## POST /filmes

| Método | Caminho | Corpo | Resposta | Códigos |
| --- | --- | --- | --- | --- |
| POST | `/filmes` | Objeto JSON conforme os campos acima; `id` não é necessário | Filme criado, incluindo ID | 201; 400 por corpo/validação inválidos; 413 por corpo acima do limite; 500 por falha nos dados |

Envie `Content-Type: application/json`. Exemplo válido:

```json
{
  "titulo": "Filme de teste",
  "ano": 2020,
  "genero": "Drama",
  "poster": "",
  "status": "quero",
  "nota": 4,
  "comentario": "Cadastro de teste"
}
```

O ID corresponde ao maior ID atual mais um. A resposta 201 só é enviada após gravar o arquivo JSON.

## PUT /filmes/:id

| Método | Caminho | Parâmetros e corpo | Resposta | Códigos |
| --- | --- | --- | --- | --- |
| PUT | `/filmes/:id` | `id` na URL; objeto JSON com os campos a alterar | Filme atualizado | 200; 400 por corpo/validação inválidos; 404 se não existir; 413 por corpo acima do limite; 500 por falha nos dados |

Aceita atualização parcial: campos omitidos mantêm seus valores. O filme resultante passa pela mesma validação do POST. O ID original é preservado. Exemplo: `{"titulo":"Título revisado","nota":5}`. A resposta só é enviada após a gravação.

## DELETE /filmes/:id

| Método | Caminho | Parâmetros | Resposta | Códigos |
| --- | --- | --- | --- | --- |
| DELETE | `/filmes/:id` | `id` na URL; sem corpo | Sem conteúdo | 204 após gravar; 404 se não existir; 500 por falha nos dados |

Não tente interpretar JSON na resposta 204. Repetir a remoção do mesmo ID devolve 404.

## Erros e CORS

Erros de validação de POST e PUT devolvem **todos os problemas** em `erros`. O campo `erro` mantém a mensagem combinada para compatibilidade. Para nota 7 e status inventado, mantendo os outros campos válidos, a resposta é 400:

```json
{
  "erros": [
    "Selecione um status válido.",
    "Informe uma nota inteira de 1 a 5."
  ],
  "erro": "Selecione um status válido. Informe uma nota inteira de 1 a 5."
}
```

Nenhum dado inválido é gravado. O frontend lê `erros`, mostra todas as mensagens e mantém os dados do formulário para correção.

| Situação | Código e corpo |
| --- | --- |
| Corpo que não seja objeto JSON | 400 e `erro` com orientação para enviar um objeto |
| JSON malformado | 400 e `{"erro":"JSON inválido."}` |
| Corpo acima do limite padrão do Express (100 KB) | 413 e `erro` explicativo |
| Filme inexistente | 404 e `{"erro":"Filme não encontrado."}` |
| Caminho ou combinação de método/rota não registrados | 404 e `{"erro":"Rota não encontrada."}` |
| Falha de leitura/gravação ou JSON persistido corrompido | 500 e `erro` explicativo; não substitui o arquivo corrompido |
| OPTIONS de preflight | 204 sem corpo; headers `Access-Control-Allow-*` fornecidos por CORS |

Respostas com corpo usam `application/json`. Respostas 204 não têm corpo. A configuração local de CORS permite qualquer origem e não utiliza credenciais.
