const BASE = (import.meta.env?.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '')

async function pedir(caminho, opcoes = {}) {
  let resposta
  try {
    resposta = await fetch(BASE + caminho, {
      ...opcoes,
      ...(opcoes.body ? { headers: { 'Content-Type': 'application/json' } } : {}),
    })
  } catch {
    throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está em execução e tente novamente.')
  }
  if (!resposta.ok) {
    const dados = await resposta.json().catch(() => null)
    throw new Error(dados?.erro || `Falha na requisição (HTTP ${resposta.status}).`)
  }
  if (resposta.status === 204) return null
  try {
    return await resposta.json()
  } catch {
    throw new Error('O servidor retornou uma resposta inválida.')
  }
}

export const listar = () => pedir('/filmes')
export const criar = (filme) => pedir('/filmes', { method: 'POST', body: JSON.stringify(filme) })
export const atualizar = (id, filme) => pedir(`/filmes/${id}`, { method: 'PUT', body: JSON.stringify(filme) })
export const remover = (id) => pedir(`/filmes/${id}`, { method: 'DELETE' })
