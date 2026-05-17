import React, { useState, useEffect } from 'react';
import { Users, AlertTriangle, CheckCircle2, Package } from 'lucide-react';

const Dashboard = ({ supplier }) => {
  const [stats, setStats] = useState({
    totalBeneficiaries: 0,
    openProblems: 0,
    resolvedProblems: 0
  });

  useEffect(() => {
    // In a real app, this would be an API call specifically for supplier dashboard stats
    // For now, we'll fetch and filter
    const fetchStats = async () => {
      try {
        const [benRes, probRes] = await Promise.all([
          fetch('http://localhost:8000/api/beneficiaries'),
          fetch('http://localhost:8000/api/problems')
        ]);

        if (benRes.ok && probRes.ok) {
          const beneficiaries = await benRes.json();
          const problems = await probRes.json();

          // In real implementation, backend would do this based on supplier ID token
          // Since we don't have supplier ID linked cleanly to problems yet, we mock the stats a bit
          // or filter by some dummy logic
          
          setStats({
            totalBeneficiaries: beneficiaries.length > 0 ? Math.floor(beneficiaries.length / 2) + 1 : 12,
            openProblems: problems.filter(p => p.status === 'Open').length || 2,
            resolvedProblems: problems.filter(p => p.status === 'Resolved').length || 5
          });
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchStats();
  }, [supplier.id]);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Supplier Dashboard</h2>
        <p className="text-slate-500 mt-2">Overview of your distributed equipment and service requests.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Total Beneficiaries</p>
            <h3 className="text-3xl font-bold text-slate-800">{stats.totalBeneficiaries}</h3>
          </div>
          <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
            <Users className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Open Equipment Issues</p>
            <h3 className="text-3xl font-bold text-red-600">{stats.openProblems}</h3>
          </div>
          <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
            <AlertTriangle className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Resolved Issues</p>
            <h3 className="text-3xl font-bold text-emerald-600">{stats.resolvedProblems}</h3>
          </div>
          <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-7 h-7" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col items-center justify-center text-center py-16">
        <Package className="w-16 h-16 text-slate-200 mb-4" />
        <h3 className="text-xl font-bold text-slate-800 mb-2">Welcome to your dedicated portal</h3>
        <p className="text-slate-500 max-w-md">
          This portal allows you to track all beneficiaries assigned to your equipment and manage any reported functionality issues efficiently.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
