const STATUS = [
  { valor: 'todos', rotulo: 'Todos' },
  { valor: 'assistido', rotulo: 'Assistido' },
  { valor: 'assistindo', rotulo: 'Assistindo' },
  { valor: 'quero', rotulo: 'Quero assistir' },
]

export default function Filtros({ ativo, aoMudar }) {
  return (
    <nav aria-label="Filtros de status">
      {STATUS.map(({ valor, rotulo }) => (
        <button key={valor} type="button" className={valor === ativo ? 'ativo' : ''}
          aria-pressed={valor === ativo} onClick={() => aoMudar(valor)}>
          {rotulo}
        </button>
      ))}
    </nav>
  )
}
