## 1. Visão Geral do Produto

### 1.1 Declaração do Problema
A gestão financeira pessoal tradicional impõe uma alta carga cognitiva e operacional. A necessidade de digitação manual contínua, a navegação por dezenas de telas e formulários e o tédio associado ao planejamento orçamentário geram altas taxas de churn nos primeiros 30 dias de uso de aplicativos convencionais.

### 1.2 Proposta de Valor
O **Mooney** transforma a gestão financeira em uma experiência conversacional e automatizada. Através de inteligência artificial generativa e integração via Open Finance, o produto elimina a digitação manual, consolida visões multi-bancárias e atua proativamente na otimização da vida financeira do usuário por meio de sugestões acionáveis e produtos financeiros embutidos (*Embedded Finance*).

### 1.3 Visão de Longo Prazo
Tornar-se o copiloto financeiro autônomo e onipresente do usuário, capaz de gerenciar orçamentos, renegociar dívidas, rentabilizar saldos parados e intermediar produtos financeiros diretamente a partir das interfaces com as quais o usuário já interage diariamente (App Nativo, WhatsApp, ChatGPT, Claude, Siri, Alexa).

---

## 2. Personas e Casos de Uso

| Persona | Perfil Comportamental | Principal Dor | Caso de Uso Mooney |
| :--- | :--- | :--- | :--- |
| **Executivo/Profissional Atarefado** | Tem alta movimentação de cartão e pouca paciência para categorização. | Abandona planilhas e apps tradicionais por falta de tempo. | Consulta o saldo global por voz enquanto dirige ou manda um áudio rápido no WhatsApp ("Quanto gastei com restaurante esta semana?"). |
| **Endividado/Em Reorganização** | Possui múltiplos contratos de crédito e faturas acumuladas. | Não sabe exatamente o impacto dos juros no orçamento nem por onde começar a amortizar. | O Mooney analisa os contratos via Open Finance e oferece portabilidade de dívida com taxa reduzida em poucos cliques. |
| **Poupador/Investidor Iniciante** | Deixa dinheiro parado na conta corrente por medo de liquidez. | Dificuldade em conciliar reserva de emergência com uso diário do cartão. | Utiliza o Cartão Pré-pago Mooney: o dinheiro depositado como limite credor rende diariamente enquanto não é gasto. |

---

## 3. Arquitetura da Solução e Tecnologias-Chave

```
                                    +-----------------------------------+
                                    |        INTERFACES DE ENTRADA      |
                                    | (App, WhatsApp, GPT, Voice, Siri) |
                                    +-----------------+-----------------+
                                                      |
                                                      v
                                    +-----------------+-----------------+
                                    |    CAMADA DE IA & NLP (AGENTES)   |
                                    |   (Extração, Contexto, Intent)    |
                                    +-----------------+-----------------+
                                                      |
                                                      v
                                    +-----------------+-----------------+
                                    |      CORE ENGINE (MOONEY)         |
                                    | (Categorização, Motor Financeiro) |
                                    +--------+----------------+---------+
                                             |                |
                                             v                v
                        +--------------------+----+      +----+--------------------+
                        | OPEN FINANCE PROVIDER   |      |  BAAS / PARTNERS        |
                        | (Pluggy / Belvo)        |      | (Dock / Celcoin / FIDC) |
                        +-------------------------+      +-------------------------+
```

* **Camada de NLP & Agentes de IA:** Processamento de linguagem natural (texto e áudio), extração de entidades (valor, data, estabelecimento, categoria) e geração de respostas estruturadas com componentes visuais (*Widgets*).
* **Agregador de Open Finance:** Conexão segura para leitura de extratos, faturas, limites e saldos consolidados de instituições financeiras brasileiras.
* **Banking as a Service (BaaS):** Emissão de cartões, gestão de contas de pagamento e liquidação financeira.
* **Corban & Credit Engine:** Motor de recomendação de crédito e intermediação de portabilidade de dívidas.

---

## 4. Requisitos Funcionais e Não-Funcionais

### 4.1 Requisitos Funcionais
* **RF-01 (Open Finance):** O sistema deve permitir a conexão de contas bancárias e cartões de crédito via protocolo Open Finance.
* **RF-02 (Consolidação de Visões):** O sistema deve exibir saldos e faturas de forma consolidada (Global) ou individual por instituição financeira.
* **RF-03 (Interface Conversacional):** O sistema deve interpretar mensagens de texto e áudio para busca de lançamentos, criação de registros e solicitações de recomendações.
* **RF-04 (Categorização Inteligente):** O sistema deve categorizar automaticamente transações importadas do Open Finance ou lançadas via chat.
* **RF-05 (Widgets Visuais):** As respostas do chat no aplicativo nativo devem aceitar componentes visuais dinâmicos (gráficos de pizza/barra, resumos de saldo e calendários).
* **RF-06 (Exportação de Dados):** O sistema deve permitir o download de relatórios e extratos nos formatos CSV, XLS e PDF.
* **RF-07 (Contratação de Produtos Financeiros):** O sistema deve apresentar fluxo de onboarding para solicitação do Cartão Pré-pago e portabilidade de crédito dentro da interface.

### 4.2 Requisitos Não-Funcionais
* **RNF-01 (Latência do Chat):** O tempo de resposta do agente de IA para consultas financeiras simples não deve exceder 2,5 segundos.
* **RNF-02 (Segurança & LGPD):** Dados sensíveis de Open Finance e registros de conversas devem ser criptografados em trânsito (TLS 1.3) e em repouso (AES-256).
* **RNF-03 (Disponibilidade):** A API principal do ecossistema deve possuir SLA de disponibilidade de 99.9%.
* **RNF-04 (Acessibilidade de Voz):** O motor de transcrição de áudio deve suportar variações regionais do português do Brasil com taxa de acerto de intenção acima de 92%.

