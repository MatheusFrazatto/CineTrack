export default function Header() {
  return (
    <header>
      <h1>CineTrack</h1>
      <input type="search" aria-label="Buscar filme" placeholder="Buscar filme..." />
      <button type="button" className="btn-adicionar" aria-label="Adicionar filme" disabled>
        <span className="rotulo-curto" aria-hidden="true">+</span>
        <span className="rotulo-completo">+ Adicionar</span>
      </button>
    </header>
  )
}
