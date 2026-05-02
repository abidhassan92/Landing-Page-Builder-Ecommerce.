
import React from 'react';
import { useAppContext } from '../context/AppContext';

const Header: React.FC = () => {
  const { currentPage } = useAppContext();
  
  const getTitle = () => {
    const path = currentPage;
    if (path === '/') return 'Dashboard';
    const title = path.replace('/', '');
    return title.charAt(0).toUpperCase() + title.slice(1);
  };
  
  return (
    <header className="flex-shrink-0 bg-dark-card border-b border-dark-border px-4 md:px-6 py-4">
      <h2 className="text-2xl font-semibold text-white">{getTitle()}</h2>
    </header>
  );
};

export default Header;
