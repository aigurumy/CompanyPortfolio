import React from 'react';
import { Link } from 'react-router-dom';
import { Users, GraduationCap, Calendar, Activity, Bell, User } from 'lucide-react';

const DashboardNav = () => {
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Activity },
    { path: '/dashboard/users', label: 'Users', icon: Users },
    { path: '/dashboard/children', label: 'Children', icon: User },
    { path: '/dashboard/classes', label: 'Classes', icon: GraduationCap },
    { path: '/dashboard/attendance', label: 'Attendance', icon: Calendar },
    { path: '/dashboard/announcements', label: 'Announcements', icon: Bell },
  ];

  return (
    <nav className="bg-slate-800 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="text-xl font-bold text-blue-400">
              Child-Care System
            </Link>
            <div className="hidden md:flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-blue-400 hover:bg-slate-700 transition-colors"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-300">Demo Admin</p>
              <p className="text-xs text-slate-400 capitalize">admin</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNav;
