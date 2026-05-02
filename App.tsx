import React from 'react';
import { useAppContext } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import ManagePages from './pages/ManagePages';
import ManageProducts from './pages/ManageProducts';
import ManageOrders from './pages/ManageOrders';
import ManageTemplates from './pages/ManageTemplates';
import Settings from './pages/Settings';
import LandingPageView from './pages/LandingPageView';
import NotFound from './pages/NotFound';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex h-screen bg-dark-bg text-gray-200">
    <Sidebar />
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-dark-bg p-4 md:p-6 lg:p-8">
        {children}
      </main>
    </div>
  </div>
);

const App: React.FC = () => {
  const { currentPage } = useAppContext();

  const renderAdminPage = () => {
    switch (currentPage) {
      case '/':
        return <Dashboard />;
      case '/pages':
        return <ManagePages />;
      case '/products':
        return <ManageProducts />;
      case '/orders':
        return <ManageOrders />;
      case '/templates':
        return <ManageTemplates />;
      case '/settings':
        return <Settings />;
      default:
        return <NotFound />;
    }
  };

  if (currentPage === '/page') {
      return <LandingPageView />;
  }

  return (
    <AdminLayout>
      {renderAdminPage()}
    </AdminLayout>
  );
};

export default App;
