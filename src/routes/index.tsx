import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/mooney/PhoneFrame";
import { BottomNav } from "@/components/mooney/BottomNav";
import { Icon } from "@/components/mooney/icons";
import { useMooneyData } from "@/hooks/use-mooney-data";
import { formatBRL } from "@/lib/mooney-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mooney — Suas finanças pessoais em um só lugar" },
      {
        name: "description",
        content:
          "Acompanhe seu saldo global, gastos do mês e recomendações inteligentes de economia com o Mooney.",
      },
      { property: "og:title", content: "Mooney — Suas finanças pessoais em um só lugar" },
      {
        property: "og:description",
        content: "Saldo global, gastos do mês e recomendações inteligentes de economia.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const data = useMooneyData();
  const { summary, recommendation } = data;
  const usage = Math.round((summary.currentExpenses / summary.budgetLimit) * 100);

  return (
    <PhoneFrame>
      <div className="flex flex-1 flex-col px-5 pt-14">
        <h1 className="text-center text-[32px] font-normal leading-[36px] text-mooney-black">
          Você tem nova recomendação
        </h1>

        <div className="mt-auto flex flex-col gap-2 pb-2">
          <section className="rounded-[24px] bg-mooney-gray p-5">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-[13px] font-semibold text-mooney-black">Saldo Global R$</h2>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  aria-label="Compartilhar"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-mooney-black/10"
                >
                  <Icon name="split" size={24} />
                </button>
                <button
                  type="button"
                  aria-label="Ocultar saldo"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-mooney-black/10"
                >
                  <Icon name="hide" size={24} />
                </button>
              </div>
            </div>
            <p className="mt-10 text-right text-[32px] font-semibold text-mooney-black">
              {formatBRL(summary.globalBalance)}
            </p>
            <p className="text-right text-[11px] font-semibold text-mooney-black-50">
              + {summary.lastMonthComparisonPercent}% / mês passado
            </p>
          </section>

          <section className="flex items-stretch gap-2">
            <div className="flex-1 rounded-full bg-mooney-green px-5 py-3">
              <p className="text-[14px] font-medium text-mooney-black">Gastos Atuais</p>
              <p className="text-[11px] font-medium text-mooney-black-50">Agosto/2026</p>
            </div>
            <div className="flex items-center rounded-full bg-mooney-gray px-6">
              <span className="text-[14px] font-medium text-mooney-black">{usage}%</span>
            </div>
          </section>

          <section className="flex items-center justify-between gap-3 rounded-[24px] bg-mooney-gray py-2 pl-5 pr-2">
            <div className="min-w-0">
              <p className="truncate text-[14px] font-medium text-mooney-black">Recomendação</p>
              <p className="truncate text-[11px] font-medium text-mooney-black-50">
                {recommendation.title}
              </p>
            </div>
            <Link
              to="/assistente"
              aria-label="Ver recomendação"
              className="flex h-[58px] w-[66px] shrink-0 items-center justify-center rounded-[20px] bg-mooney-black"
            >
              <Icon name="novo" size={32} invert />
            </Link>
          </section>
        </div>
      </div>

      <BottomNav active="inicio" />
    </PhoneFrame>
  );
}
