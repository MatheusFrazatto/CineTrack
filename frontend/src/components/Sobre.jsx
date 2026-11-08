import { filmesIniciais } from '../data/filmes.js'
import rascunho from '../../../docs/rascunho-tela.jpg'

const ROTULOS = { assistido: 'Assistido', assistindo: 'Assistindo', quero: 'Quero assistir' }

export default function Sobre() {
  return (
    <>
      <header>
        <a href="#catalogo" className="link-voltar">← Voltar</a>
        <h1>Sobre o CineTrack</h1>
      </header>
      <main className="pagina-sobre">
        <p>O CineTrack é um catálogo pessoal de filmes desenvolvido na disciplina de
          Programação de Sistemas Web da Universidade Estadual de Maringá.
          Nele, é possível acompanhar o que já foi assistido, o que está em andamento
          e o que ainda se deseja assistir.</p>
        <section aria-labelledby="titulo-colecao">
          <h2 id="titulo-colecao">Coleção inicial da disciplina</h2>
          <div className="tabela-responsiva" role="region" aria-label="Tabela da coleção inicial" tabIndex={0}>
            <table>
              <caption>Os seis filmes canônicos e seus status iniciais</caption>
              <thead><tr><th scope="col">Título</th><th scope="col">Ano</th><th scope="col">Gênero</th><th scope="col">Status</th></tr></thead>
              <tbody>{filmesIniciais.map((filme) => <tr key={filme.id}>
                <td>{filme.titulo}</td><td>{filme.ano}</td><td>{filme.genero}</td><td>{ROTULOS[filme.status]}</td>
              </tr>)}</tbody>
            </table>
          </div>
        </section>
        <section aria-labelledby="titulo-rascunho">
          <h2 id="titulo-rascunho">Planejamento da interface</h2>
          <figure>
            <img src={rascunho} width="643" height="362"
              alt="Rascunho da tela principal do CineTrack, com busca, filtros de status e cards de filmes." />
            <figcaption>Rascunho inicial da tela: cabeçalho com busca e ação de adicionar,
              filtros de status e uma grade com os filmes da coleção.</figcaption>
          </figure>
        </section>
        <details>
          <summary>Como os dados são organizados</summary>
          <p>Cada filme possui sete campos, conforme os requisitos do projeto:</p>
          <ul>
            <li><strong>Título:</strong> nome do filme.</li>
            <li><strong>Ano:</strong> ano de lançamento.</li>
            <li><strong>Gênero:</strong> categoria cinematográfica.</li>
            <li><strong>Pôster:</strong> URL da imagem da capa.</li>
            <li><strong>Status:</strong> Assistido, Assistindo ou Quero assistir.</li>
            <li><strong>Nota:</strong> avaliação de 1 a 5 estrelas.</li>
            <li><strong>Comentário:</strong> análise ou observações pessoais.</li>
          </ul>
        </details>
      </main>
    </>
  )
}
