import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Sidebar from './pages/super-admin/Dashboard/components/Sidebar';
import Header from './pages/super-admin/Dashboard/components/Header';
import DashboardCards from './pages/super-admin/Dashboard/DashboardCards';
import { DistributionTrendChart, EquipmentTypeChart, BeneficiariesBarChart, SupplierPerformanceChart, FunctionalStatusChart } from './pages/super-admin/Dashboard/Charts';
import ActivityLog from './pages/super-admin/Dashboard/ActivityLog';
import AreaAssignment from './pages/super-admin/Area assignment/AreaAssignment';
import SupplierManagement from './pages/super-admin/Supplier management';
import ContractorRegistration from './pages/super-admin/Contractor registration';
import DemandStatistics from './pages/super-admin/DemandStatistics';
import WoredaEncoderDashboard from './pages/W.encoder/Dashboard';
import WoredaApproverDashboard from './pages/W.approver/Dashboard';
import ZoneExpertDashboard from './pages/Z.expert/Dashboard';
import ZoneApproverDashboard from './pages/Z.approver/Dashboard';

function SuperAdminApp() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8000/api/dashboard')
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

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
                  <BeneficiariesBarChart data={data.beneficiaries_by_zone} />
                  <SupplierPerformanceChart data={data.supplier_performance} />
                  <FunctionalStatusChart data={data.functional_status} />
                </div>

                {/* <ActivityLog activities={data.recent_activity} /> */}
              </div>
            ) : (
              <div className="flex h-full items-center justify-center font-bold text-red-400">Failed to load data.</div>
            )
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

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/wencoder/*" element={<WoredaEncoderDashboard />} />
        <Route path="/wapprover/*" element={<WoredaApproverDashboard />} />
        <Route path="/zoneE/*" element={<ZoneExpertDashboard />} />
        <Route path="/zoneA/*" element={<ZoneApproverDashboard />} />
        {/* Default route for now maps to Super Admin Dashboard until authentication is ready */}
        <Route path="/*" element={<SuperAdminApp />} />
      </Routes>
    </Router>
  );
}

export default App;