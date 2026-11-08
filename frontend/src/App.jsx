import Titulo from './components/Titulo.jsx'

export default function App() {
  return (
    <main>
      <Titulo />
      <p>CineTrack © {new Date().getFullYear()}</p>
    </main>
  )
}
