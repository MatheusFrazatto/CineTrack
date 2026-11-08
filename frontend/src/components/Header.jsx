export default function Header({ busca, aoBuscar, aoAdicionar, ocupado = false }) {
  return (
    <header>
      <h1>CineTrack</h1>
      <input type="search" aria-label="Buscar filme" placeholder="Buscar filme..."
        value={busca} onChange={(evento) => aoBuscar(evento.target.value)} />
      <button type="button" className="btn-adicionar" aria-label="Adicionar filme" onClick={aoAdicionar} disabled={ocupado}>
        <span className="rotulo-curto" aria-hidden="true">+</span>
        <span className="rotulo-completo">+ Adicionar</span>
      </button>
    </header>
  )
}
