import React, { useState, useEffect } from 'react';
import { Users, Search, Plus } from 'lucide-react';

export default function SuperAdminDashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/employees')
      .then(res => res.json())
      .then(data => {
        setEmployees(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching employees:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col p-8 md:pl-8">
      <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Super Admin Console</h1>
          <p className="text-sm text-slate-500">Employee Management Interface</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors shadow-lg shadow-blue-500/20 font-medium text-sm">
          <Plus className="w-5 h-5" /> Add Employee
        </button>
      </header>
      
      <main className="flex-1">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" /> Employee Directory
            </h2>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search employees..."
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider">
                  <th className="px-6 py-4 font-bold border-b border-slate-100">Username</th>
                  <th className="px-6 py-4 font-bold border-b border-slate-100">Role</th>
                  <th className="px-6 py-4 font-bold border-b border-slate-100">Email</th>
                  <th className="px-6 py-4 font-bold border-b border-slate-100">Joined</th>
                  <th className="px-6 py-4 font-bold border-b border-slate-100">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="text-center py-8 text-slate-400 font-medium">Loading records...</td></tr>
                ) : employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0 group">
                    <td className="px-6 py-4 font-medium text-slate-800">{emp.username}</td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
                        {emp.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">{emp.email || 'N/A'}</td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {new Date(emp.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-blue-500 font-medium text-sm hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
