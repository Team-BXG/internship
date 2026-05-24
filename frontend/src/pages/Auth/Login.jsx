import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, User, Lock, Activity, ShieldAlert, KeyRound, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
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
      const res = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok) {
        if (data.requires_password_change) {
          setTempUserData(data);
          setShowPwdModal(true);
        } else {
          proceedWithLogin(data);
        }
      } else {
        toast.error(data.detail || 'Login failed');
      }
    } catch (err) {
      toast.error('Network error during login');
    } finally {
      setLoading(false);
    }
  };

  const proceedWithLogin = (userData) => {
    toast.success(`Welcome back!`);
    localStorage.setItem('user', JSON.stringify(userData));
    
    switch(userData.role) {
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-blue-600/5 backdrop-blur-3xl z-0" />
      <div className="relative z-10 w-full max-w-5xl grid md:grid-cols-2 bg-white rounded-3xl shadow-xl overflow-hidden min-h-[600px]">
        {/* Left Side */}
        <div className="p-12 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">SEDMS</h1>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Amhara Water & Energy</p>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h2>
          <p className="text-slate-500 mb-8">Please enter your credentials to access your console.</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  name="username"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50/50"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            

            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all flex justify-center items-center gap-2"
            >
              {loading ? <span className="animate-pulse">Authenticating...</span> : <>Sign In <LogIn className="w-5 h-5" /></>}
            </button>
          </form>
        </div>
        
        {/* Right Side */}
        <div className="hidden md:flex bg-gradient-to-br from-blue-600 to-indigo-800 p-12 text-white flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <div className="inline-flex py-1 px-3 rounded-full bg-white/10 border border-white/20 text-xs font-semibold tracking-widest uppercase mb-6">
              Solar Energy Distribution
            </div>
            <h2 className="text-4xl font-bold leading-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
              Empowering communities with renewable energy
            </h2>
            <p className="text-blue-100/80 leading-relaxed max-w-md">
              Securely manage equipment, track statistics, and seamlessly coordinate distribution lines across zones.
            </p>
          </div>
          
          <div className="relative z-10 flex gap-4 backdrop-blur-md bg-white/10 p-6 rounded-2xl border border-white/10">
            <div className="flex-1">
              <div className="text-2xl font-bold">124+</div>
              <div className="text-sm text-blue-200 font-medium">Active Suppliers</div>
            </div>
            <div className="w-px bg-white/20" />
            <div className="flex-1 pl-4">
              <div className="text-2xl font-bold">45.2k</div>
              <div className="text-sm text-blue-200 font-medium">Beneficiaries Reached</div>
            </div>
          </div>
        </div>
      </div>

      {/* Forced Password Change Modal */}
      {showPwdModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
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
