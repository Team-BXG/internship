import { Search, Bell, User } from "lucide-react";

export default function Header() {
   return (
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-10 w-full rounded-tl-[40px] md:pl-8">
         <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
            <span>Main Console</span>
            <span className="mx-1">›</span>
            <span className="text-blue-600 font-bold">Dashboard</span>
         </div>

         <div className="flex items-center gap-6">
            <div className="relative">
               <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
               <input
                  type="text"
                  placeholder="Search resources..."
                  className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-slate-700"
               />
            </div>

            <button className="relative text-slate-400 hover:text-slate-800 transition-colors">
               <Bell className="w-5 h-5" />
               <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="flex items-center gap-3 border-l border-slate-100 pl-6">
               <div className="text-right">
                  <span className="block text-sm font-bold text-slate-800">Dr. Kassahun Tadesse</span>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">HEAD EXPERT</span>
               </div>
               <div className="w-10 h-10 rounded-full border-2 border-slate-100 bg-slate-50 flex items-center justify-center text-slate-400">
                  <User className="w-6 h-6" />
               </div>
            </div>
         </div>
      </header>
   );
}
