import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import {
  BookOpen, Users, FileText, FolderOpen, Bell, Play,
  Download, ChevronRight, CheckCircle2, Lock, Video, File, ExternalLink,
  GraduationCap, MessageCircle, ArrowLeft, Clock
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useUser } from "../contexts/UserContext";
import { API } from "../../api/api";

export function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("lectures");
  const [course, setCourse] = useState<any>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const rolePath = user.role === 'teacher' ? 'teacher' : 'student';

  const lectures = [
    { id: 1, title: "Introduction & Overview", duration: "42:00", status: "completed", type: "video" },
    { id: 2, title: "Core Concepts Deep Dive", duration: "1:10:00", status: "in-progress", type: "video" },
    { id: 3, title: "Applied Lab Session", duration: "55:10", status: "locked", type: "video" },
    { id: 4, title: "Advanced Topics", duration: "1:05:00", status: "locked", type: "video" },
  ];

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const [courseRes, assignmentsRes, resourcesRes] = await Promise.all([
          fetch(API.courseDetails(id || ""), { headers }),
          fetch(API.courseAssignments(id || ""), { headers }),
          fetch(API.courseMaterials(id || ""), { headers }),
        ]);
        if (courseRes.ok) setCourse(await courseRes.json());
        if (assignmentsRes.ok) setAssignments(await assignmentsRes.json());
        if (resourcesRes.ok) setResources(await resourcesRes.json());
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchCourse();
  }, [id]);

  if (isLoading) {
    return <div className="text-center py-20 text-muted-foreground font-bold">Loading course...</div>;
  }

  if (!course) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-black text-foreground mb-4">Course not found</h2>
        <button onClick={() => navigate(-1)} className="text-primary font-bold hover:underline">Go Back</button>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    if (status === 'locked') return <Lock className="w-6 h-6" />;
    if (status === 'completed') return <Play className="w-6 h-6 fill-primary" />;
    return <Play className="w-6 h-6" />;
  };

  const getAssignmentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-orange-500/10 text-orange-600 border-orange-200';
      case 'in-progress': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'submitted': return 'bg-purple-500/10 text-purple-600 border-purple-200';
      case 'graded': return 'bg-green-500/10 text-green-600 border-green-200';
      case 'upcoming': return 'bg-primary/10 text-primary border-primary/20';
      default: return 'bg-secondary text-muted-foreground border-border';
    }
  };

  const groupedModuleResources = resources.reduce((acc: Record<string, any[]>, resource: any) => {
    let parsedMeta: any = null;
    try {
      parsedMeta = resource.description ? JSON.parse(resource.description) : null;
    } catch {
      parsedMeta = null;
    }
    const moduleName = parsedMeta?.module || 'General';
    if (!acc[moduleName]) acc[moduleName] = [];
    acc[moduleName].push({ ...resource, parsedMeta });
    return acc;
  }, {});

  const enrolledStudents = (course?.students || []).map((studentRel: any) => studentRel.user || studentRel);
  const groupWiseCounts = enrolledStudents.reduce((acc: Record<string, number>, student: any) => {
    const key = student.group || 'Ungrouped';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-8 pb-20">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Courses
      </button>

      {/* Hero Banner */}
      <div className="relative h-72 rounded-[40px] overflow-hidden shadow-2xl">
        <div className={`absolute inset-0 bg-gradient-to-br ${course.color}`} />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 p-10 flex flex-col justify-end">
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest border border-white/30">
                  {course.code}
                </span>
                <span className="text-white/70 text-[10px] font-bold uppercase tracking-widest">{course.semester}</span>
              </div>
              <h1 className="text-5xl font-black text-white tracking-tighter leading-none mb-4">{course.title}</h1>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-white/60 uppercase tracking-widest">Instructor</p>
                    <p className="text-sm font-bold text-white">{course.teacher?.name || 'Instructor'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-white/60 uppercase tracking-widest">Enrolled</p>
                    <p className="text-sm font-bold text-white">{course.students?.length || 0} Students</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right flex flex-col items-end gap-4">
              <div className="w-44 space-y-2">
                <div className="flex justify-between text-[10px] font-black text-white uppercase tracking-widest">
                  <span>Progress</span><span>{course.progress}%</span>
                </div>
                <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white transition-all duration-1000" style={{ width: `${course.progress}%` }} />
                </div>
              </div>
              <Link
                to={`/${rolePath}/chat/course/${course.id}`}
                className="h-10 px-6 rounded-2xl bg-white text-primary font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:shadow-xl transition-all"
              >
                <MessageCircle className="w-4 h-4" /> Course Chat
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-card rounded-[32px] p-4 border border-border shadow-sm sticky top-24 space-y-4">
            <div className="space-y-1">
              {[
                { id: 'lectures', label: 'Lectures', icon: Video },
                { id: 'assignments', label: 'Assignments', icon: FileText },
                { id: 'students', label: 'Enrolled Students', icon: Users },
                { id: 'resources', label: 'Resources', icon: FolderOpen },
                { id: 'announcements', label: 'Announcements', icon: Bell },
              ].map(tab => (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all group ${activeTab === tab.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-foreground/70 hover:bg-secondary hover:text-foreground'}`}
                >
                  <div className="flex items-center gap-4">
                    <tab.icon className="w-5 h-5" />
                    <span className="text-sm font-bold">{tab.label}</span>
                  </div>
                  {tab.id === 'assignments' && assignments.length > 0 && (
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'}`}>
                      {assignments.length}
                    </span>
                  )}
                  {activeTab === tab.id && <ChevronRight className="w-4 h-4" />}
                </button>
              ))}
            </div>

            {/* Course info card */}
            <div className="mt-4 p-4 rounded-2xl bg-secondary/50 space-y-3">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-muted-foreground">Credits</span>
                <span className="text-foreground">3</span>
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-muted-foreground">Semester</span>
                <span className="text-foreground">{course.semester}</span>
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                <span className="text-muted-foreground">Assignments</span>
                <span className="text-foreground">{assignments.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Pane */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Lectures */}
              {activeTab === 'lectures' && (
                <div className="space-y-4">
                  {lectures.map((lecture, i) => (
                    <div key={lecture.id}
                      className={`p-6 rounded-[28px] bg-card border border-border flex items-center justify-between group transition-all ${lecture.status === 'locked' ? 'opacity-60 cursor-not-allowed' : 'hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 cursor-pointer'}`}>
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-primary relative overflow-hidden">
                          {getStatusIcon(lecture.status)}
                          {lecture.status === 'in-progress' && <div className="absolute inset-0 border-2 border-primary border-t-transparent rounded-2xl animate-spin" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Lecture {i + 1}</span>
                            {lecture.status === 'completed' && <CheckCircle2 className="w-3 h-3 text-green-500" />}
                          </div>
                          <h4 className="text-base font-black text-foreground">{lecture.title}</h4>
                          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-0.5 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {lecture.duration}
                          </p>
                        </div>
                      </div>
                      {lecture.status !== 'locked' && (
                        <button className="h-10 px-6 rounded-xl bg-secondary text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm">
                          {lecture.status === 'completed' ? 'Replay' : 'Start'}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Assignments */}
              {activeTab === 'assignments' && (
                <div className="space-y-4">
                  {assignments.length > 0 ? assignments.map((assignment) => (
                    <Link
                      key={assignment.id}
                      to={`/${rolePath}/assignments/${assignment.id}`}
                      id={`assignment-${assignment.id}`}
                      className="p-8 rounded-[32px] bg-card border border-border group hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all flex items-center justify-between block"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-foreground group-hover:text-primary transition-colors">{assignment.title}</h4>
                          <p className="text-xs font-bold text-muted-foreground mt-1 uppercase tracking-widest">
                            {user.role === 'teacher'
                              ? `${assignment.submissions?.filter((s: any) => s.status === 'submitted').length || 0} Submitted • ${assignment.submissions?.filter((s: any) => s.status === 'graded').length || 0} Graded`
                              : <>Due: <span className="text-foreground">{new Date(assignment.dueDate).toLocaleDateString()}</span> &nbsp;•&nbsp; {assignment.points} pts</>
                            }
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {user.role === 'teacher' ? (
                          <span className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase border bg-primary/10 text-primary border-primary/20">
                            {course.students?.length
                              ? `${Math.round(((assignment.submissions?.length || 0) / course.students.length) * 100)}% Submission`
                              : 'No enrollments'}
                          </span>
                        ) : (
                          <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase border ${getAssignmentStatusColor(assignment.status || 'pending')}`}>
                            {(assignment.status || 'pending').replace('-', ' ')}
                          </span>
                        )}
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </Link>
                  )) : (
                    <div className="py-20 text-center bg-secondary/30 rounded-[40px] border border-dashed border-border">
                      <FileText className="w-16 h-16 text-muted-foreground/20 mx-auto mb-6" />
                      <h3 className="text-xl font-bold text-foreground">No Assignments Yet</h3>
                      <p className="text-sm text-muted-foreground mt-2">Check back later for new assignments.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Resources */}
              {activeTab === 'resources' && (
                <div className="space-y-5">
                  {Object.entries(groupedModuleResources).map(([moduleName, moduleResources]) => (
                    <div key={moduleName} className="rounded-[28px] bg-card border border-border p-5">
                      <h3 className="text-sm font-black text-foreground uppercase tracking-widest mb-4">{moduleName}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {moduleResources.map((res: any) => (
                          <div key={res.id} className="p-5 rounded-2xl bg-secondary/30 border border-border hover:border-primary transition-all flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                              <div className="w-11 h-11 rounded-xl bg-card flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                <File className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-foreground mb-0.5">{res.parsedMeta?.sectionTitle || res.title}</p>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                  {(res.parsedMeta?.type || res.materialType)} • {new Date(res.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            {res.fileUrl ? (
                              <a href={res.fileUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-card text-muted-foreground hover:text-primary transition-all flex items-center justify-center">
                                <Download className="w-4 h-4" />
                              </a>
                            ) : res.linkUrl ? (
                              <a href={res.linkUrl} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl bg-card text-muted-foreground hover:text-primary transition-all flex items-center justify-center">
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            ) : (
                              <div className="px-2 py-1 rounded-lg text-[10px] font-bold bg-primary/10 text-primary">Text</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {resources.length === 0 && (
                    <div className="col-span-2 py-16 text-center bg-secondary/30 rounded-[32px] border border-dashed border-border">
                      <FolderOpen className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-sm font-bold text-muted-foreground">No study material uploaded yet.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Enrolled Students */}
              {activeTab === 'students' && (
                <div className="rounded-[28px] bg-card border border-border p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Enrolled Students</h3>
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                      {enrolledStudents.length} total
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {Object.entries(groupWiseCounts).map(([group, count]) => (
                      <span key={group} className="px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary">
                        {group}: {count}
                      </span>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {enrolledStudents.length === 0 ? (
                      <p className="text-xs font-bold text-muted-foreground">No students enrolled yet.</p>
                    ) : (
                      enrolledStudents.map((student: any) => (
                        <div key={student.id} className="p-3 rounded-xl bg-secondary/30 border border-border">
                          <p className="text-sm font-bold text-foreground">{student.name}</p>
                          <p className="text-[11px] text-muted-foreground">{student.email}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary mt-1">
                            {student.group || 'Ungrouped'}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Announcements */}
              {activeTab === 'announcements' && (
                <div className="py-20 text-center bg-secondary/30 rounded-[40px] border border-dashed border-border">
                  <Bell className="w-16 h-16 text-muted-foreground/20 mx-auto mb-6" />
                  <h3 className="text-xl font-bold text-foreground">No Announcements Yet</h3>
                  <p className="text-sm text-muted-foreground mt-2">The instructor hasn't posted any announcements.</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
