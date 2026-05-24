import React from 'react';
import { Users, FileText, LayoutDashboard, LogOut, ChevronLeft, ChevronRight, Map } from 'lucide-react';
import logo from '../../../assets/logo.png';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ activeMenu, setActiveMenu, selectedZone, isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className={`bg-white border-r border-slate-100 flex flex-col h-screen fixed left-0 top-0 overflow-y-auto z-20 font-sans transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="p-6">
        <div className={`flex items-center gap-3 font-bold text-lg text-blue-600 ${isCollapsed ? 'justify-center' : ''}`}>
          <img src={logo} alt="SEDMS Logo" className="w-10 h-10 object-contain shrink-0" />
          {!isCollapsed && (
            <div className="leading-tight">
              <span className="block text-slate-800">SEDMS</span>
              <span className="text-[9px] uppercase tracking-wider text-slate-400">Zone Expert</span>
            </div>
          )}
        </div>
      </div>

      {!isCollapsed && (
        <div className="px-6 py-4">
          <div className="bg-slate-50 rounded-xl p-3 flex flex-col gap-1 border border-slate-100">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Logged In As</span>
            <span className="text-sm font-bold text-slate-800">Zone Expert</span>
            <span className="text-[10px] bg-blue-100 text-blue-700 w-max px-2 py-0.5 rounded-full font-bold">EXPERT</span>
            <span className="text-[10px] font-semibold text-emerald-700">{selectedZone}</span>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <nav className={`mt-2 flex flex-col gap-1 ${isCollapsed ? 'px-2' : 'px-4'}`}>
          {[
            { id: 'Dashboard', icon: LayoutDashboard },
            { id: 'Agent Management', icon: Users },
            { id: 'Area Assignment', icon: Map },
            { id: 'Zone Beneficiaries', icon: FileText }
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              title={isCollapsed ? item.id : ''}
              className={`flex items-center gap-3 py-3 rounded-xl transition-all font-medium text-sm text-left ${isCollapsed ? 'justify-center px-0' : 'px-4 w-full'} ${activeMenu === item.id ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent'}`}
            >
              <item.icon className="w-5 h-5 shrink-0" /> 
              {!isCollapsed && item.id}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-100 flex flex-col gap-2 mt-auto">
         <button 
           onClick={() => setIsCollapsed(!isCollapsed)}
           className={`flex items-center gap-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors text-left ${isCollapsed ? 'justify-center px-0' : 'px-4 w-full'}`}
         >
            {isCollapsed ? <ChevronRight className="w-5 h-5 shrink-0" /> : <ChevronLeft className="w-5 h-5 shrink-0" />}
            {!isCollapsed && "Collapse"}
         </button>
         <button 
           onClick={handleSignOut}
           title={isCollapsed ? "Sign Out" : ""}
           className={`flex items-center gap-3 py-2 text-sm font-medium text-slate-500 hover:text-red-500 transition-colors text-left ${isCollapsed ? 'justify-center px-0' : 'px-4 w-full'}`}
         >
            <LogOut className="w-5 h-5 shrink-0" />
            {!isCollapsed && "Sign Out"}
         </button>
      </div>
    </aside>
  );
};

export default Sidebar;
