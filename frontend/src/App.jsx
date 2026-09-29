import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WorkshopFlow from './components/WorkshopFlow.jsx';
import { useHealth } from './hooks/useHealth.js';
import DashboardLayout from './components/DashboardLayout';
import DashboardOverview from './components/DashboardOverview';
import RoleList from './components/RoleList';
import RoleCreate from './components/RoleCreate';
import RoleEdit from './components/RoleEdit';
import MemberList from './components/MemberList';
import MemberCreate from './components/MemberCreate';
import MemberEdit from './components/MemberEdit';

export default function App() {
  const { health, backendOnline, totalVectors } = useHealth();
  const indexEmpty = totalVectors === 0;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<WorkshopFlow indexEmpty={indexEmpty} backendOnline={backendOnline} health={health} totalVectors={totalVectors} />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="roles" element={<RoleList />} />
          <Route path="roles/new" element={<RoleCreate />} />
          <Route path="roles/:id/edit" element={<RoleEdit />} />
          <Route path="members" element={<MemberList />} />
          <Route path="members/new" element={<MemberCreate />} />
          <Route path="members/:id/edit" element={<MemberEdit />} />
        </Route>
      </Routes>
    </Router>
  );
}
