import React from 'react';
import { useAppContext } from '../context/AppContext';
import { DashboardIcon, PagesIcon, ProductIcon, OrdersIcon, SettingsIcon, TemplateIcon } from './Icon';

const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => {
  const { currentPage, setCurrentPage } = useAppContext();
  const isActive = currentPage === to;

  const handleClick = () => {
    setCurrentPage(to);
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-primary/20 text-primary'
          : 'text-gray-400 hover:bg-dark-border hover:text-white'
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </button>
  );
};

const Sidebar: React.FC = () => {
  return (
    <div className="flex flex-col w-64 bg-dark-card border-r border-dark-border p-4">
      <div className="flex items-center mb-8">
        <div className="w-8 h-8 bg-gradient-to-tr from-primary to-secondary rounded-full"></div>
        <h1 className="ml-2 text-xl font-bold text-white">Quantum</h1>
      </div>
      <nav className="flex flex-col space-y-2">
        <NavItem to="/" icon={<DashboardIcon className="w-5 h-5" />} label="Dashboard" />
        <NavItem to="/pages" icon={<PagesIcon className="w-5 h-5" />} label="Pages" />
        <NavItem to="/products" icon={<ProductIcon className="w-5 h-5" />} label="Products" />
        <NavItem to="/orders" icon={<OrdersIcon className="w-5 h-5" />} label="Orders" />
        <NavItem to="/templates" icon={<TemplateIcon className="w-5 h-5" />} label="Templates" />
        <NavItem to="/settings" icon={<SettingsIcon className="w-5 h-5" />} label="Settings" />
      </nav>
    </div>
  );
};

export default Sidebar;
