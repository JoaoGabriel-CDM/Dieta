/**
 * meal.js
 * Lógica de montagem da refeição: adicionar/remover porções e manter
 * a lista de itens + painel de totais sincronizados na UI.
 */

/** Array de porções calculadas (retorno de calcularPorcao). Estado em memória da refeição. */
let REFEICAO_ATUAL = [];

/**
 * Adiciona um alimento à refeição atual, calculando a porção real com base
 * no peso informado. Cada porção recebe um identificador único próprio
 * (porcaoId), diferente do id do alimento na base TACO, permitindo múltiplas
 * entradas do mesmo alimento com pesos diferentes.
 * @param {object} alimentoMapeado
 * @param {number} pesoEmGramas
 */
function adicionarItemNaRefeicao(alimentoMapeado, pesoEmGramas) {
  try {
    const porcaoCalculada = calcularPorcao(alimentoMapeado, pesoEmGramas);
    REFEICAO_ATUAL.push(porcaoCalculada);
    renderizarRefeicao();
  } catch (erro) {
    exibirMensagemErro(erro.message);
  }
}

/**
 * Remove um item da refeição pelo seu porcaoId único (nunca pelo id do
 * alimento, já que o mesmo alimento pode aparecer mais de uma vez).
 * @param {string} porcaoId
 */
function removerItemDaRefeicao(porcaoId) {
  REFEICAO_ATUAL = REFEICAO_ATUAL.filter(porcao => porcao.porcaoId !== porcaoId);
  renderizarRefeicao();
}

/**
 * Renderiza a lista de itens da refeição e recalcula/renderiza o painel de
 * totais. Deve ser chamada a cada adição ou remoção.
 */
function renderizarRefeicao() {
  const listaItens = document.getElementById('listaItensRefeicao');
  const estadoVazio = document.getElementById('estadoVazioRefeicao');

  listaItens.innerHTML = '';

  if (REFEICAO_ATUAL.length === 0) {
    estadoVazio.classList.remove('hidden');
  } else {
    estadoVazio.classList.add('hidden');

    REFEICAO_ATUAL.forEach(porcao => {
      const li = document.createElement('li');
      li.className = 'flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow-sm border border-slate-100';
      li.innerHTML = `
        <div class="min-w-0">
          <p class="font-medium text-slate-800 truncate">${porcao.nome}</p>
          <p class="text-xs text-slate-400">${porcao.pesoEmGramas} g · ${porcao.kcal} kcal</p>
        </div>
        <button
          data-porcao-id="${porcao.porcaoId}"
          class="botao-remover-item shrink-0 ml-3 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-full p-2 transition-colors"
          aria-label="Remover item">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>`;
      listaItens.appendChild(li);
    });

    // Liga os eventos de remoção após renderizar (event delegation simples)
    document.querySelectorAll('.botao-remover-item').forEach(botao => {
      botao.addEventListener('click', () => {
        const porcaoId = botao.getAttribute('data-porcao-id');
        removerItemDaRefeicao(porcaoId);
      });
    });
  }

  renderizarTotais();
}

/**
 * Recalcula os totais da refeição (iterando o array completo, nunca um
 * contador incremental separado) e atualiza o painel fixo de totais.
 */
function renderizarTotais() {
  const totais = calcularTotaisRefeicao(REFEICAO_ATUAL);

  document.getElementById('totalKcal').textContent = totais.kcal;
  document.getElementById('totalProteina').textContent = `${totais.proteina_g} g`;
  document.getElementById('totalCarboidrato').textContent = `${totais.carboidrato_g} g`;
  document.getElementById('totalGordura').textContent = `${totais.gordura_g} g`;
}

/**
 * Exibe uma mensagem de erro visível ao usuário (ex: falha ao carregar dados
 * ou peso inválido).
 * @param {string} mensagem
 */
function exibirMensagemErro(mensagem) {
  const areaErro = document.getElementById('areaMensagemErro');
  areaErro.textContent = mensagem;
  areaErro.classList.remove('hidden');

  setTimeout(() => {
    areaErro.classList.add('hidden');
  }, 4000);
}
