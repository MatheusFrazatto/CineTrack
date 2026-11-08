import test from 'node:test'
import assert from 'node:assert/strict'
import { listar, criar, atualizar, remover } from './api.js'

test('CRUD usa fetch com método, rota e JSON corretos e trata DELETE 204', async (t) => {
  const chamadas = []
  t.mock.method(globalThis, 'fetch', async (url, opcoes = {}) => {
    chamadas.push({ url, opcoes })
    return opcoes.method === 'DELETE' ? new Response(null, { status: 204 }) : Response.json({ id: 7, titulo: 'Resposta do servidor' })
  })
  assert.equal((await listar()).id, 7)
  assert.equal((await criar({ titulo: 'Novo' })).titulo, 'Resposta do servidor')
  assert.equal((await atualizar(7, { titulo: 'Editado' })).id, 7)
  assert.equal(await remover(7), null)
  assert.deepEqual(chamadas.map(({ opcoes }) => opcoes.method || 'GET'), ['GET', 'POST', 'PUT', 'DELETE'])
  assert.ok(chamadas[2].url.endsWith('/filmes/7'))
  assert.equal(JSON.parse(chamadas[1].opcoes.body).titulo, 'Novo')
  assert.equal(chamadas[1].opcoes.headers['Content-Type'], 'application/json')
})

test('4xx e 5xx propagam a mensagem do servidor e admitem resposta sem JSON', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({ erro: 'Filme não encontrado.' }, { status: 404 }))
  await assert.rejects(remover(99), /Filme não encontrado/)
  globalThis.fetch = async () => new Response('<html>erro</html>', { status: 503 })
  await assert.rejects(listar(), /503/)
})

test('falha de rede e resposta malformada produzem mensagens compreensíveis', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => { throw new TypeError('Failed to fetch') })
  await assert.rejects(listar(), /conectar ao servidor/)
  globalThis.fetch = async () => new Response('{quebrado', { status: 200 })
  await assert.rejects(listar(), /resposta inválida/)
})
