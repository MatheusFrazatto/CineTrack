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

const primeiroCard = document.querySelector(".card");
const primeiroBadge = primeiroCard.querySelector(".badge");
const primeiraNota = primeiroCard.querySelector(".nota");

primeiroBadge.textContent = rotuloStatus("assistido");
primeiraNota.textContent = `Nota: ${estrelas(5)}`;

const TOTAL = 6;
const resumoRodape = document.querySelector("footer small");

resumoRodape.textContent = `CineTrack © 2026 · ${TOTAL} filmes cadastrados`;
