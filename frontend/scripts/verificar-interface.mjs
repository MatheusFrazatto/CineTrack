import assert from 'node:assert/strict'
import { JSDOM } from 'jsdom'
import { createServer } from 'vite'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { createRequire } from 'node:module'
import { once } from 'node:events'

const require = createRequire(import.meta.url)
const { criarApp } = require('../../backend/app.js')
const { popular } = require('../../backend/seed.js')
const pasta = fs.mkdtempSync(path.join(os.tmpdir(), 'cinetrack-integracao-'))
const arquivo = path.join(pasta, 'filmes.json')
popular(arquivo)
const backend = criarApp({ arquivo, log: false }).listen(0, '127.0.0.1')
await once(backend, 'listening')
const base = `http://127.0.0.1:${backend.address().port}`
const fetchReal = globalThis.fetch
let modo = 'carga-erro'
let liberarEscrita
let liberarCarga
globalThis.fetch = async (url, opcoes = {}) => {
  const destino = new URL(url)
  if (!destino.pathname.startsWith('/filmes')) return fetchReal(url, opcoes)
  if (modo === 'carga-erro') {
    await new Promise((resolve) => { liberarCarga = resolve })
    return Response.json({ erro: 'Falha de carga simulada.' }, { status: 503 })
  }
  if (modo === 'rede-erro') throw new TypeError('Failed to fetch')
  if (opcoes.method && modo === 'escrita-erro') return Response.json({ erro: 'Falha de gravação simulada.' }, { status: 400 })
  if (opcoes.method && modo === 'escrita-pendente') await new Promise((resolve) => { liberarEscrita = resolve })
  return fetchReal(base + destino.pathname + destino.search, opcoes)
}

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: 'http://localhost:5173' })
Object.assign(globalThis, { window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement,
  IS_REACT_ACT_ENVIRONMENT: true })
