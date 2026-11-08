const STATUS = [
  { valor: 'todos', rotulo: 'Todos' },
  { valor: 'assistido', rotulo: 'Assistido' },
  { valor: 'assistindo', rotulo: 'Assistindo' },
  { valor: 'quero', rotulo: 'Quero assistir' },
]

export default function Filtros({ ativo, aoMudar, ordem, aoOrdenar }) {
  return (
    <nav aria-label="Filtros de status">
      {STATUS.map(({ valor, rotulo }) => (
        <button key={valor} type="button" className={valor === ativo ? 'ativo' : ''}
          aria-pressed={valor === ativo} onClick={() => aoMudar(valor)}>
          {rotulo}
        </button>
      ))}
      <div className="ordenacao">
        <label htmlFor="ordenar">Ordenar por</label>
        <select id="ordenar" name="ordenar" value={ordem} onChange={(evento) => aoOrdenar(evento.target.value)}>
          <option value="titulo">Título (A a Z)</option>
          <option value="ano">Ano (mais recente)</option>
          <option value="nota">Nota (maior primeiro)</option>
        </select>
      </div>
    </nav>
  )
}
