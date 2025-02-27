import React, { useState } from 'react';
import { useFinancial } from '../context/FinancialContext';
import { Income } from '../types';
import { Edit, Trash2, Plus } from 'lucide-react';

const IncomeList: React.FC = () => {
  const { financialData, addIncome, updateIncome, deleteIncome, totalIncome } = useFinancial();
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Income, 'id'>>({
    description: '',
    value: 0,
    category: ''
  });

  const handleAddClick = () => {
    setIsAdding(true);
    setFormData({
      description: '',
      value: 0,
      category: ''
    });
  };

  const handleEditClick = (income: Income) => {
    setIsEditing(income.id);
    setFormData({
      description: income.description,
      value: income.value,
      category: income.category
    });
  };

  const handleCancelClick = () => {
    setIsAdding(false);
    setIsEditing(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing) {
      updateIncome({ ...formData, id: isEditing });
      setIsEditing(null);
    } else if (isAdding) {
      addIncome(formData);
      setIsAdding(false);
    }
    
    setFormData({
      description: '',
      value: 0,
      category: ''
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Entradas</h2>
        <button
          onClick={handleAddClick}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus size={18} className="mr-1" />
          Adicionar Entrada
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="p-4 bg-yellow-50 border-b border-yellow-100">
          <p className="font-semibold text-yellow-800">
            Total de Entradas: {formatCurrency(totalIncome)}
          </p>
        </div>

        {(isAdding || isEditing) && (
          <form onSubmit={handleSubmit} className="p-4 bg-gray-50 border-b">
            <h3 className="text-lg font-semibold mb-4">
              {isAdding ? 'Adicionar Nova Entrada' : 'Editar Entrada'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="Salário">Salário</option>
                  <option value="Benefícios">Benefícios</option>
                  <option value="Investimentos">Investimentos</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Outros">Outros</option>
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
                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
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
              {financialData.incomes.map((income) => (
                <tr key={income.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {income.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{income.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600">
                      {formatCurrency(income.value)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditClick(income)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => deleteIncome(income.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {financialData.incomes.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    Nenhuma entrada cadastrada
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

export default IncomeList;