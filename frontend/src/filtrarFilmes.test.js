import test from 'node:test'
import assert from 'node:assert/strict'
import { filtrarFilmes } from './filtrarFilmes.js'
import { filmesIniciais } from './data/filmes.js'

test('combina status e busca sem alterar a lista original', () => {
  const antes = structuredClone(filmesIniciais)
  assert.deepEqual(filtrarFilmes(filmesIniciais, 'quero', 'INTER'), [filmesIniciais[4]])
  assert.equal(filtrarFilmes(filmesIniciais, 'assistido', 'INTER').length, 0)
  assert.equal(filtrarFilmes(filmesIniciais, 'todos', '').length, 6)
  assert.deepEqual(filmesIniciais, antes)
})
