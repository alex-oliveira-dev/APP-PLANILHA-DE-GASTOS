import React, { useState } from 'react';
import { useFinancial } from '../context/FinancialContext';
import { PieChart, BarChart, DollarSign } from 'lucide-react';

const Reports: React.FC = () => {
  const { 
    financialData, 
    totalIncome, 
    totalEssentialExpenses, 
    totalNonEssentialExpenses, 
    totalExpenses,
    balance
  } = useFinancial();
  
  const [reportType, setReportType] = useState<'expenses' | 'income'>('expenses');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Group expenses by type
  const expensesByType = financialData.expenses.reduce((acc, expense) => {
    if (!acc[expense.type]) {
      acc[expense.type] = 0;
    }
    acc[expense.type] += expense.value;
    return acc;
  }, {} as Record<string, number>);

  // Group expenses by category
  const expensesByCategory = {
    essential: totalEssentialExpenses,
    nonEssential: totalNonEssentialExpenses
  };

  // Group income by category
  const incomeByCategory = financialData.incomes.reduce((acc, income) => {
    if (!acc[income.category]) {
      acc[income.category] = 0;
    }
    acc[income.category] += income.value;
    return acc;
  }, {} as Record<string, number>);

  // Calculate percentages for expense types
  const expenseTypePercentages = Object.entries(expensesByType).map(([type, value]) => ({
    type,
    value,
    percentage: (value / totalExpenses) * 100
  })).sort((a, b) => b.value - a.value);

  // Calculate percentages for expense categories
  const expenseCategoryPercentages = [
    { 
      category: 'Essencial', 
      value: expensesByCategory.essential,
      percentage: (expensesByCategory.essential / totalExpenses) * 100
    },
    { 
      category: 'Não Essencial', 
      value: expensesByCategory.nonEssential,
      percentage: (expensesByCategory.nonEssential / totalExpenses) * 100
    }
  ];

  // Calculate percentages for income categories
  const incomeCategoryPercentages = Object.entries(incomeByCategory).map(([category, value]) => ({
    category,
    value,
    percentage: (value / totalIncome) * 100
  })).sort((a, b) => b.value - a.value);

  // Generate random colors for charts
  const getColor = (index: number) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 
      'bg-purple-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500',
      'bg-orange-500', 'bg-cyan-500'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Relatórios</h2>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">Resumo Financeiro</h3>
          <div className="flex space-x-2">
            <button
              onClick={() => setReportType('expenses')}
              className={`px-4 py-2 rounded-md ${
                reportType === 'expenses' 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <BarChart size={18} className="inline-block mr-1" />
              Despesas
            </button>
            <button
              onClick={() => setReportType('income')}
              className={`px-4 py-2 rounded-md ${
                reportType === 'income' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <DollarSign size={18} className="inline-block mr-1" />
              Entradas
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chart Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-lg font-medium mb-4">
              {reportType === 'expenses' ? 'Distribuição de Despesas' : 'Distribuição de Entradas'}
            </h4>
            <div className="flex justify-center">
              <div className="relative w-48 h-48">
                <PieChart size={192} className="text-gray-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold">
                    {reportType === 'expenses' ? formatCurrency(totalExpenses) : formatCurrency(totalIncome)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Details Section */}
          <div>
            <h4 className="text-lg font-medium mb-4">
              {reportType === 'expenses' 
                ? 'Detalhamento de Despesas por Categoria' 
                : 'Detalhamento de Entradas por Categoria'}
            </h4>
            
            {reportType === 'expenses' ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  {expenseCategoryPercentages.map((item, index) => (
                    <div key={item.category} className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${getColor(index)} mr-2`}></div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{item.category}</span>
                          <span className="text-sm text-gray-600">
                            {formatCurrency(item.value)} ({item.percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`${getColor(index)} h-2 rounded-full`} 
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <h4 className="text-lg font-medium mt-6 mb-4">Detalhamento por Tipo</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {expenseTypePercentages.map((item, index) => (
                    <div key={item.type} className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${getColor(index + 2)} mr-2`}></div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{item.type}</span>
                          <span className="text-sm text-gray-600">
                            {formatCurrency(item.value)} ({item.percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`${getColor(index + 2)} h-2 rounded-full`} 
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {incomeCategoryPercentages.map((item, index) => (
                  <div key={item.category} className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${getColor(index)} mr-2`}></div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{item.category}</span>
                        <span className="text-sm text-gray-600">
                          {formatCurrency(item.value)} ({item.percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`${getColor(index)} h-2 rounded-full`} 
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Análise Financeira</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-medium mb-3">Indicadores</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Despesas Essenciais / Renda</span>
                  <span className="text-sm font-medium">
                    {totalIncome > 0 ? ((totalEssentialExpenses / totalIncome) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`bg-blue-500 h-2 rounded-full`} 
                    style={{ width: `${totalIncome > 0 ? (totalEssentialExpenses / totalIncome) * 100 : 0}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Recomendado: menos de 50% da renda
                </p>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Despesas Não Essenciais / Renda</span>
                  <span className="text-sm font-medium">
                    {totalIncome > 0 ? ((totalNonEssentialExpenses / totalIncome) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`bg-purple-500 h-2 rounded-full`} 
                    style={{ width: `${totalIncome > 0 ? (totalNonEssentialExpenses / totalIncome) * 100 : 0}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Recomendado: menos de 30% da renda
                </p>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Economia / Renda</span>
                  <span className="text-sm font-medium">
                    {totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`${balance >= 0 ? 'bg-green-500' : 'bg-red-500'} h-2 rounded-full`} 
                    style={{ width: `${totalIncome > 0 ? Math.abs(balance / totalIncome) * 100 : 0}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Recomendado: pelo menos 20% da renda
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-3">Recomendações</h4>
            <ul className="space-y-2 text-sm">
              {totalEssentialExpenses / totalIncome > 0.5 && (
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Suas despesas essenciais estão acima de 50% da sua renda. Considere reduzir gastos com moradia ou renegociar dívidas.</span>
                </li>
              )}
              
              {totalNonEssentialExpenses / totalIncome > 0.3 && (
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Suas despesas não essenciais estão acima de 30% da sua renda. Considere reduzir gastos com lazer, assinaturas e compras não essenciais.</span>
                </li>
              )}
              
              {balance / totalIncome < 0.2 && balance > 0 && (
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  <span>Você está economizando menos de 20% da sua renda. Tente aumentar sua taxa de economia para construir uma reserva de emergência mais robusta.</span>
                </li>
              )}
              
              {balance <= 0 && (
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Você está gastando mais do que ganha. Revise seus gastos e corte despesas não essenciais imediatamente.</span>
                </li>
              )}
              
              {expenseTypePercentages.some(item => item.type === 'Dívidas' && item.percentage > 20) && (
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Seus gastos com dívidas estão muito altos. Considere renegociar ou consolidar suas dívidas.</span>
                </li>
              )}
              
              {balance / totalIncome >= 0.2 && (
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Parabéns! Você está economizando mais de 20% da sua renda. Continue assim e considere investir esse dinheiro.</span>
                </li>
              )}
              
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Lembre-se de manter uma reserva de emergência equivalente a pelo menos 6 meses de despesas.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;