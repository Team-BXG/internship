import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AgentRegistration from './AgentRegistration';
import ZoneDashboard from './ZoneDashboard';

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState('Dashboard');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [selectedZone, setSelectedZone] = useState(user.zone || '');
  const [isCollapsed, setIsCollapsed] = useState(false);

  React.useEffect(() => {
    if (!selectedZone && user.zone_id) {
      fetch('http://127.0.0.1:8000/api/zones')
        .then(res => res.json())
        .then(zones => {
          const matched = zones.find(z => z.id === user.zone_id);
          if (matched) {
            setSelectedZone(matched.name);
            user.zone = matched.name;
            localStorage.setItem('user', JSON.stringify(user));
          }
        })
        .catch(console.error);
    }
  }, [selectedZone, user.zone_id]);

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} selectedZone={selectedZone} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        <Header activeMenu={activeMenu} selectedZone={selectedZone} />

        <main className="flex-1 p-8 overflow-y-auto w-full">
          {activeMenu === 'Dashboard' && (
            <ZoneDashboard selectedZone={selectedZone} />
          )}
          {activeMenu === 'Agent Management' && (
            <AgentRegistration selectedZone={selectedZone} />
          )}
          {activeMenu !== 'Dashboard' && activeMenu !== 'Agent Management' && (
            <div className="flex min-h-[50vh] items-center justify-center">
              <div className="text-xl font-bold text-slate-500 flex flex-col items-center">
                 Page Under Construction
                 <span className="text-sm font-normal text-slate-400 mt-2">The {activeMenu} feature is not yet available.</span>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
