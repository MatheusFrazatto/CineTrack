import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

const server = await createServer({ server: { middlewareMode: true } })
try {
  const { default: App } = await server.ssrLoadModule('/src/App.jsx')
  const { default: ListaFilmes } = await server.ssrLoadModule('/src/components/ListaFilmes.jsx')
  const html = renderToStaticMarkup(createElement(App))
  assert.match(html, /<h1>CineTrack<\/h1>/)
  assert.equal((html.match(/<article /g) || []).length, 6)
  assert.match(html, /Cidade de Deus/)
  assert.match(html, /aria-label="Buscar filme"/)
  assert.match(html, /6 filmes cadastrados/)
  assert.match(renderToStaticMarkup(createElement(ListaFilmes, { filmes: [] })), /Nenhum filme encontrado/)
  console.log('Renderização: seis cards, cabeçalho, rodapé e estado vazio validados.')
} finally {
  await server.close()
}
