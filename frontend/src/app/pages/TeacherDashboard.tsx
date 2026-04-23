import {
  BookOpen, Users, FileCheck, TrendingUp, Plus, Bell,
  ChevronRight, Clock, Star, BarChart2, MessageSquare,
  CheckCircle2, AlertCircle, Pencil, MoreVertical,
  Play, Calendar, Layout, FileText
} from 'lucide-react';
import { Link } from 'react-router';
import { useUser } from '../contexts/UserContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';

const ANALYTICS_DATA = [
  { name: 'Mon', submissions: 45, engagement: 85 },
  { name: 'Tue', submissions: 52, engagement: 78 },
  { name: 'Wed', submissions: 38, engagement: 92 },
  { name: 'Thu', submissions: 65, engagement: 88 },
  { name: 'Fri', submissions: 48, engagement: 81 },
  { name: 'Sat', submissions: 20, engagement: 45 },
  { name: 'Sun', submissions: 15, engagement: 30 },
];

const COURSE_PROGRESS = [
  { name: 'CS101', value: 72, color: '#1F5F5B' },
  { name: 'CS301', value: 80, color: '#2E7D73' },
  { name: 'CS401', value: 85, color: '#184D47' },
];

const STATS_COLORS = ['#1F5F5B', '#2E7D73', '#4DB6AC', '#A7D7C5'];

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div className="h-2 bg-secondary rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full ${color}`}
        style={{ width: `${(value / max) * 100}%`, transition: 'width 0.8s ease' }}
      />
    </div>
  );
}

