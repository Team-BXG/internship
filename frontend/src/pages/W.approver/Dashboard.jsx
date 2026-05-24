import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ApproveBeneficiary from './Approve Beneficiary';
import ReviewDemands from './Review Demands';
import ApproveProblem from './Approve Problem';

const WoredaApproverDashboard = () => {
  const [activeMenu, setActiveMenu] = useState('Approve Beneficiaries');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [selectedScope, setSelectedScope] = useState({ zone: user.zone || '', woreda: user.woreda || '' });
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} selectedScope={selectedScope} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        <Header activeMenu={activeMenu} selectedScope={selectedScope} />

        <main className="flex-1 p-8 overflow-y-auto w-full">
          {activeMenu === 'Approve Beneficiaries' && <ApproveBeneficiary selectedScope={selectedScope} />}
          {activeMenu === 'Review Demands' && <ReviewDemands selectedScope={selectedScope} />}
          {activeMenu === 'Approve Problems' && <ApproveProblem selectedScope={selectedScope} />}
        </main>
      </div>
    </div>
  );
};

export default WoredaApproverDashboard;
