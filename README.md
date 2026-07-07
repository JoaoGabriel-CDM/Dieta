# Dieta App — Contador de Calorias com Tabela TACO

## Como rodar
Basta abrir `index.html` diretamente no navegador (duplo clique) ou servir a pasta
com qualquer servidor estático. Não há build, não há dependências de Node.js.

## Sobre os dados (`data/taco.json`)
O arquivo contém um **subconjunto real e verificável de 20 alimentos comuns** da
Tabela TACO (4ª edição, NEPA/UNICAMP), com valores nutricionais oficiais
referentes a 100g. Pode ser **expandido futuramente** adicionando novos objetos
no mesmo formato/schema, sem alterar a estrutura. Nenhum valor foi inventado ou
preenchido com placeholder — alimentos sem dado confiável simplesmente não
foram incluídos.

## Escopo desta versão (v1)
Implementado exatamente conforme a documentação:
- Busca local (sem rede) na base TACO embutida.
- Input obrigatório de peso em gramas antes de adicionar qualquer item.
- Cálculo proporcional: `(valor por 100g / 100) * peso digitado`.
- Lista de itens com remoção individual.
- Painel de totais em tempo real (kcal, proteína, carboidrato, gordura).
- Layout responsivo mobile-first (testado mentalmente em 360px e 1280px).

**Fora de escopo nesta versão** (não implementado, conforme decisão do documento):
login/autenticação, persistência remota (Firebase/Supabase/etc.), histórico de
refeições por data/calendário, cálculo de meta calórica (TMB/superávit/déficit).

## Sugestões de melhoria futura (apenas nota, não implementado)
- Cálculo de TMB e meta calórica personalizada.
- Histórico diário/semanal com gráficos de evolução.
- Persistência em banco remoto com autenticação de usuário.
- Expansão do `taco.json` para cobrir a tabela TACO completa.
