import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { PhoneFrame } from "@/components/mooney/PhoneFrame";
import { Icon } from "@/components/mooney/icons";
import waveOn from "@/assets/waveOn.svg";
import waveOff from "@/assets/waveOff.svg";
import { useMooneyData } from "@/hooks/use-mooney-data";
import { addTransaction, formatBRL } from "@/lib/mooney-data";
import { askFinancialAgent } from "@/lib/agent";
import { transcribeAudio } from "@/lib/transcription";

export const Route = createFileRoute("/assistente")({
  head: () => ({
    meta: [
      { title: "Assistente Mooney — Converse sobre suas finanças" },
      {
        name: "description",
        content:
          "Fale com o assistente de voz do Mooney e receba respostas sobre saldo, gastos e previsões do mês.",
      },
      { property: "og:title", content: "Mooney — Suas finanças pessoais em um só lugar" },
      {
        property: "og:description",
        content: "Assistente de voz para saldo, gastos e previsões do mês.",
      },
    ],
  }),
  component: Assistant,
});

type AssistantState = "initial" | "listening" | "processing" | "conversation";

function Waveform({ active }: { active?: boolean }) {
  const bars = [10, 16, 8, 20, 12, 18, 9, 16, 11, 19, 8, 14];
  return (
    <span className="flex h-5 items-center gap-[3px]">
      {bars.map((h, i) => (
        <span
          key={i}
          className="w-[3px] rounded-full bg-mooney-black"
          style={{
            height: h,
            animation: active ? "mooney-wave 1s ease-in-out infinite" : undefined,
            animationDelay: `${i * 0.08}s`,
          }}
        />
      ))}
    </span>
  );
}

const STATE_CONTENT: Record<AssistantState, { title: string; caption: string }> = {
  initial: {
    title: "Olá",
    caption: "Toque no botão principal para começar a falar",
  },
  listening: {
    title: "Ouvindo",
    caption: "Toque no botão principal novamente para enviar",
  },
  processing: {
    title: "Aguarde",
    caption: "Estou processando suas informações",
  },
  conversation: {
    title: "",
    caption: "",
  },
};

function Assistant() {
  const router = useRouter();
  const data = useMooneyData();

  const [showTextInput, setShowTextInput] = useState(false);
  const [text, setText] = useState("");

  const [recording, setRecording] = useState(false);
  const [busy, setBusy] = useState(false);
  const [reply, setReply] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const contentState: AssistantState = busy
    ? "processing"
    : reply || error
      ? "conversation"
      : recording
        ? "listening"
        : "initial";

  // O botão segue a gravação mesmo com resposta na tela: gravar de novo
  // dentro da conversa mostra o botão verde animado.
  const buttonState: AssistantState = busy ? "processing" : recording ? "listening" : contentState;

  async function runAgent(message: string) {
    if (!message.trim()) return;
    setTranscript(message);
    setBusy(true);
    setError(null);
    try {
      const result = await askFinancialAgent({ data: { message, data } });
      if (result.newTransaction) addTransaction(result.newTransaction);
      setReply(result.reply);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro inesperado");
    } finally {
      setBusy(false);
    }
  }

  async function startRecording() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
        if (blob.size < 2048) {
          setError("Gravação muito curta. Tente novamente.");
          return;
        }
        setBusy(true);
        try {
          const buffer = await blob.arrayBuffer();
          let binary = "";
          const bytes = new Uint8Array(buffer);
          const chunkSize = 0x8000;
          for (let i = 0; i < bytes.length; i += chunkSize) {
            binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
          }
          const audioBase64 = btoa(binary);
          const said = await transcribeAudio({
            data: { audioBase64, mimeType: blob.type || "audio/webm" },
          });
          if (!said) {
            setError("Não consegui entender o áudio.");
            return;
          }
          await runAgent(said);
        } catch (e) {
          setError(e instanceof Error ? e.message : "Erro na transcrição");
        } finally {
          setBusy(false);
        }
      };
      recorder.start();
      recorderRef.current = recorder;
      setRecording(true);
    } catch {
      setError("Não foi possível acessar o microfone.");
    }
  }

  function stopRecording() {
    recorderRef.current?.stop();
    recorderRef.current = null;
    setRecording(false);
  }

  function resetToInitial() {
    setReply(null);
    setError(null);
    setTranscript(null);
  }

  return (
    <PhoneFrame>
      {contentState === "conversation" ? (
        <div className="flex flex-1 flex-col overflow-y-auto px-6 pt-12">
          {transcript && (
            <p className="mb-4 text-[13px] font-medium text-mooney-black-50">“{transcript}”</p>
          )}
          {error ? (
            <p className="text-[16px] leading-[24px] text-mooney-black">{error}</p>
          ) : (
            reply && (
              <>
                <p className="whitespace-pre-wrap text-[20px] leading-[28px] text-mooney-black">
                  {reply}
                </p>
                <p className="mt-6 text-[13px] font-medium text-mooney-black-50">
                  Saldo atual: R${formatBRL(data.summary.globalBalance)}
                </p>
                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    aria-label="Gostei"
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-mooney-gray"
                  >
                    <Icon name="like" size={12} />
                  </button>
                  <button
                    type="button"
                    aria-label="Não gostei"
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-mooney-gray"
                  >
                    <Icon name="dislike" size={12} />
                  </button>
                </div>
              </>
            )
          )}
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <h1 className="text-[32px] font-normal leading-[36px] text-mooney-black">
            {contentState === "initial"
              ? `Olá, ${data.user.name}!`
              : STATE_CONTENT[contentState].title}
          </h1>
          <p className="mt-2 max-w-[240px] text-[16px] font-normal text-mooney-black">
            {STATE_CONTENT[contentState].caption}
          </p>
        </div>
      )}

      {showTextInput && (
        <form
          className="flex items-center gap-2 px-5 pb-3"
          onSubmit={(e) => {
            e.preventDefault();
            const msg = text;
            setText("");
            void runAgent(msg);
          }}
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Digite sua mensagem"
            className="h-12 flex-1 rounded-full bg-mooney-gray px-5 text-[14px] text-mooney-black outline-none"
          />
          <button
            type="submit"
            disabled={!text.trim() || Boolean(busy)}
            className="h-12 rounded-full bg-mooney-black px-5 text-[14px] font-semibold text-mooney-gray disabled:opacity-40"
          >
            Enviar
          </button>
        </form>
      )}

      <div className="flex items-center justify-center gap-3 px-5 pb-8">
        <button
          type="button"
          aria-label="Voltar"
          onClick={() => {
            void router.navigate({ to: "/" });
          }}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-mooney-gray"
        >
          <Icon name="left" size={24} />
        </button>

        <button
          type="button"
          aria-label={buttonState === "listening" ? "Parar gravação e enviar" : "Gravar áudio"}
          disabled={buttonState === "processing"}
          onClick={() => (recording ? stopRecording() : void startRecording())}
          className={`flex h-12 w-[104px] items-center justify-center rounded-full ${
            buttonState === "listening" ? "bg-mooney-green" : "bg-mooney-black"
          }`}
        >
          {buttonState === "listening" ? (
            <Waveform active />
          ) : (
            <img
              src={buttonState === "processing" ? waveOff : waveOn}
              alt=""
              aria-hidden
              width={74}
              height={20}
            />
          )}
        </button>

        <button
          type="button"
          aria-label="Alternar entrada de texto"
          onClick={() => setShowTextInput((v) => !v)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-mooney-gray"
        >
          <Icon name="upload" size={24} />
        </button>
      </div>
    </PhoneFrame>
  );
}
