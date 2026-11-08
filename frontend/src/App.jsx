import Header from './components/Header.jsx'
import Filtros from './components/Filtros.jsx'
import ListaFilmes from './components/ListaFilmes.jsx'
import Rodape from './components/Rodape.jsx'
import { filmesIniciais } from './data/filmes.js'
import { useEffect, useState } from 'react'
import { filtrarFilmes } from './filtrarFilmes.js'

export default function App() {
  const [status, setStatus] = useState('todos')
  const [busca, setBusca] = useState('')
  const [buscaAplicada, setBuscaAplicada] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setBuscaAplicada(busca), 300)
    return () => clearTimeout(timer)
  }, [busca])

  const visiveis = filtrarFilmes(filmesIniciais, status, buscaAplicada)
  return (
    <>
      <Header busca={busca} aoBuscar={setBusca} />
      <Filtros ativo={status} aoMudar={setStatus} />
      <main><ListaFilmes filmes={visiveis} /></main>
      <Rodape total={filmesIniciais.length} />
    </>
  )
}
