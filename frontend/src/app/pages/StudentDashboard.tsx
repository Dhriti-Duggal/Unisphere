import { 
    BookOpen, ClipboardList, TrendingUp, Users, Calendar, 
    Clock, CheckCircle2, AlertCircle, Flame, ChevronRight,
    PlayCircle, BookMarked, Bell, ArrowUpRight, Search, MessageSquare
} from 'lucide-react';
import { Link } from 'react-router';
import { useUser } from '../contexts/UserContext';
import { motion } from 'motion/react';

// ─── Attendance Ring Component ────────────────────────────────────────────────
function AttendanceRing({ pct }: { pct: number }) {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const color = '#1F5F5B'; // Primary Theme Color
  return (
    <div className="relative flex items-center justify-center">
        <svg width="100" height="100" viewBox="0 0 96 96" className="transform rotate-[-90deg]">
        <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(31, 95, 91, 0.1)" strokeWidth="6" />
        <motion.circle
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            cx="48" cy="48" r={r}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeDasharray={circ}
            strokeLinecap="round"
        />
        </svg>
        <div className="absolute flex flex-col items-center">
            <span className="text-xl font-black text-foreground">{pct}%</span>
            <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Attendance</span>
        </div>
    </div>
  );
}

// ─── Grade Bar Component ──────────────────────────────────────────────────────
function GradeBar({ course, grade }: { course: string; grade: number }) {
  const letter = grade >= 93 ? 'A' : grade >= 90 ? 'A-' : grade >= 87 ? 'B+' : grade >= 83 ? 'B' : grade >= 80 ? 'B-' : 'C+';
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">{course}</span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full">{letter}</span>
          <span className="text-[10px] font-bold text-muted-foreground">{grade}%</span>
        </div>
      </div>
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${grade}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-primary rounded-full shadow-sm"
        />
      </div>
    </div>
  );
}

