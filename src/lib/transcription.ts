import { createServerFn } from "@tanstack/react-start";

const GROQ_TRANSCRIPTION_URL = "https://api.groq.com/openai/v1/audio/transcriptions";
const GROQ_MODEL = "whisper-large-v3-turbo";

export const transcribeAudio = createServerFn({ method: "POST" })
  .validator((d: { audioBase64: string; mimeType: string }) => {
    if (typeof d?.audioBase64 !== "string" || d.audioBase64.length === 0) {
      throw new Error("Áudio ausente ou inválido.");
    }
    return { audioBase64: d.audioBase64, mimeType: d.mimeType ?? "audio/webm" };
  })
  .handler(async ({ data }) => {
    const apiKey = process.env["GROQ_API_KEY"];
    if (!apiKey) {
      throw new Error("GROQ_API_KEY não configurada no servidor.");
    }

    const binary = atob(data.audioBase64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const file = new Blob([bytes], { type: data.mimeType });

    const form = new FormData();
    form.append("file", file, "audio.webm");
    form.append("model", GROQ_MODEL);
    form.append("language", "pt");
    form.append("response_format", "json");

    const res = await fetch(GROQ_TRANSCRIPTION_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
    });

    if (!res.ok) {
      throw new Error(`Falha na transcrição (${res.status}): ${await res.text().catch(() => "")}`);
    }

    const json = (await res.json()) as { text?: string };
    return json.text?.trim() ?? "";
  });
