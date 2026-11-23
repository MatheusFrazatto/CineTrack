# ANPs 07 a 10 - Testes da Parte 2

**Aluno:** Matheus Frazatto - RA 138269  
**Data:** 23/11/2026  
**Ambiente automatizado:** Windows, PowerShell, Node.js 24.19.0, npm 11.17.0, React/Vite, jsdom e Express.

Os testes usaram um clone local limpo e arquivos temporários, preservando `parte1/` e o catálogo de trabalho. A cópia de teste foi obtida do repositório local com as ANPs, antes da publicação desses commits no GitHub. As verificações no navegador foram executadas manualmente pelo autor, que confirmou os resultados descritos abaixo.

## Preparação do zero

| Passo executado | Resultado observado |
| --- | --- |
| Clonar o repositório local em uma pasta temporária, sem compartilhar os objetos por hardlink | Clone criado; código das ANPs disponível. |
| Em `backend/`, executar `npm ci` | 73 pacotes instalados conforme o lockfile. |
| Copiar `backend/.env.example` para `.env` | Configuração criada. Neste teste foi usada `PORT=3027`, para isolar os serviços locais. |
| Executar `node seed.js` dentro do backend do clone | Mensagem `6 filmes gravados.`; os seis filmes canônicos estavam disponíveis. |
| Executar `npm start` no backend | API iniciada em `http://localhost:3027`. |
| Em `frontend/`, executar `npm ci` | 52 pacotes instalados conforme o lockfile. |
| Copiar `frontend/.env.example` para `.env` e definir `VITE_API_URL=http://localhost:3027` | Frontend configurado para a API do clone. |
| Executar `npm run dev -- --host 127.0.0.1 --port 5187 --strictPort` | Vite iniciado em `http://127.0.0.1:5187/`; documento HTML respondeu 200. |
| Executar os testes das duas pastas | Backend: 11/11; frontend: 12/12, mais renderização e integração. |
| Executar `npm run build` no frontend | Build gerado com sucesso. |

Para repetir em outra máquina, clone a versão final do GitHub e siga o [README](../README.md). As portas padrão são 3000 e 5173; as portas acima são apenas as usadas nesta verificação.

## ANP 07 - Componentes e contador

| Caso | Resultado real |
| --- | --- |
| Renderizar Estrelas com notas 1, 3 e 5 | Cinco símbolos por nota, com estrelas preenchidas/vazias corretas e descrição acessível. |
| Renderizar Badge com os três status | Classes e rótulos Assistido, Assistindo e Quero assistir corretos. |
| Abrir o seed sem filtro | Seis cards; `Exibindo 6 de 6 filmes`. |
| Buscar `duna` | Um card; `Exibindo 1 de 6 filmes`. |
| Combinar uma busca sem correspondência com outro status | Estado vazio e contador `Exibindo 0 de 6 filmes`. |

Estrelas e Badge têm arquivos próprios, `export default` e apenas a prop necessária. CardFilme usa os componentes. O contador deriva de `visiveis.length` e `filmes.length`, sem estado adicional. Testes de renderização e integração passaram sem avisos React de keys ou props. O autor confirmou a apresentação e a ausência de avisos no console durante o teste manual.

## ANP 08 - Preferências persistentes

| Procedimento | Resultado real |
| --- | --- |
| Digitar `duna`, escolher Assistindo e reabrir o App | Busca e status restaurados; apenas Duna aparece, com contador 1 de 6. |
| Manter `INTER` e Assistido, reabrir o App | Controles restaurados e resultado vazio, coerente com os dados do seed. |
| Gravar `xxx` em `cinetrack:filtros` e reabrir | Aplicação abre com busca vazia, Todos e seis cards. |
| Ler chave ausente, JSON `null`, array ou campos com tipos/status inválidos | Padrões restaurados sem exceção. |
| Simular bloqueio de acesso ao armazenamento | Leitura retorna os padrões; a gravação é protegida por `try/catch`. |

Os estados de busca e status usam inicializadores preguiçosos. O efeito de gravação declara `[busca, status]`. `buscaAplicada` já inicia com a busca restaurada. Apenas as preferências ficam em `cinetrack:filtros`; os filmes continuam vindo de `api.js` e do arquivo JSON do backend. Ordenação continua voltando ao padrão ao recarregar, pois não faz parte desta persistência.

A restauração de busca/status após recarregar também foi confirmada manualmente pelo autor no navegador. Os casos corrompido/bloqueado foram verificados por testes automatizados.

## ANP 09 - Consultas HTTP

Consultas realizadas sobre o seed, com cliente HTTP e confirmação manual dos três novos exemplos no navegador:

