import CardFilme from './CardFilme.jsx'

export default function ListaFilmes({ filmes }) {
  if (filmes.length === 0) return <p className="mensagem" role="status">Nenhum filme encontrado.</p>
  return (
    <section id="lista" aria-label="Catálogo de filmes" aria-live="polite">
      {filmes.map((filme) => <CardFilme key={filme.id} filme={filme} />)}
    </section>
  )
}
