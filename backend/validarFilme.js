function validarFilme(filme) {
  const erros = [];

  if (typeof filme.poster !== 'string' || typeof filme.comentario !== 'string') {
    erros.push('Pôster e comentário devem ser textos.');
  }

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

module.exports = { validarFilme }
