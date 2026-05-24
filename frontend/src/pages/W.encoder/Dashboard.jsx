import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import RegisterBeneficiary from './Register Beneficiary';
import RegisterDemand from './Register Demand';
import RegisterProblem from './Register Problem';
import ChangeStatus from './ChangeStatus';
import AssignedDemands from './AssignedDemands';
import WoredaDashboard from './WoredaDashboard';

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState('Notifications');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [selectedScope, setSelectedScope] = useState({ zone: user.zone || '', woreda: user.woreda || '' });
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} selectedScope={selectedScope} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        <Header activeMenu={activeMenu} selectedScope={selectedScope} />

        <main className="flex-1 p-8 overflow-y-auto">
          {activeMenu === 'Notifications' && <WoredaDashboard selectedScope={selectedScope} />}
          {activeMenu === 'Beneficiary Registration' && <RegisterBeneficiary selectedScope={selectedScope} />}
          {activeMenu === 'Demand Registration' && <RegisterDemand selectedScope={selectedScope} />}
          {activeMenu === 'Problem Register' && <RegisterProblem selectedScope={selectedScope} />}
          {activeMenu === 'Assigned Demands' && <AssignedDemands selectedScope={selectedScope} />}
          {activeMenu === 'Change Status' && <ChangeStatus selectedScope={selectedScope} />}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
