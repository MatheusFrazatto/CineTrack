const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { once } = require('node:events')
const { popular } = require('../seed.js')
const { criarApp } = require('../app.js')

async function preparar(t) {
  const pasta = fs.mkdtempSync(path.join(os.tmpdir(), 'cinetrack-api-'))
  const arquivo = path.join(pasta, 'filmes.json')
  popular(arquivo)
  const servidor = criarApp({ arquivo, log: false }).listen(0, '127.0.0.1')
  await once(servidor, 'listening')
  const base = `http://127.0.0.1:${servidor.address().port}`
  t.after(async () => {
    await new Promise((resolve) => servidor.close(resolve))
    fs.rmSync(pasta, { recursive: true, force: true })
  })
  return { arquivo, servidor, base }
}

test('GET lista, filtra por status e consulta um filme', async (t) => {
  const { base } = await preparar(t)
  const lista = await fetch(base + '/filmes')
  assert.equal(lista.status, 200)
  assert.match(lista.headers.get('content-type'), /application\/json/)
  assert.equal((await lista.json()).length, 6)
  const filtrados = await (await fetch(base + '/filmes?status=quero')).json()
  assert.equal(filtrados.length, 2)
  assert.ok(filtrados.every((filme) => filme.status === 'quero'))
  assert.equal((await (await fetch(base + '/filmes/4')).json()).titulo, 'Duna: Parte Dois')
})

test('GET devolve 404 JSON para ID inexistente e rota desconhecida', async (t) => {
  const { base } = await preparar(t)
  for (const rota of ['/filmes/99', '/filmes/abc', '/inexistente']) {
    const resposta = await fetch(base + rota)
    assert.equal(resposta.status, 404)
    assert.equal(typeof (await resposta.json()).erro, 'string')
  }
})

test('arquivo corrompido retorna 500 JSON sem sobrescrever os dados', async (t) => {
  const { arquivo, base } = await preparar(t)
  fs.writeFileSync(arquivo, '{invalido')
  const resposta = await fetch(base + '/filmes')
  assert.equal(resposta.status, 500)
  assert.match((await resposta.json()).erro, /dados/)
  assert.equal(fs.readFileSync(arquivo, 'utf8'), '{invalido')
})

const opcoes = (method, body) => ({ method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
const dadosValidos = { titulo: 'Novo filme', ano: 2020, genero: 'Drama', poster: '', status: 'quero', nota: 3, comentario: '' }

test('POST valida dados, ignora ID do cliente e persiste antes da resposta 201', async (t) => {
  const { arquivo, base } = await preparar(t)
  const antes = fs.readFileSync(arquivo, 'utf8')
  for (const dados of [null, [], {}, { ...dadosValidos, titulo: '  ' }, { ...dadosValidos, ano: '2020' },
    { ...dadosValidos, nota: 9 }, { ...dadosValidos, status: 'outro' }, { ...dadosValidos, poster: 'javascript:alert(1)' },
    { ...dadosValidos, comentario: {} }]) {
    const resposta = await fetch(base + '/filmes', opcoes('POST', dados))
    assert.equal(resposta.status, 400)
    assert.equal(typeof (await resposta.json()).erro, 'string')
  }
  assert.equal(fs.readFileSync(arquivo, 'utf8'), antes)
  const resposta = await fetch(base + '/filmes', opcoes('POST', { ...dadosValidos, id: 1, extra: 'ignorar', comentario: '  Observação  ' }))
  assert.equal(resposta.status, 201)
  const novo = await resposta.json()
  assert.equal(novo.id, 7)
  assert.equal(novo.extra, undefined)
  assert.equal(novo.comentario, 'Observação')
  assert.deepEqual(JSON.parse(fs.readFileSync(arquivo, 'utf8')).at(-1), novo)
})

test('PUT preserva ID, valida alterações e DELETE retorna 204 sem corpo ou 404', async (t) => {
  const { arquivo, base } = await preparar(t)
  const resposta = await fetch(base + '/filmes/1', opcoes('PUT', { titulo: 'Título editado', id: 999, comentario: '   ' }))
  assert.equal(resposta.status, 200)
  const atualizado = await resposta.json()
  assert.equal(atualizado.id, 1)
  assert.equal(atualizado.titulo, 'Título editado')
  assert.equal(atualizado.ano, 2010)
  assert.equal(atualizado.comentario, '')
  assert.equal((await fetch(base + '/filmes/1', opcoes('PUT', { ano: 0 }))).status, 400)
  assert.equal((await fetch(base + '/filmes/99', opcoes('PUT', dadosValidos))).status, 404)
  assert.equal((await fetch(base + '/filmes/1', opcoes('PUT', null))).status, 400)
  const removido = await fetch(base + '/filmes/1', { method: 'DELETE' })
  assert.equal(removido.status, 204)
  assert.equal(await removido.text(), '')
  assert.equal((await fetch(base + '/filmes/1', { method: 'DELETE' })).status, 404)
  assert.equal(JSON.parse(fs.readFileSync(arquivo, 'utf8')).length, 5)
})

test('escritas permanecem ao reiniciar a aplicação sobre o mesmo arquivo', async (t) => {
  const { arquivo, base, servidor } = await preparar(t)
  const novo = await (await fetch(base + '/filmes', opcoes('POST', dadosValidos))).json()
  await fetch(base + '/filmes/' + novo.id, opcoes('PUT', { titulo: 'Persistido' }))
  await fetch(base + '/filmes/1', { method: 'DELETE' })
  await new Promise((resolve) => servidor.close(resolve))
  const reiniciado = criarApp({ arquivo, log: false }).listen(0, '127.0.0.1')
  await once(reiniciado, 'listening')
  t.after(() => new Promise((resolve) => reiniciado.close(resolve)))
  const lista = await (await fetch(`http://127.0.0.1:${reiniciado.address().port}/filmes`)).json()
  assert.equal(lista.length, 6)
  assert.ok(lista.some((filme) => filme.titulo === 'Persistido'))
  assert.ok(!lista.some((filme) => filme.id === 1))
})

test('CORS atende preflight e corpo JSON malformado retorna erro JSON', async (t) => {
  const { base } = await preparar(t)
  const preflight = await fetch(base + '/filmes', { method: 'OPTIONS', headers: {
    Origin: 'http://localhost:5173', 'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'content-type',
  } })
  assert.equal(preflight.status, 204)
  assert.ok(preflight.headers.get('access-control-allow-origin'))
  const malformado = await fetch(base + '/filmes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{invalido' })
  assert.equal(malformado.status, 400)
  assert.match((await malformado.json()).erro, /JSON/)
})
