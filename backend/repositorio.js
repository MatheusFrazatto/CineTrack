const fs = require('node:fs')
const path = require('node:path')

const ARQUIVO = path.join(__dirname, 'data', 'filmes.json')

function lerFilmes(arquivo = ARQUIVO) {
  const filmes = JSON.parse(fs.readFileSync(arquivo, 'utf8'))
  if (!Array.isArray(filmes)) throw new Error('O arquivo de filmes deve conter uma lista.')
  return filmes
}

function salvarFilmes(lista, arquivo = ARQUIVO) {
  fs.writeFileSync(arquivo, JSON.stringify(lista, null, 2) + '\n', 'utf8')
}

module.exports = { ARQUIVO, lerFilmes, salvarFilmes }
