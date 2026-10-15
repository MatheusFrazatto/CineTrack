import test from 'node:test';
import assert from 'node:assert/strict';
import { mediaNotas, contagemPorStatus, ordenarPorNota } from './estatisticas.js';

const filmes = Object.freeze([
  Object.freeze({ titulo: 'Primeiro', nota: 4, status: 'quero' }),
  Object.freeze({ titulo: 'Segundo', nota: 5, status: 'assistido' }),
  Object.freeze({ titulo: 'Terceiro', nota: 4, status: 'assistindo' }),
]);

test('a média considera todas as notas e arredonda para uma casa decimal', () => {
  assert.equal(mediaNotas(filmes), 4.3);
  assert.equal(mediaNotas([]), 0);
});

test('a contagem mantém os três status mesmo quando não há filmes', () => {
  assert.deepEqual(contagemPorStatus(filmes), { assistido: 1, assistindo: 1, quero: 1 });
  assert.deepEqual(contagemPorStatus([]), { assistido: 0, assistindo: 0, quero: 0 });
});

test('a ordenação é decrescente e preserva a coleção recebida', () => {
  const ordenados = ordenarPorNota(filmes);
  assert.deepEqual(ordenados.map(filme => filme.titulo), ['Segundo', 'Primeiro', 'Terceiro']);
  assert.deepEqual(filmes.map(filme => filme.titulo), ['Primeiro', 'Segundo', 'Terceiro']);
  assert.notEqual(ordenados, filmes);
});

test('os seis filmes canônicos produzem os resultados do enunciado', async () => {
  const { filmesIniciais } = await import('./filmes.js');
  assert.equal(mediaNotas(filmesIniciais), 4.5);
  assert.deepEqual(contagemPorStatus(filmesIniciais), { assistido: 3, assistindo: 1, quero: 2 });
  assert.deepEqual(ordenarPorNota(filmesIniciais).map(filme => filme.nota), [5, 5, 5, 4, 4, 4]);
  assert.deepEqual(filmesIniciais.map(filme => filme.id), [1, 2, 3, 4, 5, 6]);
});
