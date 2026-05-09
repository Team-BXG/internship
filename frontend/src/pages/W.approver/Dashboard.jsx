import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ApproveBeneficiary from './Approve Beneficiary';
import ReviewDemands from './Review Demands';
import ApproveProblem from './Approve Problem';
import ScopeSelector from '../../components/ScopeSelector';

const WoredaApproverDashboard = () => {
  const [activeMenu, setActiveMenu] = useState('Approve Beneficiaries');
  const [selectedScope, setSelectedScope] = useState({ zone: '', woreda: '' });

  if (!selectedScope.zone || !selectedScope.woreda) {
    return (
      <ScopeSelector
        title="Select Woreda Approver Workspace"
        subtitle="Choose your zone and woreda. Approvals and updates will be restricted to this area."
        requireWoreda
        onConfirm={({ zone, woreda }) => setSelectedScope({ zone, woreda })}
      />
    );
  }

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} selectedScope={selectedScope} />

      <div className="flex-1 ml-64 flex flex-col min-h-screen">
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
