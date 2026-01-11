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
    <nav className="bg-white/70 backdrop-blur-md border-b border-purple-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Child-Care System
            </Link>
            <div className="hidden md:flex space-x-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-purple-500 hover:bg-purple-50 transition-colors"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">Demo Admin</p>
              <p className="text-xs text-gray-500 capitalize">admin</p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNav;
