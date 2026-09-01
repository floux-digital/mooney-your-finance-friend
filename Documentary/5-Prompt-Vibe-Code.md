
#### **Prompt**

Nosso PRD está bastante robusto, mas para validar questões de uso da solução inApp, precisamos de uma prova de conceito funcional do aplicativo. Para não perdermos tempo, vamos usar o Lovable (vibe coding) como solução para implementar nosso protótipo funcional, onde precisamos garantir a tela inicial (home) e tela de interação com a IA (assistente). 

O protótipo deverá ser parcialmente funcional, lendo e gravando informações em local storage, agente IA funcional, uso de whisper para transcrição dos áudios. 

Devemos incluir um payload em json com dados suficientes para renderizar a interface e proporcionar consulta real de saldo atual, previsão de saldo no mês e insight de economia.  No teste, o usuário também deve conseguir adicoinar depesesas. 

O protótipo deverá fazer os registros de dados solicitados pelo usuário. O design precisa ser identico ao específicado (passaremos as imagens do design para o lovable). 


Tipografia:
- OpenSans

Cores:
- gray: #E5E5E5
- black: #121212
- green: #4DBEA6
- white: #FFFFFF
- white-10: #FFFFFF1A
- black-50: #00000080

Marca e Icones: vou fornecer o SVG no lovable.

Design: vou fornecer uma imagem contendo algumas especs, assim como estou enviando anexo por aqui.

![[Pasted image 20260831233643.png]]


Com isso, forneça um prompt detalhado, incluindo o payload solicitado, para rodarmos uma sessão de desenvolvimento no Lovable. Se necessário, quebre o prompt em sessões. 





#### **Resposta IA**

Para garantir que o Lovable compreenda com precisão os requisitos de design, tipografia, estado e comportamento funcional (incluindo o agente de IA e a captura de áudio via Whisper), vamos estruturar o desenvolvimento em **3 sessões sequenciais de prompts**.

### **Sessão 1: Design System, Layout e Payload Mock no LocalStorage**

Colar o prompt abaixo no Lovable junto com as imagens de especificação visual do aplicativo.

''''
Atue como um desenvolvedor Frontend Senior especialista em React, Tailwind CSS e TypeScript.
Crie o protótipo mobile do aplicativo de finanças pessoais "Mooney" seguindo estritamente as especificações de design e layout da imagem fornecida.

1. CONFIGURAÇÕES VISUAIS E TIPOGRAFIA

- Fonte Principal: 'Open Sans', sans-serif.
- Paleta de Cores (Definir variáveis no Tailwind):
  * Gray: #E5E5E5
  * Black: #121212
  * Green: #4DBEA6
  * White: #FFFFFF
  * White-10: rgba(255, 255, 255, 0.1)
  * Black-50: rgba(0, 0, 0, 0.5)
- Layout: Mobile First, container centralizado com cantos arredondados (borderRadius: 32px), fundo externo escuro (#121212) simulando a tela do smartphone.

2. ESPECIFICAÇÕES DE UI (SEGUIR DIMENSÕES E TOKENS ANEXADOS)
- Home Screen:
  * Título topo: "Você tem nova recomendação" (Regular, 32px, line-height 36px, align center).
  * Card Saldo Global: Fundo #E5E5E5, borderRadius: 24px.
    - Label "Saldo Global R$": SemiBold 13px.
    - Valor principal: SemiBold 32px.
    - Subtexto de variação: SemiBold 11px.
    - Botões de ação topo direita do card: Shape w:40, h:40 com ícone w:24, h:24.
  * Card Gastos Atuais: Cor de fundo #4DBEA6, texto Medium 14px e Medium 11px.
  * Card Recomendação: Fundo #E5E5E5, texto Medium 14px/11px com botão preto de ação (Shape w:66, h:58, ícone w:32, h:32).
  * Bottom Navigation Bar: Botões redondos (Shape w:48, h:48 com ícone w:24, h:24). Botão ativo com pill preta e texto SemiBold 10px.

- Assistant Screen (Voice/Chat UI):
  * Estado de Ouvindo: Título "Olá, Jeff!" (Regular 32px, LH 36px), subtítulo "Vamos lá, o Mooney já te ouvindo" (Regular 16px).
  * Onda de Áudio / Microfone: Botão central verde #4DBEA6 com animação de forma de onda (waveform). Botão esquerdo voltar (seta), botão direito alternar input.
  * Tela de Resposta Conversacional: Balão de resposta com texto em Mixed 20px, LH 28px. Botões de feedback (like/dislike - Shape w:24, h:24, Icon w:12, h:12).

3. PAYLOAD DE DADOS INICIAIS (LOCALSTORAGE)
Ao iniciar a aplicação, se não houver dados no LocalStorage sob a chave 'mooney_data', inicialize com o seguinte JSON:

{
  "user": {
    "name": "Jeff",
    "monthlyGoal": 15000.00
  },
  "summary": {
    "globalBalance": 17482.00,
    "lastMonthComparisonPercent": 23,
    "currentExpenses": 12580.00,
    "budgetLimit": 17482.00,
    "predictedEndMonthBalance": 14200.00,
    "monthlySavingsRecommendation": 96.00
  },
  "recommendation": {
    "title": "Reduza R$ 96 / mês",
    "description": "Identificamos assinaturas duplicadas e tarifas bancárias evitáveis."
  },
  "transactions": [
    { "id": "1", "description": "Supermercado", "amount": 450.00, "type": "expense", "category": "Alimentação", "date": "2026-08-28" },
    { "id": "2", "description": "Restaurante", "amount": 120.00, "type": "expense", "category": "Alimentação", "date": "2026-08-29" },
    { "id": "3", "description": "Posto de Combustível", "amount": 210.00, "type": "expense", "category": "Transporte", "date": "2026-08-30" }
  ]
}

Crie a estrutura básica dos componentes, roteamento entre Home e Assistente, e garanta que a Home leia os valores dinamicamente a partir desse LocalStorage.
''''


