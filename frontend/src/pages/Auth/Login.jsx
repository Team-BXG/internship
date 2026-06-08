import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, User, Lock, ShieldAlert, KeyRound, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api';

import heroBg from '../../assets/hero_uploaded.jpg';
import logo from '../../assets/logo.png';

export default function Login() {
  useEffect(() => {
    document.title = 'SEDMS - Login';
  }, []);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Forced Password Change States
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [tempUserData, setTempUserData] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { username, password });
      const data = res.data;

      if (data.requires_password_change) {
        setTempUserData(data);
        setShowPwdModal(true);
      } else {
        proceedWithLogin(data);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        toast.error(err.response.data.detail || 'Login failed');
      } else {
        toast.error('Network error during login');
      }
    } finally {
      setLoading(false);
    }
  };

  const proceedWithLogin = (userData) => {
    toast.success(`Welcome back!`);
    
    // Save tokens if they are provided
    if (userData.access_token) {
      localStorage.setItem('access_token', userData.access_token);
    }
    if (userData.refresh_token) {
      localStorage.setItem('refresh_token', userData.refresh_token);
    }
    
    // Clean up tokens from user object before saving
    const userToSave = { ...userData };
    delete userToSave.access_token;
    delete userToSave.refresh_token;
    delete userToSave.token_type;

    localStorage.setItem('user', JSON.stringify(userToSave));

    switch (userData.role) {
      case 'Woreda Encoder': navigate('/wencoder'); break;
      case 'Woreda Approver': navigate('/wapprover'); break;
      case 'Zone Approver': navigate('/zoneA'); break;
      case 'Zone Expert': navigate('/zoneE'); break;
      case 'Super Admin': navigate('/superadmin'); break;
      case 'Head Expert': navigate('/headexpert'); break;
      default: navigate('/'); break;
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setPwdLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/employees/${tempUserData.id}/change-initial-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ new_password: newPassword })
      });

      if (res.ok) {
        toast.success("Password changed successfully!");
        setShowPwdModal(false);
        // Automatically log them in after changing password
        const updatedData = { ...tempUserData, requires_password_change: false };
        proceedWithLogin(updatedData);
      } else {
        const errData = await res.json();
        toast.error(errData.detail || "Failed to change password");
      }
    } catch (error) {
      toast.error("Network error");
    } finally {
      setPwdLoading(false);
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
          <p className="text-blue-700 text-sm mt-2 text-center uppercase tracking-widest font-bold drop-shadow-sm">System Login</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-800 drop-shadow-sm">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                name="username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-full border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all bg-white/60 text-slate-900 placeholder:text-slate-500 shadow-inner"
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
                className="w-full pl-12 pr-4 py-3.5 rounded-full border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all bg-white/60 text-slate-900 placeholder:text-slate-500 shadow-inner"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-4 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all flex justify-center items-center gap-2 mt-4 hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] border border-blue-400/30"
          >
            {loading ? <span className="animate-pulse">Authenticating...</span> : <>Sign In <LogIn className="w-5 h-5" /></>}
          </button>
        </form>
      </div>

      {/* Forced Password Change Modal */}
      {showPwdModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-8 pb-6 bg-red-50/50 border-b border-red-100 text-center relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-100 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-orange-100 rounded-full blur-2xl" />
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-red-100 flex items-center justify-center mb-4">
                  <ShieldAlert className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Security Requirement</h3>
                <p className="text-sm text-slate-600 mt-2 max-w-[280px]">
                  You are using a temporary password. For security reasons, you must change it before accessing the system.
                </p>
              </div>
            </div>
            <form onSubmit={handleChangePassword} className="p-8 space-y-5 bg-white">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">New Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50"
                    placeholder="At least 8 characters"
                  />
                </div>
                {newPassword.length > 0 && newPassword.length < 8 && (
                  <p className="text-xs text-red-500 pl-1">Password must be at least 8 characters</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Confirm Password</label>
                <div className="relative">
                  <Check className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50"
                    placeholder="Match new password"
                  />
                </div>
                {confirmPassword.length > 0 && confirmPassword !== newPassword && (
                  <p className="text-xs text-red-500 pl-1">Passwords do not match</p>
                )}
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={pwdLoading}
                  className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-slate-900/20 transition-all disabled:opacity-50"
                >
                  {pwdLoading ? "Updating Securely..." : "Update Password & Login"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPwdModal(false)}
                  className="w-full mt-3 py-2 text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors"
                >
                  Cancel & Return to Login
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
