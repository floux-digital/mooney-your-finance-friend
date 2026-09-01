export type Transaction = {
  id: string;
  description: string;
  amount: number;
  type: "expense" | "income";
  category: string;
  date: string;
};

export type MooneyData = {
  user: { name: string; monthlyGoal: number };
  summary: {
    globalBalance: number;
    lastMonthComparisonPercent: number;
    currentExpenses: number;
    budgetLimit: number;
    predictedEndMonthBalance: number;
    monthlySavingsRecommendation: number;
  };
  recommendation: { title: string; description: string };
  transactions: Transaction[];
};

export const MOONEY_STORAGE_KEY = "mooney_data";

export const defaultMooneyData: MooneyData = {
  user: { name: "Jeff", monthlyGoal: 15000.0 },
  summary: {
    globalBalance: 17482.0,
    lastMonthComparisonPercent: 23,
    currentExpenses: 12580.0,
    budgetLimit: 17482.0,
    predictedEndMonthBalance: 14200.0,
    monthlySavingsRecommendation: 96.0,
  },
  recommendation: {
    title: "Reduza R$ 96 / mês",
    description: "Identificamos assinaturas duplicadas e tarifas bancárias evitáveis.",
  },
  transactions: [
    { id: "1", description: "Supermercado", amount: 450.0, type: "expense", category: "Alimentação", date: "2026-08-28" },
    { id: "2", description: "Restaurante", amount: 120.0, type: "expense", category: "Alimentação", date: "2026-08-29" },
    { id: "3", description: "Posto de Combustível", amount: 210.0, type: "expense", category: "Transporte", date: "2026-08-30" },
  ],
};

export function loadMooneyData(): MooneyData {
  if (typeof window === "undefined") return defaultMooneyData;
  try {
    const raw = window.localStorage.getItem(MOONEY_STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(MOONEY_STORAGE_KEY, JSON.stringify(defaultMooneyData));
      return defaultMooneyData;
    }
    return JSON.parse(raw) as MooneyData;
  } catch {
    return defaultMooneyData;
  }
}

export const formatBRL = (value: number) =>
  new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
