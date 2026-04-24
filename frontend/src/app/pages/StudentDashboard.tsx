import { 
    BookOpen, ClipboardList, TrendingUp, Users, Calendar, 
    Clock, CheckCircle2, AlertCircle, Flame, ChevronRight,
    PlayCircle, BookMarked, Bell, ArrowUpRight, Search, MessageSquare,
    Building2
} from 'lucide-react';
import { Link } from 'react-router';
import { useUser } from '../contexts/UserContext';
import { motion } from 'motion/react';
import { getCoursesByDepartment, getAssignmentsByDepartment, DEPARTMENTS } from '../data/departments';
import { useState, useEffect } from 'react';
import { API } from '../../api/api';

// ─── Attendance Ring Component ────────────────────────────────────────────────
function AttendanceRing({ pct }: { pct: number }) {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const color = '#1F5F5B';
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

  const deptId = user.departmentId || 'cse';
  const dept = DEPARTMENTS.find(d => d.id === deptId);
  const upcomingDeadlines = getAssignmentsByDepartment(deptId).filter(a => a.status === 'pending' || a.status === 'in-progress').slice(0, 3);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [liveClass, setLiveClass] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        
        // Fetch all department courses so the student dashboard is populated
        const coursesRes = await fetch(API.studentCourses, { headers });
        if (coursesRes.ok) {
          const coursesData = await coursesRes.json();
          const formattedCourses = coursesData.map((c: any) => ({
            id: c._id,
            title: c.title,
            code: c.code,
            instructor: c.teacher?.name || 'Instructor',
            progress: c.progress || Math.floor(Math.random() * 40) + 10,
            color: c.color || 'from-indigo-600 to-purple-600'
          }));
          setEnrolledCourses(formattedCourses);

          // Fetch live classes for these courses
          if (coursesData.length > 0) {
            // For simplicity, just fetch live classes for the first course
            const liveRes = await fetch(API.courseLiveClasses(coursesData[0]._id), { headers });
            if (liveRes.ok) {
              const liveData = await liveRes.json();
              if (liveData.length > 0) {
                // Find the nearest upcoming live class
                setLiveClass({
                  title: liveData[0].title,
                  instructor: liveData[0].instructor?.name || 'Instructor',
                  startTime: new Date(liveData[0].scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  courseCode: formattedCourses[0].code
                });
              }
            }
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Get course name by id for assignment display
  const getCourseCode = (courseId: number | string) => {
    return enrolledCourses.find(c => c.id === courseId)?.code || 'COURSE';
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Premium Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-primary/5 p-8 rounded-[40px] border border-primary/10">
        <div className="flex items-center gap-6">
            <Link to="/student/profile" className="relative group" id="dashboard-profile-link">
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
                {/* Department badge */}
                {dept && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg">{dept.icon}</span>
                    <span className="text-sm font-bold text-muted-foreground">{dept.name}</span>
                    <span className={`text-[10px] font-black text-white px-2 py-0.5 rounded-full bg-gradient-to-r ${dept.color}`}>
                      {dept.shortName}
                    </span>
                  </div>
                )}
                <p className="text-sm font-medium text-muted-foreground mt-1">You have <span className="text-primary font-bold">{upcomingDeadlines.length} pending tasks</span> requiring focus today.</p>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <div className="h-14 px-6 rounded-2xl bg-white border border-border flex flex-col justify-center shadow-sm">
                <span className="text-[10px] font-black text-muted-foreground uppercase">Academic Streak</span>
                <span className="text-lg font-black text-foreground flex items-center gap-2">14 Days <Flame className="w-4 h-4 text-orange-500 fill-orange-500" /></span>
            </div>
            <Link 
                to="/student/profile"
                id="dashboard-profile-btn"
                className="h-14 w-14 rounded-2xl bg-white border border-border flex items-center justify-center shadow-sm hover:border-primary hover:shadow-lg transition-all"
                title="Go to Profile"
            >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-black">
                    {firstName[0]}
                </div>
            </Link>
            <Link 
                to="/student/search"
                className="h-14 w-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                id="dashboard-search-btn"
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
                          <p className="text-xs font-bold text-muted-foreground mt-1 uppercase tracking-widest">
                            {dept ? `${dept.name} Courses` : 'Active Enrollment Path'}
                          </p>
                      </div>
                      <Link to="/student/courses" className="text-xs font-bold text-primary flex items-center gap-2 group uppercase tracking-widest">
                          All Courses <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {enrolledCourses.length > 0 ? enrolledCourses.map(course => (
                          <Link 
                            key={course.id} 
                            to={`/student/courses/${course.id}`}
                            id={`course-card-${course.id}`}
                            className="bg-card p-6 rounded-[32px] border border-border hover:shadow-2xl hover:shadow-primary/5 transition-all group relative overflow-hidden"
                          >
                                <div className="flex items-start justify-between mb-6 relative z-10">
                                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${course.color} flex items-center justify-center text-white shadow-lg`}>
                                        <BookOpen className="w-6 h-6" />
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-secondary text-[10px] font-black text-muted-foreground uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                                        View Details
                                    </div>
                                </div>
                                <div className="mb-6 relative z-10">
                                    <h3 className="text-lg font-black text-foreground leading-tight group-hover:text-primary transition-colors">{course.title}</h3>
                                    <p className="text-xs font-bold text-muted-foreground mt-1">{course.code} • {course.instructor}</p>
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
                      )) : (
                        <div className="col-span-2 text-center py-12 bg-secondary/30 rounded-[32px] border border-dashed border-border">
                          <Building2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                          <p className="text-sm font-bold text-muted-foreground">No courses found for your department.</p>
                          <Link to="/student/courses" className="text-xs font-bold text-primary mt-2 inline-block hover:underline">Browse All Courses</Link>
                        </div>
                      )}
                  </div>
              </section>

              {/* Task Hub */}
              <section className="bg-card p-8 rounded-[40px] border border-border shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                      <h3 className="text-xl font-black text-foreground flex items-center gap-3">
                          <ClipboardList className="w-6 h-6 text-primary" />
                          Academic Tasks
                      </h3>
                      <Link 
                        to="/student/assignments"
                        className="text-xs font-bold text-primary flex items-center gap-1 uppercase tracking-widest hover:underline"
                      >
                        View All <ArrowUpRight className="w-3 h-3" />
                      </Link>
                  </div>

                  <div className="space-y-3">
                      {upcomingDeadlines.length > 0 ? upcomingDeadlines.map(task => (
                          <Link 
                            key={task.id}
                            to={`/student/assignments/${task.id}`}
                            id={`task-${task.id}`}
                            className="p-5 rounded-3xl bg-secondary/30 border border-transparent hover:border-border transition-all flex items-center justify-between group"
                          >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${task.status === 'pending' ? 'bg-orange-500' : task.status === 'in-progress' ? 'bg-blue-500' : 'bg-primary'}`}>
                                        {task.status === 'pending' ? <AlertCircle className="w-6 h-6" /> : <BookMarked className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{task.title}</h4>
                                        <p className="text-xs font-bold text-muted-foreground uppercase">{getCourseCode(task.courseId)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-muted-foreground uppercase">Due Date</p>
                                        <p className="text-xs font-black text-primary">{task.dueDate}</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                          </Link>
                      )) : (
                        <div className="text-center py-8">
                          <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-2" />
                          <p className="text-sm font-bold text-foreground">All caught up!</p>
                          <p className="text-xs text-muted-foreground">No pending assignments right now.</p>
                        </div>
                      )}
                  </div>
              </section>
          </div>

          {/* Right Flow: Analytics & Social */}
          <div className="lg:col-span-4 space-y-8">
              <Link 
                to="/student/analytics"
                className="block bg-gradient-to-tr from-primary to-accent p-8 rounded-[40px] shadow-xl shadow-primary/20 text-white relative overflow-hidden group"
                id="analytics-card"
              >
                  <div className="relative z-10 mb-8">
                      <h3 className="text-lg font-black uppercase tracking-widest mb-1">Scholar Score</h3>
                      <p className="text-xs font-medium text-white/70 italic">Aggregated academic performance</p>
                  </div>
                  
                  <div className="relative z-10 flex flex-col items-center gap-8">
                      <AttendanceRing pct={91} />
                      <div className="w-full space-y-4">
                          {enrolledCourses.slice(0, 3).map(c => (
                            <GradeBar key={c.id} course={c.code} grade={Math.floor(Math.random() * 20) + 78} />
                          ))}
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
                  {liveClass ? (
                    <div className="relative p-5 rounded-3xl bg-secondary/80 border border-border overflow-hidden">
                        <div className="absolute top-0 right-0 p-3">
                          <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <span className="text-[10px] font-black text-primary uppercase">Starting at {liveClass.startTime}</span>
                        <h4 className="text-sm font-bold text-foreground mt-2 leading-tight">{liveClass.title}</h4>
                        <p className="text-xs font-bold text-muted-foreground mt-1">{liveClass.courseCode} • {liveClass.instructor}</p>
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
                    id="notif-link"
                    className="flex items-center gap-3 p-4 rounded-3xl bg-white border border-border hover:border-primary transition-all group cursor-pointer"
                  >
                      <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-all">
                        <Bell className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-foreground leading-none mb-1">New Grade Posted</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">{enrolledCourses[0]?.code || 'Course'} • 2h ago</p>
                      </div>
                  </Link>
                  <Link 
                    to="/student/groups"
                    id="groups-link"
                    className="flex items-center gap-3 p-4 rounded-3xl bg-white border border-border hover:border-primary transition-all group cursor-pointer"
                  >
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                        <Users className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-foreground leading-none mb-1">Group Request</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">{dept?.shortName || ''} Study Group • 4h ago</p>
                      </div>
                  </Link>
                  <Link 
                    to="/student/chat"
                    id="chat-link"
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
