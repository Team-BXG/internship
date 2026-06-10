import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import RegisterBeneficiary from './RegisterBeneficiary';
import RegisterDemand from './RegisterDemand';
import RegisterProblem from './RegisterProblem';
import ChangeStatus from './ChangeStatus';
import AssignedDemands from './AssignedDemands';
import WoredaDashboard from './WoredaDashboard';
import ProblemHandlings from './ProblemHandlings';

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState('Notifications');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [selectedScope, setSelectedScope] = useState({ zone: user.zone || '', woreda: user.woreda || '' });
  const [isCollapsed, setIsCollapsed] = useState(false);

  React.useEffect(() => {
    if ((!selectedScope.zone || !selectedScope.woreda) && (user.zone_id || user.woreda_id)) {
      Promise.all([
        fetch((import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api/zones').then(r => r.json()),
        fetch((import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api/woredas').then(r => r.json())
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
          {activeMenu === 'Problem Handlings' && <ProblemHandlings selectedScope={selectedScope} />}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
