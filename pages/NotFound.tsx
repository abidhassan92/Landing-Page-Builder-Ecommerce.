
import React from 'react';
import { useAppContext } from '../context/AppContext';

const NotFound: React.FC = () => {
  const { setCurrentPage } = useAppContext();

  const handleGoHome = () => {
    setCurrentPage('/');
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h1 className="text-9xl font-black text-primary opacity-20">404</h1>
      <h2 className="text-3xl font-bold text-white mt-4">Page Not Found</h2>
      <p className="text-gray-400 mt-2">The page you're looking for doesn't exist or has been moved.</p>
      <button 
        onClick={handleGoHome}
        className="mt-8 px-6 py-2 rounded-md bg-primary text-dark-bg font-bold hover:bg-opacity-80 transition-colors"
      >
        Go to Dashboard
      </button>
    </div>
  );
};

export default NotFound;
