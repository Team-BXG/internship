import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ApprovalQueue from './ApprovalQueue';
import ProblemApproval from './ProblemApproval';
import Overview from './Overview';
import DemandStatistics from './DemandStatistics';
import ScopeSelector from '../../components/ScopeSelector';
import { useState } from 'react';

const ZoneApproverDashboard = () => {
  const [selectedZone, setSelectedZone] = useState('');

  if (!selectedZone) {
    return (
      <ScopeSelector
        title="Select Zone Approver Workspace"
        subtitle="Choose the zone to approve. Queue and problems will be shown only for this zone."
        onConfirm={({ zone }) => setSelectedZone(zone)}
      />
    );
  }

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans">
      <Sidebar selectedZone={selectedZone} />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Header selectedZone={selectedZone} />
        <main className="flex-1 p-8 overflow-y-auto w-full">
          <Routes>
            <Route path="overview" element={<Overview selectedZone={selectedZone} />} />
            <Route path="demands" element={<DemandStatistics selectedZone={selectedZone} />} />
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
