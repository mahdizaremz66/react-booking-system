import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppThemeProvider } from './theme';
import { useSnackbar } from './utils/messageHandler';
import CentralizedSnackbar from './components/CentralizedSnackbar';
import DashboardLayout from './components/DashboardLayout';
import PublicLayout from './components/PublicLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AccountingAccountList from './pages/AccountingAccountList';
import AccountingJournalList from './pages/AccountingJournalList';
import ThemeSettings from './pages/ThemeSettings';
import NotFound from './pages/NotFound';

function AppContent() {
  const { snackbar, hideMessage } = useSnackbar();

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          } />
          <Route path="/login" element={
            <PublicLayout>
              <Login />
            </PublicLayout>
          } />
          <Route path="/register" element={
            <PublicLayout>
              <Register />
            </PublicLayout>
          } />
          <Route path="/dashboard" element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          } />
          <Route path="/accounting/accounts" element={
            <DashboardLayout>
              <AccountingAccountList />
            </DashboardLayout>
          } />
          <Route path="/accounting/journals" element={
            <DashboardLayout>
              <AccountingJournalList />
            </DashboardLayout>
          } />
          <Route path="/settings/theme" element={
            <DashboardLayout>
              <ThemeSettings />
            </DashboardLayout>
          } />
          <Route path="*" element={
            <PublicLayout>
              <NotFound />
            </PublicLayout>
          } />
        </Routes>
      </Router>
      <CentralizedSnackbar snackbar={snackbar} onClose={hideMessage} />
    </>
  );
}

function App() {
  return (
    <AppThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </AppThemeProvider>
  );
}

export default App; 