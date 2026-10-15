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

function validarFilme(filme) {
  const erros = [];

  if (typeof filme.titulo !== "string" || !filme.titulo.trim()) {
    erros.push("Título obrigatório");
  }

  if (!Number.isInteger(filme.ano) || filme.ano < 1888 || filme.ano > 2030) {
    erros.push("Informe um ano inteiro entre 1888 e 2030.");
  }

  if (typeof filme.genero !== "string" || !filme.genero.trim()) {
    erros.push("Gênero obrigatório");
  }

  if (!["assistido", "assistindo", "quero"].includes(filme.status)) {
    erros.push("Selecione um status válido.");
  }

  if (!Number.isInteger(filme.nota) || filme.nota < 1 || filme.nota > 5) {
    erros.push("Informe uma nota inteira de 1 a 5.");
  }

  if (filme.poster) {
    try {
      const url = new URL(filme.poster);
      if (!["http:", "https:"].includes(url.protocol)) {
        erros.push("A URL do pôster deve começar com http:// ou https://.");
      }
    } catch {
      erros.push("Informe uma URL válida para o pôster ou deixe o campo vazio.");
    }
  }

  return { valido: erros.length === 0, erros };
}

console.log(rotuloStatus("quero"), estrelas(3));

const catalogoFilmes = [
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
  {
    id: 7,
    tmdbId: 1368337,
    titulo: "A Odisseia",
    ano: 2026,
    genero: "Ação, Aventura, Fantasia",
    poster: "https://images.metahub.space/poster/medium/tt33764258/img",
    nota: 5,
    status: "assistido",
    comentario: "",
  },
  {
    id: 8,
    tmdbId: 969681,
    titulo: "Homem-Aranha: Um Novo Dia",
    ano: 2026,
    genero: "Ação, Aventura",
    poster: "https://images.metahub.space/poster/medium/tt22084616/img",
    nota: 4,
    status: "assistido",
    comentario: "",
  },
  {
    id: 9,
    tmdbId: 244786,
    titulo: "Whiplash: Em Busca da Perfeição",
    ano: 2014,
    genero: "Drama, Música",
    poster: "https://images.metahub.space/poster/medium/tt2582802/img",
    nota: 5,
    status: "assistido",
    comentario: "",
  },
  {
    id: 10,
    tmdbId: 329,
    titulo: "Jurassic Park: O Parque dos Dinossauros",
    ano: 1993,
    genero: "Aventura, Ficção científica",
    poster: "https://images.metahub.space/poster/medium/tt0107290/img",
    nota: 4,
    status: "assistido",
    comentario: "",
  },
  {
    id: 11,
    tmdbId: 414906,
    titulo: "Batman",
    ano: 2022,
    genero: "Ação, Crime, Mistério",
    poster: "https://images.metahub.space/poster/medium/tt1877830/img",
    nota: 4,
    status: "assistido",
    comentario: "",
  },
  {
    id: 12,
    tmdbId: 1083381,
    titulo: "Backrooms: Um Não-Lugar",
    ano: 2026,
    genero: "Terror, Ficção científica, Suspense",
    poster: "https://images.metahub.space/poster/medium/tt26657236/img",
    nota: 3,
    status: "assistido",
    comentario: "",
  },
  {
    id: 13,
    tmdbId: 1339713,
    titulo: "Obsessão",
    ano: 2026,
    genero: "Terror, Suspense",
    poster: "https://images.metahub.space/poster/medium/tt37287335/img",
    nota: 3,
    status: "quero",
    comentario: "",
  },
  {
    id: 14,
    tmdbId: 7347,
    titulo: "Tropa de Elite",
    ano: 2007,
    genero: "Ação, Crime, Drama",
    poster: "https://images.metahub.space/poster/medium/tt0861739/img",
    nota: 3,
    status: "assistido",
    comentario: "",
  },
  {
    id: 15,
    tmdbId: 47931,
    titulo: "Tropa de Elite 2: O Inimigo Agora é Outro",
    ano: 2010,
    genero: "Crime, Drama, Suspense",
    poster: "https://images.metahub.space/poster/medium/tt1555149/img",
    nota: 4,
    status: "assistido",
    comentario: "",
  },
  {
    id: 16,
    tmdbId: 1101383,
    titulo: "O Fim da Rua",
    ano: 2026,
    genero: "Ação, Aventura, Mistério",
    poster: "https://images.metahub.space/poster/medium/tt27165187/img",
    nota: 3,
    status: "quero",
    comentario: "",
  },
];

