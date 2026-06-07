import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ApprovalQueue from './ApprovalQueue';
import ProblemApproval from './ProblemApproval';
import Overview from './Overview';
import DemandStatistics from './DemandStatistics';
import ReviewDemands from './ReviewDemands';

import { useState } from 'react';

const ZoneApproverDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [selectedZone, setSelectedZone] = useState(user.zone || '');
  const [isCollapsed, setIsCollapsed] = useState(false);

  React.useEffect(() => {
    if (!selectedZone && user.zone_id) {
      fetch('http://localhost:8000/api/zones')
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
      <Sidebar selectedZone={selectedZone} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        <Header selectedZone={selectedZone} />
        <main className="flex-1 p-8 overflow-y-auto w-full">
          <Routes>
            <Route path="overview" element={<Overview selectedZone={selectedZone} />} />
            <Route path="demands" element={<DemandStatistics selectedZone={selectedZone} />} />
            <Route path="review-demands" element={<ReviewDemands selectedZone={selectedZone} />} />
            <Route path="queue" element={<ApprovalQueue selectedZone={selectedZone} />} />
            <Route path="problems" element={<ProblemApproval selectedZone={selectedZone} />} />
            <Route path="/" element={<Navigate to="overview" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default ZoneApproverDashboard;
