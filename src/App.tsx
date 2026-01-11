import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardNav from './components/DashboardNav';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-slate-900 text-slate-100">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <DashboardNav />
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;