const CHAVE = "cinetrack:filmes";
const CHAVE_IMPORTACAO = "cinetrack:importacao-filmes-2026-10";

function carregar() {
  const filmesSalvos = localStorage.getItem(CHAVE);
  const lista = filmesSalvos
    ? JSON.parse(filmesSalvos)
    : catalogoFilmes.map((filme) => ({ ...filme }));

  if (localStorage.getItem(CHAVE_IMPORTACAO) !== "concluida") {
    let proximoId = Math.max(0, ...lista.map((filme) => filme.id)) + 1;

    catalogoFilmes.filter((filme) => filme.tmdbId).forEach((novoFilme) => {
      const jaCadastrado = lista.some(
        (filme) =>
          filme.tmdbId === novoFilme.tmdbId ||
          filme.titulo.toLowerCase() === novoFilme.titulo.toLowerCase(),
      );

      if (!jaCadastrado) {
        lista.push({ ...novoFilme, id: proximoId });
        proximoId += 1;
      }
    });

    localStorage.setItem(CHAVE, JSON.stringify(lista));
    localStorage.setItem(CHAVE_IMPORTACAO, "concluida");
  }

  return lista;
}

let filmes = carregar();
let termoAtual = "";
let statusAtual = "todos";
let ordemAtual = "titulo";
const listaFilmes = document.querySelector("#lista");
const navFiltros = document.querySelector("nav");
const selecaoOrdem = document.querySelector("#ordenar");
const busca = document.querySelector("header input");
const modal = document.querySelector("#modal");
const form = document.querySelector("#form-filme");
const botaoAdicionar = document.querySelector(".btn-adicionar");
const botaoCancelar = document.querySelector(".btn-cancelar");
const resumoRodape = document.querySelector(".resumo-catalogo");
const errosFormulario = document.querySelector("#erros-formulario");
const POSTER_PADRAO = "poster-placeholder.svg";
let editandoId = null;

const gerarId = (lista) =>
  Math.max(0, ...lista.map((filme) => filme.id)) + 1;

const salvar = () => {
  localStorage.setItem(CHAVE, JSON.stringify(filmes));
};

function aplicarFiltros(lista, opcoes) {
  const termo = opcoes.termo.toLowerCase();

  return lista
    .filter((filme) => filme.titulo.toLowerCase().includes(termo))
    .filter(
      (filme) =>
        opcoes.status === "todos" || filme.status === opcoes.status,
    );
}

function ordenarFilmes(lista, criterio) {
  return [...lista].sort((primeiro, segundo) => {
    if (criterio === "ano") return segundo.ano - primeiro.ano;
    if (criterio === "nota") return segundo.nota - primeiro.nota;
    return primeiro.titulo.localeCompare(segundo.titulo, "pt-BR");
  });
}

