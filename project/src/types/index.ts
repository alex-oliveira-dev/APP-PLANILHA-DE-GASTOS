export interface Income {
  id: string;
  description: string;
  value: number;
  category: string;
}

export interface Expense {
  id: string;
  description: string;
  value: number;
  category: 'essential' | 'non-essential';
  type: string;
}

export interface FinancialData {
  incomes: Income[];
  expenses: Expense[];
}