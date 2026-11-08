const express = require('express')
const morgan = require('morgan')
const { ARQUIVO, lerFilmes } = require('./repositorio.js')

function criarApp({ arquivo = ARQUIVO, log = true } = {}) {
  const app = express()
  if (log) app.use(morgan('dev'))
  app.use(express.json())

  app.get('/filmes', (req, res) => {
    let lista = lerFilmes(arquivo)
    if (req.query.status) lista = lista.filter((filme) => filme.status === req.query.status)
    res.json(lista)
  })

  app.get('/filmes/:id', (req, res) => {
    const filme = lerFilmes(arquivo).find((item) => item.id === Number(req.params.id))
    if (!filme) return res.status(404).json({ erro: 'Filme não encontrado.' })
    res.json(filme)
  })

  app.use((req, res) => res.status(404).json({ erro: 'Rota não encontrada.' }))
  app.use((erro, req, res, next) => {
    if (res.headersSent) return next(erro)
    if (erro.type === 'entity.parse.failed') return res.status(400).json({ erro: 'JSON inválido.' })
    res.status(500).json({ erro: 'Não foi possível acessar os dados. Verifique o arquivo JSON do servidor.' })
  })
  return app
}

module.exports = { criarApp }
