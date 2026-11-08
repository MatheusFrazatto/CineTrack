import Header from './components/Header.jsx'
import Filtros from './components/Filtros.jsx'
import ListaFilmes from './components/ListaFilmes.jsx'
import Rodape from './components/Rodape.jsx'
import { filmesIniciais } from './data/filmes.js'

export default function App() {
  return (
    <>
      <Header />
      <Filtros />
      <main><ListaFilmes filmes={filmesIniciais} /></main>
      <Rodape total={filmesIniciais.length} />
    </>
  )
}
