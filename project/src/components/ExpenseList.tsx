import React, { useState } from 'react';
import { useFinancial } from '../context/FinancialContext';
import { Expense } from '../types';
import { Edit, Trash2, Plus } from 'lucide-react';

const ExpenseList: React.FC = () => {
  const { 
    financialData, 
    addExpense, 
    updateExpense, 
    deleteExpense, 
    totalEssentialExpenses,
    totalNonEssentialExpenses,
    totalExpenses
  } = useFinancial();
  
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Expense, 'id'>>({
    description: '',
    value: 0,
    category: 'essential',
    type: ''
  });

  const handleAddClick = () => {
    setIsAdding(true);
    setFormData({
      description: '',
      value: 0,
      category: 'essential',
      type: ''
    });
  };

  const handleEditClick = (expense: Expense) => {
    setIsEditing(expense.id);
    setFormData({
      description: expense.description,
      value: expense.value,
      category: expense.category,
      type: expense.type
    });
  };

  const handleCancelClick = () => {
    setIsAdding(false);
    setIsEditing(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing) {
      updateExpense({ ...formData, id: isEditing });
      setIsEditing(null);
    } else if (isAdding) {
      addExpense(formData);
      setIsAdding(false);
    }
    
    setFormData({
      description: '',
      value: 0,
      category: 'essential',
      type: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'value' ? parseFloat(value) || 0 : value
    }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const expenseTypes = [
    'Moradia', 'Alimentação', 'Transporte', 'Saúde', 'Educação', 
    'Lazer', 'Utilidades', 'Impostos', 'Seguros', 'Dívidas', 
    'Investimentos', 'Cuidados Pessoais', 'Pets', 'Comunicação', 
    'Entretenimento', 'Emergências', 'Financeiro', 'Outros'
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Despesas</h2>
        <button
          onClick={handleAddClick}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus size={18} className="mr-1" />
          Adicionar Despesa
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-4 bg-red-50 border-b border-red-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Despesas Essenciais:</p>
              <p className="font-semibold text-red-800">{formatCurrency(totalEssentialExpenses)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Despesas Não Essenciais:</p>
              <p className="font-semibold text-red-800">{formatCurrency(totalNonEssentialExpenses)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total de Despesas:</p>
              <p className="font-semibold text-red-800">{formatCurrency(totalExpenses)}</p>
            </div>
          </div>
        </div>

        {(isAdding || isEditing) && (
          <form onSubmit={handleSubmit} className="p-4 bg-gray-50 border-b">
            <h3 className="text-lg font-semibold mb-4">
              {isAdding ? 'Adicionar Nova Despesa' : 'Editar Despesa'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor (R$)
                </label>
                <input
                  type="number"
                  name="value"
                  value={formData.value}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="essential">Essencial</option>
                  <option value="non-essential">Não Essencial</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                >
                  <option value="">Selecione um tipo</option>
                  {expenseTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={handleCancelClick}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                {isAdding ? 'Adicionar' : 'Salvar'}
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {financialData.expenses.map((expense) => (
                <tr key={expense.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {expense.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{expense.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      expense.category === 'essential' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {expense.category === 'essential' ? 'Essencial' : 'Não Essencial'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-red-600">
                      {formatCurrency(expense.value)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditClick(expense)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => deleteExpense(expense.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {financialData.expenses.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    Nenhuma despesa cadastrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExpenseList;