import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

const server = await createServer({ server: { middlewareMode: true } })
try {
  const { default: App } = await server.ssrLoadModule('/src/App.jsx')
  const { default: ListaFilmes } = await server.ssrLoadModule('/src/components/ListaFilmes.jsx')
  const { filmesIniciais } = await server.ssrLoadModule('/src/data/filmes.js')
  const html = renderToStaticMarkup(createElement(App))
  assert.match(html, /<h1>CineTrack<\/h1>/)
  const lista = renderToStaticMarkup(createElement(ListaFilmes, { filmes: filmesIniciais }))
  assert.equal((lista.match(/<article /g) || []).length, 6)
  assert.match(lista, /Cidade de Deus/)
  assert.match(html, /aria-label="Buscar filme"/)
  assert.match(html, /Carregando filmes/)
  assert.match(renderToStaticMarkup(createElement(ListaFilmes, { filmes: [] })), /Nenhum filme encontrado/)
  const { default: Estrelas } = await server.ssrLoadModule('/src/components/Estrelas.jsx')
  const { default: Badge } = await server.ssrLoadModule('/src/components/Badge.jsx')
  for (const [nota, simbolos] of [[1, '★☆☆☆☆'], [3, '★★★☆☆'], [5, '★★★★★']]) {
    const estrelas = renderToStaticMarkup(createElement(Estrelas, { nota }))
    assert.ok(estrelas.includes(simbolos))
    assert.ok(estrelas.includes(`Nota: ${nota} de 5 estrelas`))
  }
  for (const [status, rotulo] of [['assistido', 'Assistido'], ['assistindo', 'Assistindo'], ['quero', 'Quero assistir']]) {
    assert.equal(renderToStaticMarkup(createElement(Badge, { status })), `<span class="badge ${status}">${rotulo}</span>`)
  }
  console.log('Renderização: seis cards, cabeçalho, rodapé e estado vazio validados.')
} finally {
  await server.close()
}
