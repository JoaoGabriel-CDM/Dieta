/**
 * app.js
 * Inicialização e orquestração da aplicação.
 * Responsável por: carregar a base de alimentos uma única vez, mapear os
 * dados brutos, e conectar os elementos de UI aos handlers definidos em
 * search.js e meal.js.
 */

/** Base de alimentos bruta (formato do taco.json), carregada uma única vez. */
let BASE_ALIMENTOS = [];

/** Base de alimentos já mapeada para o formato interno da aplicação (ver mapearAlimento). */
let BASE_ALIMENTOS_MAPEADA = [];

/**
 * Carrega o taco.json via fetch local (mesma origem, sem CORS).
 * Deve ser chamada uma única vez, ao carregar a página.
 * @returns {Promise<Array<object>>}
 */
async function carregarBaseDeAlimentos() {
  const resposta = await fetch('./data/taco.json');
  if (!resposta.ok) {
    throw new Error('Falha ao carregar a base de alimentos TACO.');
  }
  const alimentos = await resposta.json();
  return alimentos;
}

/**
 * Camada de abstração: desacopla a nomenclatura interna da app da
 * nomenclatura do JSON (facilita trocar a fonte de dados no futuro).
 * Toda a UI e a lógica de cálculo consomem apenas o objeto mapeado.
 * @param {object} itemBruto - item conforme schema do taco.json
 * @returns {object} alimento mapeado
 */
function mapearAlimento(itemBruto) {
  return {
    id: itemBruto.id,
    nome: itemBruto.nome,
    categoria: itemBruto.categoria,
    kcalPor100g: itemBruto.kcal,
    proteinaPor100g: itemBruto.proteina_g,
    carboidratoPor100g: itemBruto.carboidrato_g,
    gorduraPor100g: itemBruto.gordura_g
  };
}

/**
 * Inicializa a aplicação: carrega os dados, mapeia, e conecta os eventos
 * de UI. Executado uma única vez no DOMContentLoaded.
 */
async function inicializarAplicacao() {
  try {
    BASE_ALIMENTOS = await carregarBaseDeAlimentos();
    BASE_ALIMENTOS_MAPEADA = BASE_ALIMENTOS.map(mapearAlimento);
  } catch (erro) {
    exibirMensagemErro(erro.message || 'Não foi possível carregar os alimentos. Tente recarregar a página.');
    return;
  }

  conectarEventosDeUI();
  renderizarRefeicao(); // estado inicial vazio, já calcula totais em zero
}

/**
 * Conecta todos os event listeners da aplicação aos elementos do DOM.
 */
function conectarEventosDeUI() {
  // Botão flutuante de lupa: abre o modal de busca
  document.getElementById('botaoAbrirBusca')
    .addEventListener('click', abrirModalBusca);

  // Botão de fechar modal
  document.getElementById('botaoFecharModal')
    .addEventListener('click', fecharModalBusca);

  // Clique fora do card do modal fecha o modal
  document.getElementById('modalBusca')
    .addEventListener('click', (evento) => {
      if (evento.target.id === 'modalBusca') {
        fecharModalBusca();
      }
    });

  // Campo de busca: search-as-you-type com debounce (tratado em search.js)
  document.getElementById('inputBusca')
    .addEventListener('input', (evento) => aoDigitarBusca(evento.target.value));

  // Campo de peso: habilita/desabilita botão de adicionar
  document.getElementById('inputPeso')
    .addEventListener('input', (evento) => aoDigitarPeso(evento.target.value));

  // Botão de confirmar adição do alimento à refeição
  document.getElementById('botaoAdicionarRefeicao')
    .addEventListener('click', confirmarAdicaoAlimento);

  // Tecla Escape fecha o modal
  document.addEventListener('keydown', (evento) => {
    const modal = document.getElementById('modalBusca');
    if (evento.key === 'Escape' && !modal.classList.contains('hidden')) {
      fecharModalBusca();
    }
  });
}

document.addEventListener('DOMContentLoaded', inicializarAplicacao);
