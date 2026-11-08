export function filtrarFilmes(filmes, status, busca) {
  return filmes
    .filter((filme) => status === 'todos' || filme.status === status)
    .filter((filme) => filme.titulo.toLowerCase().includes(busca.toLowerCase()))
}
