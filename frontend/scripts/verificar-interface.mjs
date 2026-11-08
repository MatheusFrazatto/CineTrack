import assert from 'node:assert/strict'
import { JSDOM } from 'jsdom'
import { createServer } from 'vite'

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
const root = createRoot(document.querySelector('#root'))
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
try {
  const { default: App } = await server.ssrLoadModule('/src/App.jsx')
  await act(async () => root.render(createElement(App)))
  assert.equal(document.querySelectorAll('.card').length, 6)
  await click('[aria-label="Adicionar filme"]')
  await enviar()
  assert.match(document.querySelector('[role="alert"]').textContent, /Título obrigatório/)
  await preencher('#titulo', 'Filme de teste')
  await preencher('#ano', '2020')
  await preencher('#genero', 'Drama')
  await enviar()
  assert.equal(document.querySelectorAll('.card').length, 7)
  assert.equal(document.querySelector('dialog'), null)
  await click('[aria-label="Editar Filme de teste"]')
  await preencher('#titulo', 'Filme editado')
  await enviar()
  assert.ok(document.querySelector('[aria-label="Editar Filme editado"]'))
  window.confirm = () => false
  await click('[aria-label="Remover Filme editado"]')
  assert.equal(document.querySelectorAll('.card').length, 7)
  window.confirm = () => true
  await click('[aria-label="Remover Filme editado"]')
  assert.equal(document.querySelectorAll('.card').length, 6)
  await preencher('input[type="search"]', 'INTER')
  await act(async () => new Promise((resolve) => setTimeout(resolve, 340)))
  assert.equal(document.querySelectorAll('.card').length, 1)
  await click('nav button:nth-child(2)')
  assert.match(document.querySelector('main').textContent, /Nenhum filme encontrado/)
  console.log('Interface: validação, adição, edição, confirmação, remoção e filtros combinados passaram.')
} finally {
  await act(async () => root.unmount())
  await server.close()
  dom.window.close()
}
