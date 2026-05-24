import { LayoutDashboard, Users, Map, Wrench, FileText, UserCog, History, Settings, LogOut, ChevronLeft, Zap } from "lucide-react";
import logo from '../../../../assets/logo.png';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({ activeMenu, setActiveMenu, isCollapsed, setIsCollapsed }) {
  const navigate = useNavigate();
  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Demand Statistics", icon: Zap },
    { name: "Supplier Management", icon: Users },
    { name: "Area Assignment", icon: Map },
    { name: "Contractor Registration", icon: Wrench },
    { name: "Reports", icon: FileText },
    { name: "User Management", icon: UserCog },
    { name: "Audit Logs", icon: History },
    { name: "Settings", icon: Settings },
  ];

  const handleSignOut = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className={`bg-white border-r border-slate-100 flex flex-col h-screen fixed left-0 top-0 overflow-y-auto z-20 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="p-6 flex justify-center">
        <div className={`flex items-center gap-3 font-bold text-lg text-primary ${isCollapsed ? 'justify-center' : ''}`}>
          <img src={logo} alt="SEDMS Logo" className="w-10 h-10 object-contain shrink-0" />
          {!isCollapsed && (
            <div className="leading-tight overflow-hidden whitespace-nowrap">
              <span className="block text-slate-800">SEDMS</span>
              <span className="text-[9px] uppercase tracking-wider text-slate-400">Amhara Water & Energy</span>
            </div>
          )}
        </div>
      </div>

      <div className={`px-4 py-4 ${isCollapsed ? 'hidden' : ''}`}>
        <div className="bg-slate-50 rounded-xl p-3 flex flex-col gap-1 border border-slate-100 whitespace-nowrap overflow-hidden">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Logged In As</span>
          <span className="text-sm font-bold text-slate-800">Dr. Kassahun Tadesse</span>
          <span className="text-[10px] bg-blue-100 text-blue-700 w-max px-2 py-0.5 rounded-full font-bold">HEAD EXPERT</span>
        </div>
      </div>

      <nav className="flex-1 px-4 mt-2 flex flex-col gap-1">
        {menuItems.map((item, i) => (
          <button
            key={i}
            onClick={() => setActiveMenu(item.name)}
            title={isCollapsed ? item.name : undefined}
            className={`flex items-center gap-3 py-3 rounded-xl text-sm font-medium transition-all ${
              isCollapsed ? 'justify-center px-0' : 'px-4'
            } ${
              activeMenu === item.name
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
          </button>
        ))}
      </nav>

      <div className={`p-4 border-t border-slate-100 flex flex-col gap-2 ${isCollapsed ? 'items-center' : ''}`}>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`flex items-center gap-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors ${isCollapsed ? 'justify-center w-full px-0' : 'px-4'}`}
        >
          <ChevronLeft className={`w-5 h-5 shrink-0 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
          {!isCollapsed && "Collapse"}
        </button>
        <button 
          onClick={handleSignOut}
          title={isCollapsed ? "Sign Out" : ""}
          className={`flex items-center gap-3 py-2 text-sm font-medium text-slate-500 hover:text-red-500 transition-colors ${isCollapsed ? 'justify-center w-full px-0' : 'px-4'}`}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!isCollapsed && "Sign Out"}
        </button>
      </div>
    </aside>
  );
}