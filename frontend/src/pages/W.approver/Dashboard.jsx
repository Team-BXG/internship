import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ApproveBeneficiary from './ApproveBeneficiary';
import ReviewDemands from './ReviewDemands';
import ApproveProblem from './ApproveProblem';

const WoredaApproverDashboard = () => {
  const [activeMenu, setActiveMenu] = useState('Approve Beneficiaries');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [selectedScope, setSelectedScope] = useState({ zone: user.zone || '', woreda: user.woreda || '' });
  const [isCollapsed, setIsCollapsed] = useState(false);

  React.useEffect(() => {
    if ((!selectedScope.zone || !selectedScope.woreda) && (user.zone_id || user.woreda_id)) {
      Promise.all([
        fetch('http://localhost:8000/api/zones').then(r => r.json()),
        fetch('http://localhost:8000/api/woredas').then(r => r.json())
      ]).then(([zones, woredas]) => {
        const zMatch = zones.find(z => z.id === user.zone_id);
        const wMatch = woredas.find(w => w.id === user.woreda_id);
        const newScope = {
          zone: zMatch ? zMatch.name : selectedScope.zone,
          woreda: wMatch ? wMatch.name : selectedScope.woreda,
          zone_id: user.zone_id,
          woreda_id: user.woreda_id
        };
        setSelectedScope(newScope);
        user.zone = newScope.zone;
        user.woreda = newScope.woreda;
        localStorage.setItem('user', JSON.stringify(user));
      }).catch(console.error);
    }
  }, []);

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
