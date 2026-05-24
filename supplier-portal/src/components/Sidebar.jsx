import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, AlertTriangle, LogOut, Package, User } from 'lucide-react';

const Sidebar = ({ supplier }) => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('supplier_user');
    window.location.href = '/login';
  };

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 overflow-y-auto z-20 text-slate-300">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3 font-bold text-lg text-white">
          <Package className="w-8 h-8 text-blue-500" />
          <div className="leading-tight">
            <span className="block text-white">Supplier Portal</span>
            <span className="text-[10px] uppercase tracking-wider text-blue-400">{supplier.name}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mt-6">
        <nav className="px-4 space-y-2">
          <NavLink to="/dashboard" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-left ${isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </NavLink>
          <NavLink to="/beneficiaries" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-left ${isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <Users className="w-5 h-5" /> My Beneficiaries
          </NavLink>
          <NavLink to="/problems" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-left ${isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <AlertTriangle className="w-5 h-5" /> Equipment Issues
          </NavLink>
          <NavLink to="/profile" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-left ${isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <User className="w-5 h-5" /> My Profile
          </NavLink>
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800">
         <button onClick={handleSignOut} className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-400 hover:text-red-400 transition-colors w-full">
            <LogOut className="w-5 h-5" />
            Sign Out
         </button>
      </div>
    </aside>
  );
};

export default Sidebar;
