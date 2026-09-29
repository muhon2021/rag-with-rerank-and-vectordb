import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WorkshopFlow from './components/WorkshopFlow.jsx';
import { useHealth } from './hooks/useHealth.js';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardOverview from './components/dashboard/DashboardOverview';
import RoleList from './components/dashboard/roles/RoleList';
import RoleCreate from './components/dashboard/roles/RoleCreate';
import RoleEdit from './components/dashboard/roles/RoleEdit';
import MemberList from './components/dashboard/members/MemberList';
import MemberCreate from './components/dashboard/members/MemberCreate';
import MemberEdit from './components/dashboard/members/MemberEdit';

export default function App() {
  const { health, backendOnline, totalVectors } = useHealth();
  const indexEmpty = totalVectors === 0;

  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="roles" element={<RoleList />} />
          <Route path="roles/new" element={<RoleCreate />} />
          <Route path="roles/:id/edit" element={<RoleEdit />} />
          <Route path="members" element={<MemberList />} />
          <Route path="members/new" element={<MemberCreate />} />
          <Route path="members/:id/edit" element={<MemberEdit />} />
        </Route>
        <Route path="*" element={<WorkshopFlow indexEmpty={indexEmpty} backendOnline={backendOnline} health={health} totalVectors={totalVectors} />} />
      </Routes>
    </Router>
  );
}