---

## 5. Roadmap de Desenvolvimento e Entregas

```
+---------------------------------------------------------------------------------------------------+
| FASE 1: MVP Conversacional & Open Finance                                                         |
| - App Nativo (Voice & Text Chat) | Open Finance Conectividade | Widgets Visuais | Exportação CSV/PDF  |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
| FASE 2: Expansão Omnichannel & Presença Ubíqua                                                    |
| - Integração WhatsApp | Custom GPTs & Claude Projects | Atalhos Siri & Alexa                      |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
| FASE 3: Embedded Finance & Monetização de Alto Impacto                                            |
| - Cartão Pré-pago com Rendimento | Portabilidade de Dívida | Marketplace de Crédito Pessoal          |
+---------------------------------------------------------------------------------------------------+
```

### **Fase 1: MVP — Core Conversacional & Open Finance**

* **Escopo Detalhado:**
  * Aplicativo móvel nativo com navegação focada em áudio/texto (*Voice-first UI*).
  * Conexão via Open Finance para consolidação de contas e cartões de crédito.
  * Agente de IA para suporte a perguntas com filtros ("Quanto gastei em mercado mês passado?").
  * Lançamento manual simplificado por mensagem de texto ou comando de voz.
  * Renderização de *Widgets* gráficos (resumo financeiro, progresso do mês, gráficos dinâmicos).
  * Módulo de exportação de dados em CSV, XLS e PDF.
* **Alavanca de Valor para o Cliente:**
  * Fim da digitação manual de gastos diários.
  * Clareza imediata sobre a saúde financeira consolidada sem abrir múltiplos apps de banco.
* **Alavanca de Crescimento para o Negócio:**
  * Validação rápida da retenção em 30 dias (*Retention D30*).
  * Redução do Custo de Aquisição (CAC) organicamente via forte apelo de usabilidade (*Word-of-Mouth*).
  * Coleta de base de dados para treinamento do modelo de recomendação financeira.

---

### **Fase 2: Expansão Omnichannel & Presença Ubíqua**

* **Escopo Detalhado:**
  * Liberação do bot do WhatsApp com suporte a fotos de comprovantes e notas fiscais.
  * Desenvolvimento de conectores para ChatGPT (Custom GPT), Claude e Gemini.
  * Integração com assistentes de voz do sistema operacional (Siri Shortcuts e Google Assistant).
  * Sistema proativo de alertas ("Você atingiu 80% do seu orçamento mensal de lazer").
* **Alavanca de Valor para o Cliente:**
  * Eliminação total da necessidade de abrir o aplicativo nativo para gerenciar o dinheiro.
  * Interatividade financeira onde o usuário já passa a maior parte do tempo.
* **Alavanca de Crescimento para o Negócio:**
  * Aumento expressivo no engajamento diário (*DAU/MAU ratio*).
  * Redução drástica da taxa de abandono (*Churn Rate*) por manter a marca presente na rotina do usuário.

---

### **Fase 3: Embedded Finance & Monetização de Alto Impacto**

* **Escopo Detalhado:**
  * Lançamento do Cartão de Crédito Pré-pago Mooney com rendimento diário sobre o saldo depositado.
  * Motor de análise proativa de contratos de empréstimo do usuário via Open Finance.
  * Esteira automatizada para portabilidade de dívidas com refinanciamento a taxas menores.
  * Algoritmo de recomendação de investimentos e troco programado.
* **Alavanca de Valor para o Cliente:**
  * Economia financeira real através do abatimento de juros em dívidas ativas.
  * Rendimento do dinheiro mantido como limite sem perder liquidez.
* **Alavanca de Crescimento para o Negócio:**
  * Diversificação de fontes de receita (*Interchange fees*, comissão por portabilidade de crédito/Corban e *take rate* de investimento).
  * Unidade econômica altamente positiva (Aumento do *LTV* por usuário ativo).

---

## 6. Métricas de Sucesso (KPIs)

```
                                  +------------------------------+
                                  |     METRICAS DE SUCESSO      |
                                  +--------------+---------------+
                                                 |
         +---------------------------------------+---------------------------------------+
         |                                       |                                       |
         v                                       v                                       v
+------------------+                   +------------------+                   +------------------+
|   ENGAJAMENTO    |                   |   EFICIÊNCIA IA  |                   |   MONETIZAÇÃO    |
| - DAU/MAU > 45%  |                   | - Acc. Intenção  |                   | - LTV / CAC > 3x |
| - Retenção D30   |                   |   > 95%          |                   | - Adopção Cartão |
|   > 35%          |                   | - Latência < 2.5s|                   |   > 20%          |
+------------------+                   +------------------+                   +------------------+
```

1. **Engajamento & Retenção:**
   * **Retenção D30:** Mínimo de 35% dos usuários ativos no dia 30 após o download.
   * **Frequência de Uso (DAU/MAU):** Manter proporção superior a 45%.
2. **Eficácia da Inteligência Artificial:**
   * **Acurácia de Classificação e Intenção:** > 95% de assertividade na categorização automática de transações.
   * **Taxa de Correção Manual:** < 5% das transações ajustadas manualmente pelo usuário.
3. **Métricas de Negócio & Monetização:**
   * **Adocao do Cartão Pré-pago (Fase 3):** 20% da base ativa convertida nos primeiros 6 meses do lançamento.
   * **Economia Gerada por Usuário:** R$ médios economizados por mês em portabilidade ou otimização de orçamentos.
   * **LTV / CAC:** Proporção superior a 3,5x na maturidade da Fase 3.