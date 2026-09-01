import { createServerFn } from "@tanstack/react-start";
import type { MooneyData, Transaction } from "./mooney-data";

const AGENT_URL = "https://api.groq.com/openai/v1/chat/completions";
const AGENT_MODEL = "openai/gpt-oss-120b";

export const SYSTEM_PROMPT = `Você é o agente de inteligência artificial do Mooney, um assistente de finanças pessoais preciso e amigável.Analise a solicitação do usuário e o JSON de contexto financeiro fornecido.
Se o usuário solicitar uma consulta (ex: saldo, previsão do mês, gastos ou recomendações), responda de forma direta e amigável. Se o usuário relatar um novo gasto/despesa (ex: 'gastei 45 reais no almoço' ou 'adicione uma despesa de 120 no mercado'), responda confirmando o registro E retorne um objeto JSON na propriedade 'newTransaction' com { description, amount, category, type: 'expense', date }.
Responda SEMPRE em JSON válido no formato: { "reply": string, "newTransaction": { "description": string, "amount": number, "category": string, "type": "expense", "date": "YYYY-MM-DD" } | null }, onde reply deve ser sempre curto e objetivo, sem perder o tom amigável, não ultrapassando 240 caracteres. Você não inventa dados, apenas trabalha com os dados que lhe são fornecido.`;

export type AgentResult = {
  reply: string;
  newTransaction: Omit<Transaction, "id"> | null;
};

export const askFinancialAgent = createServerFn({ method: "POST" })
  .validator((d: { message: string; data: MooneyData }) => {
    if (typeof d?.message !== "string" || !d.message.trim()) {
      throw new Error("Mensagem vazia.");
    }
    return { message: d.message, data: d.data };
  })
  .handler(async ({ data }): Promise<AgentResult> => {
    const apiKey = process.env["GROQ_API_KEY"];
    if (!apiKey) {
      throw new Error("GROQ_API_KEY não configurada no servidor.");
    }

    const res = await fetch(AGENT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: AGENT_MODEL,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Contexto financeiro (mooney_data): ${JSON.stringify(data.data)}\n\nData de hoje: ${new Date()
              .toISOString()
              .slice(0, 10)}\n\nSolicitação do usuário: ${data.message}`,
          },
        ],
      }),
    });

    if (!res.ok) {
      throw new Error(`Falha no agente (${res.status}): ${await res.text().catch(() => "")}`);
    }

    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const raw = json.choices?.[0]?.message?.content ?? "";

    try {
      const parsed = JSON.parse(raw) as Partial<AgentResult> & Record<string, unknown>;
      const tx = parsed.newTransaction as Omit<Transaction, "id"> | null | undefined;
      return {
        reply: typeof parsed.reply === "string" && parsed.reply ? parsed.reply : raw,
        newTransaction:
          tx && typeof tx.amount === "number" && tx.amount > 0
            ? {
              description: tx.description ?? "Despesa",
              amount: tx.amount,
              category: tx.category ?? "Outros",
              type: "expense",
              date: tx.date ?? new Date().toISOString().slice(0, 10),
            }
            : null,
      };
    } catch {
      return { reply: raw, newTransaction: null };
    }
  });
