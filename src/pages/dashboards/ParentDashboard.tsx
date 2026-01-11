import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Baby, Clock, Calendar, Activity, Image, Bell } from 'lucide-react';

interface Child {
  id: string;
  first_name: string;
  last_name: string;
  photo_url: string | null;
  date_of_birth: string;
  class_name: string | null;
}

interface RecentActivity {
  id: string;
  title: string;
  description: string;
  activity_type: string;
  created_at: string;
  photo_url: string | null;
}

interface TodayAttendance {
  child_id: string;
  check_in_time: string | null;
  check_out_time: string | null;
}

const ParentDashboard = () => {
  const { user } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [attendanceToday, setAttendanceToday] = useState<Record<string, TodayAttendance>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchChildren();
    }
  }, [user]);

  const fetchChildren = async () => {
    try {
      const { data: childrenData, error } = await supabase
        .from('parent_children')
        .select(`
          child_id,
          children(
            id,
            first_name,
            last_name,
            photo_url,
            date_of_birth
          )
        `)
        .eq('parent_id', user?.id);

      if (error) throw error;

      if (childrenData) {
        const childrenWithClasses = await Promise.all(
          childrenData.map(async (item: any) => {
            const child = item.children;

            const { data: enrollment } = await supabase
              .from('class_enrollments')
              .select('classes(name)')
              .eq('child_id', child.id)
              .eq('status', 'active')
              .maybeSingle();

            const todayDate = new Date().toISOString().split('T')[0];
            const { data: attendance } = await supabase
              .from('attendance')
              .select('check_in_time, check_out_time')
              .eq('child_id', child.id)
              .eq('date', todayDate)
              .maybeSingle();

            return {
              ...child,
              class_name: enrollment?.classes?.name || null,
              attendance_today: attendance,
            };
          })
        );

        setChildren(childrenWithClasses);

        const attendanceMap: Record<string, TodayAttendance> = {};
        childrenWithClasses.forEach((child: any) => {
          if (child.attendance_today) {
            attendanceMap[child.id] = {
              child_id: child.id,
              check_in_time: child.attendance_today.check_in_time,
              check_out_time: child.attendance_today.check_out_time,
            };
          }
        });
        setAttendanceToday(attendanceMap);

        if (childrenWithClasses.length > 0) {
          fetchRecentActivities(childrenWithClasses.map((c: any) => c.id));
        }
      }
    } catch (error) {
      console.error('Error fetching children:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivities = async (childIds: string[]) => {
    try {
      const { data: enrollments } = await supabase
        .from('class_enrollments')
        .select('class_id')
        .in('child_id', childIds);

      if (enrollments && enrollments.length > 0) {
        const classIds = enrollments.map((e) => e.class_id);

        const { data: activities, error } = await supabase
          .from('activities')
          .select('*')
          .in('class_id', classIds)
          .order('created_at', { ascending: false })
          .limit(6);

        if (!error && activities) {
          setRecentActivities(activities);
        }
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatTime = (timestamp: string | null) => {
    if (!timestamp) return 'Not checked in';
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Parent Dashboard</h1>
        <p className="text-slate-400">Stay connected with your child's day</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-slate-100 mb-4">My Children</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children.length > 0 ? (
            children.map((child) => (
              <div
                key={child.id}
                className="bg-slate-800 rounded-lg p-6 hover:transform hover:scale-105 transition-all duration-300"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                    {child.first_name[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-100">
                      {child.first_name} {child.last_name}
                    </h3>
                    <p className="text-slate-400 text-sm">{calculateAge(child.date_of_birth)} years old</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Class:</span>
                    <span className="text-slate-100 font-medium">{child.class_name || 'Not assigned'}</span>
                  </div>

                  {attendanceToday[child.id] && (
                    <>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Check-in:</span>
                        <span className="text-green-400 font-medium">
                          {formatTime(attendanceToday[child.id].check_in_time)}
                        </span>
                      </div>
                      {attendanceToday[child.id].check_out_time && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-400">Check-out:</span>
                          <span className="text-orange-400 font-medium">
                            {formatTime(attendanceToday[child.id].check_out_time)}
                          </span>
                        </div>
                      )}
                    </>
                  )}

                  {!attendanceToday[child.id] && (
                    <div className="flex items-center justify-center p-2 bg-slate-700 rounded text-slate-400 text-sm">
                      <Clock className="w-4 h-4 mr-2" />
                      Not checked in today
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-slate-800 rounded-lg">
              <Baby className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No children registered</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Activity className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-semibold text-slate-100">Recent Activities</h2>
          </div>
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-slate-100 font-medium">{activity.title}</h4>
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded capitalize">
                      {activity.activity_type}
                    </span>
                  </div>
                  {activity.description && (
                    <p className="text-slate-400 text-sm mb-2">{activity.description}</p>
                  )}
                  {activity.photo_url && (
                    <div className="mt-2 rounded-lg overflow-hidden">
                      <img
                        src={activity.photo_url}
                        alt={activity.title}
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  )}
                  <p className="text-slate-500 text-xs mt-2">
                    {new Date(activity.created_at).toLocaleDateString()} at{' '}
                    {new Date(activity.created_at).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-center py-8">No recent activities</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="w-5 h-5 text-green-400" />
              <h2 className="text-xl font-semibold text-slate-100">This Week</h2>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-slate-700 rounded-lg">
                <p className="text-slate-100 font-medium text-sm">Parent-Teacher Conference</p>
                <p className="text-slate-400 text-xs">Friday, 3:00 PM</p>
              </div>
              <div className="p-3 bg-slate-700 rounded-lg">
                <p className="text-slate-100 font-medium text-sm">Field Trip - Zoo Visit</p>
                <p className="text-slate-400 text-xs">Thursday, 9:00 AM</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Bell className="w-5 h-5 text-orange-400" />
              <h2 className="text-xl font-semibold text-slate-100">Announcements</h2>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-slate-700 rounded-lg">
                <p className="text-slate-100 font-medium text-sm">Upcoming Holiday Closure</p>
                <p className="text-slate-400 text-xs">The center will be closed next Monday</p>
              </div>
              <div className="p-3 bg-slate-700 rounded-lg">
                <p className="text-slate-100 font-medium text-sm">New Art Program</p>
                <p className="text-slate-400 text-xs">Starting next week - sign up now!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
