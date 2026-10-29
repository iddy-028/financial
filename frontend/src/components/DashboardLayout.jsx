import { useState } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/transactions': 'Transactions',
  '/categories': 'Categories',
  '/budgets': 'Budgets',
  '/reports': 'Reports',
  '/profile': 'Profile',
};

export default function DashboardLayout({ title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const pageTitle = title || pageTitles[location.pathname] || 'Dashboard';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-64">
        <Header onMenuClick={() => setSidebarOpen(true)} title={pageTitle} />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
