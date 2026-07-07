/**
 * search.js
 * Lógica de busca (search-as-you-type com debounce) e controle do modal de busca.
 */

let debounceTimerId = null;
let alimentoSelecionadoParaAdicionar = null;

/**
 * Filtra a base de alimentos em memória por correspondência parcial e
 * case-insensitive no campo "nome". Nunca refaz fetch — apenas filtra o array
 * já carregado em memória.
 * @param {string} termo
 * @param {Array<object>} baseDeAlimentos - alimentos já mapeados (mapearAlimento)
 * @returns {Array<object>}
 */
function buscarAlimentos(termo, baseDeAlimentos) {
  const termoNormalizado = termo.trim().toLowerCase();
  if (termoNormalizado.length === 0) return [];

  return baseDeAlimentos.filter(alimento =>
    alimento.nome.toLowerCase().includes(termoNormalizado)
  ).slice(0, 20);
}

/**
 * Abre o modal de busca e foca automaticamente no campo de input.
 */
function abrirModalBusca() {
  const modal = document.getElementById('modalBusca');
  const inputBusca = document.getElementById('inputBusca');

  modal.classList.remove('hidden');
  modal.classList.add('flex');

  // Reseta estado do modal a cada abertura
  alimentoSelecionadoParaAdicionar = null;
  inputBusca.value = '';
  renderizarResultadosBusca([]);
  esconderFormularioPeso();

  // autofocus
  setTimeout(() => inputBusca.focus(), 50);
}

/**
 * Fecha o modal de busca.
 */
function fecharModalBusca() {
  const modal = document.getElementById('modalBusca');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  alimentoSelecionadoParaAdicionar = null;
}

/**
 * Handler do evento oninput do campo de busca, com debounce de 250ms.
 * @param {string} termo
 */
function aoDigitarBusca(termo) {
  clearTimeout(debounceTimerId);
  debounceTimerId = setTimeout(() => {
    const resultados = buscarAlimentos(termo, BASE_ALIMENTOS_MAPEADA);
    renderizarResultadosBusca(resultados);
  }, 250);
}

/**
 * Renderiza a lista de resultados de busca no modal.
 * @param {Array<object>} resultados
 */
function renderizarResultadosBusca(resultados) {
  const listaResultados = document.getElementById('listaResultadosBusca');
  listaResultados.innerHTML = '';

  if (resultados.length === 0) {
    listaResultados.innerHTML = `
      <li class="px-4 py-3 text-sm text-slate-400 text-center">
        Digite o nome de um alimento para buscar.
      </li>`;
    return;
  }

  resultados.forEach(alimento => {
    const item = document.createElement('li');
    item.className = 'px-4 py-3 border-b border-slate-100 last:border-b-0 hover:bg-emerald-50 cursor-pointer transition-colors';
    item.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <p class="font-medium text-slate-800">${alimento.nome}</p>
          <p class="text-xs text-slate-400">${alimento.categoria} · ${alimento.kcalPor100g} kcal/100g</p>
        </div>
        <span class="text-emerald-500 text-sm font-medium">Selecionar</span>
      </div>`;
    item.addEventListener('click', () => selecionarAlimentoParaAdicionar(alimento));
    listaResultados.appendChild(item);
  });
}

/**
 * Ao selecionar um alimento da lista de resultados, exibe imediatamente o
 * campo para digitar o peso em gramas. O alimento NUNCA é adicionado à
 * refeição sem que o peso tenha sido informado.
 * @param {object} alimentoMapeado
 */
function selecionarAlimentoParaAdicionar(alimentoMapeado) {
  alimentoSelecionadoParaAdicionar = alimentoMapeado;

  const nomeSelecionado = document.getElementById('nomeAlimentoSelecionado');
  const inputPeso = document.getElementById('inputPeso');
  const formularioPeso = document.getElementById('formularioPeso');
  const botaoAdicionar = document.getElementById('botaoAdicionarRefeicao');

  nomeSelecionado.textContent = alimentoMapeado.nome;
  inputPeso.value = '';
  botaoAdicionar.disabled = true;
  botaoAdicionar.classList.add('opacity-50', 'cursor-not-allowed');

  formularioPeso.classList.remove('hidden');
  formularioPeso.classList.add('flex');

  setTimeout(() => inputPeso.focus(), 50);
}

/**
 * Esconde o formulário de peso (estado inicial do modal).
 */
function esconderFormularioPeso() {
  const formularioPeso = document.getElementById('formularioPeso');
  formularioPeso.classList.add('hidden');
  formularioPeso.classList.remove('flex');
}

/**
 * Handler do oninput do campo de peso: habilita o botão "Adicionar à Refeição"
 * somente quando um peso válido (> 0) foi digitado.
 * @param {string} valorDigitado
 */
function aoDigitarPeso(valorDigitado) {
  const botaoAdicionar = document.getElementById('botaoAdicionarRefeicao');
  const peso = parseFloat(valorDigitado);

  const pesoValido = !Number.isNaN(peso) && peso > 0;

  botaoAdicionar.disabled = !pesoValido;
  if (pesoValido) {
    botaoAdicionar.classList.remove('opacity-50', 'cursor-not-allowed');
  } else {
    botaoAdicionar.classList.add('opacity-50', 'cursor-not-allowed');
  }
}

/**
 * Confirma a adição do alimento selecionado à refeição, com o peso informado.
 * Chamado pelo clique no botão "Adicionar à Refeição".
 */
function confirmarAdicaoAlimento() {
  const inputPeso = document.getElementById('inputPeso');
  const peso = parseFloat(inputPeso.value);

  if (!alimentoSelecionadoParaAdicionar) return;
  if (Number.isNaN(peso) || peso <= 0) return; // proteção extra, botão já fica desabilitado

  adicionarItemNaRefeicao(alimentoSelecionadoParaAdicionar, peso);

  // Mantém o modal aberto para permitir adicionar múltiplos itens em sequência.
  // Escolha de implementação: permite montar a refeição inteira sem reabrir o modal.
  alimentoSelecionadoParaAdicionar = null;
  esconderFormularioPeso();
  document.getElementById('inputBusca').value = '';
  document.getElementById('inputBusca').focus();
  renderizarResultadosBusca([]);
}
