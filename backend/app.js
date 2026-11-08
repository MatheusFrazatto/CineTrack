const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const { ARQUIVO, lerFilmes, salvarFilmes } = require('./repositorio.js')
const { validarFilme } = require('./validarFilme.js')

function corpoValido(dados) {
  return dados !== null && typeof dados === 'object' && !Array.isArray(dados)
}

function selecionarCampos(dados) {
  const resultado = {}
  for (const chave of ['titulo', 'ano', 'genero', 'poster', 'status', 'nota', 'comentario']) {
    if (Object.hasOwn(dados, chave)) resultado[chave] = dados[chave]
  }
  return resultado
}

function normalizar(filme) {
  return { ...filme, titulo: filme.titulo.trim(), genero: filme.genero.trim(), poster: filme.poster.trim() }
}

function criarApp({ arquivo = ARQUIVO, log = true } = {}) {
  const app = express()
  if (log) app.use(morgan('dev'))
  app.use(cors())
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

  app.post('/filmes', (req, res) => {
    if (!corpoValido(req.body)) return res.status(400).json({ erro: 'Envie um objeto JSON com os dados do filme.' })
    const dados = { poster: '', comentario: '', ...selecionarCampos(req.body) }
    const validacao = validarFilme(dados)
    if (!validacao.valido) return res.status(400).json({ erro: validacao.erros.join(' ') })
    const lista = lerFilmes(arquivo)
    const id = Math.max(0, ...lista.map((filme) => filme.id)) + 1
    const novo = { ...normalizar(dados), id }
    salvarFilmes([...lista, novo], arquivo)
    res.status(201).json(novo)
  })

  app.put('/filmes/:id', (req, res) => {
    const id = Number(req.params.id)
    const lista = lerFilmes(arquivo)
    const original = lista.find((filme) => filme.id === id)
    if (!original) return res.status(404).json({ erro: 'Filme não encontrado.' })
    if (!corpoValido(req.body)) return res.status(400).json({ erro: 'Envie um objeto JSON com os dados do filme.' })
    const dados = { ...original, ...selecionarCampos(req.body), id }
    const validacao = validarFilme(dados)
    if (!validacao.valido) return res.status(400).json({ erro: validacao.erros.join(' ') })
    const atualizado = normalizar(dados)
    salvarFilmes(lista.map((filme) => filme.id === id ? atualizado : filme), arquivo)
    res.json(atualizado)
  })

  app.delete('/filmes/:id', (req, res) => {
    const id = Number(req.params.id)
    const lista = lerFilmes(arquivo)
    if (!lista.some((filme) => filme.id === id)) return res.status(404).json({ erro: 'Filme não encontrado.' })
    salvarFilmes(lista.filter((filme) => filme.id !== id), arquivo)
    res.status(204).end()
  })

  app.use((req, res) => res.status(404).json({ erro: 'Rota não encontrada.' }))
  app.use((erro, req, res, next) => {
    if (res.headersSent) return next(erro)
    if (erro.type === 'entity.parse.failed') return res.status(400).json({ erro: 'JSON inválido.' })
    if (erro.type === 'entity.too.large') return res.status(413).json({ erro: 'Corpo da requisição muito grande.' })
    res.status(500).json({ erro: 'Não foi possível acessar os dados. Verifique o arquivo JSON do servidor.' })
  })
  return app
}

module.exports = { criarApp }
