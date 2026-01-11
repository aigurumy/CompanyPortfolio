import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminDashboard from './dashboards/AdminDashboard';
import TeacherDashboard from './dashboards/TeacherDashboard';
import ParentDashboard from './dashboards/ParentDashboard';

const Dashboard = () => {
  const { profile } = useAuth();

  if (!profile) {
    return null;
  }

  switch (profile.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'teacher':
      return <TeacherDashboard />;
    case 'parent':
      return <ParentDashboard />;
    default:
      return <div>Invalid role</div>;
  }
};

export default Dashboard;
