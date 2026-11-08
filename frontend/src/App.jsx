import Header from './components/Header.jsx'
import Filtros from './components/Filtros.jsx'
import ListaFilmes from './components/ListaFilmes.jsx'
import Rodape from './components/Rodape.jsx'
import { useEffect, useRef, useState } from 'react'
import { filtrarFilmes } from './filtrarFilmes.js'
import ModalFilme from './components/ModalFilme.jsx'
import { listar, criar, atualizar, remover } from './api.js'

export default function App() {
  const [filmes, setFilmes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [tentativa, setTentativa] = useState(0)
  const [ocupado, setOcupado] = useState(false)
  const [erroAcao, setErroAcao] = useState(null)
  const operacao = useRef(false)
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

  async function salvar(dados) {
    if (operacao.current) return
    operacao.current = true
    setOcupado(true)
    setErroAcao(null)
    try {
      if (editando.id) {
        const atualizado = await atualizar(editando.id, dados)
        setFilmes((anteriores) => anteriores.map((filme) => filme.id === atualizado.id ? atualizado : filme))
      } else {
        const novo = await criar(dados)
        setFilmes((anteriores) => [...anteriores, novo])
      }
      setEditando(null)
    } finally {
      operacao.current = false
      setOcupado(false)
    }
  }

  async function removerFilme(id) {
    if (operacao.current) return
    if (!window.confirm('Remover este filme do catálogo?')) return
    operacao.current = true
    setOcupado(true)
    setErroAcao(null)
    try {
      await remover(id)
      setFilmes((anteriores) => anteriores.filter((filme) => filme.id !== id))
    } catch (falha) {
      setErroAcao(falha.message)
    } finally {
      operacao.current = false
      setOcupado(false)
    }
  }
  return (
    <>
      <Header busca={busca} aoBuscar={setBusca} aoAdicionar={() => setEditando({})} ocupado={carregando || Boolean(erro) || ocupado} />
      <Filtros ativo={status} aoMudar={setStatus} />
      <main aria-busy={carregando}>
        {erroAcao && <p className="mensagem erros-formulario" role="alert">{erroAcao}</p>}
        {carregando ? <p className="mensagem" role="status">Carregando filmes...</p> : erro ? (
          <div className="mensagem" role="alert"><p>{erro}</p><button type="button" onClick={() => setTentativa((valor) => valor + 1)}>Tentar novamente</button></div>
        ) : <ListaFilmes filmes={visiveis} aoEditar={setEditando} aoRemover={removerFilme} ocupado={ocupado} />}
      </main>
      <Rodape total={filmes.length} />
      {editando !== null && <ModalFilme filme={editando} aoSalvar={salvar} aoFechar={() => setEditando(null)} />}
    </>
  )
}
