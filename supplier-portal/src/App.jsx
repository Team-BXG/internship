import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Beneficiaries from './pages/Beneficiaries';
import Problems from './pages/Problems';

// Mock login state for demonstration
// In a real app, this would come from an auth context
const MOCK_SUPPLIER = {
  id: 1,
  name: 'SolarTech Solutions Ltd'
};

function App() {
  const [supplier] = useState(MOCK_SUPPLIER);

  return (
    <Router>
      <Toaster position="top-right" />
      <div className="flex bg-slate-50 min-h-screen font-sans">
        <Sidebar supplier={supplier} />
        <div className="flex-1 ml-64 flex flex-col min-h-screen">
          <Header supplier={supplier} />
          <main className="flex-1 p-8 overflow-y-auto w-full">
            <Routes>
              <Route path="/dashboard" element={<Dashboard supplier={supplier} />} />
              <Route path="/beneficiaries" element={<Beneficiaries supplier={supplier} />} />
              <Route path="/problems" element={<Problems supplier={supplier} />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
