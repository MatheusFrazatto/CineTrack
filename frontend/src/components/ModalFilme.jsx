import { useEffect, useRef, useState } from 'react'
import { validarFilme } from '../validarFilme.js'

const VAZIO = { titulo: '', ano: '', genero: '', poster: '', status: 'quero', nota: 3, comentario: '' }

export default function ModalFilme({ filme, aoSalvar, aoFechar }) {
  const [dados, setDados] = useState({ ...VAZIO, ...filme })
  const [erros, setErros] = useState([])
  const [salvando, setSalvando] = useState(false)
  const dialogo = useRef(null)
  const errosRef = useRef(null)
  const enviando = useRef(false)

  useEffect(() => {
    const elemento = dialogo.current
    elemento.showModal()
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { elemento.close(); document.body.style.overflow = overflow }
  }, [])

  useEffect(() => { if (erros.length) errosRef.current?.focus() }, [erros])

  function atualizar(campo, valor) {
    setDados((anteriores) => ({ ...anteriores, [campo]: valor }))
  }

  async function submeter(evento) {
    evento.preventDefault()
    if (enviando.current) return
    const filmeSalvo = { ...dados, titulo: dados.titulo.trim(), genero: dados.genero.trim(),
      poster: dados.poster.trim(), ano: Number(dados.ano), nota: Number(dados.nota) }
    const validacao = validarFilme(filmeSalvo)
    if (!validacao.valido) { setErros(validacao.erros); return }
    enviando.current = true
    setSalvando(true)
    setErros([])
    try {
      await aoSalvar(filmeSalvo)
    } catch (erro) {
      setErros([erro.message || 'Não foi possível salvar. Tente novamente.'])
    } finally {
      enviando.current = false
      setSalvando(false)
    }
  }

  return (
    <dialog ref={dialogo} className="modal-conteudo" aria-labelledby="titulo-modal"
      onCancel={(evento) => { evento.preventDefault(); if (!enviando.current) aoFechar() }}>
      <h2 id="titulo-modal">{filme.id ? 'Editar filme' : 'Adicionar filme'}</h2>
      <form onSubmit={submeter} noValidate aria-busy={salvando}>
        {erros.length > 0 && <div className="erros-formulario" role="alert" tabIndex={-1} ref={errosRef}>
          <ul>{erros.map((erro) => <li key={erro}>{erro}</li>)}</ul>
        </div>}
        <fieldset disabled={salvando}>
          <div><label htmlFor="titulo">Título</label><input id="titulo" value={dados.titulo} onChange={(e) => atualizar('titulo', e.target.value)} required autoFocus /></div>
          <div><label htmlFor="ano">Ano</label><input id="ano" type="number" min="1888" max="2030" value={dados.ano} onChange={(e) => atualizar('ano', e.target.value)} required /></div>
          <div><label htmlFor="genero">Gênero</label><input id="genero" value={dados.genero} onChange={(e) => atualizar('genero', e.target.value)} required /></div>
          <div><label htmlFor="poster">URL do pôster (opcional)</label><input id="poster" type="url" value={dados.poster} onChange={(e) => atualizar('poster', e.target.value)} /></div>
          <div><label htmlFor="status">Status</label><select id="status" value={dados.status} onChange={(e) => atualizar('status', e.target.value)}>
            <option value="quero">Quero assistir</option><option value="assistindo">Assistindo</option><option value="assistido">Assistido</option>
          </select></div>
          <div><label htmlFor="nota">Nota (1 a 5)</label><input id="nota" type="number" min="1" max="5" value={dados.nota} onChange={(e) => atualizar('nota', e.target.value)} required /></div>
          <div><label htmlFor="comentario">Comentário (opcional)</label><textarea id="comentario" rows="3" value={dados.comentario} onChange={(e) => atualizar('comentario', e.target.value)} /></div>
        </fieldset>
        <div className="form-acoes">
          <button type="button" className="btn-cancelar" onClick={aoFechar} disabled={salvando}>Cancelar</button>
          <button type="submit" className="btn-salvar" disabled={salvando}>{salvando ? 'Salvando...' : 'Salvar'}</button>
        </div>
      </form>
    </dialog>
  )
}
