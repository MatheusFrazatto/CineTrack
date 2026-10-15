import { filmesIniciais } from './filmes.js';
import { mediaNotas, contagemPorStatus, ordenarPorNota } from './estatisticas.js';

console.log('Média das notas:', mediaNotas(filmesIniciais));
console.log('Contagem por status:', contagemPorStatus(filmesIniciais));
console.log('Filmes por nota (maior para menor):', ordenarPorNota(filmesIniciais));
console.log('Array original depois de ordenar:', filmesIniciais);
