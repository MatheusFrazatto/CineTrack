import Header from './components/Header.jsx'
import Filtros from './components/Filtros.jsx'
import ListaFilmes from './components/ListaFilmes.jsx'
import Rodape from './components/Rodape.jsx'
import { filmesIniciais, gerarId } from './data/filmes.js'
import { useEffect, useState } from 'react'
import { filtrarFilmes } from './filtrarFilmes.js'
import ModalFilme from './components/ModalFilme.jsx'

export default function App() {
  const [filmes, setFilmes] = useState(filmesIniciais)
  const [editando, setEditando] = useState(null)
  const [status, setStatus] = useState('todos')
  const [busca, setBusca] = useState('')
  const [buscaAplicada, setBuscaAplicada] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setBuscaAplicada(busca), 300)
    return () => clearTimeout(timer)
  }, [busca])

  const visiveis = filtrarFilmes(filmes, status, buscaAplicada)

  function salvar(dados) {
    if (editando.id) {
      setFilmes((anteriores) => anteriores.map((filme) => filme.id === editando.id ? { ...dados, id: filme.id } : filme))
    } else {
      setFilmes((anteriores) => [...anteriores, { ...dados, id: gerarId(anteriores) }])
    }
    setEditando(null)
  }

  function removerFilme(id) {
    if (!window.confirm('Remover este filme do catálogo?')) return
    setFilmes((anteriores) => anteriores.filter((filme) => filme.id !== id))
  }
  return (
    <>
      <Header busca={busca} aoBuscar={setBusca} aoAdicionar={() => setEditando({})} />
      <Filtros ativo={status} aoMudar={setStatus} />
      <main><ListaFilmes filmes={visiveis} aoEditar={setEditando} aoRemover={removerFilme} /></main>
      <Rodape total={filmes.length} />
      {editando !== null && <ModalFilme filme={editando} aoSalvar={salvar} aoFechar={() => setEditando(null)} />}
    </>
  )
}