Object.defineProperty(globalThis, 'navigator', { value: dom.window.navigator, configurable: true })
// jsdom não implementa a apresentação de dialogs; verificar aqui o ciclo React.
dom.window.HTMLDialogElement.prototype.showModal = function () { this.open = true }
dom.window.HTMLDialogElement.prototype.close = function () { this.open = false }
const { createElement, act } = await import('react')
const { createRoot } = await import('react-dom/client')
const server = await createServer({ server: { middlewareMode: true } })
let root = createRoot(document.querySelector('#root'))
async function esperar(condicao) {
  for (let tentativa = 0; tentativa < 200; tentativa += 1) {
    if (condicao()) return
    await act(async () => new Promise((resolve) => setTimeout(resolve, 10)))
  }
  assert.fail('A interface não chegou ao estado esperado: ' + document.body.textContent)
}
const click = async (seletor) => {
  const elemento = document.querySelector(seletor)
  assert.ok(elemento, seletor)
  await act(async () => elemento.click())
}
async function preencher(seletor, valor) {
  const elemento = document.querySelector(seletor)
  const proto = elemento instanceof dom.window.HTMLTextAreaElement ? dom.window.HTMLTextAreaElement.prototype : dom.window.HTMLInputElement.prototype
  Object.getOwnPropertyDescriptor(proto, 'value').set.call(elemento, valor)
  await act(async () => elemento.dispatchEvent(new dom.window.Event('input', { bubbles: true })))
}
const enviar = () => act(async () => document.querySelector('form').dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true })))
const titulos = () => [...document.querySelectorAll('.card h2')].map((elemento) => elemento.textContent)
async function ordenarPor(valor) {
  const seletor = document.querySelector('#ordenar')
  assert.ok(seletor, 'O seletor de ordenação deve existir')
  await act(async () => {
    seletor.value = valor
    seletor.dispatchEvent(new dom.window.Event('change', { bubbles: true }))
  })
}
try {
  const { default: App } = await server.ssrLoadModule('/src/App.jsx')
  await act(async () => root.render(createElement(App)))
  assert.match(document.querySelector('main').textContent, /Carregando filmes/)
  await act(async () => liberarCarga())
  await esperar(() => document.querySelector('[role="alert"]'))
  assert.match(document.querySelector('[role="alert"]').textContent, /Falha de carga/)
  assert.ok(document.querySelector('[aria-label="Adicionar filme"]').disabled)
  modo = 'normal'
  await click('main button')
  await esperar(() => document.querySelectorAll('.card').length === 6)
  assert.equal(document.querySelectorAll('.card').length, 6)
  assert.equal(document.title, 'CineTrack (6)')
  assert.deepEqual(titulos(), ['A Origem', 'Cidade de Deus', 'Duna: Parte Dois', 'Interestelar', 'O Auto da Compadecida', 'Parasita'])
  await ordenarPor('ano')
  assert.equal(titulos()[0], 'Duna: Parte Dois')
  await ordenarPor('nota')
  assert.equal(document.querySelector('#ordenar').value, 'nota')
  assert.ok(titulos().indexOf('Interestelar') < titulos().indexOf('Cidade de Deus'))
  await click('[aria-label="Adicionar filme"]')
  await enviar()
  assert.match(document.querySelector('[role="alert"]').textContent, /Título obrigatório/)
  await preencher('#titulo', 'Filme de teste')
  await preencher('#ano', '2020')
  await preencher('#genero', 'Drama')
  modo = 'escrita-pendente'
  await enviar()
  assert.equal(document.querySelectorAll('.card').length, 6)
  assert.ok(document.querySelector('button[type="submit"]').disabled)
  assert.ok(document.querySelector('.btn-cancelar').disabled)
  modo = 'normal'
  await act(async () => liberarEscrita())
  await esperar(() => document.querySelectorAll('.card').length === 7)
  assert.equal(document.querySelectorAll('.card').length, 7)
  assert.equal(document.querySelector('dialog'), null)
  assert.equal(document.querySelector('#ordenar').value, 'nota')
  assert.equal(titulos().at(-1), 'Filme de teste')
  await click('[aria-label="Editar Filme de teste"]')
  await preencher('#titulo', 'Filme editado')
  modo = 'escrita-erro'
  await enviar()
  await esperar(() => document.querySelector('[role="alert"]'))
  assert.match(document.querySelector('[role="alert"]').textContent, /Falha de gravação/)
  assert.ok(document.querySelector('[aria-label="Editar Filme de teste"]'))
  assert.ok(document.querySelector('dialog'))
  modo = 'normal'
  await enviar()
  await esperar(() => document.querySelector('[aria-label="Editar Filme editado"]'))
  assert.ok(document.querySelector('[aria-label="Editar Filme editado"]'))
  window.confirm = () => false
  await click('[aria-label="Remover Filme editado"]')
  assert.equal(document.querySelectorAll('.card').length, 7)
  window.confirm = () => true
  modo = 'rede-erro'
  await click('[aria-label="Remover Filme editado"]')
  await esperar(() => document.querySelector('main [role="alert"]'))
  assert.match(document.querySelector('main [role="alert"]').textContent, /conectar ao servidor/)
  assert.equal(document.querySelectorAll('.card').length, 7)
  modo = 'normal'
  await click('[aria-label="Remover Filme editado"]')
  await esperar(() => document.querySelectorAll('.card').length === 6)
  assert.equal(document.querySelectorAll('.card').length, 6)
  await preencher('input[type="search"]', 'INTER')
  await act(async () => new Promise((resolve) => setTimeout(resolve, 340)))
  assert.equal(document.querySelectorAll('.card').length, 1)
  await click('nav button:nth-child(2)')
  assert.match(document.querySelector('main').textContent, /Nenhum filme encontrado/)
  assert.equal(document.querySelector('#ordenar').value, 'nota')
  await click('a[href="#sobre"]')
  await esperar(() => document.querySelector('.pagina-sobre'))
  assert.equal(document.querySelectorAll('.pagina-sobre tbody tr').length, 6)
  assert.equal(document.querySelectorAll('.pagina-sobre details li').length, 7)
  assert.ok(document.querySelector('.pagina-sobre figure img').getAttribute('src'))
  assert.equal(document.title, 'Sobre - CineTrack')
  await click('.pagina-sobre summary')
  assert.ok(document.querySelector('.pagina-sobre details').open)
  await click('a[href="#catalogo"]')
  await esperar(() => document.querySelector('#ordenar'))
  assert.equal(document.querySelector('#ordenar').value, 'nota')
  assert.equal(document.querySelector('input[type="search"]').value, 'INTER')
  assert.equal(document.title, 'CineTrack (6)')
  await act(async () => root.unmount())
  fs.writeFileSync(arquivo, '[]')
  root = createRoot(document.querySelector('#root'))
  await act(async () => root.render(createElement(App)))
  await esperar(() => document.querySelector('main').textContent.includes('Nenhum filme encontrado'))
  assert.equal(document.title, 'CineTrack (0)')
  const { default: CardFilme } = await server.ssrLoadModule('/src/components/CardFilme.jsx')
  await act(async () => root.render(createElement(CardFilme, { filme: {
    id: 1, titulo: 'Pôster indisponível', ano: 2020, genero: 'Drama', nota: 3, status: 'quero', poster: 'https://example.invalid/poster.jpg',
  } })))
  const imagem = document.querySelector('img')
  const propriedade = Object.getOwnPropertyDescriptor(dom.window.HTMLImageElement.prototype, 'src')
  let atribuicoes = 0
  Object.defineProperty(imagem, 'src', {
    get() { return propriedade.get.call(this) },
    set(valor) { atribuicoes += 1; propriedade.set.call(this, valor) },
  })
  await act(async () => imagem.dispatchEvent(new dom.window.Event('error')))
  await act(async () => imagem.dispatchEvent(new dom.window.Event('error')))
  assert.equal(atribuicoes, 1, 'Falha do placeholder não deve causar tentativas infinitas')
  console.log('Integração React + Express: carga, retry, CRUD, validação, espera do servidor, falhas sem perder dados, filtros e vazio passaram.')
} finally {
  await act(async () => root.unmount())
  await server.close()
  await new Promise((resolve) => backend.close(resolve))
  globalThis.fetch = fetchReal
  fs.rmSync(pasta, { recursive: true, force: true })
  dom.window.close()
}
