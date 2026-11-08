import test from 'node:test'
import assert from 'node:assert/strict'
import { ordenarFilmes } from './ordenarFilmes.js'
import { filtrarFilmes } from './filtrarFilmes.js'

const filmes = Object.freeze([
  Object.freeze({ titulo: 'Zebra', ano: 2000, nota: 3, status: 'quero' }),
  Object.freeze({ titulo: 'Épico', ano: 2024, nota: 5, status: 'assistido' }),
  Object.freeze({ titulo: 'Ação', ano: 2010, nota: 4, status: 'quero' }),
])

test('ordena títulos com acentos em pt-BR e não altera a coleção original', () => {
  assert.deepEqual(ordenarFilmes(filmes, 'titulo').map((filme) => filme.titulo), ['Ação', 'Épico', 'Zebra'])
  assert.deepEqual(filmes.map((filme) => filme.titulo), ['Zebra', 'Épico', 'Ação'])
  assert.notEqual(ordenarFilmes(filmes, 'titulo'), filmes)
})

test('ordena por ano e nota em ordem decrescente e aceita lista vazia', () => {
  assert.deepEqual(ordenarFilmes(filmes, 'ano').map((filme) => filme.ano), [2024, 2010, 2000])
  assert.deepEqual(ordenarFilmes(filmes, 'nota').map((filme) => filme.nota), [5, 4, 3])
  assert.deepEqual(ordenarFilmes([], 'nota'), [])
})

test('combina ordenação com busca e status sem reintroduzir filmes ocultos', () => {
  const filtrados = filtrarFilmes(filmes, 'quero', 'a')
  assert.deepEqual(ordenarFilmes(filtrados, 'nota').map((filme) => filme.titulo), ['Ação', 'Zebra'])
})
