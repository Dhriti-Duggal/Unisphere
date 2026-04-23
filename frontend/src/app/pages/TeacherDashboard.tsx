import {
  BookOpen, Users, FileCheck, Plus, Bell,
  ChevronRight, Star, MessageSquare, FileText,
  CheckCircle2, Play, Calendar, ArrowUpRight, Search
} from 'lucide-react';
import { Link } from 'react-router';
import { useUser } from '../contexts/UserContext';
import { motion } from 'motion/react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { getCoursesByDepartment, getDepartmentById, getAssignmentsByDepartment } from '../data/departments';

const ANALYTICS_DATA = [
  { name: 'Mon', submissions: 45, engagement: 85 },
  { name: 'Tue', submissions: 52, engagement: 78 },
  { name: 'Wed', submissions: 38, engagement: 92 },
  { name: 'Thu', submissions: 65, engagement: 88 },
  { name: 'Fri', submissions: 48, engagement: 81 },
  { name: 'Sat', submissions: 20, engagement: 45 },
  { name: 'Sun', submissions: 15, engagement: 30 },
];

const PIE_COLORS = ['#1F5F5B', '#2E7D73', '#184D47', '#4DB6AC'];

// Fake students per course for demo
const MOCK_STUDENTS = [
  { name: 'Priya Sharma',   avatar: 'P', grade: 92, status: 'active' },
  { name: 'Arjun Mehta',    avatar: 'A', grade: 78, status: 'active' },
  { name: 'Sneha Patel',    avatar: 'S', grade: 85, status: 'inactive' },
  { name: 'Rohan Verma',    avatar: 'R', grade: 65, status: 'active' },
  { name: 'Diya Kapoor',    avatar: 'D', grade: 90, status: 'active' },
];

