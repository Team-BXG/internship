import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Beneficiaries from './pages/Beneficiaries';
import Problems from './pages/Problems';
import Login from './pages/Login';
import Profile from './pages/Profile';
import DarkModeToggle from './components/DarkModeToggle';

function App() {
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Supplier Portal';
    const saved = localStorage.getItem('supplier_user');
    if (saved) {
      setSupplier(JSON.parse(saved));
    }
    setLoading(false);
  }, []);

  const handleLogin = (data) => {
    setSupplier(data);
  };

  if (loading) return null;

  if (!supplier) {
    return (
      <Router>
        <Toaster position="top-right" />
        <DarkModeToggle />
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Toaster position="top-right" />
      <DarkModeToggle />
      <div className="flex bg-slate-50 min-h-screen font-sans">
        <Sidebar supplier={supplier} />
        <div className="flex-1 ml-64 flex flex-col min-h-screen">
          <Header supplier={supplier} />
          <main className="flex-1 p-8 overflow-y-auto w-full">
            <Routes>
              <Route path="/dashboard" element={<Dashboard supplier={supplier} />} />
              <Route path="/beneficiaries" element={<Beneficiaries supplier={supplier} />} />
              <Route path="/problems" element={<Problems supplier={supplier} />} />
              <Route path="/profile" element={<Profile supplier={supplier} />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
