import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { GraduationCap, Users, CheckCircle, Calendar, Plus } from 'lucide-react';

interface ClassInfo {
  id: string;
  name: string;
  age_group: string;
  enrollment_count: number;
  attendance_today: number;
}

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [todayDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (user) {
      fetchTeacherClasses();
    }
  }, [user]);

  const fetchTeacherClasses = async () => {
    try {
      const { data: assignedClasses, error } = await supabase
        .from('teacher_assignments')
        .select(`
          class_id,
          is_lead_teacher,
          classes(*)
        `)
        .eq('teacher_id', user?.id);

      if (error) throw error;

      if (assignedClasses) {
        const classesWithStats = await Promise.all(
          assignedClasses.map(async (assignment: any) => {
            const classData = assignment.classes;

            const { count: enrollmentCount } = await supabase
              .from('class_enrollments')
              .select('id', { count: 'exact', head: true })
              .eq('class_id', classData.id)
              .eq('status', 'active');

            const { count: attendanceCount } = await supabase
              .from('attendance')
              .select('id', { count: 'exact', head: true })
              .eq('date', todayDate)
              .in('child_id',
                supabase
                  .from('class_enrollments')
                  .select('child_id')
                  .eq('class_id', classData.id)
              );

            return {
              id: classData.id,
              name: classData.name,
              age_group: classData.age_group,
              enrollment_count: enrollmentCount || 0,
              attendance_today: attendanceCount || 0,
            };
          })
        );

        setClasses(classesWithStats);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
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
        <h1 className="text-3xl font-bold text-slate-100 mb-2">Teacher Dashboard</h1>
        <p className="text-slate-400">Manage your classes and students</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <GraduationCap className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">My Classes</p>
              <p className="text-3xl font-bold text-slate-100">{classes.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <Users className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Total Students</p>
              <p className="text-3xl font-bold text-slate-100">
                {classes.reduce((sum, c) => sum + c.enrollment_count, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-teal-500/10 rounded-lg">
              <CheckCircle className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <p className="text-slate-400 text-sm">Present Today</p>
              <p className="text-3xl font-bold text-slate-100">
                {classes.reduce((sum, c) => sum + c.attendance_today, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-100">My Classes</h2>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" />
            <span>New Activity</span>
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.length > 0 ? (
            classes.map((classInfo) => (
              <div
                key={classInfo.id}
                className="bg-slate-700 rounded-lg p-6 hover:bg-slate-600 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100 mb-1">
                      {classInfo.name}
                    </h3>
                    <p className="text-slate-400 text-sm">{classInfo.age_group}</p>
                  </div>
                  <GraduationCap className="w-6 h-6 text-blue-400" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Enrolled:</span>
                    <span className="text-slate-100 font-medium">{classInfo.enrollment_count}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Present Today:</span>
                    <span className="text-green-400 font-medium">{classInfo.attendance_today}</span>
                  </div>
                  <div className="pt-2 mt-2 border-t border-slate-600">
                    <div className="w-full bg-slate-600 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                        style={{
                          width: `${classInfo.enrollment_count > 0
                            ? (classInfo.attendance_today / classInfo.enrollment_count) * 100
                            : 0}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 text-center">Attendance Rate</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <GraduationCap className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No classes assigned yet</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Calendar className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-semibold text-slate-100">Today's Schedule</h2>
          </div>
          <div className="space-y-3">
            <div className="p-4 bg-slate-700 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-100 font-medium">Morning Circle</p>
                  <p className="text-slate-400 text-sm">9:00 AM - 9:30 AM</p>
                </div>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">Upcoming</span>
              </div>
            </div>
            <div className="p-4 bg-slate-700 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-100 font-medium">Learning Activities</p>
                  <p className="text-slate-400 text-sm">10:00 AM - 11:00 AM</p>
                </div>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded">In Progress</span>
              </div>
            </div>
            <div className="p-4 bg-slate-700 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-100 font-medium">Lunch Time</p>
                  <p className="text-slate-400 text-sm">12:00 PM - 1:00 PM</p>
                </div>
                <span className="px-3 py-1 bg-slate-500/20 text-slate-400 text-xs rounded">Scheduled</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-slate-100 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white font-medium hover:from-blue-600 hover:to-blue-700 transition-all text-sm">
              Take Attendance
            </button>
            <button className="p-4 bg-gradient-to-r from-green-500 to-green-600 rounded-lg text-white font-medium hover:from-green-600 hover:to-green-700 transition-all text-sm">
              Post Activity
            </button>
            <button className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg text-white font-medium hover:from-orange-600 hover:to-orange-700 transition-all text-sm">
              Send Message
            </button>
            <button className="p-4 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg text-white font-medium hover:from-teal-600 hover:to-teal-700 transition-all text-sm">
              View Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
