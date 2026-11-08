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
