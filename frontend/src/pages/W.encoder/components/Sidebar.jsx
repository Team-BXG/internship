import { ClipboardList, AlertTriangle, RefreshCw, Bell, ChevronLeft, LogOut, Zap } from "lucide-react";
import logo from '../../../assets/logo.png';

export default function Sidebar({ activeMenu, setActiveMenu, selectedScope }) {
  const menuItems = [
    { name: "Notifications", icon: Bell },
    { name: "Beneficiary Registration", icon: ClipboardList },
    { name: "Demand Registration", icon: Zap },
    { name: "Problem Register", icon: AlertTriangle },
    { name: "Assigned Demands", icon: User },
    { name: "Change Status", icon: RefreshCw },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col h-screen fixed left-0 top-0 overflow-y-auto z-20">
      <div className="p-6">
        <div className="flex items-center gap-3 font-bold text-lg text-primary">
          <img src={logo} alt="SEDMS Logo" className="w-10 h-10 object-contain" />
          <div className="leading-tight">
            <span className="block text-slate-800">SEDMS</span>
            <span className="text-[9px] uppercase tracking-wider text-slate-400">Woreda Encoder</span>
          </div>
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="bg-slate-50 rounded-xl p-3 flex flex-col gap-1 border border-slate-100">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Logged In As</span>
          <span className="text-sm font-bold text-slate-800">Woreda Encoder</span>
          <span className="text-[10px] bg-blue-100 text-blue-700 w-max px-2 py-0.5 rounded-full font-bold">ENCODER</span>
          <span className="text-[10px] font-semibold text-emerald-700">{selectedScope.zone} / {selectedScope.woreda}</span>
        </div>
      </div>

      <nav className="flex-1 px-4 mt-2 flex flex-col gap-1">
        {menuItems.map((item, i) => (
          <button
            key={i}
            onClick={() => setActiveMenu(item.name)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeMenu === item.name 
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.name}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100 flex flex-col gap-2">
         <button className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Collapse
         </button>
         <button className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-500 hover:text-red-500 transition-colors">
            <LogOut className="w-4 h-4" />
            Sign Out
         </button>
      </div>
    </aside>
  );
}
