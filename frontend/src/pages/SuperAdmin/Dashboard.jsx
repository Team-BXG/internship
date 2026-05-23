import React, { useState, useEffect } from 'react';
import { Users, Search, Plus, Activity, ExternalLink, ShieldAlert, X, KeyRound, MapPin, Edit2 } from 'lucide-react';

export default function SuperAdminDashboard() {
  const [employees, setEmployees] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [zones, setZones] = useState([]);
  const [woredas, setWoredas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('employees');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showEditEmpModal, setShowEditEmpModal] = useState(false);
  const [showAddZoneModal, setShowAddZoneModal] = useState(false);
  const [showAddWoredaModal, setShowAddWoredaModal] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  
  // Forms state
  const [newEmployee, setNewEmployee] = useState({ username: '', email: '', role: 'Admin', password: '' });
  const [editEmployee, setEditEmployee] = useState({ id: null, username: '', email: '', role: '' });
  const [newPassword, setNewPassword] = useState('');
  const [newZone, setNewZone] = useState({ name: '' });
  const [newWoreda, setNewWoreda] = useState({ name: '', zone_id: '' });
  
  const fetchData = () => {
    fetch('http://localhost:8000/api/employees')
      .then(res => res.json())
      .then(data => setEmployees(data))
      .catch(err => console.error("Error fetching employees:", err));

    fetch('http://localhost:8000/api/locations/zones')
      .then(res => res.json())
      .then(data => setZones(data))
      .catch(err => console.error(err));

    fetch('http://localhost:8000/api/locations/woredas')
      .then(res => res.json())
      .then(data => setWoredas(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchData();
      
    fetch('http://localhost:8000/api/activity_logs')
      .then(res => res.json())
      .then(data => {
        setActivityLogs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching logs:", err);
        setLoading(false);
      });
  }, []);

  const handleAddEmployee = (e) => {
    e.preventDefault();
    fetch('http://localhost:8000/api/employees/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    fetch(`http://localhost:8000/api/employees/${editEmployee.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: editEmployee.username,
        email: editEmployee.email,
        role: editEmployee.role
      })
    })
    .then(res => {
      if(res.ok) {
        setShowEditEmpModal(false);
        fetchData();
        alert("Employee updated successfully!");
      } else {
        alert("Error updating employee");
      }
    });
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    fetch(`http://localhost:8000/api/employees/${selectedEmp.id}/reset-password`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
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

  const handleAddZone = (e) => {
    e.preventDefault();
    fetch('http://localhost:8000/api/locations/zones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newZone)
    })
    .then(res => {
      if(res.ok) {
        setShowAddZoneModal(false);
        setNewZone({ name: '' });
        fetchData();
        alert("Zone added successfully!");
      }
    });
  };

  const handleAddWoreda = (e) => {
    e.preventDefault();
    fetch('http://localhost:8000/api/locations/woredas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newWoreda.name, zone_id: parseInt(newWoreda.zone_id) })
    })
    .then(res => {
      if(res.ok) {
        setShowAddWoredaModal(false);
        setNewWoreda({ name: '', zone_id: '' });
        fetchData();
        alert("Woreda added successfully!");
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col p-8 md:pl-8 relative">
      <header className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Super Admin Console</h1>
          <p className="text-sm text-slate-500">System Management & Security Logs</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors shadow-lg shadow-blue-500/20 font-medium text-sm">
            <Plus className="w-5 h-5" /> Add Employee
          </button>
        </div>
      </header>
      
      {/* Tabs */}
      <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
        <button 
          onClick={() => setActiveTab('employees')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'employees' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
        >
          <Users className="w-4 h-4" /> Employee Directory
        </button>
        <button 
          onClick={() => setActiveTab('locations')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'locations' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
        >
          <MapPin className="w-4 h-4" /> Locations (Zones/Woredas)
        </button>
        <button 
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === 'logs' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
        >
          <Activity className="w-4 h-4" /> Local Audit Logs
        </button>
      </div>
      
      <main className="flex-1">
        {activeTab === 'employees' && (
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
                        {emp.created_at ? new Date(emp.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <button 
                          onClick={() => { setEditEmployee({id: emp.id, username: emp.username, email: emp.email, role: emp.role}); setShowEditEmpModal(true); }}
                          className="flex items-center gap-1 text-slate-500 hover:text-blue-600 font-medium text-sm transition-colors bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button 
                          onClick={() => { setSelectedEmp(emp); setShowResetModal(true); }}
                          className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 font-medium text-sm transition-colors bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm"
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

        {activeTab === 'locations' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-500" /> Zones
                </h2>
                <button 
                  onClick={() => setShowAddZoneModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg shadow-green-500/20 transition-all flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add Zone
                </button>
              </div>
              <ul className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                {zones.map(z => (
                  <li key={z.id} className="p-4 hover:bg-slate-50 flex justify-between items-center">
                    <span className="font-medium text-slate-700">{z.name}</span>
                    <span className="text-xs text-slate-400">ID: {z.id}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-teal-500" /> Woredas
                </h2>
                <button 
                  onClick={() => setShowAddWoredaModal(true)}
                  className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg shadow-teal-500/20 transition-all flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add Woreda
                </button>
              </div>
              <ul className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                {woredas.map(w => {
                  const zone = zones.find(z => z.id === w.zone_id);
                  return (
                    <li key={w.id} className="p-4 hover:bg-slate-50 flex justify-between items-center">
                      <div>
                        <div className="font-medium text-slate-700">{w.name}</div>
                        <div className="text-xs text-slate-500">Zone: {zone?.name || w.zone_id}</div>
                      </div>
                      <span className="text-xs text-slate-400">ID: {w.id}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-500" /> Recent System Activity
              </h2>
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
                    <tr><td colSpan="5" className="text-center py-8 text-slate-400 font-medium">Loading logs...</td></tr>
                  ) : activityLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0">
                      <td className="px-6 py-4 text-slate-500 text-sm whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-800">{log.user}</td>
                      <td className="px-6 py-4 font-semibold text-slate-700">{log.action}</td>
                      <td className="px-6 py-4 text-slate-500 text-sm">{log.details}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          log.status === 'SUCCESS' ? 'bg-green-50 text-green-600' : 
                          log.status === 'ERROR' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
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
        )}
      </main>

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
                  type="text" 
                  required
                  value={newEmployee.username}
                  onChange={e => setNewEmployee({...newEmployee, username: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="e.g. john_doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input 
                  type="email" 
                  required
                  value={newEmployee.email}
                  onChange={e => setNewEmployee({...newEmployee, email: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <select 
                  value={newEmployee.role}
                  onChange={e => setNewEmployee({...newEmployee, role: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
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
                  type="password" 
                  required
                  value={newEmployee.password}
                  onChange={e => setNewEmployee({...newEmployee, password: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="••••••••"
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

      {/* Edit Employee Modal */}
      {showEditEmpModal && editEmployee && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Edit Employee</h3>
              <button onClick={() => setShowEditEmpModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditEmployee} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                <input 
                  type="text" 
                  required
                  value={editEmployee.username}
                  onChange={e => setEditEmployee({...editEmployee, username: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input 
                  type="email" 
                  required
                  value={editEmployee.email}
                  onChange={e => setEditEmployee({...editEmployee, email: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <select 
                  value={editEmployee.role}
                  onChange={e => setEditEmployee({...editEmployee, role: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Head Expert">Head Expert</option>
                  <option value="Zone Expert">Zone Expert</option>
                  <option value="Zone Approver">Zone Approver</option>
                  <option value="Woreda Approver">Woreda Approver</option>
                  <option value="Woreda Encoder">Woreda Encoder</option>
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

      {/* Reset Password Modal */}
      {showResetModal && selectedEmp && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Reset Password</h3>
              <button onClick={() => setShowResetModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleResetPassword} className="p-6 space-y-4">
              <p className="text-sm text-slate-500">
                You are setting a new password for <strong className="text-slate-800">{selectedEmp.username}</strong>.
              </p>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                <input 
                  type="password" 
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <KeyRound className="w-4 h-4" /> Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Zone Modal */}
      {showAddZoneModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Add New Zone</h3>
              <button onClick={() => setShowAddZoneModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddZone} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Zone Name</label>
                <input 
                  type="text" 
                  required
                  value={newZone.name}
                  onChange={e => setNewZone({name: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                  placeholder="e.g. North Gondar"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowAddZoneModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-2 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 shadow-lg shadow-green-500/20 transition-all"
                >
                  Save Zone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Woreda Modal */}
      {showAddWoredaModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Add New Woreda</h3>
              <button onClick={() => setShowAddWoredaModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddWoreda} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Woreda Name</label>
                <input 
                  type="text" 
                  required
                  value={newWoreda.name}
                  onChange={e => setNewWoreda({...newWoreda, name: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
                  placeholder="e.g. Debark"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Parent Zone</label>
                <select 
                  required
                  value={newWoreda.zone_id}
                  onChange={e => setNewWoreda({...newWoreda, zone_id: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-white"
                >
                  <option value="" disabled>Select a Zone</option>
                  {zones.map(z => (
                    <option key={z.id} value={z.id}>{z.name}</option>
                  ))}
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowAddWoredaModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-2 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 shadow-lg shadow-teal-500/20 transition-all"
                >
                  Save Woreda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
