import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Package, Shield, Mail, Phone, MapPin, Key, User } from 'lucide-react';

const Profile = ({ supplier }) => {
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    
    try {
      const res = await fetch(`http://localhost:8000/api/auth/supplier/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supplier_id: supplier.id, current_password: passwords.current, new_password: passwords.new })
      });
      if (res.ok) {
        toast.success("Password changed successfully!");
        setPasswords({ current: '', new: '', confirm: '' });
      } else {
        toast.error("Failed to change password. Check your current password.");
      }
    } catch (e) {
      toast.error("Error changing password");
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">My Profile</h2>
        <p className="text-slate-500 mt-1">Manage your supplier account details and security.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10" />
            </div>
            <h3 className="font-bold text-xl text-slate-800">{supplier.name}</h3>
            <p className="text-slate-500 text-sm mt-1">{supplier.company_type || 'Private Limited'}</p>
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold border border-emerald-200">
              <Shield className="w-3 h-3" /> Active Partner
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <h4 className="font-bold text-slate-800 border-b border-slate-100 pb-2">Contact Details</h4>
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-slate-400 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-500">Contact Person</p>
                <p className="text-sm font-medium text-slate-800">{supplier.contact_person || 'Not specified'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-slate-400 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-500">Email Address</p>
                <p className="text-sm font-medium text-slate-800">{supplier.email || 'Not specified'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-slate-400 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-500">Phone Number</p>
                <p className="text-sm font-medium text-slate-800">{supplier.contact_phone || 'Not specified'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-500">Address</p>
                <p className="text-sm font-medium text-slate-800">{supplier.address || 'Not specified'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
              <Key className="w-5 h-5 text-blue-500" /> Change Password
            </h3>
            
            <form onSubmit={handlePasswordChange} className="space-y-6 max-w-md">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Current Password</label>
                <input 
                  type="password" required
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={passwords.current}
                  onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">New Password</label>
                <input 
                  type="password" required minLength="6"
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={passwords.new}
                  onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Confirm New Password</label>
                <input 
                  type="password" required minLength="6"
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                />
              </div>
              
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-md shadow-blue-500/20">
                Update Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
