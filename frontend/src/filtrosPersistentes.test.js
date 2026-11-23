import test from 'node:test'
import assert from 'node:assert/strict'
import { lerFiltros } from './filtrosPersistentes.js'

test('restaura busca e status e ignora valores ausentes, corrompidos ou inválidos', (t) => {
  let salvo = null
  globalThis.window = { localStorage: { getItem: () => salvo } }
  t.after(() => { delete globalThis.window })
  for (const valor of [null, 'xxx', 'null', '[]', '{"busca":42,"status":"inventado"}']) {
    salvo = valor
    assert.deepEqual(lerFiltros(), { busca: '', status: 'todos' })
  }
  salvo = '{"busca":"duna","status":"quero"}'
  assert.deepEqual(lerFiltros(), { busca: 'duna', status: 'quero' })
})

test('armazenamento indisponível usa os padrões sem impedir a abertura', (t) => {
  globalThis.window = { get localStorage() { throw new Error('Acesso bloqueado') } }
  t.after(() => { delete globalThis.window })
  assert.deepEqual(lerFiltros(), { busca: '', status: 'todos' })
})
