import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FinancialProvider } from './context/FinancialContext';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import IncomeList from './components/IncomeList';
import ExpenseList from './components/ExpenseList';
import Reports from './components/Reports';

function App() {
  return (
    <FinancialProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Header />
          <main className="container mx-auto py-6 px-4">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/incomes" element={<IncomeList />} />
              <Route path="/expenses" element={<ExpenseList />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </main>
          <footer className="bg-white shadow-inner py-4">
            <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
              <p>Controle Financeiro - Baseado na planilha Primo Pobre</p>
            </div>
          </footer>
        </div>
      </Router>
    </FinancialProvider>
  );
}

export default App;