export default function Estrelas({ nota }) {
  return <p aria-label={`Nota: ${nota} de 5 estrelas`}>{'★'.repeat(nota) + '☆'.repeat(5 - nota)}</p>
}
