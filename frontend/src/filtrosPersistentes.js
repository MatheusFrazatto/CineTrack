export function lerFiltros() {
  try {
    const salvo = JSON.parse(window.localStorage.getItem('cinetrack:filtros'))
    return {
      busca: typeof salvo?.busca === 'string' ? salvo.busca : '',
      status: ['todos', 'assistido', 'assistindo', 'quero'].includes(salvo?.status) ? salvo.status : 'todos',
    }
  } catch {
    return { busca: '', status: 'todos' }
  }
}
