import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneFrame } from "@/components/mooney/PhoneFrame";
import { Icon } from "@/components/mooney/icons";
import { useMooneyData } from "@/hooks/use-mooney-data";
import { formatBRL } from "@/lib/mooney-data";

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

function Waveform() {
  const bars = [10, 16, 8, 20, 12, 18, 9, 16, 11, 19, 8, 14];
  return (
    <span className="flex h-5 items-center gap-[3px]">
      {bars.map((h, i) => (
        <span
          key={i}
          className="w-[3px] rounded-full bg-mooney-black"
          style={{
            height: h,
            animation: "mooney-wave 1s ease-in-out infinite",
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
  const [answered, setAnswered] = useState(false);

  return (
    <PhoneFrame>
      {answered ? (
        <div className="flex flex-1 flex-col px-6 pt-12">
          <p className="text-[20px] leading-[28px] text-mooney-black">
            Certo, você deve chegar ao final do mês próximo de{" "}
            <strong className="font-semibold">
              R${formatBRL(data.summary.predictedEndMonthBalance)}
            </strong>
            .
          </p>
          <p className="mt-6 text-[20px] leading-[28px] text-mooney-black">
            Gostaria de ver os detalhes em uma tabela?
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
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <h1 className="text-[32px] font-normal leading-[36px] text-mooney-black">
            Olá, {data.user.name}!
          </h1>
          <p className="mt-2 text-[16px] font-normal text-mooney-black">
            Vamos lá, o Mooney já te ouvindo
          </p>
        </div>
      )}

      <div className="flex items-center justify-center gap-3 px-5 pb-8">
        <button
          type="button"
          aria-label="Voltar"
          onClick={() => (answered ? setAnswered(false) : router.navigate({ to: "/" }))}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-mooney-gray"
        >
          <Icon name="left" size={24} />
        </button>

        <button
          type="button"
          aria-label={answered ? "Falar novamente" : "Enviar áudio"}
          onClick={() => setAnswered((v) => !v)}
          className={`flex h-12 w-[104px] items-center justify-center rounded-full ${
            answered ? "bg-mooney-black" : "bg-mooney-green"
          }`}
        >
          {answered ? (
            <Icon name="waveOff" size={32} invert />
          ) : (
            <Waveform />
          )}
        </button>

        <button
          type="button"
          aria-label="Alternar entrada"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-mooney-gray"
        >
          <Icon name="upload" size={24} />
        </button>
      </div>
    </PhoneFrame>
  );
}
