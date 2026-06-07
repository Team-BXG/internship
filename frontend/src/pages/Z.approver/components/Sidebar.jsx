import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, AlertTriangle, LogOut, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import logo from '../../../assets/logo.png';

const Sidebar = ({ selectedZone, isCollapsed, setIsCollapsed }) => {
  const location = useLocation();
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
              <span className="text-[9px] uppercase tracking-wider text-slate-400">Zone Approver</span>
            </div>
          )}
        </div>
      </div>

      {!isCollapsed && (
        <div className="px-6 py-4">
          <div className="bg-slate-50 rounded-xl p-3 flex flex-col gap-1 border border-slate-100">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Logged In As</span>
            <span className="text-sm font-bold text-slate-800">Zone Approver</span>
            <span className="text-[10px] bg-blue-100 text-blue-700 w-max px-2 py-0.5 rounded-full font-bold">APPROVER</span>
            <span className="text-[10px] font-semibold text-emerald-700">{selectedZone}</span>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <nav className={`mt-2 ${isCollapsed ? 'px-2' : 'px-4'} space-y-1`}>
          <NavLink to="/zoneA/overview" title={isCollapsed ? "Dashboard" : ""} className={({isActive}) => `flex items-center gap-3 py-3 rounded-xl transition-all font-medium text-sm text-left ${isCollapsed ? 'justify-center px-0' : 'px-4'} ${isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent'}`}>
            <LayoutDashboard className="w-5 h-5 shrink-0" /> {!isCollapsed && "Dashboard"}
          </NavLink>
        </nav>

        <div className="mt-8 px-4">
          {!isCollapsed && <h2 className="text-[10px] font-bold text-slate-400 pl-4 uppercase tracking-wider mb-2">Zone Views</h2>}
          <nav className={`space-y-1 ${isCollapsed ? '-mx-2' : ''}`}>
            <NavLink to="/zoneA/demands" title={isCollapsed ? "Demand Statistics" : ""} className={({isActive}) => `flex items-center gap-3 py-3 rounded-xl transition-all font-medium text-sm text-left ${isCollapsed ? 'justify-center px-0' : 'px-4'} ${isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent'}`}>
              <Zap className="w-5 h-5 shrink-0" /> {!isCollapsed && "Demand Statistics"}
            </NavLink>
            <NavLink to="/zoneA/review-demands" title={isCollapsed ? "Review Demands" : ""} className={({isActive}) => `flex items-center gap-3 py-3 rounded-xl transition-all font-medium text-sm text-left ${isCollapsed ? 'justify-center px-0' : 'px-4'} ${isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent'}`}>
              <CheckSquare className="w-5 h-5 shrink-0" /> {!isCollapsed && "Review Demands"}
            </NavLink>
            <NavLink to="/zoneA/queue" title={isCollapsed ? "Beneficiary View" : ""} className={({isActive}) => `flex items-center gap-3 py-3 rounded-xl transition-all font-medium text-sm text-left ${isCollapsed ? 'justify-center px-0' : 'px-4'} ${isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent'}`}>
              <CheckSquare className="w-5 h-5 shrink-0" /> {!isCollapsed && "Beneficiary View"}
            </NavLink>
            <NavLink to="/zoneA/problems" title={isCollapsed ? "Problem Approval" : ""} className={({isActive}) => `flex items-center gap-3 py-3 rounded-xl transition-all font-medium text-sm text-left ${isCollapsed ? 'justify-center px-0' : 'px-4'} ${isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent'}`}>
              <AlertTriangle className="w-5 h-5 shrink-0" /> {!isCollapsed && "Problem Approval"}
            </NavLink>
          </nav>
        </div>
      </div>

      <div className="p-4 border-t border-slate-100 flex flex-col gap-2">
         <button 
           onClick={() => setIsCollapsed(!isCollapsed)}
           className={`flex items-center gap-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors text-left w-full ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}
         >
            {isCollapsed ? <ChevronRight className="w-5 h-5 shrink-0" /> : <ChevronLeft className="w-5 h-5 shrink-0" />}
            {!isCollapsed && "Collapse"}
         </button>
         <button 
           onClick={handleSignOut}
           title={isCollapsed ? "Sign Out" : ""}
           className={`flex items-center gap-3 py-2 text-sm font-medium text-slate-500 hover:text-red-500 transition-colors text-left w-full ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}
         >
            <LogOut className="w-5 h-5 shrink-0" />
            {!isCollapsed && "Sign Out"}
         </button>
      </div>
    </aside>
  );
};;

export default Sidebar;