function debounce(fn, ms = 300) {
  let timer;

  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

const abrir = () => {
  mostrarErros([]);
  modal.hidden = false;
};

const fechar = () => {
  if (modal) {
    modal.hidden = true;
  } else {
    window.location.assign("index.html");
  }
};

function lerDadosFormulario() {
  const dados = Object.fromEntries(new FormData(form));
  for (const campo of ["titulo", "genero", "poster", "comentario"]) {
    dados[campo] = dados[campo].trim();
  }
  dados.ano = Number(dados.ano);
  dados.nota = Number(dados.nota);
  return dados;
}

function mostrarErros(erros) {
  errosFormulario.replaceChildren();
  const listaErros = document.createElement("ul");
  erros.forEach((mensagem) => {
    const item = document.createElement("li");
    item.textContent = mensagem;
    listaErros.appendChild(item);
  });
  errosFormulario.hidden = erros.length === 0;
  if (erros.length > 0) {
    errosFormulario.appendChild(listaErros);
    errosFormulario.focus();
  }
}

function criarCard(filme) {
  const card = document.createElement("article");
  card.className = "card";
  card.dataset.id = filme.id;

  const poster = document.createElement("img");
  poster.src = filme.poster || POSTER_PADRAO;
  poster.alt = `Pôster de ${filme.titulo}`;
  poster.addEventListener("error", () => {
    if (poster.getAttribute("src") !== POSTER_PADRAO) {
      poster.src = POSTER_PADRAO;
    }
  });

  const titulo = document.createElement("h2");
  titulo.textContent = filme.titulo;

  const detalhes = document.createElement("p");
  detalhes.textContent = `${filme.ano} · ${filme.genero}`;

  const nota = document.createElement("p");
  nota.className = "nota";
  nota.textContent = filme.nota > 0
    ? `Nota: ${estrelas(filme.nota)}`
    : `Sem avaliação: ${estrelas(0)}`;

  const badge = document.createElement("span");
  badge.className = `badge ${filme.status}`;
  badge.textContent = rotuloStatus(filme.status);

  const acoes = document.createElement("div");
  acoes.className = "acoes";

  const editar = document.createElement("button");
  editar.type = "button";
  editar.className = "btn-editar";
  editar.textContent = "Editar";

  const remover = document.createElement("button");
  remover.type = "button";
  remover.className = "btn-remover";
  remover.textContent = "Remover";

  acoes.append(editar, remover);
  card.append(poster, titulo, detalhes, nota, badge, acoes);

  return card;
}

function renderizarCards(lista) {
  const fragmento = document.createDocumentFragment();

  lista.forEach((filme) => {
    fragmento.appendChild(criarCard(filme));
  });

  listaFilmes.replaceChildren(fragmento);
}

function atualizar() {
  if (!listaFilmes) return;

  const filmesVisiveis = aplicarFiltros(filmes, {
    termo: termoAtual,
    status: statusAtual,
  });

  renderizarCards(ordenarFilmes(filmesVisiveis, ordemAtual));
  resumoRodape.textContent = `CineTrack © 2026 · ${filmes.length} filmes cadastrados`;
}

atualizar();

listaFilmes?.addEventListener("click", (evento) => {
  const botaoEditar = evento.target.closest(".btn-editar");

  if (botaoEditar) {
    const card = botaoEditar.closest(".card");
    editandoId = Number(card.dataset.id);
    const filme = filmes.find((item) => item.id === editandoId);

    form.elements.titulo.value = filme.titulo;
    form.elements.ano.value = filme.ano;
    form.elements.genero.value = filme.genero;
    form.elements.poster.value = filme.poster;
    form.elements.status.value = filme.status;
    form.elements.nota.value = filme.nota || "";
    form.elements.comentario.value = filme.comentario;
    abrir();
    return;
  }

  const botaoRemover = evento.target.closest(".btn-remover");
  if (!botaoRemover) return;
  if (!confirm("Remover este filme?")) return;

  const card = botaoRemover.closest(".card");
  const id = Number(card.dataset.id);

  filmes = filmes.filter((filme) => filme.id !== id);
  salvar();
  atualizar();
});

navFiltros?.addEventListener("click", (evento) => {
  const botaoFiltro = evento.target.closest("button[data-status]");
  if (!botaoFiltro) return;

  navFiltros
    .querySelectorAll("button")
    .forEach((botao) => botao.classList.remove("ativo"));
  botaoFiltro.classList.add("ativo");

  statusAtual = botaoFiltro.dataset.status;
  atualizar();
});

selecaoOrdem?.addEventListener("change", (evento) => {
  ordemAtual = evento.target.value;
  atualizar();
});

const aoDigitar = (evento) => {
  termoAtual = evento.target.value;
  atualizar();
};

busca?.addEventListener("input", debounce(aoDigitar, 300));

botaoAdicionar?.addEventListener("click", () => {
  editandoId = null;
  form.reset();
  abrir();
});

botaoCancelar.addEventListener("click", fechar);

document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape" && modal && !modal.hidden) {
    fechar();
  }
});

form.addEventListener("invalid", (evento) => {
  evento.preventDefault();
  const { erros } = validarFilme(lerDadosFormulario());
  mostrarErros(erros);
}, true);

form.addEventListener("input", () => mostrarErros([]));

form.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const dados = lerDadosFormulario();

  const { valido, erros } = validarFilme(dados);
  if (!valido) {
    mostrarErros(erros);
    return;
  }

  mostrarErros([]);

  if (editandoId !== null) {
    filmes = filmes.map((filme) =>
      filme.id === editandoId ? { ...filme, ...dados } : filme,
    );
  } else {
    filmes = [...filmes, { id: gerarId(filmes), ...dados }];
  }

  salvar();
  atualizar();
  fechar();
});
