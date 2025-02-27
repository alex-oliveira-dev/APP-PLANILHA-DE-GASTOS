import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FinancialData, Income, Expense } from '../types';
import { initialData } from '../data/initialData';

interface FinancialContextType {
  financialData: FinancialData;
  addIncome: (income: Omit<Income, 'id'>) => void;
  updateIncome: (income: Income) => void;
  deleteIncome: (id: string) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  totalIncome: number;
  totalEssentialExpenses: number;
  totalNonEssentialExpenses: number;
  totalExpenses: number;
  balance: number;
  emergencyFund: number;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export const useFinancial = () => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
};

export const FinancialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [financialData, setFinancialData] = useState<FinancialData>(() => {
    const savedData = localStorage.getItem('financialData');
    return savedData ? JSON.parse(savedData) : initialData;
  });

  useEffect(() => {
    localStorage.setItem('financialData', JSON.stringify(financialData));
  }, [financialData]);

  const addIncome = (income: Omit<Income, 'id'>) => {
    const newIncome = { ...income, id: uuidv4() };
    setFinancialData(prev => ({
      ...prev,
      incomes: [...prev.incomes, newIncome]
    }));
  };

  const updateIncome = (income: Income) => {
    setFinancialData(prev => ({
      ...prev,
      incomes: prev.incomes.map(item => item.id === income.id ? income : item)
    }));
  };

  const deleteIncome = (id: string) => {
    setFinancialData(prev => ({
      ...prev,
      incomes: prev.incomes.filter(item => item.id !== id)
    }));
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = { ...expense, id: uuidv4() };
    setFinancialData(prev => ({
      ...prev,
      expenses: [...prev.expenses, newExpense]
    }));
  };

  const updateExpense = (expense: Expense) => {
    setFinancialData(prev => ({
      ...prev,
      expenses: prev.expenses.map(item => item.id === expense.id ? expense : item)
    }));
  };

  const deleteExpense = (id: string) => {
    setFinancialData(prev => ({
      ...prev,
      expenses: prev.expenses.filter(item => item.id !== id)
    }));
  };

  const totalIncome = financialData.incomes.reduce((sum, item) => sum + item.value, 0);
  
  const totalEssentialExpenses = financialData.expenses
    .filter(expense => expense.category === 'essential')
    .reduce((sum, item) => sum + item.value, 0);
  
  const totalNonEssentialExpenses = financialData.expenses
    .filter(expense => expense.category === 'non-essential')
    .reduce((sum, item) => sum + item.value, 0);
  
  const totalExpenses = totalEssentialExpenses + totalNonEssentialExpenses;
  
  const balance = totalIncome - totalExpenses;
  
  const emergencyFund = balance * 6;

  const value = {
    financialData,
    addIncome,
    updateIncome,
    deleteIncome,
    addExpense,
    updateExpense,
    deleteExpense,
    totalIncome,
    totalEssentialExpenses,
    totalNonEssentialExpenses,
    totalExpenses,
    balance,
    emergencyFund
  };

  return (
    <FinancialContext.Provider value={value}>
      {children}
    </FinancialContext.Provider>
  );
};