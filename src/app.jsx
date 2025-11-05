import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

// Pages
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Sales from './pages/Sales.jsx';
import Production from './pages/Production.jsx';
import Dispatch from './pages/Dispatch.jsx';
import RnD from './pages/RnD.jsx';
import Purchase from './pages/Purchase.jsx';
import HR from './pages/HR.jsx';
import Clients from './pages/Clients.jsx';
import Product from './pages/Product.jsx';
import User from './pages/User.jsx';
import Dropdown from './pages/Dropdown.jsx';

// Toaster
import { Toaster } from './components/ui/toaster.jsx';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem('ksev_auth');
      const userData = localStorage.getItem('ksev_user');
      
      if (authStatus === 'true' && userData) {
        setIsAuthenticated(true);
      } else {
        // Clear any invalid auth data
        localStorage.removeItem('ksev_auth');
        localStorage.removeItem('ksev_user');
        localStorage.removeItem('ksev_token');
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('ksev_auth');
    localStorage.removeItem('ksev_user');
    localStorage.removeItem('ksev_token');
    setIsAuthenticated(false);
  };

  // Loading show karein initially
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-sky-500">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>KSEV Admin Panel</title>
        <meta
          name="description"
          content="Professional admin panel for KSEV Company with comprehensive data management, analytics, and reporting capabilities."
        />
      </Helmet>

      {/* ✅ BrowserRouter main.jsx mein hai, yahan se hata diya */}
      <Routes>
        {/* Default route */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? 
            <Navigate to="/dashboard" replace /> : 
            <Navigate to="/login" replace />
          } 
        />
        
        {/* Login route */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
            <Navigate to="/dashboard" replace /> : 
            <Login onLogin={handleLogin} />
          } 
        />
        
        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? 
            <Dashboard onLogout={handleLogout} /> : 
            <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/sales" 
          element={
            isAuthenticated ? 
            <Sales onLogout={handleLogout} /> : 
            <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/production" 
          element={
            isAuthenticated ? 
            <Production onLogout={handleLogout} /> : 
            <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/dispatch" 
          element={
            isAuthenticated ? 
            <Dispatch onLogout={handleLogout} /> : 
            <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/rnd" 
          element={
            isAuthenticated ? 
            <RnD onLogout={handleLogout} /> : 
            <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/purchase" 
          element={
            isAuthenticated ? 
            <Purchase onLogout={handleLogout} /> : 
            <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/hr" 
          element={
            isAuthenticated ? 
            <HR onLogout={handleLogout} /> : 
            <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/clients" 
          element={
            isAuthenticated ? 
            <Clients onLogout={handleLogout} /> : 
            <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/product" 
          element={
            isAuthenticated ? 
            <Product onLogout={handleLogout} /> : 
            <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/user" 
          element={
            isAuthenticated ? 
            <User onLogout={handleLogout} /> : 
            <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/dropdown" 
          element={
            isAuthenticated ? 
            <Dropdown onLogout={handleLogout} /> : 
            <Navigate to="/login" replace />
          } 
        />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      <Toaster />
    </>
  );
}

export default App;