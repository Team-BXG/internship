import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './pages/head-expert/Dashboard/components/Sidebar';
import Header from './pages/head-expert/Dashboard/components/Header';
import DashboardCards from './pages/head-expert/Dashboard/DashboardCards';
import { DistributionTrendChart, EquipmentTypeChart, BeneficiariesBarChart, SupplierPerformanceChart, FunctionalStatusChart } from './pages/head-expert/Dashboard/Charts';
import ActivityLog from './pages/head-expert/Dashboard/ActivityLog';
import AreaAssignment from './pages/head-expert/Area assignment/AreaAssignment';
import SupplierManagement from './pages/head-expert/Supplier management';
import ContractorRegistration from './pages/head-expert/Contractor registration';
import DemandStatistics from './pages/head-expert/DemandStatistics';
import ProblemHandlings from './pages/head-expert/ProblemHandlings';
import Reports from './pages/head-expert/Reports';
import WoredaEncoderDashboard from './pages/W.encoder/Dashboard';
import WoredaApproverDashboard from './pages/W.approver/Dashboard';
import ZoneExpertDashboard from './pages/Z.expert/Dashboard';
import ZoneApproverDashboard from './pages/Z.approver/Dashboard';

function HeadExpertApp() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/dashboard')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching dashboard data:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        <Header />

        <main className="flex-1 p-8 overflow-y-auto">
          {activeMenu === "Demand Statistics" ? (
            <DemandStatistics />
          ) : activeMenu === "Supplier Management" ? (
            <SupplierManagement />
          ) : activeMenu === "Contractor Registration" ? (
            <ContractorRegistration />
          ) : activeMenu === "Area Assignment" ? (
            <AreaAssignment />
          ) : activeMenu === "Dashboard" ? (
            loading ? (
              <div className="flex h-full items-center justify-center font-bold text-slate-400">Loading Dashboard...</div>
            ) : data ? (
              <div className="max-w-7xl mx-auto">
                <DashboardCards stats={data.stats} />

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
                  <div className="xl:col-span-2">
                    <DistributionTrendChart data={data.distribution_trend} />
                  </div>
                  <div>
                    <EquipmentTypeChart data={data.equipment_type} />
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
                  <SupplierPerformanceChart data={data.supplier_performance} />
                  <FunctionalStatusChart data={data.functional_status} />
                </div>

                {/* <ActivityLog activities={data.recent_activity} /> */}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center font-bold text-red-400">Failed to load data.</div>
            )
          ) : activeMenu === "Problem Statistics" ? (
            <ProblemHandlings />
          ) : activeMenu === "Reports" ? (
            <Reports />
          ) : (
            <div className="flex h-full items-center justify-center flex-col text-slate-400">
              <h2 className="text-2xl font-bold mb-2">Page Under Construction</h2>
              <p>The {activeMenu} page is not yet implemented.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

import SuperAdminDashboard from './pages/SuperAdmin/Dashboard';
import Login from './pages/Auth/Login';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return <Navigate to="/login" replace />;
  try {
    const user = JSON.parse(userStr);
    if (allowedRoles && !allowedRoles.includes(user.role)) {
       return <Navigate to="/login" replace />;
    }
    return children;
  } catch (e) {
    return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/wencoder/*" element={
          <ProtectedRoute allowedRoles={['Woreda Encoder']}>
            <WoredaEncoderDashboard />
          </ProtectedRoute>
        } />
        <Route path="/wapprover/*" element={
          <ProtectedRoute allowedRoles={['Woreda Approver']}>
            <WoredaApproverDashboard />
          </ProtectedRoute>
        } />
        <Route path="/zoneE/*" element={
          <ProtectedRoute allowedRoles={['Zone Expert']}>
            <ZoneExpertDashboard />
          </ProtectedRoute>
        } />
        <Route path="/zoneA/*" element={
          <ProtectedRoute allowedRoles={['Zone Approver']}>
            <ZoneApproverDashboard />
          </ProtectedRoute>
        } />
        <Route path="/superadmin/*" element={
          <ProtectedRoute allowedRoles={['Super Admin']}>
            <SuperAdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/headexpert/*" element={
          <ProtectedRoute allowedRoles={['Head Expert']}>
            <HeadExpertApp />
          </ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;