export function StudentDashboard() {
  const { user } = useUser();
  const firstName = user?.name?.split(" ")[0] || "Student";

  const enrolledCourses = [
    { id: 1, name: 'Intro to Computer Science', code: 'CS101', teacher: 'Dr. Sarah Johnson', progress: 72, color: 'from-teal-600 to-emerald-600' },
    { id: 2, name: 'Data Structures & Algorithms', code: 'CS201', teacher: 'Prof. Michael Chen', progress: 55, color: 'from-indigo-600 to-blue-600' },
    { id: 3, name: 'Web Development', code: 'CS301', teacher: 'Dr. Emily Davis', progress: 80, color: 'from-primary to-accent' },
    { id: 4, name: 'Database Systems', code: 'CS205', teacher: 'Prof. James Wilson', progress: 65, color: 'from-cyan-600 to-teal-600' },
  ];

  const upcomingDeadlines = [
    { id: 1, title: 'Lab Report 3', course: 'CS101', daysLeft: 2, status: 'urgent' },
    { id: 2, title: 'Binary Tree Implementation', course: 'CS201', daysLeft: 4, status: 'upcoming' },
    { id: 3, title: 'React Portfolio Project', course: 'CS301', daysLeft: 7, status: 'in-progress' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Premium Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-primary/5 p-8 rounded-[40px] border border-primary/10">
        <div className="flex items-center gap-6">
            <Link to="/student/profile" className="relative group">
                <div className="w-20 h-20 rounded-[28px] bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-primary/20 group-hover:scale-105 transition-transform overflow-hidden">
                    {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                        firstName[0]
                    )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-white border-4 border-primary/5 flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                    <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                </div>
            </Link>
            <div>
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1 italic">Welcome back to your orbit</p>
                <h1 className="text-4xl font-black text-foreground tracking-tight">Bonjour, {firstName}!</h1>
                <p className="text-sm font-medium text-muted-foreground mt-1">You have <span className="text-primary font-bold">3 critical tasks</span> requiring focus today.</p>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <div className="h-14 px-6 rounded-2xl bg-white border border-border flex flex-col justify-center shadow-sm">
                <span className="text-[10px] font-black text-muted-foreground uppercase">Academic Streak</span>
                <span className="text-lg font-black text-foreground flex items-center gap-2">14 Days <Flame className="w-4 h-4 text-orange-500 fill-orange-500" /></span>
            </div>
            <Link 
                to="/student/search"
                className="h-14 w-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 transition-all"
            >
                <Search className="w-6 h-6" />
            </Link>
        </div>
      </div>

      {/* Main Grid System */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Flow: Courses & Assignments */}
          <div className="lg:col-span-8 space-y-8">
              {/* Active Courses */}
              <section>
                  <div className="flex items-end justify-between mb-6 px-2">
                      <div>
                          <h2 className="text-xl font-black text-foreground leading-none">Learning Registry</h2>
                          <p className="text-xs font-bold text-muted-foreground mt-1 uppercase tracking-widest">Active Enrollment Path</p>
                      </div>
                      <Link to="/student/courses" className="text-xs font-bold text-primary flex items-center gap-2 group uppercase tracking-widest">
                          Global Courses <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {enrolledCourses.map(course => (
                          <Link 
                            key={course.id} 
                            to={`/student/courses/${course.id}`}
                            className="bg-card p-6 rounded-[32px] border border-border hover:shadow-2xl hover:shadow-primary/5 transition-all group relative overflow-hidden"
                          >
                                <div className="flex items-start justify-between mb-6 relative z-10">
                                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${course.color} flex items-center justify-center text-white shadow-lg`}>
                                        <BookOpen className="w-6 h-6" />
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-secondary text-[10px] font-black text-muted-foreground uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                                        View Syllabus
                                    </div>
                                </div>
                                <div className="mb-6 relative z-10">
                                    <h3 className="text-lg font-black text-foreground leading-tight group-hover:text-primary transition-colors">{course.name}</h3>
                                    <p className="text-xs font-bold text-muted-foreground mt-1">{course.code} • {course.teacher}</p>
                                </div>
                                <div className="space-y-4 relative z-10">
                                    <div className="flex items-center justify-between text-xs font-black">
                                        <span className="text-muted-foreground uppercase tracking-widest">Mastery</span>
                                        <span className="text-primary">{course.progress}%</span>
                                    </div>
                                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${course.progress}%` }}
                                            className={`h-full bg-gradient-to-r ${course.color}`}
                                        />
                                    </div>
                                </div>
                                {/* Background Accent */}
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${course.color} opacity-5 group-hover:scale-150 transition-transform duration-700 rounded-full translate-x-12 translate-y-[-12px]`}></div>
                          </Link>
                      ))}
                  </div>
              </section>

              {/* Task Hub */}
              <section className="bg-card p-8 rounded-[40px] border border-border shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                      <h3 className="text-xl font-black text-foreground flex items-center gap-3">
                          <ClipboardList className="w-6 h-6 text-primary" />
                          Academic Tasks
                      </h3>
                      <div className="flex gap-2">
                        {['All', 'Urgent', 'Done'].map(tab => (
                            <button key={tab} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'All' ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'}`}>{tab}</button>
                        ))}
                      </div>
                  </div>

                  <div className="space-y-3">
                      {upcomingDeadlines.map(task => (
                          <div key={task.id} className="p-5 rounded-3xl bg-secondary/30 border border-transparent hover:border-border transition-all flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${task.status === 'urgent' ? 'bg-red-500' : 'bg-primary'}`}>
                                        {task.status === 'urgent' ? <AlertCircle className="w-6 h-6" /> : <BookMarked className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{task.title}</h4>
                                        <p className="text-xs font-bold text-muted-foreground uppercase">{task.course}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8">
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-muted-foreground uppercase">Due Status</p>
                                        <p className={`text-xs font-black ${task.status === 'urgent' ? 'text-red-500 animate-pulse' : 'text-primary'}`}>
                                            {task.daysLeft} DAYS LEFT
                                        </p>
                                    </div>
                                    <button className="h-10 px-5 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:shadow-lg hover:shadow-primary/20 transition-all">Submit Now</button>
                                </div>
                          </div>
                      ))}
                  </div>
              </section>
          </div>

          {/* Right Flow: Analytics & Social */}
          <div className="lg:col-span-4 space-y-8">
              <Link 
                to="/student/analytics"
                className="block bg-gradient-to-tr from-primary to-accent p-8 rounded-[40px] shadow-xl shadow-primary/20 text-white relative overflow-hidden group"
              >
                  <div className="relative z-10 mb-8">
                      <h3 className="text-lg font-black uppercase tracking-widest mb-1">Scholar Score</h3>
                      <p className="text-xs font-medium text-white/70 italic">Aggregated academic performance</p>
                  </div>
                  
                  <div className="relative z-10 flex flex-col items-center gap-8">
                      <AttendanceRing pct={91} />
                      <div className="w-full space-y-4">
                          <GradeBar course="CS101" grade={92} />
                          <GradeBar course="CS201" grade={85} />
                          <GradeBar course="CS301" grade={95} />
                      </div>
                  </div>

                  <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-white/10 rounded-full blur-[60px] animate-pulse"></div>
              </Link>

              {/* Next Class Module */}
              <div className="bg-card p-8 rounded-[32px] border border-border shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-base font-black text-foreground uppercase tracking-tighter flex items-center gap-3">
                        <PlayCircle className="w-6 h-6 text-primary" />
                        Next Live Node
                    </h3>
                    <div className="w-2 h-2 rounded-full bg-primary animate-ping"></div>
                  </div>
                  {enrolledCourses.length > 0 ? (
                    <div className="relative p-5 rounded-3xl bg-secondary/80 border border-border overflow-hidden">
                        <div className="absolute top-0 right-0 p-3">
                          <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <span className="text-[10px] font-black text-primary uppercase">Starting in 20m</span>
                        <h4 className="text-sm font-bold text-foreground mt-2 leading-tight">Advanced Algorithms (Lec 4)</h4>
                        <p className="text-xs font-bold text-muted-foreground mt-1">Prof. Michael Chen</p>
                        <Link 
                          to="/student/live-class"
                          className="w-full h-11 mt-4 rounded-xl bg-primary text-white text-xs font-bold shadow-md hover:shadow-primary/30 transition-all flex items-center justify-center"
                        >
                          Join Session
                        </Link>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">No active nodes</p>
                        <Link to="/student/courses" className="text-[10px] font-black text-primary uppercase hover:underline">Browse Catalogue</Link>
                    </div>
                  )}
              </div>

              {/* Quick Actions Feed */}
              <div className="space-y-3">
                  <Link 
                    to="/student/notifications"
                    className="flex items-center gap-3 p-4 rounded-3xl bg-white border border-border hover:border-primary transition-all group cursor-pointer"
                  >
                      <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-all">
                        <Bell className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-foreground leading-none mb-1">New Grade Posted</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Data Structures • 2h ago</p>
                      </div>
                  </Link>
                  <Link 
                    to="/student/groups"
                    className="flex items-center gap-3 p-4 rounded-3xl bg-white border border-border hover:border-primary transition-all group cursor-pointer"
                  >
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                        <Users className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-foreground leading-none mb-1">Group Request</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Web Dev Study • 4h ago</p>
                      </div>
                  </Link>
                  <Link 
                    to="/student/chat"
                    className="flex items-center gap-3 p-4 rounded-3xl bg-white border border-border hover:border-primary transition-all group cursor-pointer"
                  >
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-foreground leading-none mb-1">Oracle Terminal</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Open direct transmissions</p>
                      </div>
                  </Link>
              </div>
          </div>
      </div>
    </div>
  );
}
