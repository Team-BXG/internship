import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, Plus, Activity, ExternalLink, ShieldAlert, X, KeyRound, MapPin, Edit2, LayoutDashboard, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import AuditLogs from './AuditLogs';

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [zones, setZones] = useState([]);
  const [woredas, setWoredas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState('overview');

  // Stats for charts
  const [stats, setStats] = useState({ total: 0, active: 0, disabled: 0 });

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showEditEmpModal, setShowEditEmpModal] = useState(false);
  const [showAddZoneModal, setShowAddZoneModal] = useState(false);
  const [showAddWoredaModal, setShowAddWoredaModal] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [showForcedPasswordModal, setShowForcedPasswordModal] = useState(false);
  
  // Forms state
  const [newEmployee, setNewEmployee] = useState({ username: '', email: '', role: 'Admin', password: '' });
  const [editEmployee, setEditEmployee] = useState({ id: null, username: '', email: '', role: '', status: '' });
  const [newPassword, setNewPassword] = useState('');
  const [forcedPasswordData, setForcedPasswordData] = useState({ current: '', new: '', confirm: '' });
  const [newZone, setNewZone] = useState({ name: '' });
  const [newWoreda, setNewWoreda] = useState({ name: '', zone_id: '' });

  const handleSignOut = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };
  
  const fetchData = () => {
    // Note: backend was updated to return { items: [], total: X }
    fetch((import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api/employees')
      .then(res => res.json())
      .then(data => {
        const emps = data.items || [];
        setEmployees(emps);
        const active = emps.filter(e => e.status !== 'Disabled').length;
        setStats({
          total: data.total || emps.length,
          active: active,
          disabled: emps.length - active
        });
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching employees:", err);
        setLoading(false);
      });

    fetch((import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api/locations/zones')
      .then(res => res.json())
      .then(data => setZones(data))
      .catch(err => console.error(err));

    fetch((import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api/locations/woredas')
      .then(res => res.json())
      .then(data => setWoredas(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchData();
    // Simulate login check for forced password change requirement
    const userRequiresPasswordChange = localStorage.getItem('requires_password_change') === 'true';
    if (userRequiresPasswordChange) {
      setShowForcedPasswordModal(true);
    }
  }, []);

  const handleAddEmployee = (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    fetch((import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api/employees/', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-User-Name': user?.username || 'Unknown',
        'X-User-Role': user?.role || 'Unknown'
      },
      body: JSON.stringify(newEmployee)
    })
    .then(res => {
      if(res.ok) {
        setShowAddModal(false);
        setNewEmployee({ username: '', email: '', role: 'Admin', password: '' });
        fetchData();
        alert("Employee added successfully!");
      } else {
        alert("Error adding employee");
      }
    });
  };

  const handleEditEmployee = (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    fetch(`${import.meta.env.VITE_API_URL || (import.meta.env.VITE_API_URL || "http://localhost:8000")}/api/employees/${editEmployee.id}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'X-User-Name': user?.username || 'Unknown',
        'X-User-Role': user?.role || 'Unknown'
      },
      body: JSON.stringify({
        username: editEmployee.username,
        email: editEmployee.email,
        role: editEmployee.role
      })
    })
    .then(res => {
      if(res.ok) {
        // Now update status if needed
        if (editEmployee.status) {
          return fetch(`${import.meta.env.VITE_API_URL || (import.meta.env.VITE_API_URL || "http://localhost:8000")}/api/employees/${editEmployee.id}/status`, {
            method: 'PATCH',
            headers: { 
              'Content-Type': 'application/json',
              'X-User-Name': user?.username || 'Unknown',
              'X-User-Role': user?.role || 'Unknown'
            },
            body: JSON.stringify({ status: editEmployee.status })
          });
        }
      } else {
        throw new Error("Error updating employee details");
      }
    })
    .then(() => {
      setShowEditEmpModal(false);
      fetchData();
      alert("Employee updated successfully!");
    })
    .catch(err => alert(err.message));
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    fetch(`${import.meta.env.VITE_API_URL || (import.meta.env.VITE_API_URL || "http://localhost:8000")}/api/employees/${selectedEmp.id}/reset-password`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'X-User-Name': user?.username || 'Unknown',
        'X-User-Role': user?.role || 'Unknown'
      },
      body: JSON.stringify({ new_password: newPassword })
    })
    .then(res => {
      if(res.ok) {
        setShowResetModal(false);
        setNewPassword('');
        setSelectedEmp(null);
        alert("Password reset successfully!");
      } else {
        alert("Error resetting password");
      }
    });
  };

  const handleForcedPasswordChange = (e) => {
    e.preventDefault();
    if (forcedPasswordData.new !== forcedPasswordData.confirm) {
      alert("Passwords do not match");
      return;
    }
    const empId = localStorage.getItem('emp_id') || 1; // Fallback for dev
    const user = JSON.parse(localStorage.getItem('user'));
    fetch(`${import.meta.env.VITE_API_URL || (import.meta.env.VITE_API_URL || "http://localhost:8000")}/api/employees/${empId}/change-initial-password`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-User-Name': user?.username || 'Unknown',
        'X-User-Role': user?.role || 'Unknown'
      },
      body: JSON.stringify({ new_password: forcedPasswordData.new })
    })
    .then(res => {
      if(res.ok) {
        setShowForcedPasswordModal(false);
        localStorage.setItem('requires_password_change', 'false');
        alert("Password updated successfully!");
      } else {
        alert("Error changing password");
      }
    });
  };

  const handleAddZone = (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    fetch((import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api/locations/zones', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-User-Name': user?.username || 'Unknown',
        'X-User-Role': user?.role || 'Unknown'
      },
      body: JSON.stringify(newZone)
    })
    .then(res => {
      if(res.ok) {
        setShowAddZoneModal(false);
        setNewZone({ name: '' });
        fetchData();
      }
    });
  };

  const handleAddWoreda = (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    fetch((import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api/locations/woredas', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-User-Name': user?.username || 'Unknown',
        'X-User-Role': user?.role || 'Unknown'
      },
      body: JSON.stringify({ name: newWoreda.name, zone_id: parseInt(newWoreda.zone_id) })
    })
    .then(res => {
      if(res.ok) {
        setShowAddWoredaModal(false);
        setNewWoreda({ name: '', zone_id: '' });
        fetchData();
      }
    });
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#6366F1'];
  const pieData = Object.entries(
    employees.reduce((acc, emp) => {
      acc[emp.role] = (acc[emp.role] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value], index) => ({
    name,
    value,
    color: COLORS[index % COLORS.length]
  }));

  const barData = zones.map(zone => ({
    name: zone.name,
    count: woredas.filter(w => w.zone_id === zone.id).length
  }));

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-white border-r border-slate-100 text-slate-500 flex flex-col fixed inset-y-0 z-10 shadow-xl">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-blue-500" /> Enterprise
          </h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-bold">Super Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Overview Dashboard' },
            { id: 'employees', icon: Users, label: 'Employee Directory' },
            { id: 'logs', icon: Activity, label: 'Audit Logs' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeMenu === item.id ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <item.icon className="w-5 h-5" /> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all">
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto relative z-0">
        <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 capitalize">{activeMenu.replace('-', ' ')}</h2>
            <p className="text-sm text-slate-500">Manage your enterprise system configurations.</p>
          </div>
          {activeMenu === 'employees' && (
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-colors shadow-lg shadow-blue-500/30 font-semibold text-sm">
              <Plus className="w-5 h-5" /> Add Employee
            </button>
          )}
        </header>

        {activeMenu === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="bg-blue-100 p-4 rounded-xl text-blue-600"><Users className="w-8 h-8" /></div>
                <div>
                  <p className="text-sm text-slate-500 font-semibold">Total Employees</p>
                  <p className="text-3xl font-black text-slate-800">{stats.total}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="bg-green-100 p-4 rounded-xl text-green-600"><MapPin className="w-8 h-8" /></div>
                <div>
                  <p className="text-sm text-slate-500 font-semibold">Total Zones</p>
                  <p className="text-3xl font-black text-slate-800">{zones.length}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="bg-purple-100 p-4 rounded-xl text-purple-600"><MapPin className="w-8 h-8" /></div>
                <div>
                  <p className="text-sm text-slate-500 font-semibold">Total Woredas</p>
                  <p className="text-3xl font-black text-slate-800">{woredas.length}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Woredas per Zone</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                      <RechartsTooltip cursor={{fill: '#F8FAFC'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                      <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Employee Roles</h3>
                <div className="h-64 flex justify-center items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute text-center">
                    <p className="text-3xl font-black text-slate-800">{stats.total}</p>
                    <p className="text-xs font-semibold text-slate-500">Total</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeMenu === 'employees' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" /> Employee Directory
              </h2>
            </div>
            <div className="overflow-x-auto relative">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider z-10 shadow-sm">
                  <tr>
                    <th className="px-6 py-4 font-bold border-b border-slate-100">Username</th>
                    <th className="px-6 py-4 font-bold border-b border-slate-100">Role</th>
                    <th className="px-6 py-4 font-bold border-b border-slate-100">Status</th>
                    <th className="px-6 py-4 font-bold border-b border-slate-100">Joined</th>
                    <th className="px-6 py-4 font-bold border-b border-slate-100 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr><td colSpan="5" className="text-center py-8 text-slate-400 font-medium">Loading records...</td></tr>
                  ) : employees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800">{emp.username}</div>
                        <div className="text-xs text-slate-500">{emp.email || 'No email provided'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                          {emp.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${emp.status === 'Disabled' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-600 border-green-200'}`}>
                          {emp.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-sm font-medium">
                        {emp.created_at ? new Date(emp.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button 
                          onClick={() => { setEditEmployee({id: emp.id, username: emp.username, email: emp.email, role: emp.role, status: emp.status || 'Active'}); setShowEditEmpModal(true); }}
                          className="inline-flex items-center gap-1 text-slate-600 hover:text-blue-600 font-semibold text-xs transition-colors bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm hover:shadow"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button 
                          onClick={() => { setSelectedEmp(emp); setShowResetModal(true); }}
                          className="inline-flex items-center gap-1 text-slate-600 hover:text-indigo-600 font-semibold text-xs transition-colors bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm hover:shadow"
                        >
                          <KeyRound className="w-3.5 h-3.5" /> Reset
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}



        {activeMenu === 'logs' && <AuditLogs />}
      </main>

      {/* Forced Password Change Modal */}
      {showForcedPasswordModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-200">
            <div className="p-8 pb-6 bg-indigo-600 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <ShieldAlert className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">Security Required</h3>
              <p className="text-indigo-100 text-sm font-medium">Please update your temporary password to secure your account.</p>
            </div>
            <form onSubmit={handleForcedPasswordChange} className="p-8 space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Current Password</label>
                <input 
                  type="password" required
                  value={forcedPasswordData.current}
                  onChange={e => setForcedPasswordData({...forcedPasswordData, current: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">New Password</label>
                <input 
                  type="password" required
                  value={forcedPasswordData.new}
                  onChange={e => setForcedPasswordData({...forcedPasswordData, new: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Confirm New Password</label>
                <input 
                  type="password" required
                  value={forcedPasswordData.confirm}
                  onChange={e => setForcedPasswordData({...forcedPasswordData, confirm: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
              <div className="pt-2">
                <button 
                  type="submit" 
                  className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-xl shadow-indigo-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" /> Secure My Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {showEditEmpModal && editEmployee && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Edit Employee Details</h3>
              <button onClick={() => setShowEditEmpModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditEmployee} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                <input 
                  type="text" required
                  value={editEmployee.username}
                  onChange={e => setEditEmployee({...editEmployee, username: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input 
                  type="email" required
                  value={editEmployee.email || ''}
                  onChange={e => setEditEmployee({...editEmployee, email: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <select 
                  value={editEmployee.role}
                  onChange={e => setEditEmployee({...editEmployee, role: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Head Expert">Head Expert</option>
                  <option value="Zone Expert">Zone Expert</option>
                  <option value="Zone Approver">Zone Approver</option>
                  <option value="Woreda Approver">Woreda Approver</option>
                  <option value="Woreda Encoder">Woreda Encoder</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select 
                  value={editEmployee.status}
                  onChange={e => setEditEmployee({...editEmployee, status: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white font-semibold"
                >
                  <option value="Active" className="text-green-600">Active</option>
                  <option value="Disabled" className="text-red-600">Disabled</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowEditEmpModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Add New Employee</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddEmployee} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                <input 
                  type="text" required
                  value={newEmployee.username}
                  onChange={e => setNewEmployee({...newEmployee, username: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input 
                  type="email" required
                  value={newEmployee.email}
                  onChange={e => setNewEmployee({...newEmployee, email: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <select 
                  value={newEmployee.role}
                  onChange={e => setNewEmployee({...newEmployee, role: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Head Expert">Head Expert</option>
                  <option value="Zone Expert">Zone Expert</option>
                  <option value="Zone Approver">Zone Approver</option>
                  <option value="Woreda Approver">Woreda Approver</option>
                  <option value="Woreda Encoder">Woreda Encoder</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Temporary Password</label>
                <input 
                  type="password" required
                  value={newEmployee.password}
                  onChange={e => setNewEmployee({...newEmployee, password: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all"
                >
                  Create Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetModal && selectedEmp && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Force Password Reset</h3>
              <button onClick={() => setShowResetModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleResetPassword} className="p-6 space-y-4">
              <p className="text-sm text-slate-500 font-medium">
                Set a new temporary password for <strong className="text-slate-800">{selectedEmp.username}</strong>. They will be forced to change it on next login.
              </p>
              <div>
                <input 
                  type="password" required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-center tracking-widest font-mono text-lg"
                  placeholder="••••••••"
                />
              </div>
              <div className="pt-2 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <KeyRound className="w-4 h-4" /> Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
