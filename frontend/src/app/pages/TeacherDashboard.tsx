import {
  BookOpen, Users, FileCheck, TrendingUp, Plus, Bell,
  ChevronRight, Clock, Star, BarChart2, MessageSquare,
  CheckCircle2, AlertCircle, Pencil, MoreVertical,
  Play, Calendar, Layout, FileText, Search, Flame, ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router';
import { useUser } from '../contexts/UserContext';
import { motion } from 'motion/react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { getCoursesByDepartment, getDepartmentById, DEPARTMENTS } from '../data/departments';

const ANALYTICS_DATA = [
  { name: 'Mon', submissions: 45, engagement: 85 },
  { name: 'Tue', submissions: 52, engagement: 78 },
  { name: 'Wed', submissions: 38, engagement: 92 },
  { name: 'Thu', submissions: 65, engagement: 88 },
  { name: 'Fri', submissions: 48, engagement: 81 },
  { name: 'Sat', submissions: 20, engagement: 45 },
  { name: 'Sun', submissions: 15, engagement: 30 },
];

export function TeacherDashboard() {
  const { user } = useUser();
  const firstName = user?.name?.split(' ')[0] || 'Teacher';

  const deptId = user.departmentId || 'cse';
  const dept = getDepartmentById(deptId);
  const deptCourses = getCoursesByDepartment(deptId).slice(0, 3);

  const pieData = deptCourses.map(c => ({ name: c.code, value: c.progress }));
  const PIE_COLORS = ['#1F5F5B', '#2E7D73', '#184D47', '#4DB6AC'];

  const pendingTotal = deptCourses.reduce((sum, c) => sum + Math.floor(Math.random() * 8 + 2), 0);

  return (
    <div className="space-y-8 pb-12">
      {/* ── Premium Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-primary/5 p-8 rounded-[40px] border border-primary/10">
        <div className="flex items-center gap-6">
          <Link to="/teacher/profile" className="relative group" id="teacher-profile-link">
            <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-3xl font-black shadow-xl group-hover:scale-105 transition-transform overflow-hidden">
              {user.avatarUrl
                ? <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                : firstName[0]}
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-white border-4 border-primary/5 flex items-center justify-center shadow-lg">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            </div>
          </Link>

          <div>
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1 italic">Instructor Control Centre</p>
            <h1 className="text-4xl font-black text-foreground tracking-tight">Professor {firstName}!</h1>
            {dept && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-lg">{dept.icon}</span>
                <span className="text-sm font-bold text-muted-foreground">{dept.name}</span>
                <span className={`text-[10px] font-black text-white px-2 py-0.5 rounded-full bg-gradient-to-r ${dept.color}`}>
                  {dept.shortName}
                </span>
              </div>
            )}
            <p className="text-sm font-medium text-muted-foreground mt-1">
              You have <span className="text-primary font-bold">{pendingTotal} pending submissions</span> requiring review.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/teacher/create-course"
            id="create-course-btn"
            className="h-14 px-6 rounded-2xl bg-primary text-white font-bold flex items-center gap-2 shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:scale-105 transition-all"
          >
            <Plus className="w-5 h-5" /> New Course
          </Link>
          <Link
            to="/teacher/profile"
            id="teacher-profile-btn"
            className="h-14 w-14 rounded-2xl bg-white border border-border flex items-center justify-center shadow-sm hover:border-primary hover:shadow-lg transition-all"
            title="My Profile"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-sm font-black">
              {firstName[0]}
            </div>
          </Link>
          <Link
            to="/teacher/notifications"
            className="h-14 w-14 rounded-2xl bg-card border border-border flex items-center justify-center text-foreground hover:bg-secondary transition-all relative"
          >
            <Bell className="w-6 h-6" />
            <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background" />
          </Link>
        </div>
      </div>

      {/* ── Analytics Row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="xl:col-span-2 bg-card rounded-[32px] p-8 border border-border shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-foreground">Engagement Velocity</h3>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Last 7 Days Academic Activity</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase">
                <div className="w-3 h-3 rounded-full bg-primary" /> Submissions
              </span>
              <span className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase">
                <div className="w-3 h-3 rounded-full bg-accent" /> Engagement
              </span>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ANALYTICS_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                <Bar dataKey="submissions" fill="#1F5F5B" radius={[6, 6, 0, 0]} barSize={32} />
                <Bar dataKey="engagement" fill="#A7D7C5" radius={[6, 6, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-card rounded-[32px] p-8 border border-border shadow-sm">
          <h3 className="text-lg font-bold text-foreground mb-1">Course Progress</h3>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mb-6">Completion by Module</p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={8} dataKey="value">
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {deptCourses.map((c, i) => (
              <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-transparent hover:border-border transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                  <span className="text-xs font-bold text-foreground">{c.code}</span>
                </div>
                <span className="text-xs font-black text-primary">{c.progress}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Courses + Side Panel ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Courses */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-foreground tracking-tight">My Courses</h2>
              {dept && (
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                  {dept.name} Modules
                </p>
              )}
            </div>
            <Link to="/teacher/courses" className="text-xs font-bold text-primary flex items-center gap-2 uppercase tracking-widest hover:underline">
              All Courses <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deptCourses.map(course => (
              <div key={course.id} className="bg-card rounded-[28px] p-6 border border-border group hover:shadow-xl transition-all relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${course.color} opacity-5 group-hover:scale-150 transition-transform duration-500 rounded-full translate-x-12 -translate-y-3`} />

                <div className="flex items-start justify-between mb-6 relative z-10">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${course.color} flex items-center justify-center text-white shadow-lg`}>
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-muted-foreground bg-secondary px-2 py-1 rounded-lg uppercase">
                      {course.students} students
                    </span>
                  </div>
                </div>

                <div className="mb-4 relative z-10">
                  <h3 className="text-base font-black text-foreground leading-tight group-hover:text-primary transition-colors">{course.title}</h3>
                  <p className="text-xs font-bold text-muted-foreground mt-1 uppercase tracking-widest">{course.code} • {course.credits} Credits</p>
                </div>

                <div className="space-y-3 relative z-10">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-primary">{course.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      className={`h-full bg-gradient-to-r ${course.color}`}
                    />
                  </div>
                  <div className="flex items-center gap-3 pt-1">
                    <Link
                      to={`/teacher/courses/${course.id}`}
                      id={`manage-course-${course.id}`}
                      className="flex-1 h-10 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center"
                    >
                      Manage Course
                    </Link>
                    <Link
                      to={`/teacher/courses/${course.id}`}
                      className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all"
                    >
                      <FileText className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {/* New Course Card */}
            <Link
              to="/teacher/create-course"
              className="rounded-[28px] border-2 border-dashed border-border flex flex-col items-center justify-center p-8 gap-4 hover:bg-secondary/50 hover:border-primary/50 group transition-all"
            >
              <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-border flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary group-hover:rotate-90 transition-all duration-500">
                <Plus className="w-6 h-6" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-foreground">Create New Course</p>
                <p className="text-xs font-medium text-muted-foreground">Add a new {dept?.shortName || ''} module</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Side Panel */}
        <div className="lg:col-span-4 space-y-6">
          {/* Profile Completion */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-[32px] p-6 text-white shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl font-black shadow-lg overflow-hidden">
                {user.avatarUrl
                  ? <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                  : firstName[0]}
              </div>
              <div>
                <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Faculty ID</p>
                <p className="text-sm font-black text-white">{user.studentId || 'EMP-2024-XXXX'}</p>
                <p className="text-xs text-white/70">{user.year || 'Professor'}</p>
              </div>
            </div>

            {/* Profile completion meter */}
            {(() => {
              const fields = [user.name, user.email, user.department, user.bio, user.phone, user.studentId, user.year];
              const filled = fields.filter(Boolean).length;
              const pct = Math.round((filled / fields.length) * 100);
              return (
                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                    <span className="text-white/70">Profile Completion</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-white rounded-full"
                    />
                  </div>
                  {pct < 100 && (
                    <Link
                      to="/teacher/profile"
                      className="mt-4 w-full h-10 rounded-xl bg-white/20 hover:bg-white/30 text-white text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center border border-white/20"
                    >
                      Complete Profile →
                    </Link>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Live Class */}
          <div className="bg-card rounded-[32px] p-6 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-black text-foreground flex items-center gap-3">
                <Play className="w-5 h-5 text-accent fill-accent/30" /> Live Classes
              </h3>
              <Link to="/teacher/live-class" className="text-[10px] font-black uppercase text-primary hover:underline">Schedule</Link>
            </div>
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
              <div className="flex items-start justify-between mb-4">
                <div className="px-2 py-1 rounded bg-primary text-white text-[9px] font-black uppercase animate-pulse">Live Soon</div>
                <span className="text-[10px] font-bold text-muted-foreground">10:00 AM</span>
              </div>
              <h4 className="text-sm font-bold text-foreground mb-1 leading-snug">
                {deptCourses[0]?.title || 'Lecture Session'}
              </h4>
              <p className="text-xs text-muted-foreground font-medium mb-4">{deptCourses[0]?.code || 'Course'} • Virtual Session</p>
              <Link
                to="/teacher/live-class"
                className="w-full h-11 rounded-xl bg-primary text-white text-xs font-bold hover:shadow-lg transition-all flex items-center justify-center"
              >
                Enter Lecture Portal
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            {[
              { label: 'Upload Syllabus', sub: 'Import PDF/Word', to: '/teacher/courses', icon: FileCheck, color: 'text-primary bg-primary/10 group-hover:bg-primary group-hover:text-white' },
              { label: 'Student Submissions', sub: 'Review & Grade', to: '/teacher/assignments', icon: CheckCircle2, color: 'text-green-600 bg-green-500/10 group-hover:bg-green-500 group-hover:text-white' },
              { label: 'Broadcast Message', sub: 'Notify All Students', to: '/teacher/chat', icon: MessageSquare, color: 'text-indigo-600 bg-indigo-500/10 group-hover:bg-indigo-500 group-hover:text-white' },
            ].map(({ label, sub, to, icon: Icon, color }) => (
              <Link
                key={label}
                to={to}
                className="w-full p-4 rounded-2xl bg-card border border-border flex items-center justify-between group hover:border-primary transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-foreground leading-none mb-1">{label}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">{sub}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}