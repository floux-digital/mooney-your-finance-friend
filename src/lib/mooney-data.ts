export type Transaction = {
  id: string;
  description: string;
  amount: number;
  type: "expense" | "income";
  category: string;
  date: string;
};

export type MooneyData = {
  user: {
    name: string;
    monthlySpentGoal: number;
    globalInitialBalance: number;
    globalBalanceGoal: number
  };
  summary: {
    globalBalance: number;
    lastMonthComparisonPercent: number;
    currentExpenses: number;
    budgetLimit: number;
    predictedEndMonthBalance: number;
    monthlySavingsRecommendation: {
      total: number,
      transationsIds: string[];
    }
  };
  recommendation: { title: string; description: string };
  transactions: Transaction[];
};

export const MOONEY_STORAGE_KEY = "mooney_data";

export const defaultMooneyData: MooneyData = {
  user: {
    name: "Jeff",
    monthlySpentGoal: 9000.0,
    globalInitialBalance: 12595.0,
    globalBalanceGoal: 15600.0
  },
  summary: {
    globalBalance: 18063.43,
    lastMonthComparisonPercent: 23,
    currentExpenses: 6531.57,
    budgetLimit: 9000.0,
    predictedEndMonthBalance: 16100.0,
    monthlySavingsRecommendation: {
      total: 96.0,
      transationsIds: ["5", "11"]
    }
  },
  recommendation: {
    title: "Reduza R$ 96 / mês",
    description: "Algumas assinaturas de streaming poderiam ser canceladas",
  },
  transactions: [
    {
      id: "1",
      description: "Supermercado",
      amount: 850.00,
      type: "expense",
      category: "Alimentação",
      date: "2026-08-28"
    },
    {
      id: "2",
      description: "Restaurante",
      amount: 185.50,
      type: "expense",
      category: "Alimentação",
      date: "2026-08-29"
    },
    {
      id: "3",
      description: "Posto de Combustível",
      amount: 250.00,
      type: "expense",
      category: "Transporte",
      date: "2026-08-30"
    },
    {
      id: "4",
      description: "Salário",
      amount: 12000.00,
      type: "income",
      category: "Salário",
      date: "2026-08-01"
    },
    {
      id: "5",
      description: "Netflix",
      amount: 55.90,
      type: "expense",
      category: "Assinaturas",
      date: "2026-08-05"
    },
    {
      id: "6",
      description: "Aluguel",
      amount: 3200.00,
      type: "expense",
      category: "Moradia",
      date: "2026-08-01"
    },
    {
      id: "7",
      description: "Conta de Luz",
      amount: 245.80,
      type: "expense",
      category: "Moradia",
      date: "2026-08-10"
    },
    {
      id: "8",
      description: "Internet",
      amount: 149.90,
      type: "expense",
      category: "Moradia",
      date: "2026-08-01"
    },
    {
      id: "9",
      description: "Supermercado",
      amount: 620.47,
      type: "expense",
      category: "Alimentação",
      date: "2026-08-15"
    },
    {
      id: "10",
      description: "Amazon Prime",
      amount: 35.00,
      type: "expense",
      category: "Assinaturas",
      date: "2026-08-20"
    },
    {
      id: "11",
      description: "Premiere",
      amount: 40.10,
      type: "expense",
      category: "Assinaturas",
      date: "2026-08-20"
    },
    {
      id: "12",
      description: "Farmácia",
      amount: 168.90,
      type: "expense",
      category: "Saúde",
      date: "2026-08-22"
    },
    {
      id: "13",
      description: "Academia",
      amount: 130.00,
      type: "expense",
      category: "Saúde",
      date: "2026-08-02"
    }
  ],
};

export function getMonthlySpentBalance(data: MooneyData): number {
  return data.user.monthlySpentGoal - data.summary.currentExpenses;
}

export function loadMooneyData(): MooneyData {  if (typeof window === "undefined") return defaultMooneyData;
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

export const MOONEY_UPDATED_EVENT = "mooney_data_updated";

export function saveMooneyData(data: MooneyData) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(MOONEY_STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent(MOONEY_UPDATED_EVENT));
}

export function addTransaction(tx: Omit<Transaction, "id">): MooneyData {
  const current = loadMooneyData();
  const transaction: Transaction = { ...tx, id: `${Date.now()}` };
  const isExpense = tx.type === "expense";
  const delta = isExpense ? -tx.amount : tx.amount;

  const next: MooneyData = {
    ...current,
    summary: {
      ...current.summary,
      globalBalance: current.summary.globalBalance + delta,
      currentExpenses: current.summary.currentExpenses + (isExpense ? tx.amount : 0),
      predictedEndMonthBalance: current.summary.predictedEndMonthBalance + delta,
    },
    transactions: [transaction, ...current.transactions],
  };

  saveMooneyData(next);
  return next;
}
