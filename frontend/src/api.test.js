import test from 'node:test'
import assert from 'node:assert/strict'
import { listar } from './api.js'

test('camada simulada carrega os seis filmes de forma assíncrona', async () => {
  const promessa = listar()
  assert.ok(promessa instanceof Promise)
  const filmes = await promessa
  assert.equal(filmes.length, 6)
  assert.equal(filmes[0].titulo, 'A Origem')
})
