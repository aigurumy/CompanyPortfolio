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
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Teachers',
      value: stats.totalTeachers,
      icon: Users,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Parents',
      value: stats.totalParents,
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Classes',
      value: stats.totalClasses,
      icon: GraduationCap,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-500/10',
    },
    {
      title: "Today's Attendance",
      value: stats.todayAttendance,
      icon: UserCheck,
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-500/10',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Admin Dashboard</h1>
        <p className="text-slate-400">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div
            key={index}
            className="bg-slate-800 rounded-lg p-6 hover:transform hover:scale-105 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className="w-6 h-6 text-slate-100" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-slate-400 text-sm font-medium mb-1">{stat.title}</h3>
            <p className="text-3xl font-bold text-slate-100">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-100">Recent Activities</h2>
            <Calendar className="w-5 h-5 text-slate-400" />
          </div>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-slate-100 font-medium mb-1">{activity.title}</h4>
                      <p className="text-slate-400 text-sm mb-2">{activity.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-slate-500">
                        <span>{activity.classes?.name}</span>
                        <span>{activity.profiles?.full_name}</span>
                        <span>{new Date(activity.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded capitalize">
                      {activity.activity_type}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-center py-8">No recent activities</p>
            )}
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-slate-100 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white font-medium hover:from-blue-600 hover:to-blue-700 transition-all">
              Add Child
            </button>
            <button className="p-4 bg-gradient-to-r from-green-500 to-green-600 rounded-lg text-white font-medium hover:from-green-600 hover:to-green-700 transition-all">
              Add Teacher
            </button>
            <button className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg text-white font-medium hover:from-purple-600 hover:to-purple-700 transition-all">
              Create Class
            </button>
            <button className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg text-white font-medium hover:from-orange-600 hover:to-orange-700 transition-all">
              New Announcement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
