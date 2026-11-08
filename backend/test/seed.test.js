const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { popular } = require('../seed.js')

test('seed cria diretórios e grava os seis filmes completos', () => {
  const pasta = fs.mkdtempSync(path.join(os.tmpdir(), 'cinetrack-seed-'))
  try {
    const arquivo = path.join(pasta, 'data', 'filmes.json')
    assert.equal(popular(arquivo), 6)
    const filmes = JSON.parse(fs.readFileSync(arquivo, 'utf8'))
    assert.equal(filmes.length, 6)
    assert.equal(new Set(filmes.map((filme) => filme.id)).size, 6)
    assert.deepEqual(Object.keys(filmes[0]).sort(), ['ano', 'comentario', 'genero', 'id', 'nota', 'poster', 'status', 'titulo'])
    assert.equal(filmes[5].titulo, 'Cidade de Deus')
  } finally { fs.rmSync(pasta, { recursive: true, force: true }) }
})