### **Sessão 2: Captura de Áudio, Integração OpenAI (Whisper + GPT) e Persistência de Despesas**

Colar o prompt abaixo logo após o Lovable finalizar a primeira etapa.

''''
Agora vamos tornar a tela do Assistente (Voice/Chat) totalmente funcional com IA e persistência de dados no LocalStorage.

1. CAPTURA DE ÁUDIO & TRANSCRIÇÃO (OPENAI WHISPER API)
- Permita que o usuário clique no botão de microfone (waveform) na tela do assistente para iniciar a gravação de áudio do navegador (MediaRecorder API).
- Ao clicar novamente para parar, grave o áudio em Blob e envie para a API do Whisper da OpenAI (`https://api.openai.com/v1/audio/transcriptions`) usando `whisper-1`.
- Exiba um modal ou campo de configuração para que o usuário insira a chave da OpenAI (`OPENAI_API_KEY`) e armazene essa chave de forma segura no LocalStorage.
- Forneça também uma caixa de texto alternativa para digitação manual caso o usuário não queira usar áudio.

2. LÓGICA DO AGENTE FINANCEIRO (OPENAI GPT-4o-mini)
- Mande a transcrição do áudio (ou texto digitado) juntamente com o estado atual do 'mooney_data' do LocalStorage para a API da OpenAI (`https://api.openai.com/v1/chat/completions`).
- O System Prompt da IA deve ser:
  "Você é o agente de inteligência artificial do Mooney, um assistente de finanças pessoais preciso e amigável.
  Analise a solicitação do usuário e o JSON de contexto financeiro fornecido.
  Se o usuário solicitar uma consulta (ex: saldo, previsão do mês, gastos ou recomendações), responda de forma direta e amigável.
  Se o usuário relatar um novo gasto/despesa (ex: 'gastei 45 reais no almoço' ou 'adicione uma despesa de 120 no mercado'), responda confirmando o registro E retorne um objeto JSON na propriedade 'newTransaction' com { description, amount, category, type: 'expense', date }."

3. ATUALIZAÇÃO AUTOMÁTICA DO LOCALSTORAGE
- Se a resposta da IA contiver um 'newTransaction':
  1. Adicione a nova transação no array 'transactions' do LocalStorage.
  2. Subtraia o valor do 'globalBalance' e adicione ao 'currentExpenses'.
  3. Atualize a 'predictedEndMonthBalance'.
  4. Atualize a interface da Home e do Assistente em tempo real.

5. EXIBIÇÃO DA RESPOSTA
- Renderize a resposta da IA no balão de chat da tela do assistente exatamente como no layout (Mixed 20px, LH 28px, com os botões de like/dislike).
 ''''



### **Sessão 3: Refinamento de Interações e Teste de Fluxo Completo**

Colar o prompt abaixo para realizar os ajustes finais e testes do protótipo.

''''
Vamos finalizar o protótipo com os seguintes refinamentos de experiência do usuário:

1. WIDGETS E TABELA DINÂMICA NO CHAT
- Se o usuário perguntar "Gostaria de ver os detalhes em uma tabela?" ou pedir relatórios no chat, renderize uma tabela simplificada dentro da tela do assistente com as últimas transações cadastradas no LocalStorage.
- Adicione um botão "Exportar dados (CSV)" acessível na interface do assistente ou na Home para baixar a lista de transações do LocalStorage.

2. REPETIÇÃO E TESTE DO FLUXO
- Garanta que ao navegar da tela do Assistente de volta para a Home (clicando no botão voltar ou no ícone da Home), os cartões de Saldo Global e Gastos Atuais reflitam imediatamente os novos lançamentos feitos durante a conversa.
- Adicione um botão discreto de "Resetar Protótipo" no rodapé/menu para restaurar o JSON do LocalStorage para o estado inicial de teste.

Verifique todos os espaçamentos, bordas arredondadas e fontes para garantir que o protótipo esteja idêntico às especificações visuais do design.
'''