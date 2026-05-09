import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AgentRegistration from './AgentRegistration';
import ScopeSelector from '../../components/ScopeSelector';
import AreaAssignment from '../super-admin/Area assignment/AreaAssignment';

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState('Agent Management');
  const [selectedZone, setSelectedZone] = useState('');

  if (!selectedZone) {
    return (
      <ScopeSelector
        title="Select Zone Expert Workspace"
        subtitle="Choose the zone to open. All records will be limited to this zone."
        onConfirm={({ zone }) => setSelectedZone(zone)}
      />
    );
  }

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} selectedZone={selectedZone} />

      <div className="flex-1 ml-64 flex flex-col min-h-screen">
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
