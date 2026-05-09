import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import RegisterBeneficiary from './Register Beneficiary';
import RegisterDemand from './Register Demand';
import RegisterProblem from './Register Problem';
import ChangeStatus from './ChangeStatus';
import AssignedDemands from './AssignedDemands';
import ScopeSelector from '../../components/ScopeSelector';

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState('Notifications');
  const [selectedScope, setSelectedScope] = useState({ zone: '', woreda: '' });

  if (!selectedScope.zone || !selectedScope.woreda) {
    return (
      <ScopeSelector
        title="Select Woreda Encoder Workspace"
        subtitle="Choose your zone first, then select woreda. Data entry and lists will only use this scope."
        requireWoreda
        onConfirm={({ zone, woreda }) => setSelectedScope({ zone, woreda })}
      />
    );
  }

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} selectedScope={selectedScope} />

      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Header activeMenu={activeMenu} selectedScope={selectedScope} />

        <main className="flex-1 p-8 overflow-y-auto">
          {activeMenu === 'Notifications' && <div className="text-slate-500">Notifications content goes here</div>}
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
