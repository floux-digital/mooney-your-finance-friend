# Mooney: Your Finance Friend

Atue como um desenvolvedor Frontend Senior especialista em React, Tailwind CSS e TypeScript.
Crie o protótipo mobile do aplicativo de finanças pessoais "Mooney" seguindo estritamente as especificações de design e layout da imagem fornecida.

CONFIGURAÇÕES VISUAIS E TIPOGRAFIA

Fonte Principal: 'Open Sans', sans-serif.

Paleta de Cores (Definir variáveis no Tailwind):

Gray: #E5E5E5

Black: #121212

Green: #4DBEA6

White: #FFFFFF

White-10: rgba(255, 255, 255, 0.1)

Black-50: rgba(0, 0, 0, 0.5)

Layout: Mobile First, container centralizado com cantos arredondados (borderRadius: 32px), fundo externo escuro (#121212) simulando a tela do smartphone.

ESPECIFICAÇÕES DE UI (SEGUIR DIMENSÕES E TOKENS ANEXADOS NA PASTA MOONEY.ZIP)

Home Screen:

Título topo: "Você tem nova recomendação" (Regular, 32px, line-height 36px, align center).

Card Saldo Global: Fundo #E5E5E5, borderRadius: 24px.

Label "Saldo Global R$": SemiBold 13px.

Valor principal: SemiBold 32px.

Subtexto de variação: SemiBold 11px.

Botões de ação topo direita do card: Shape w:40, h:40 com ícone w:24, h:24.

Card Gastos Atuais: Cor de fundo #4DBEA6, texto Medium 14px e Medium 11px.

Card Recomendação: Fundo #E5E5E5, texto Medium 14px/11px com botão preto de ação (Shape w:66, h:58, ícone w:32, h:32).

Bottom Navigation Bar: Botões redondos (Shape w:48, h:48 com ícone w:24, h:24). Botão ativo com pill preta e texto SemiBold 10px.

Assistant Screen (Voice/Chat UI):

Estado de Ouvindo: Título "Olá, Jeff!" (Regular 32px, LH 36px), subtítulo "Vamos lá, o Mooney já te ouvindo" (Regular 16px).

Onda de Áudio / Microfone: Botão central verde #4DBEA6 com animação de forma de onda (waveform). Botão esquerdo voltar (seta), botão direito alternar input.

Tela de Resposta Conversacional: Balão de resposta com texto em Mixed 20px, LH 28px. Botões de feedback (like/dislike - Shape w:24, h:24, Icon w:12, h:12).

PAYLOAD DE DADOS INICIAIS (LOCALSTORAGE)
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

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7bc02b28-1da7-43ea-a410-d18220ffe051).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