| Requisição | Código | Resultado observado |
| --- | --- | --- |
| GET `/filmes?q=du` | 200 | Apenas Duna: Parte Dois. |
| GET `/filmes?q=DU` | 200 | Mesmo resultado, comprovado no teste automatizado. |
| GET `/filmes?q=a&status=quero` | 200 | Interestelar e Cidade de Deus. |
| GET `/filmes?q=du&status=assistido` | 200 | `[]`, comprovando combinação dos critérios. |
| GET `/stats` | 200 | `total: 6`, `porStatus: { assistido: 3, assistindo: 1, quero: 2 }`, `mediaNotas: 4.5`. |
| GET `/filmes` | 200 | Seis filmes completos. |
| GET `/filmes/4` | 200 | Duna: Parte Dois, ID 4. |
| GET `/filmes/99` | 404 | `{"erro":"Filme não encontrado."}`. |

No teste automatizado, alterar o filme 1 para status Quero assistir e nota 1 fez `/stats` retornar total 6, contagens 2/1/3 e média 3,8. Com arquivo `[]`, total, contagens e média ficaram zero. Esses casos usaram arquivo temporário próprio, sem interferir no seed da conferência manual. O cálculo usa `reduce`.

## ANP 10 - Validação e erro na interface

Foi enviado um POST com os outros campos válidos, `nota: 7` e `status: "inventado"`. Resultado HTTP real: **400**, com os dois problemas juntos:

```json
{
  "erros": [
    "Selecione um status válido.",
    "Informe uma nota inteira de 1 a 5."
  ],
  "erro": "Selecione um status válido. Informe uma nota inteira de 1 a 5."
}
```

O teste automatizado repetiu o caso no PUT e comparou o conteúdo do arquivo antes/depois: nenhuma escrita ocorreu. POST válido retornou 201 com ID do servidor; PUT válido retornou 200 preservando o ID. DELETE retornou 204 sem corpo, ou 404 se repetido.

Na integração React/Express, o transporte de teste alterou nota e status de uma submissão válida para provocar a resposta 400 real do servidor. O modal mostrou ambas as mensagens, manteve o título digitado e conservou o card anterior. Ao reenviar dados válidos, a edição concluiu. A alteração do transporte existe somente no teste, não na aplicação.

## CRUD pela interface e persistência após reiniciar

O script `frontend/scripts/verificar-interface.mjs` executa componentes reais em jsdom, conectados a um processo Node separado e a um arquivo temporário populado pelo seed. Resultado observado no clone:

| Passo | Resultado real |
| --- | --- |
| Carregar o catálogo | Seis cards. |
| Abrir Adicionar e salvar sem título | Erro de validação visível; nenhum cadastro. |
| Cadastrar Filme de teste, ano 2020, gênero Drama | Sete cards; novo card após a confirmação do servidor. |
| Editar para Filme editado | Card atualizado; nos cenários de falha, formulário e card anterior preservados. |
| Cancelar a confirmação de remoção | Filme permaneceu. |
| Confirmar a remoção | Card removido; seis filmes. |
| Cadastrar Persistência ANP 10, ano 2021, gênero Drama | Sete cards. |
| Editar para Persistido após reinício | Novo título exibido e gravado. |
| Remover Cidade de Deus pela interface | Seis cards; filme removido. |
| Encerrar o processo Node e iniciar outro usando o mesmo arquivo | PID diferente confirmado. |
| Reabrir o App e carregar da API reiniciada | Seis cards; Persistido após reinício presente e Cidade de Deus ausente. |
| Conferir o JSON no disco | Cadastro/edição presentes e remoção mantida. |

O console do teste registrou: `Persistência: cadastro, edição e remoção pela interface sobreviveram à troca do processo Node.` O teste foi aprovado também no clone limpo.

Na conferência manual, o autor confirmou busca, contador, filtros após recarregar, cadastro de Teste ANP 10, edição e remoção, sem problemas. Depois o backend de teste na porta 3027 foi encerrado e iniciado novamente com `npm start`. O autor recarregou a página e confirmou que o resultado da última ação persistiu, além dos exemplos de consulta da ANP 09. Após reiniciar, `/stats` respondeu 200 com o seed de seis filmes e média 4,5.

## Verificações complementares e limites

- CORS/preflight, JSON malformado, arquivo corrompido, status HTTP e gravação antes da resposta passaram nos testes do backend.
- Carregamento, retry, rede indisponível, espera de escrita, ordenação, página Sobre, fallback de imagem e lista vazia passaram na integração.
- `npm run lint` terminou com código zero e dois avisos preexistentes: ano com `Date` no Rodape e sincronização inicial da navegação por efeito no App. Não são avisos de key/props nem erros no console do navegador.
- `git diff v1.0 -- parte1` não apresentou diferenças.
- Testes jsdom não medem layout, foco/teclado nativos do dialog nem impressão. A conferência visual acima é a confirmação manual do autor; não houve automação de navegador disponível nesta rodada. Não foi feita nova medição Lighthouse.

## Documentação e versão

A [documentação da API](api.md) cobre consultas, CRUD, parâmetros, corpos, códigos de resposta, validação e CORS. O README contém a execução de backend e frontend a partir do zero e as entregas das ANPs 07 a 10. A tag local `v2.0` é atualizada para o commit final das ANPs; a referência remota só muda quando os novos commits e a tag forem publicados.
