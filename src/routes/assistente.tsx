import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { PhoneFrame } from "@/components/mooney/PhoneFrame";
import { Icon } from "@/components/mooney/icons";
import { useMooneyData } from "@/hooks/use-mooney-data";
import { addTransaction, formatBRL } from "@/lib/mooney-data";
import { askFinancialAgent, getOpenAIKey, setOpenAIKey, transcribeAudio } from "@/lib/openai";

export const Route = createFileRoute("/assistente")({
  head: () => ({
    meta: [
      { title: "Assistente Mooney — Converse sobre suas finanças" },
      {
        name: "description",
        content:
          "Fale com o assistente de voz do Mooney e receba respostas sobre saldo, gastos e previsões do mês.",
      },
      { property: "og:title", content: "Assistente Mooney — Converse sobre suas finanças" },
      {
        property: "og:description",
        content: "Assistente de voz para saldo, gastos e previsões do mês.",
      },
    ],
  }),
  component: Assistant,
});

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

function Assistant() {
  const router = useRouter();
  const data = useMooneyData();

  const [apiKey, setApiKey] = useState("");
  const [keyDraft, setKeyDraft] = useState("");
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [text, setText] = useState("");

  const [recording, setRecording] = useState(false);
  const [busy, setBusy] = useState<false | "transcrevendo" | "pensando">(false);
  const [reply, setReply] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const stored = getOpenAIKey();
    setApiKey(stored);
    setKeyDraft(stored);
  }, []);

  async function runAgent(message: string) {
    if (!message.trim()) return;
    setTranscript(message);
    setBusy("pensando");
    setError(null);
    try {
      const result = await askFinancialAgent(message, data, apiKey);
      if (result.newTransaction) addTransaction(result.newTransaction);
      setReply(result.reply);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro inesperado");
    } finally {
      setBusy(false);
    }
  }

  async function startRecording() {
    if (!apiKey) {
      setShowKeyModal(true);
      return;
    }
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
        setBusy("transcrevendo");
        try {
          const said = await transcribeAudio(blob, apiKey);
          if (!said) {
            setError("Não consegui entender o áudio.");
            setBusy(false);
            return;
          }
          await runAgent(said);
        } catch (e) {
          setError(e instanceof Error ? e.message : "Erro na transcrição");
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

  const answered = Boolean(reply) || Boolean(error) || Boolean(busy);

  return (
    <PhoneFrame>
      {answered ? (
        <div className="flex flex-1 flex-col overflow-y-auto px-6 pt-12">
          {transcript && (
            <p className="mb-4 text-[13px] font-medium text-mooney-black-50">“{transcript}”</p>
          )}
          {busy && (
            <p className="text-[20px] leading-[28px] text-mooney-black-50">
              {busy === "transcrevendo" ? "Transcrevendo seu áudio…" : "Analisando suas finanças…"}
            </p>
          )}
          {!busy && error && (
            <p className="text-[16px] leading-[24px] text-mooney-black">{error}</p>
          )}
          {!busy && !error && reply && (
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
          )}
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <h1 className="text-[32px] font-normal leading-[36px] text-mooney-black">
            Olá, {data.user.name}!
          </h1>
          <p className="mt-2 text-[16px] font-normal text-mooney-black">
            {recording ? "Estou ouvindo… toque para enviar" : "Vamos lá, o Mooney já te ouvindo"}
          </p>
          <button
            type="button"
            onClick={() => setShowKeyModal(true)}
            className="mt-6 text-[12px] font-semibold text-mooney-black-50 underline"
          >
            {apiKey ? "Alterar chave da OpenAI" : "Configurar chave da OpenAI"}
          </button>
        </div>
      )}

      {showTextInput && (
        <form
          className="flex items-center gap-2 px-5 pb-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!apiKey) {
              setShowKeyModal(true);
              return;
            }
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
            if (answered) {
              setReply(null);
              setError(null);
              setTranscript(null);
            } else {
              void router.navigate({ to: "/" });
            }
          }}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-mooney-gray"
        >
          <Icon name="left" size={24} />
        </button>

        <button
          type="button"
          aria-label={recording ? "Parar gravação e enviar" : "Gravar áudio"}
          disabled={Boolean(busy)}
          onClick={() => (recording ? stopRecording() : void startRecording())}
          className={`flex h-12 w-[104px] items-center justify-center rounded-full disabled:opacity-50 ${
            recording ? "bg-mooney-black" : "bg-mooney-green"
          }`}
        >
          {recording ? <Icon name="waveOff" size={32} invert /> : <Waveform active />}
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

      {showKeyModal && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-mooney-black/40 p-4">
          <div className="w-full rounded-[24px] bg-mooney-gray p-5">
            <h2 className="text-[16px] font-semibold text-mooney-black">Chave da OpenAI</h2>
            <p className="mt-1 text-[12px] text-mooney-black-50">
              A chave fica salva apenas no seu navegador (LocalStorage).
            </p>
            <input
              type="password"
              value={keyDraft}
              onChange={(e) => setKeyDraft(e.target.value)}
              placeholder="sk-..."
              className="mt-4 h-12 w-full rounded-full bg-white px-5 text-[14px] text-mooney-black outline-none"
            />
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="h-12 flex-1 rounded-full bg-mooney-black/10 text-[14px] font-semibold text-mooney-black"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpenAIKey(keyDraft);
                  setApiKey(keyDraft.trim());
                  setShowKeyModal(false);
                }}
                className="h-12 flex-1 rounded-full bg-mooney-black text-[14px] font-semibold text-mooney-gray"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </PhoneFrame>
  );
}
