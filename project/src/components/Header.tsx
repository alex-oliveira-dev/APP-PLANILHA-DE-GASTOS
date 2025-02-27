import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PieChart, TrendingUp, TrendingDown } from 'lucide-react';

const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-yellow-500 text-white' : 'text-gray-700 hover:bg-yellow-100';
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-yellow-500 mr-2">
              <TrendingUp size={28} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Controle Financeiro</h1>
          </div>
        </div>
        <nav className="mt-4">
          <ul className="flex space-x-2">
            <li>
              <Link 
                to="/" 
                className={`flex items-center px-4 py-2 rounded-md ${isActive('/')}`}
              >
                <Home size={18} className="mr-2" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                to="/incomes" 
                className={`flex items-center px-4 py-2 rounded-md ${isActive('/incomes')}`}
              >
                <TrendingUp size={18} className="mr-2" />
                Entradas
              </Link>
            </li>
            <li>
              <Link 
                to="/expenses" 
                className={`flex items-center px-4 py-2 rounded-md ${isActive('/expenses')}`}
              >
                <TrendingDown size={18} className="mr-2" />
                Despesas
              </Link>
            </li>
            <li>
              <Link 
                to="/reports" 
                className={`flex items-center px-4 py-2 rounded-md ${isActive('/reports')}`}
              >
                <PieChart size={18} className="mr-2" />
                Relatórios
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;