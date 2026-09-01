
## Intro

Esse repositório contém a entrega para um exercício de criação de um sistema para organização de finanças pessoais usando vibe coding. 

![Descrição](Documentary/Pasted%20image%2020260831202734.png)


Dado que o exercício original propunha uma direção, mas dava abertura para que os participantes ficassem lives para exercitarem sua criatividade, aceitei o desafio extra e rodei um ciclo acelerado de Disconvery com auxílio do Gemini onde fiz descobertas que ajustaram minha solução final. 

Todo o processo de discovery foi registrado e está disponível nesse documento: 
[Documentary/2-Discovery.md](./Documentary/2-Discovery.md)

Após as descobertas, chegou a hora de recriar a Visão do Produto:
[Documentary/3-Visao-de-Produto.md](./Documentary/3-Visao-de-Produto.md)

E então escrever o PRD, alinhado com a solução repensada, deixando os prompts para vibe coding em documento específico registrado mais abaixo.
[Documentary/4-PRD.md](./Documentary/4-PRD.md)

Os registros com interação de Vibe Coding estão disponíveis em dois documentos:
[Documentary/5-Prompt-Vibe-Code.md](./Documentary/5-Prompt-Vibe-Code.md)
[Documentary/6-Vibe-Coding.md](./Documentary/6-Vibe-Coding.md)



### Resumo da Solução

Mooney um Agente de Organização Financeira  ligado ao OpenFinance e  que permite seus usuários utilizarem voz e texto para solicitar informações de suas contas, criarem registros e contratarem serviços (Cartão de Crédito e Portabilidade de Contratos de Crédito) que além de ajudá-los  na organização e otimização dos gastos , devem servir como principal alavanca de crescimento da empresa . 

Como principal característica técnica da solução, temos a abstração da interface do usuário à partir da oferta de um serviço agnóstico que pode ser cosumido por qualquer meio que aceite texto ou audio como inputs e realize chamadas REST, permitindo integração plena com serviços como Alexa, Gemini, Siri, Claude, ChatGPT e WhatsApp. 

Para atender plenamente o desafio, implementamos uma interface com recursos de Audio e Texto para gestão de uma conta fictícia, cujos dados são instalados na localStorage do client. 

### O que funcionou bem?

- O discovery sem dúvida funcionou muito bem para elaborar melhor o projeto e dar mais robustez a Visão de Produto;

- Gerar uma POC em vez do produto inteiro pareceu uma ótima estratégia para avaliar o sentimento trazido pela interação com o produto e validar isso com usuários;

- Sem integração de MCP com o figma, especificar detalhes do design foi essencial para garantir aderência com a proposta. 

### O que não funcionou como o esperado?

- Os créditos do Lovable acabaram muito rápido, já na segunda interação, sendo necessário seguir com outra ferramenta após publicação de um repositório no github

- Apesar do detalhamento do design, alguns ajustes foram necessários, servindo de aprendizado para uma próxima oportunidade. 

- Quando em localhost, a aplicação funciona bem, mas quando à partir do link no Lovable, aparece um bug no card de saldo que eu não consegui resolver. 


### O que aprendeu sobre conversar com IAs?

Elas fazem o que você pede, então se pedir direito, de forma inteligente, fornecendo detalhes e contexto, o resultado pode ser muito satisfatório. Acredito que um dos segredos esteja em segurar a ansiedade e planejar as interações de forma a construir o contexto adequado para fazer a IA chegar aonde você espera que ela chegue. 


### Instalação e execução

1. Crie uma conta no Groq e gere uma chave de api
2. Forneça sua chave de API para a variavel global  GROQ_API_KEY
3. $ bun install
4. $ bun dev




