import React from 'react';
import { Bell, Search, User } from 'lucide-react';

const Header = ({ supplier }) => {
  return (
    <header className="bg-white border-b border-slate-200 h-20 flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center text-slate-500 gap-2">
        <span className="text-sm font-medium">Welcome back,</span>
        <span className="text-sm font-bold text-slate-800">{supplier.name}</span>
      </div>
      
      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-slate-200"></div>
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <User className="w-5 h-5" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-bold text-slate-800">{supplier.contact_person || 'Admin'}</p>
            <p className="text-xs text-slate-500">{supplier.email || 'Contact Admin'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
