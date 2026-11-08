import test from 'node:test'
import assert from 'node:assert/strict'
import { validarFilme } from './validarFilme.js'
import { gerarId, filmesIniciais } from './data/filmes.js'

const filme = { ...filmesIniciais[0] }
test('aceita o filme completo e rejeita título, ano, gênero, status, nota e pôster inválidos', () => {
  assert.equal(validarFilme(filme).valido, true)
  for (const alteracao of [
    { titulo: '  ' }, { titulo: 4 }, { ano: 1887 }, { ano: 2031 }, { ano: 2000.5 },
    { genero: '' }, { status: 'outro' }, { nota: 0 }, { nota: 6 }, { nota: 2.5 },
    { poster: 'javascript:alert(1)' }, { poster: 'endereco invalido' },
  ]) assert.equal(validarFilme({ ...filme, ...alteracao }).valido, false, JSON.stringify(alteracao))
  assert.equal(validarFilme({ ...filme, poster: '', comentario: '' }).valido, true)
})

test('gera ID a partir do maior existente e aceita coleção vazia', () => {
  assert.equal(gerarId([]), 1)
  assert.equal(gerarId([{ id: 8 }, { id: 2 }]), 9)
})
