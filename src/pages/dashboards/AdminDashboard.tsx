import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Users, Baby, GraduationCap, UserCheck, TrendingUp, Calendar } from 'lucide-react';

interface Stats {
  totalChildren: number;
  totalTeachers: number;
  totalParents: number;
  totalClasses: number;
  todayAttendance: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalChildren: 0,
    totalTeachers: 0,
    totalParents: 0,
    totalClasses: 0,
    todayAttendance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
    fetchRecentActivities();
  }, []);

  const fetchStats = async () => {
    try {
      const [children, teachers, parents, classes, attendance] = await Promise.all([
        supabase.from('children').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'teacher'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'parent'),
        supabase.from('classes').select('id', { count: 'exact', head: true }),
        supabase.from('attendance').select('id', { count: 'exact', head: true }).eq('date', new Date().toISOString().split('T')[0]),
      ]);

      setStats({
        totalChildren: children.count || 0,
        totalTeachers: teachers.count || 0,
        totalParents: parents.count || 0,
        totalClasses: classes.count || 0,
        todayAttendance: attendance.count || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select(`
          *,
          classes(name),
          profiles:teacher_id(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (!error && data) {
        setRecentActivities(data);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const statCards = [
    {
      title: 'Total Children',
      value: stats.totalChildren,
      icon: Baby,
      color: 'from-blue-300 to-blue-400',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
    {
      title: 'Teachers',
      value: stats.totalTeachers,
      icon: Users,
      color: 'from-green-300 to-green-400',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
    },
    {
      title: 'Parents',
      value: stats.totalParents,
      icon: Users,
      color: 'from-pink-300 to-pink-400',
      bgColor: 'bg-pink-100',
      textColor: 'text-pink-600',
    },
    {
      title: 'Classes',
      value: stats.totalClasses,
      icon: GraduationCap,
      color: 'from-amber-300 to-amber-400',
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-600',
    },
    {
      title: "Today's Attendance",
      value: stats.todayAttendance,
      icon: UserCheck,
      color: 'from-teal-300 to-teal-400',
      bgColor: 'bg-teal-100',
      textColor: 'text-teal-600',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-300 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 hover:transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">{stat.title}</h3>
            <p className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Recent Activities</h2>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-gray-800 font-medium mb-1">{activity.title}</h4>
                      <p className="text-gray-600 text-sm mb-2">{activity.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{activity.classes?.name}</span>
                        <span>{activity.profiles?.full_name}</span>
                        <span>{new Date(activity.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-purple-200 text-purple-700 text-xs rounded-lg capitalize">
                      {activity.activity_type}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No recent activities</p>
            )}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-gradient-to-r from-blue-200 to-blue-300 rounded-xl text-blue-700 font-medium hover:from-blue-300 hover:to-blue-400 transition-all shadow-sm hover:shadow-md">
              Add Child
            </button>
            <button className="p-4 bg-gradient-to-r from-green-200 to-green-300 rounded-xl text-green-700 font-medium hover:from-green-300 hover:to-green-400 transition-all shadow-sm hover:shadow-md">
              Add Teacher
            </button>
            <button className="p-4 bg-gradient-to-r from-pink-200 to-pink-300 rounded-xl text-pink-700 font-medium hover:from-pink-300 hover:to-pink-400 transition-all shadow-sm hover:shadow-md">
              Create Class
            </button>
            <button className="p-4 bg-gradient-to-r from-amber-200 to-amber-300 rounded-xl text-amber-700 font-medium hover:from-amber-300 hover:to-amber-400 transition-all shadow-sm hover:shadow-md">
              New Announcement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