export function TeacherDashboard() {
  const { user } = useUser();
  const firstName = user?.name?.split(' ')[0] || 'Teacher';

  const deptId = user.departmentId || 'cse';
  const dept = getDepartmentById(deptId);

  // Only courses from teacher's department
  const myCourses = getCoursesByDepartment(deptId);
  const myAssignments = getAssignmentsByDepartment(deptId);
  const pendingSubmissions = myAssignments.filter(a => a.status === 'submitted').length + 4;

  const pieData = myCourses.slice(0, 4).map(c => ({ name: c.code, value: c.progress }));

  const profilePct = (() => {
    const fields = [user.name, user.email, user.department, user.bio, user.phone, user.studentId, user.year];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  })();

  return (
    <div className="space-y-8 pb-12">

      {/* ── Header (no bell — it's in the navbar) ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-primary/5 p-8 rounded-[40px] border border-primary/10">
        <div className="flex items-center gap-6">
          <Link to="/teacher/profile" className="relative group" id="teacher-profile-avatar">
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
              <span className="text-primary font-bold">{pendingSubmissions} submissions</span> pending review
              &nbsp;•&nbsp; <span className="text-foreground font-bold">{myCourses.length} courses</span> active
            </p>
          </div>
        </div>

        {/* Header actions — no bell (it's in navbar already) */}
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
        </div>
      </div>

      {/* ── Analytics Row ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Bar chart */}
        <div className="xl:col-span-2 bg-card rounded-[32px] p-8 border border-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-black text-foreground">Engagement Velocity</h3>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Last 7 Days — {dept?.name}</p>
            </div>
            <Link to="/teacher/analytics" className="text-xs font-bold text-primary uppercase tracking-widest hover:underline flex items-center gap-1">
              Full Analytics <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ANALYTICS_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                <Bar dataKey="submissions" name="Submissions" fill="#1F5F5B" radius={[6,6,0,0]} barSize={28} />
                <Bar dataKey="engagement" name="Engagement" fill="#A7D7C5" radius={[6,6,0,0]} barSize={10} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie — course completion */}
        <div className="bg-card rounded-[32px] p-8 border border-border shadow-sm">
          <h3 className="text-base font-black text-foreground mb-1">Course Progress</h3>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">Completion by Module</p>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={6} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {myCourses.slice(0, 4).map((c, i) => (
              <div key={c.id} className="flex items-center justify-between p-2.5 rounded-xl bg-secondary/50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                  <span className="text-xs font-bold text-foreground">{c.code}</span>
                </div>
                <span className="text-xs font-black text-primary">{c.progress}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── My Courses + Side Panel ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Courses (dept-filtered) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-foreground tracking-tight">My Courses</h2>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                {dept?.name} • {myCourses.length} active modules
              </p>
            </div>
            <Link to="/teacher/courses" className="text-xs font-bold text-primary flex items-center gap-2 uppercase tracking-widest hover:underline">
              All Courses <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myCourses.map(course => (
              <div key={course.id} id={`course-card-${course.id}`} className="bg-card rounded-[28px] p-6 border border-border group hover:shadow-xl transition-all relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${course.color} opacity-5 group-hover:scale-150 transition-transform duration-500 rounded-full translate-x-12 -translate-y-3`} />

                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${course.color} flex items-center justify-center text-white shadow-lg`}>
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-black text-muted-foreground bg-secondary px-2 py-1 rounded-lg uppercase">
                    {course.students} students
                  </span>
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
                    <motion.div initial={{ width: 0 }} animate={{ width: `${course.progress}%` }} className={`h-full bg-gradient-to-r ${course.color}`} />
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 pt-1">
                    <Link
                      to={`/teacher/courses/${course.id}`}
                      className="flex-1 h-9 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center hover:shadow-lg hover:shadow-primary/20 transition-all"
                    >
                      Manage
                    </Link>
                    <Link
                      to={`/teacher/assignments`}
                      className="flex-1 h-9 rounded-xl bg-secondary text-foreground text-[10px] font-black uppercase tracking-widest flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all"
                    >
                      Assignments
                    </Link>
                    <Link
                      to={`/teacher/groups`}
                      title="Student Groups"
                      className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all"
                    >
                      <Users className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {/* Add new */}
            <Link
              to="/teacher/create-course"
              className="rounded-[28px] border-2 border-dashed border-border flex flex-col items-center justify-center p-8 gap-4 hover:bg-secondary/50 hover:border-primary/50 group transition-all min-h-[200px]"
            >
              <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-border flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary group-hover:rotate-90 transition-all duration-500">
                <Plus className="w-6 h-6" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-foreground">Create New Course</p>
                <p className="text-xs font-medium text-muted-foreground">{dept?.name} module</p>
              </div>
            </Link>
          </div>

          {/* ── Students by Course ── */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-foreground tracking-tight">Students</h2>
              <Link to="/teacher/groups" className="text-xs font-bold text-primary uppercase tracking-widest hover:underline flex items-center gap-1">
                All Groups <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Course selector tabs */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {myCourses.slice(0, 4).map((c, i) => (
                <span key={c.id} className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase cursor-pointer transition-all ${i === 0 ? 'bg-primary text-white' : 'bg-card border border-border text-muted-foreground hover:text-foreground'}`}>
                  {c.code}
                </span>
              ))}
            </div>

            <div className="bg-card rounded-[32px] border border-border overflow-hidden">
              <div className="p-5 border-b border-border flex items-center justify-between">
                <p className="text-sm font-black text-foreground">{myCourses[0]?.title}</p>
                <span className="text-[10px] font-bold text-muted-foreground uppercase">{myCourses[0]?.students} enrolled</span>
              </div>
              <div className="divide-y divide-border">
                {MOCK_STUDENTS.map((s, i) => (
                  <div key={i} className="flex items-center justify-between px-6 py-4 hover:bg-secondary/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-black text-sm">
                        {s.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{s.name}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          {s.status === 'active' ? '🟢 Active' : '🔴 Inactive'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-[10px] font-black text-muted-foreground uppercase">Grade</p>
                        <p className={`text-sm font-black ${s.grade >= 85 ? 'text-green-600' : s.grade >= 70 ? 'text-primary' : 'text-orange-500'}`}>
                          {s.grade}%
                        </p>
                      </div>
                      <Link
                        to={`/teacher/chat`}
                        title="Message student"
                        className="w-9 h-9 rounded-xl bg-secondary text-muted-foreground hover:text-primary hover:bg-primary/10 flex items-center justify-center transition-all"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Sidebar ── */}
        <div className="lg:col-span-4 space-y-6">
          {/* Profile completion */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-[32px] p-6 text-white shadow-xl">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-black overflow-hidden">
                {user.avatarUrl ? <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" /> : firstName[0]}
              </div>
              <div>
                <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Faculty ID</p>
                <p className="text-sm font-black">{user.studentId || 'EMP-XXXX'}</p>
                <p className="text-xs text-white/70">{user.year || 'Professor'}</p>
              </div>
            </div>
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
              <span className="text-white/70">Profile Completion</span>
              <span>{profilePct}%</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${profilePct}%` }} transition={{ duration: 1 }} className="h-full bg-white rounded-full" />
            </div>
            {profilePct < 100 && (
              <Link
                to="/teacher/profile"
                className="mt-4 w-full h-9 rounded-xl bg-white/20 hover:bg-white/30 text-white text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center border border-white/20"
              >
                Complete Profile →
              </Link>
            )}
          </div>

          {/* Live class */}
          <div className="bg-card rounded-[32px] p-6 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-black text-foreground flex items-center gap-3">
                <Play className="w-5 h-5 text-primary fill-primary/20" /> Live Class
              </h3>
              <Link to="/teacher/live-class" className="text-[10px] font-black uppercase text-primary hover:underline">Schedule</Link>
            </div>
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
              <div className="flex items-start justify-between mb-3">
                <div className="px-2 py-1 rounded bg-primary text-white text-[9px] font-black uppercase animate-pulse">Live Soon</div>
                <span className="text-[10px] font-bold text-muted-foreground">10:00 AM</span>
              </div>
              <h4 className="text-sm font-bold text-foreground mb-1">{myCourses[0]?.title || 'Lecture Session'}</h4>
              <p className="text-xs text-muted-foreground mb-4">{myCourses[0]?.code} • Virtual</p>
              <Link to="/teacher/live-class" className="w-full h-10 rounded-xl bg-primary text-white text-xs font-bold hover:shadow-lg transition-all flex items-center justify-center">
                Enter Portal
              </Link>
            </div>
          </div>

          {/* Quick actions */}
          <div className="space-y-3">
            {[
              { label: 'Review Submissions',  sub: `${pendingSubmissions} pending`,    to: '/teacher/assignments',    icon: CheckCircle2, color: 'text-green-600 bg-green-500/10 group-hover:bg-green-500 group-hover:text-white' },
              { label: 'Upload Syllabus',      sub: 'Import PDF / Word',               to: '/teacher/courses',        icon: FileText,     color: 'text-primary bg-primary/10 group-hover:bg-primary group-hover:text-white' },
              { label: 'Broadcast Message',    sub: 'Notify all students',             to: '/teacher/chat',           icon: MessageSquare,color: 'text-indigo-600 bg-indigo-500/10 group-hover:bg-indigo-500 group-hover:text-white' },
              { label: 'Student Groups',       sub: 'Manage study groups',             to: '/teacher/groups',         icon: Users,        color: 'text-orange-600 bg-orange-500/10 group-hover:bg-orange-500 group-hover:text-white' },
            ].map(({ label, sub, to, icon: Icon, color }) => (
              <Link key={label} to={to} className="w-full p-4 rounded-2xl bg-card border border-border flex items-center justify-between group hover:border-primary transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
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