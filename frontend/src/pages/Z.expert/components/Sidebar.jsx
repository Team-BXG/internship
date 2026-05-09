import React from 'react';
import { Users, FileText, LayoutDashboard, LogOut, ChevronLeft, Map } from 'lucide-react';
import logo from '../../../assets/logo.png';

const Sidebar = ({ activeMenu, setActiveMenu, selectedZone }) => {
  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col h-screen fixed left-0 top-0 overflow-y-auto z-20 font-sans">
      <div className="p-6">
        <div className="flex items-center gap-3 font-bold text-lg text-blue-600">
          <img src={logo} alt="SEDMS Logo" className="w-10 h-10 object-contain" />
          <div className="leading-tight">
            <span className="block text-slate-800">SEDMS</span>
            <span className="text-[9px] uppercase tracking-wider text-slate-400">Zone Expert</span>
          </div>
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="bg-slate-50 rounded-xl p-3 flex flex-col gap-1 border border-slate-100">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Logged In As</span>
          <span className="text-sm font-bold text-slate-800">Zone Expert</span>
          <span className="text-[10px] bg-blue-100 text-blue-700 w-max px-2 py-0.5 rounded-full font-bold">EXPERT</span>
          <span className="text-[10px] font-semibold text-emerald-700">{selectedZone}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <nav className="px-4 space-y-1 mt-2">
          <button 
            onClick={() => setActiveMenu('Dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-left ${activeMenu === 'Dashboard' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent'}`}
          >
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </button>
          
          <button 
            onClick={() => setActiveMenu('Agent Management')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-left ${activeMenu === 'Agent Management' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent'}`}
          >
            <Users className="w-4 h-4" /> Agent Management
          </button>
          
          <button 
            onClick={() => setActiveMenu('Area Assignment')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-left ${activeMenu === 'Area Assignment' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent'}`}
          >
            <Map className="w-4 h-4" /> Area Assignment
          </button>
          
          <button 
            onClick={() => setActiveMenu('Zone Beneficiaries')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm text-left ${activeMenu === 'Zone Beneficiaries' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent'}`}
          >
             <FileText className="w-4 h-4" /> Zone Beneficiaries
          </button>
        </nav>
      </div>

      <div className="p-4 border-t border-slate-100 flex flex-col gap-2 mt-auto">
         <button className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors text-left">
            <ChevronLeft className="w-4 h-4" />
            Collapse
         </button>
         <button className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-500 hover:text-red-500 transition-colors text-left">
            <LogOut className="w-4 h-4" />
            Sign Out
         </button>
      </div>
    </aside>
  );
};

export default Sidebar;
