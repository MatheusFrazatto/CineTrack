export default function Rodape({ total }) {
  return (
    <footer>
      <p>Desenvolvido por <a href="https://github.com/MatheusFrazatto">Matheus Frazatto</a></p>
      <p>Programação de Sistemas Web · UEM</p>
      <p>Professor: Lucas de Oliveira Teixeira</p>
      <p><small className="resumo-catalogo">{total} filmes cadastrados · CineTrack © {new Date().getFullYear()}</small></p>
    </footer>
  )
}
