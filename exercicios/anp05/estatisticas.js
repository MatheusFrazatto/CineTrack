// Funções puras: recebem dados e devolvem resultados, sem acessar o DOM.
export function mediaNotas(lista) {
  if (lista.length === 0) return 0;
  const soma = lista.reduce((total, filme) => total + filme.nota, 0);
  return Number((soma / lista.length).toFixed(1));
}

export function contagemPorStatus(lista) {
  return lista.reduce((contagem, filme) => {
    contagem[filme.status] += 1;
    return contagem;
  }, { assistido: 0, assistindo: 0, quero: 0 });
}

export function ordenarPorNota(lista) {
  // sort altera o array em que é chamado; o spread cria uma cópia antes.
  return [...lista].sort((primeiro, segundo) => segundo.nota - primeiro.nota);
}
