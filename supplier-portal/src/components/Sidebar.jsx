import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, AlertTriangle, LogOut, Package, User } from 'lucide-react';
import logo from '../assets/logo.png';

const Sidebar = ({ supplier }) => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('supplier_user');
    window.location.href = '/login';
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col h-screen fixed left-0 top-0 overflow-y-auto z-20 text-slate-500">
      <div className="p-6 flex items-center justify-start gap-3 border-b border-slate-100">
        <img src={logo} alt="SEDMS Logo" className="w-10 h-10 object-contain shrink-0" />
        <div className="leading-tight overflow-hidden whitespace-nowrap">
          <span className="block text-slate-800 font-bold text-base">SEDMS</span>
          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-medium">Amhara Water & Energy</span>
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="bg-slate-50 rounded-xl p-3 flex flex-col gap-1 border border-slate-100 whitespace-nowrap overflow-hidden">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Logged In As</span>
          <span className="text-sm font-bold text-slate-800 truncate" title={supplier.name}>{supplier.name}</span>
          <span className="text-[10px] bg-blue-100 text-blue-700 w-max px-2 py-0.5 rounded-full font-bold">SUPPLIER</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <nav className="px-4 space-y-1">
          <NavLink to="/dashboard" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-left ${isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </NavLink>
          <NavLink to="/beneficiaries" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-left ${isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
            <Users className="w-5 h-5" /> My Beneficiaries / Assigned Demands
          </NavLink>
          <NavLink to="/problems" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-left ${isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
            <AlertTriangle className="w-5 h-5" /> Equipment Issues
          </NavLink>
          <NavLink to="/profile" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-left ${isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
            <User className="w-5 h-5" /> My Profile
          </NavLink>
        </nav>
      </div>

      <div className="p-4 border-t border-slate-100">
         <button onClick={handleSignOut} className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-500 hover:text-red-500 transition-colors w-full">
            <LogOut className="w-5 h-5" />
            Sign Out
         </button>
      </div>
    </aside>
  );
};

export default Sidebar;
