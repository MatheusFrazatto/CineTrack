# Requisitos Iniciais do CineTrack

## 1. Campos de um Filme
Cada filme cadastrado no sistema possui os seguintes 7 campos:
1. **Título**: Nome do filme (texto).
2. **Ano**: Ano de lançamento (número).
3. **Gênero**: Categoria/gênero cinematográfico (texto/seleção).
4. **Pôster**: URL da imagem da capa do filme (texto).
5. **Status**: Situação do filme (*Assistido* ou *Quero Assistir*).
6. **Nota**: Avaliação do usuário de 1 a 5 estrelas ou 1 a 10 (número).
7. **Comentário**: Análise ou observações pessoais do usuário (texto).

---

## 2. Áreas da Interface
A interface principal da aplicação é dividida em 4 áreas principais:
1. **Busca por Título**: Campo de texto para pesquisa dinâmica de filmes pelo nome.
2. **Filtros de Status**: Botões/seletor para filtrar a exibição por filmes *Todos*, *Assistidos* ou *Quero Assistir*.
3. **Lista de Filmes**: Grade/cards apresentando a coleção de filmes cadastrados.
4. **Formulário de Cadastro**: Seção/modal contendo os campos para inserção de novos filmes.

---

## 3. Mapeamento da API REST (Ação × Método × Rota)

| Ação | Método HTTP | Rota |
| :--- | :---: | :--- |
| **Listar filmes** | `GET` | `/filmes` |
| **Buscar filme por ID** | `GET` | `/filmes/:id` |
| **Cadastrar filme** | `POST` | `/filmes` |
| **Editar filme** | `PUT` | `/filmes/:id` |
| **Remover filme** | `DELETE` | `/filmes/:id` |
