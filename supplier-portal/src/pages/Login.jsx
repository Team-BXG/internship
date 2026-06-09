import React, { useState } from 'react';
import { LogIn, User, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

import heroBg from '../assets/hero_uploaded.jpg';
import logo from '../assets/logo.png';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        if (data.role !== 'Supplier') {
          toast.error('Access denied. Only suppliers can log in here.');
          setLoading(false);
          return;
        }
        
        localStorage.setItem('supplier_user', JSON.stringify(data));
        onLogin(data);
      } else {
        toast.error(data.detail || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      toast.error('Unable to connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Blurred overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-lg z-0" />
      
      <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-2xl border border-white/70 rounded-[3rem] shadow-2xl p-8 sm:p-10">
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="Amhara Water & Energy Bureau Logo" className="w-24 h-24 mb-4 object-contain drop-shadow-md rounded-full" />
          <h1 className="text-2xl font-bold text-slate-900 text-center drop-shadow-sm">Amhara Water and Energy Bureau</h1>
          <p className="text-emerald-700 text-sm mt-2 text-center uppercase tracking-widest font-bold drop-shadow-sm">Supplier Portal</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-800 drop-shadow-sm">Supplier Name or Email</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                name="username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-full border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all bg-white/60 text-slate-900 placeholder:text-slate-500 shadow-inner"
                placeholder="Enter your username"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-800 drop-shadow-sm">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-full border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all bg-white/60 text-slate-900 placeholder:text-slate-500 shadow-inner"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-4 rounded-full shadow-[0_0_20px_rgba(5,150,105,0.4)] transition-all flex justify-center items-center gap-2 mt-4 hover:shadow-[0_0_30px_rgba(5,150,105,0.6)] border border-emerald-400/30"
          >
            {loading ? <span className="animate-pulse">Authenticating...</span> : <>Sign In <LogIn className="w-5 h-5" /></>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