export function TeacherDashboard() {
  const { user } = useUser();
  const firstName = user?.name?.split(' ')[0] || 'Teacher';

  const managedCourses = [
    {
      id: 1,
      name: 'Intro to Computer Science',
      code: 'CS101',
      students: 120,
      assignments: 8,
      avgScore: 85,
      completion: 72,
      color: 'from-teal-600 to-emerald-600',
      pending: 5,
    },
    {
      id: 2,
      name: 'Advanced Programming',
      code: 'CS301',
      students: 75,
      assignments: 12,
      avgScore: 88,
      completion: 80,
      color: 'from-indigo-600 to-purple-600',
      pending: 8,
    },
    {
      id: 3,
      name: 'Software Engineering',
      code: 'CS401',
      students: 60,
      assignments: 10,
      avgScore: 91,
      completion: 85,
      color: 'from-cyan-600 to-blue-600',
      pending: 2,
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Dynamic Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm text-muted-foreground font-medium">Instructor Control Center</span>
            <div className="w-1 h-1 rounded-full bg-muted-foreground"></div>
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Live Now</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground tracking-tight">Professor {firstName},</h1>
          <p className="text-muted-foreground mt-1 font-medium italic">
            You have <span className="text-primary font-bold">15 pending submissions</span> requiring your academic review.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/teacher/create-course"
            className="h-12 px-6 rounded-2xl bg-primary text-white font-bold flex items-center gap-2 hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Initialize Course
          </Link>
          <Link 
            to="/teacher/notifications"
            className="h-12 w-12 rounded-2xl bg-card border border-border flex items-center justify-center text-foreground hover:bg-secondary transition-all"
          >
            <Bell className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Analytics Insight Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Chart */}
          <div className="xl:col-span-2 bg-card rounded-[32px] p-8 border border-border shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-8">
                  <div>
                      <h3 className="text-lg font-bold text-foreground">Engagement Velocity</h3>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">Last 7 Days Academic Activity</p>
                  </div>
                  <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-primary"></div>
                          <span className="text-xs font-bold text-muted-foreground uppercase">Retention</span>
                      </div>
                      <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-accent"></div>
                          <span className="text-xs font-bold text-muted-foreground uppercase">Submissions</span>
                      </div>
                  </div>
              </div>
              <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={ANALYTICS_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                          <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} 
                            dy={10}
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} 
                          />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                            cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                          />
                          <Bar dataKey="submissions" fill="#1F5F5B" radius={[6, 6, 0, 0]} barSize={32} />
                          <Bar dataKey="engagement" fill="#A7D7C5" radius={[6, 6, 0, 0]} barSize={12} />
                      </BarChart>
                  </ResponsiveContainer>
              </div>
          </div>

          {/* Distribution Chart */}
          <div className="bg-card rounded-[32px] p-8 border border-border shadow-sm flex flex-col">
              <h3 className="text-lg font-bold text-foreground mb-1">Course Saturation</h3>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mb-8">Active Learner Distribution</p>
              
              <div className="flex-1 flex flex-col justify-center gap-8">
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={COURSE_PROGRESS}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={8}
                                dataKey="value"
                            >
                                {COURSE_PROGRESS.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-3">
                      {COURSE_PROGRESS.map((item, i) => (
                          <div key={item.name} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-transparent hover:border-border transition-all">
                              <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                                  <span className="text-xs font-bold text-foreground">{item.name}</span>
                              </div>
                              <span className="text-xs font-black text-primary">{item.value}%</span>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </div>

      {/* Course Cards & Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Workload */}
          <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-foreground tracking-tight">Academic Workload</h2>
                  <Link to="/teacher/courses" className="text-xs font-bold text-primary flex items-center gap-2 uppercase tracking-widest hover:underline">
                      Global Registry <ChevronRight className="w-4 h-4" />
                  </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {managedCourses.map(course => (
                      <div key={course.id} className="bg-card rounded-[28px] p-6 border border-border group hover:shadow-xl transition-all relative overflow-hidden">
                          <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${course.color} opacity-5 group-hover:scale-150 transition-transform duration-500 rounded-full translate-x-12 translate-y-[-12px]`}></div>
                          
                          <div className="flex items-start justify-between mb-6 relative z-10">
                              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${course.color} flex items-center justify-center text-white shadow-lg`}>
                                  <BookOpen className="w-6 h-6" />
                              </div>
                              <button className="w-10 h-10 rounded-xl bg-secondary text-muted-foreground flex items-center justify-center hover:text-primary transition-all">
                                  <MoreVertical className="w-5 h-5" />
                              </button>
                          </div>

                          <div className="mb-6 relative z-10">
                              <h3 className="text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors">{course.name}</h3>
                              <p className="text-xs font-bold text-muted-foreground mt-1 uppercase tracking-widest">{course.code} • {course.students} Learners</p>
                          </div>

                          <div className="space-y-4 relative z-10">
                              <div className="flex items-center justify-between text-xs font-bold">
                                  <span className="text-muted-foreground uppercase tracking-tighter">Throughput</span>
                                  <span className="text-primary font-black">{course.completion}%</span>
                              </div>
                              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${course.completion}%` }}
                                    className={`h-full bg-gradient-to-r ${course.color}`}
                                  />
                              </div>
                              <div className="flex items-center gap-4 pt-2">
                                  <Link 
                                    to={`/teacher/courses/${course.id}/manage`}
                                    className="flex-1 h-10 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center"
                                  >
                                      Launch Suite
                                  </Link>
                                  <button className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all">
                                      <FileText className="w-4 h-4" />
                                  </button>
                              </div>
                          </div>
                      </div>
                  ))}
                  <Link 
                    to="/teacher/create-course"
                    className="rounded-[28px] border-2 border-dashed border-border flex flex-col items-center justify-center p-8 gap-4 hover:bg-secondary/50 hover:border-primary/50 group transition-all"
                  >
                      <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-border flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary group-hover:rotate-90 transition-all duration-500">
                          <Plus className="w-6 h-6" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-foreground">Deploy New Module</p>
                        <p className="text-xs font-medium text-muted-foreground">Initialize academic node</p>
                      </div>
                  </Link>
              </div>
          </div>

          {/* Side Panels */}
          <div className="lg:col-span-4 space-y-6">
              {/* Meeting Deck */}
              <div className="bg-card rounded-[32px] p-6 border border-border shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-foreground flex items-center gap-3">
                          <Play className="w-5 h-5 text-accent fill-accent/10" />
                          Live Command
                      </h3>
                      <Link to="/teacher/live-class" className="text-[10px] font-black uppercase text-primary hover:underline">Full Schedule</Link>
                  </div>
                  <div className="space-y-3">
                      <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 relative overflow-hidden group">
                          <div className="flex items-start justify-between mb-4">
                              <div className="px-2 py-1 rounded bg-primary text-white text-[9px] font-black uppercase animate-pulse">Live Soon</div>
                              <span className="text-[10px] font-bold text-muted-foreground">10:00 AM</span>
                          </div>
                          <h4 className="text-sm font-bold text-foreground mb-1 leading-snug">The Algorithm Paradigm: CS301</h4>
                          <p className="text-xs text-muted-foreground font-medium mb-4">Virtual Session Node #4</p>
                          <Link 
                            to="/teacher/live-class"
                            className="w-full h-11 rounded-xl bg-primary text-white text-xs font-bold hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center"
                          >
                              Enter Lecture Portal
                          </Link>
                      </div>
                      <div className="p-4 rounded-2xl bg-secondary/50 border border-transparent hover:border-border transition-all space-y-3">
                           <div className="flex items-center justify-between">
                               <div className="flex items-center gap-3">
                                   <Calendar className="w-4 h-4 text-muted-foreground" />
                                   <span className="text-xs font-bold text-foreground">Staff Seminar</span>
                               </div>
                               <span className="text-[10px] font-bold text-muted-foreground">2:00 PM</span>
                           </div>
                           <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Room 204 • All Faculty</p>
                      </div>
                  </div>
              </div>

              {/* Quick Actions Feed */}
              <div className="space-y-3">
                  <button className="w-full p-5 rounded-2xl bg-card border border-border flex items-center justify-between group hover:border-primary transition-all">
                      <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                              <FileCheck className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                              <p className="text-sm font-bold text-foreground leading-none mb-1">Upload Syllabus</p>
                              <p className="text-[10px] font-bold text-muted-foreground uppercase">Import PDF/Word</p>
                          </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-all" />
                  </button>
                  <button className="w-full p-5 rounded-2xl bg-card border border-border flex items-center justify-between group hover:border-primary transition-all">
                      <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all">
                              <MessageSquare className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                              <p className="text-sm font-bold text-foreground leading-none mb-1">Mass Broadcast</p>
                              <p className="text-[10px] font-bold text-muted-foreground uppercase">Global Announcement</p>
                          </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-all" />
                  </button>
              </div>
          </div>
      </div>
    </div>
  );
}