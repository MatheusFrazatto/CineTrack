function rotuloStatus(status) {
  if (status === "assistido") {
    return "Assistido";
  }

  if (status === "assistindo") {
    return "Assistindo";
  }

  if (status === "quero") {
    return "Quero assistir";
  }

  return status;
}

const estrelas = (nota) => {
  let resultado = "";

  for (let i = 1; i <= 5; i += 1) {
    resultado += i <= nota ? "★" : "☆";
  }

  return resultado;
};

console.log(rotuloStatus("quero"), estrelas(3));

const filmesIniciais = [
  {
    id: 1,
    titulo: "A Origem",
    ano: 2010,
    genero: "Ficção científica",
    poster: "https://www.themoviedb.org/t/p/w1280/ms1bJvwa4BJycBakQ7afcedGlwY.jpg",
    nota: 5,
    status: "assistido",
    comentario: "Um thriller inteligente e visualmente impressionante.",
  },
  {
    id: 2,
    titulo: "Parasita",
    ano: 2019,
    genero: "Suspense",
    poster: "https://www.themoviedb.org/t/p/w1280/igw938inb6Fy0YVcwIyxQ7Lu5FO.jpg",
    nota: 4,
    status: "assistido",
    comentario: "Uma crítica social envolvente e surpreendente.",
  },
  {
    id: 3,
    titulo: "O Auto da Compadecida",
    ano: 2000,
    genero: "Comédia",
    poster: "https://www.themoviedb.org/t/p/w1280/imcOp1kJsCsAFCoOtY5OnPrFbAf.jpg",
    nota: 5,
    status: "assistido",
    comentario: "Humor brasileiro com personagens inesquecíveis.",
  },
  {
    id: 4,
    titulo: "Duna: Parte Dois",
    ano: 2024,
    genero: "Ficção científica",
    poster: "https://www.themoviedb.org/t/p/w1280/rrjoeR5m98ptkGUJ2Z7G4t2lXMg.jpg",
    nota: 4,
    status: "assistindo",
    comentario: "Uma continuação épica e visualmente grandiosa.",
  },
  {
    id: 5,
    titulo: "Interestelar",
    ano: 2014,
    genero: "Ficção científica",
    poster: "https://www.themoviedb.org/t/p/w1280/6ricSDD83BClJsFdGB6x7cM0MFQ.jpg",
    nota: 5,
    status: "quero",
    comentario: "Uma jornada emocionante pelo espaço e pelo tempo.",
  },
  {
    id: 6,
    titulo: "Cidade de Deus",
    ano: 2002,
    genero: "Drama",
    poster: "https://www.themoviedb.org/t/p/w1280/gfnXixcGC060QcG6JPxN6AMdVsq.jpg",
    nota: 4,
    status: "quero",
    comentario: "Um retrato intenso e marcante da realidade brasileira.",
  },
];

function renderizarCards(lista) {
  const cards = lista
    .map(
      (filme) => `
        <article class="card" data-id="${filme.id}">
          <img src="${filme.poster}" alt="Pôster de ${filme.titulo}">
          <h2>${filme.titulo}</h2>
          <p>${filme.ano} &middot; ${filme.genero}</p>
          <p class="nota">Nota: ${estrelas(filme.nota)}</p>
          <span class="badge ${filme.status}">${rotuloStatus(filme.status)}</span>
          <div class="acoes">
            <button type="button">Editar</button>
            <button type="button">Remover</button>
          </div>
        </article>
      `,
    )
    .join("");

  const listaFilmes = document.querySelector("#lista");
  listaFilmes.innerHTML = cards;
}

renderizarCards(filmesIniciais);

const TOTAL = filmesIniciais.length;
const resumoRodape = document.querySelector("footer small");

resumoRodape.textContent = `CineTrack © 2026 · ${TOTAL} filmes cadastrados`;
