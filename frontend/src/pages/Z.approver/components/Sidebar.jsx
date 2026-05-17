import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, AlertTriangle, LogOut, ChevronLeft, Zap } from 'lucide-react';
import logo from '../../../assets/logo.png';

const Sidebar = ({ selectedZone }) => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col h-screen fixed left-0 top-0 overflow-y-auto z-20 font-sans">
      <div className="p-6">
        <div className="flex items-center gap-3 font-bold text-lg text-blue-600">
          <img src={logo} alt="SEDMS Logo" className="w-10 h-10 object-contain" />
          <div className="leading-tight">
            <span className="block text-slate-800">SEDMS</span>
            <span className="text-[9px] uppercase tracking-wider text-slate-400">Zone Approver</span>
          </div>
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="bg-slate-50 rounded-xl p-3 flex flex-col gap-1 border border-slate-100">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Logged In As</span>
          <span className="text-sm font-bold text-slate-800">Zone Approver</span>
          <span className="text-[10px] bg-blue-100 text-blue-700 w-max px-2 py-0.5 rounded-full font-bold">APPROVER</span>
          <span className="text-[10px] font-semibold text-emerald-700">{selectedZone}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <nav className="px-4 space-y-1">
          <NavLink to="/zoneA/overview" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-left ${isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent'}`}>
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </NavLink>
        </nav>

        <div className="mt-8 px-4">
          <h2 className="text-[10px] font-bold text-slate-400 pl-4 uppercase tracking-wider mb-2">Zone Views</h2>
          <nav className="space-y-1">
            <NavLink to="/zoneA/demands" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-left ${isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent'}`}>
              <Zap className="w-4 h-4" /> Demand Statistics
            </NavLink>
            <NavLink to="/zoneA/queue" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-left ${isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent'}`}>
              <CheckSquare className="w-4 h-4" /> Beneficiary View
            </NavLink>
            <NavLink to="/zoneA/problems" className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-left ${isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent'}`}>
              <AlertTriangle className="w-4 h-4" /> Problem Approval
            </NavLink>
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-slate-100 flex flex-col gap-2">
         <button className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors text-left w-full">
            <ChevronLeft className="w-4 h-4" />
            Collapse
         </button>
         <button className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-500 hover:text-red-500 transition-colors text-left w-full">
            <LogOut className="w-4 h-4" />
            Sign Out
         </button>
      </div>
    </aside>
  );
};

export default Sidebar;
