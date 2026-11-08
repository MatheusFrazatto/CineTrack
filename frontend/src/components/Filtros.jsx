const STATUS = [
  { valor: 'todos', rotulo: 'Todos' },
  { valor: 'assistido', rotulo: 'Assistido' },
  { valor: 'assistindo', rotulo: 'Assistindo' },
  { valor: 'quero', rotulo: 'Quero assistir' },
]

export default function Filtros() {
  return (
    <nav aria-label="Filtros de status">
      {STATUS.map(({ valor, rotulo }) => (
        <button key={valor} type="button" className={valor === 'todos' ? 'ativo' : ''} aria-pressed={valor === 'todos'} disabled>
          {rotulo}
        </button>
      ))}
    </nav>
  )
}
