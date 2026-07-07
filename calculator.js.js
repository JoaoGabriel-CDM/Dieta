/**
 * calculator.js
 * Funções puras de cálculo nutricional proporcional.
 * Fórmula oficial (Seção 4.1 da documentação):
 *   valorPorGrama = valorPor100g / 100
 *   valorRealDaPorcao = valorPorGrama * pesoDigitadoPeloUsuario
 * Nenhuma variação, aproximação ou fórmula alternativa é permitida.
 */

/**
 * Arredonda um valor numérico para 1 casa decimal.
 * @param {number} valor
 * @returns {number}
 */
function arredondar(valor) {
  return Math.round(valor * 10) / 10;
}

/**
 * Calcula os valores nutricionais reais de uma porção com base no peso informado.
 * @param {object} alimentoMapeado - objeto retornado por mapearAlimento()
 * @param {number} pesoEmGramas - peso digitado pelo usuário, deve ser > 0
 * @returns {object} valores reais da porção
 */
function calcularPorcao(alimentoMapeado, pesoEmGramas) {
  if (typeof pesoEmGramas !== 'number' || pesoEmGramas <= 0 || Number.isNaN(pesoEmGramas)) {
    throw new Error('Peso inválido: deve ser um número maior que zero.');
  }

  const fator = pesoEmGramas / 100;

  return {
    porcaoId: `porcao-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
    id: alimentoMapeado.id,
    nome: alimentoMapeado.nome,
    pesoEmGramas: pesoEmGramas,
    kcal: arredondar(alimentoMapeado.kcalPor100g * fator),
    proteina_g: arredondar(alimentoMapeado.proteinaPor100g * fator),
    carboidrato_g: arredondar(alimentoMapeado.carboidratoPor100g * fator),
    gordura_g: arredondar(alimentoMapeado.gorduraPor100g * fator)
  };
}

/**
 * Calcula o somatório em tempo real da refeição montada.
 * Sempre itera o array completo, nunca mantém contador incremental separado,
 * para evitar dessincronização entre a lista de porções e os totais exibidos.
 * @param {Array<object>} listaDePorcoes
 * @returns {object} totais { kcal, proteina_g, carboidrato_g, gordura_g }
 */
function calcularTotaisRefeicao(listaDePorcoes) {
  const totaisBrutos = listaDePorcoes.reduce((totais, porcao) => {
    totais.kcal += porcao.kcal;
    totais.proteina_g += porcao.proteina_g;
    totais.carboidrato_g += porcao.carboidrato_g;
    totais.gordura_g += porcao.gordura_g;
    return totais;
  }, { kcal: 0, proteina_g: 0, carboidrato_g: 0, gordura_g: 0 });

  return {
    kcal: arredondar(totaisBrutos.kcal),
    proteina_g: arredondar(totaisBrutos.proteina_g),
    carboidrato_g: arredondar(totaisBrutos.carboidrato_g),
    gordura_g: arredondar(totaisBrutos.gordura_g)
  };
}
