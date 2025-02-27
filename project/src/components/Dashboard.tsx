import React from 'react';
import { useFinancial } from '../context/FinancialContext';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { 
    totalIncome, 
    totalEssentialExpenses, 
    totalNonEssentialExpenses, 
    totalExpenses, 
    balance,
    emergencyFund
  } = useFinancial();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-2">
            <TrendingUp className="text-green-500 mr-2" size={24} />
            <h3 className="text-lg font-semibold">Total de Entradas</h3>
          </div>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-2">
            <TrendingDown className="text-red-500 mr-2" size={24} />
            <h3 className="text-lg font-semibold">Total de Despesas</h3>
          </div>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
          <div className="mt-2 text-sm">
            <p>Essenciais: {formatCurrency(totalEssentialExpenses)}</p>
            <p>Não Essenciais: {formatCurrency(totalNonEssentialExpenses)}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-2">
            <div className={`mr-2 ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {balance >= 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
            </div>
            <h3 className="text-lg font-semibold">Saldo Mensal</h3>
          </div>
          <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(balance)}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-2">
            <AlertCircle className="text-yellow-500 mr-2" size={24} />
            <h3 className="text-lg font-semibold">Reserva de Emergência</h3>
          </div>
          <p className="text-2xl font-bold text-yellow-600">{formatCurrency(emergencyFund)}</p>
          <p className="text-sm text-gray-600 mt-1">Ideal (6 meses de saldo)</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4">Resumo Financeiro</h3>
        
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="font-medium">Total de Entradas:</span>
            <span className="font-bold text-green-600">{formatCurrency(totalIncome)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-medium">Total de Despesas Essenciais:</span>
            <span className="font-bold text-red-600">{formatCurrency(totalEssentialExpenses)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-medium">Total de Despesas Não Essenciais:</span>
            <span className="font-bold text-red-600">{formatCurrency(totalNonEssentialExpenses)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t">
            <span className="font-medium">Saldo:</span>
            <span className={`font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(balance)}
            </span>
          </div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-md">
          <p className="font-semibold text-yellow-800 mb-2">
            Se sua planilha estiver correta, todo mês vai te sobrar: {formatCurrency(balance)}
          </p>
          <p className="text-yellow-800">
            Neste cenário, sua reserva de emergência ideal seria no valor de: {formatCurrency(emergencyFund)}
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Dicas Financeiras</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>Mantenha suas despesas essenciais abaixo de 50% da sua renda total.</li>
          <li>Tente economizar pelo menos 20% da sua renda todo mês.</li>
          <li>Evite usar o cartão de crédito para despesas que você não pode pagar à vista.</li>
          <li>Crie uma reserva de emergência equivalente a 6 meses de despesas.</li>
          <li>Peça isenção de tarifas bancárias no seu banco.</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;