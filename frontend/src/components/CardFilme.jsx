const ROTULOS = { assistido: 'Assistido', assistindo: 'Assistindo', quero: 'Quero assistir' }
const PLACEHOLDER = '/poster-placeholder.svg'

function estrelas(nota) {
  return '★'.repeat(nota) + '☆'.repeat(5 - nota)
}

export default function CardFilme({ filme, aoEditar, aoRemover, ocupado = false }) {
  return (
    <article className="card">
      <img src={filme.poster || PLACEHOLDER} alt={`Pôster de ${filme.titulo}`} loading="lazy"
        onError={(evento) => {
          if (evento.currentTarget.getAttribute('src') !== PLACEHOLDER) evento.currentTarget.src = PLACEHOLDER
        }} />
      <h2>{filme.titulo}</h2>
      <p>{filme.ano} · {filme.genero}</p>
      <span className={`badge ${filme.status}`}>{ROTULOS[filme.status]}</span>
      <p aria-label={`Nota: ${filme.nota} de 5 estrelas`}>{estrelas(filme.nota)}</p>
      {filme.comentario && <p className="comentario">{filme.comentario}</p>}
      <div className="acoes">
        <button type="button" disabled={ocupado} onClick={() => aoEditar(filme)} aria-label={`Editar ${filme.titulo}`}>Editar</button>
        <button type="button" disabled={ocupado} onClick={() => aoRemover(filme.id)} aria-label={`Remover ${filme.titulo}`}>Remover</button>
      </div>
    </article>
  )
}
