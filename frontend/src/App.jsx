import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Categories from './pages/Categories';
import Budgets from './pages/Budgets';
import Reports from './pages/Reports';
import Alerts from './pages/Alerts';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import DashboardLayout from './components/DashboardLayout';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
            </Route>
            <Route path="/transactions" element={<ProtectedRoute><DashboardLayout title="Transactions" /></ProtectedRoute>}>
              <Route index element={<Transactions />} />
            </Route>
            <Route path="/categories" element={<ProtectedRoute><DashboardLayout title="Categories" /></ProtectedRoute>}>
              <Route index element={<Categories />} />
            </Route>
            <Route path="/budgets" element={<ProtectedRoute><DashboardLayout title="Budgets" /></ProtectedRoute>}>
              <Route index element={<Budgets />} />
            </Route>
            <Route path="/reports" element={<ProtectedRoute><DashboardLayout title="Reports" /></ProtectedRoute>}>
              <Route index element={<Reports />} />
            </Route>
            <Route path="/alerts" element={<ProtectedRoute><DashboardLayout title="Alerts" /></ProtectedRoute>}>
              <Route index element={<Alerts />} />
            </Route>
            <Route path="/admin" element={<ProtectedRoute><DashboardLayout title="Admin" /></ProtectedRoute>}>
              <Route index element={<Admin />} />
            </Route>
            <Route path="/profile" element={<ProtectedRoute><DashboardLayout title="Profile" /></ProtectedRoute>}>
              <Route index element={<Profile />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
