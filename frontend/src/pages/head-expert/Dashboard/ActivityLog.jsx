export default function ActivityLog({ activities }) {
  if (!activities) return null;

  const getStatusColor = (status) => {
    switch(status) {
      case 'SUCCESS': return 'text-green-500 bg-green-50';
      case 'ERROR': return 'text-red-500 bg-red-50';
      case 'INFO': return 'text-blue-500 bg-blue-50';
      default: return 'text-slate-500 bg-slate-50';
    }
  };

  const getInitials = (userStr) => {
    // extract generic initials
    return userStr.substring(0, 1);
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-50 mt-8 mb-12">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <span>⚡</span> Recent System Activity
        </h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs font-bold text-green-500 uppercase">Live</span>
        </div>
      </div>

      <div className="flex flex-col gap-0 divide-y divide-slate-50">
        {activities.map((log, i) => (
          <div key={i} className="py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors px-2 rounded-xl">
             <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-sm">
                 {getInitials(log.user)}
               </div>
               <div>
                 <span className="block text-sm font-bold text-slate-800">{log.user.split(" - ")[0]} <span className="font-medium text-slate-500">- {log.action}</span></span>
                 <span className="text-xs text-slate-400 font-medium">{log.details}</span>
               </div>
             </div>
             
             <div className="text-right flex flex-col items-end gap-1">
               <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${getStatusColor(log.status)}`}>
                 {log.status}
               </span>
               <span className="text-[10px] text-slate-400 font-semibold uppercase">
                 {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
               </span>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
