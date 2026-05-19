import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

export function DistributionTrendChart({ data }) {
  if (!data) return null;
  return (
     <div className="lg:col-span-2 group bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 hover:border-slate-200 transition-all duration-400 ease-out">
        <div className="flex justify-between items-start mb-6">
           <div>
              <h3 className="font-bold text-slate-800">Distribution Trend</h3>
              <p className="text-xs text-slate-400 font-medium mt-1">Units distributed & beneficiaries enrolled</p>
           </div>
           <select className="bg-slate-50 border-none rounded-lg text-xs font-semibold px-3 py-2 text-slate-600 focus:outline-none">
              <option>Last 8 Months</option>
           </select>
        </div>
        <div className="h-64 w-full">
           <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                 <defs>
                    <linearGradient id="colorUnits" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                       <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} dy={10} />
                 <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
                 <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} />
                 <Area type="monotone" dataKey="units_distributed" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorUnits)" name="Units Distributed" />
                 <Line type="monotone" dataKey="beneficiaries" stroke="#8b5cf6" strokeWidth={3} dot={false} name="Beneficiaries" />
              </AreaChart>
           </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-4">
           <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div><span className="text-[10px] font-bold text-slate-400 uppercase">Units Distributed</span></div>
           <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-500"></div><span className="text-[10px] font-bold text-slate-400 uppercase">Beneficiaries</span></div>
        </div>
     </div>
  );
}

export function EquipmentTypeChart({ data }) {
  if (!data) return null;
  const COLORS = ['#3b82f6', '#06b6d4', '#6366f1', '#a855f7'];
  
  return (
     <div className="group bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 hover:border-slate-200 transition-all duration-400 ease-out">
        <h3 className="font-bold text-slate-800">Equipment Type</h3>
        <p className="text-xs text-slate-400 font-medium mt-1 mb-6">All equipment types</p>
        
        <div className="h-48 w-full flex justify-center items-center">
           <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                 <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                 >
                    {data.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                    ))}
                 </Pie>
                 <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} />
              </PieChart>
           </ResponsiveContainer>
        </div>
        
        <div className="mt-4 flex flex-col gap-2 px-4">
           {data.map((entry, index) => (
              <div key={index} className="flex items-center justify-between text-xs font-semibold text-slate-600">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    {entry.name}
                 </div>
                 <span className="font-bold text-slate-800">{entry.value}%</span>
              </div>
           ))}
        </div>
     </div>
  );
}

export function BeneficiariesBarChart({ data }) {
  if (!data) return null;
  return (
     <div className="group bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 hover:border-slate-200 transition-all duration-400 ease-out h-full">
        <h3 className="font-bold text-slate-800">Beneficiaries by Zone</h3>
        <p className="text-xs text-slate-400 font-medium mt-1 mb-6">Total enrolled per administrative zone</p>
        
        <div className="h-48 w-full">
           <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barSize={20}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis dataKey="zone" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#94a3b8'}} dy={10} />
                 <YAxis axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#94a3b8'}} />
                 <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} cursor={{fill: '#f8fafc'}} />
                 <Bar dataKey="beneficiaries" fill="#3b82f6" radius={[4, 4, 4, 4]} />
              </BarChart>
           </ResponsiveContainer>
        </div>
     </div>
  );
}

export function SupplierPerformanceChart({ data }) {
  if (!data) return null;
  return (
     <div className="group bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 hover:border-slate-200 transition-all duration-400 ease-out h-full">
        <h3 className="font-bold text-slate-800">Supplier Performance</h3>
        <p className="text-xs text-slate-400 font-medium mt-1 mb-6">Score & units delivered per supplier</p>
        
        <div className="h-48 w-full">
           <ResponsiveContainer width="100%" height="100%" layout="vertical">
              <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }} barSize={12}>
                 <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                 <XAxis type="number" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#94a3b8'}} domain={[0, 100]} />
                 <YAxis dataKey="supplier" type="category" axisLine={false} tickLine={false} tick={{fontSize: 9, fill: '#64748b'}} width={80} />
                 <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} cursor={{fill: '#f8fafc'}} />
                 <Bar dataKey="score" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
           </ResponsiveContainer>
        </div>
     </div>
  );
}

export function FunctionalStatusChart({ data }) {
  if (!data) return null;
  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#64748b'];
  
  return (
     <div className="group bg-white p-6 rounded-[24px] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 hover:border-slate-200 transition-all duration-400 ease-out h-full">
        <h3 className="font-bold text-slate-800">Functional Status Analysis</h3>
        <p className="text-xs text-slate-400 font-medium mt-1 mb-6">System functionality overview</p>
        
        <div className="h-48 w-full flex justify-center items-center">
           <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                 <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius={80}
                    dataKey="value"
                 >
                    {data.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                    ))}
                 </Pie>
                 <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} />
              </PieChart>
           </ResponsiveContainer>
        </div>
        
        <div className="mt-4 flex flex-col gap-2 px-2">
           {data.map((entry, index) => (
              <div key={index} className="flex items-center justify-between text-xs font-semibold text-slate-600">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    {entry.name}
                 </div>
                 <span className="font-bold text-slate-800">{entry.value.toLocaleString()}</span>
              </div>
           ))}
        </div>
     </div>
  );
}
