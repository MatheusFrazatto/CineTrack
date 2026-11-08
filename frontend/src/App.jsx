import Header from './components/Header.jsx'
import Filtros from './components/Filtros.jsx'
import ListaFilmes from './components/ListaFilmes.jsx'
import Rodape from './components/Rodape.jsx'
import { gerarId } from './data/filmes.js'
import { useEffect, useState } from 'react'
import { filtrarFilmes } from './filtrarFilmes.js'
import ModalFilme from './components/ModalFilme.jsx'
import { listar } from './api.js'

export default function App() {
  const [filmes, setFilmes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [tentativa, setTentativa] = useState(0)
  const [editando, setEditando] = useState(null)
  const [status, setStatus] = useState('todos')
  const [busca, setBusca] = useState('')
  const [buscaAplicada, setBuscaAplicada] = useState('')

  useEffect(() => {
    let ativo = true
    setCarregando(true)
    setErro(null)
    listar()
      .then((dados) => { if (ativo) setFilmes(dados) })
      .catch((falha) => { if (ativo) setErro(falha.message) })
      .finally(() => { if (ativo) setCarregando(false) })
    return () => { ativo = false }
  }, [tentativa])

  useEffect(() => { document.title = `CineTrack (${filmes.length})` }, [filmes.length])

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
      <Header busca={busca} aoBuscar={setBusca} aoAdicionar={() => setEditando({})} ocupado={carregando || Boolean(erro)} />
      <Filtros ativo={status} aoMudar={setStatus} />
      <main aria-busy={carregando}>
        {carregando ? <p className="mensagem" role="status">Carregando filmes...</p> : erro ? (
          <div className="mensagem" role="alert"><p>{erro}</p><button type="button" onClick={() => setTentativa((valor) => valor + 1)}>Tentar novamente</button></div>
        ) : <ListaFilmes filmes={visiveis} aoEditar={setEditando} aoRemover={removerFilme} />}
      </main>
      <Rodape total={filmes.length} />
      {editando !== null && <ModalFilme filme={editando} aoSalvar={salvar} aoFechar={() => setEditando(null)} />}
    </>
  )
}
