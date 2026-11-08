export function ordenarFilmes(lista, criterio) {
  return [...lista].sort((primeiro, segundo) => {
    if (criterio === "ano") return segundo.ano - primeiro.ano;
    if (criterio === "nota") return segundo.nota - primeiro.nota;
    return primeiro.titulo.localeCompare(segundo.titulo, "pt-BR");
  });
}
