import type { MooneyData, Transaction } from "./mooney-data";

export const OPENAI_KEY_STORAGE = "mooney_openai_key";

export function getOpenAIKey(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(OPENAI_KEY_STORAGE) ?? "";
}

export function setOpenAIKey(key: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(OPENAI_KEY_STORAGE, key.trim());
}

export const SYSTEM_PROMPT = `Você é o agente de inteligência artificial do Mooney, um assistente de finanças pessoais preciso e amigável.
Analise a solicitação do usuário e o JSON de contexto financeiro fornecido.
Se o usuário solicitar uma consulta (ex: saldo, previsão do mês, gastos ou recomendações), responda de forma direta e amigável.
Se o usuário relatar um novo gasto/despesa (ex: 'gastei 45 reais no almoço' ou 'adicione uma despesa de 120 no mercado'), responda confirmando o registro E retorne um objeto JSON na propriedade 'newTransaction' com { description, amount, category, type: 'expense', date }.
Responda SEMPRE em JSON válido no formato: { "reply": string, "newTransaction": { "description": string, "amount": number, "category": string, "type": "expense", "date": "YYYY-MM-DD" } | null }`;

export async function transcribeAudio(blob: Blob, apiKey: string): Promise<string> {
  const form = new FormData();
  const ext = (blob.type.split(";")[0] || "").includes("mp4") ? "mp4" : "webm";
  form.append("file", blob, `recording.${ext}`);
  form.append("model", "whisper-1");
  form.append("language", "pt");

  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  });
  if (!res.ok) {
    throw new Error(`Falha na transcrição (${res.status}): ${await res.text().catch(() => "")}`);
  }
  const json = (await res.json()) as { text?: string };
  return json.text?.trim() ?? "";
}

export type AgentResult = {
  reply: string;
  newTransaction: Omit<Transaction, "id"> | null;
};

export async function askFinancialAgent(
  message: string,
  data: MooneyData,
  apiKey: string,
): Promise<AgentResult> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Contexto financeiro (mooney_data): ${JSON.stringify(data)}\n\nData de hoje: ${new Date()
            .toISOString()
            .slice(0, 10)}\n\nSolicitação do usuário: ${message}`,
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
}
