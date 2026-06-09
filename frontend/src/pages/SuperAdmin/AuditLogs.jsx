import React, { useState, useEffect } from 'react';
import { Search, Download, Filter, Activity } from 'lucide-react';
export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('All');

  useEffect(() => {
    fetch((import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api/activity_logs')
      .then(res => res.json())
      .then(data => {
        setLogs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching logs:", err);
        setLoading(false);
      });
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = filterAction === 'All' || log.action === filterAction;
    return matchesSearch && matchesAction;
  });

  const uniqueActions = ['All', ...new Set(logs.map(log => log.action))];

  const exportCSV = () => {
    const headers = ['Timestamp', 'User', 'Action', 'Details', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredLogs.map(log => [
        `"${new Date(log.timestamp).toLocaleString()}"`,
        `"${log.user}"`,
        `"${log.action}"`,
        `"${log.details}"`,
        `"${log.status}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'audit_logs.csv';
    link.click();
  };

  ;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Activity className="w-6 h-6 text-indigo-500" /> System Audit Logs
        </h2>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search user or details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 w-full bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
          
          <div className="relative">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
            >
              {uniqueActions.map(action => (
                <option key={action} value={action}>{action}</option>
              ))}
            </select>
          </div>

          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl text-sm font-medium hover:bg-slate-700 transition-colors shadow-lg shadow-slate-200">
            <Download className="w-4 h-4" /> CSV
          </button>
          
          
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider">
              <th className="px-6 py-4 font-bold border-b border-slate-100">Timestamp</th>
              <th className="px-6 py-4 font-bold border-b border-slate-100">User</th>
              <th className="px-6 py-4 font-bold border-b border-slate-100">Action</th>
              <th className="px-6 py-4 font-bold border-b border-slate-100">Details</th>
              <th className="px-6 py-4 font-bold border-b border-slate-100">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="text-center py-12 text-slate-400 font-medium animate-pulse">Loading logs...</td></tr>
            ) : filteredLogs.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-12 text-slate-400 font-medium">No logs found matching your criteria.</td></tr>
            ) : filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0">
                <td className="px-6 py-4 text-slate-500 text-sm whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4 font-medium text-slate-800">{log.user}</td>
                <td className="px-6 py-4">
                  <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-md whitespace-nowrap">
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500 text-sm">{log.details}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    log.status === 'SUCCESS' ? 'bg-green-50 text-green-600 border border-green-200' : 
                    log.status === 'ERROR' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-blue-50 text-blue-600 border border-blue-200'
                  }`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
