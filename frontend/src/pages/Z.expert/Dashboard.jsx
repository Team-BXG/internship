import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AgentRegistration from './AgentRegistration';

import AreaAssignment from '../head-expert/Area assignment/AreaAssignment';

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState('Agent Management');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [selectedZone, setSelectedZone] = useState(user.zone || '');
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} selectedZone={selectedZone} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        <Header activeMenu={activeMenu} selectedZone={selectedZone} />

        <main className="flex-1 p-8 overflow-y-auto w-full">
          {activeMenu === 'Agent Management' ? (
            <AgentRegistration selectedZone={selectedZone} />
          ) : activeMenu === 'Area Assignment' ? (
            <AreaAssignment selectedZone={selectedZone} />
          ) : (
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
