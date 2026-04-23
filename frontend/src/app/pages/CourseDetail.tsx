import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import {
  BookOpen, Users, Calendar, FileText, 
  MessageSquare, FolderOpen, Bell, Clock,
  Play, Download, ChevronRight, CheckCircle2,
  Lock, ExternalLink, Video, File
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function CourseDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("lectures");
  
  // Mock course data
  const course = {
    id: id,
    title: "Web Development",
    code: "CS301",
    instructor: "Dr. Michael Chen",
    students: 120,
    description: "Master the art of building scalable, modern web applications with React and Node.js. This course covers everything from component architecture to state management and backend integration.",
    color: "from-primary to-accent",
    semester: "Spring 2026",
    progress: 45
  };

  const lectures = [
    { id: 1, title: "Introduction to React Hooks", duration: "45:20", status: "completed", type: "video" },
    { id: 2, title: "State Management with Redux", duration: "1:15:00", status: "in-progress", type: "video" },
    { id: 3, title: "Component Life Cycle In-Depth", duration: "55:10", status: "locked", type: "video" },
  ];

  const assignments = [
    { id: 1, title: "Portfolio Website Build", dueDate: "2026-04-30", status: "pending", points: 100 },
    { id: 2, title: "API Integration Lab", dueDate: "2026-05-15", status: "upcoming", points: 50 },
  ];

  const resources = [
    { id: 1, title: "Course Syllabus", type: "PDF", size: "1.2 MB" },
    { id: 2, title: "React Cheat Sheet", type: "IMAGE", size: "800 KB" },
    { id: 3, title: "Backend setup.zip", type: "ARCHIVE", size: "15 MB" },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Cinematic Course Header */}
      <div className="relative h-80 rounded-[40px] overflow-hidden shadow-2xl">
          <div className={`absolute inset-0 bg-gradient-to-br ${course.color} opacity-95`}></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          
          <div className="absolute inset-0 p-12 flex flex-col justify-end">
             <div className="flex items-end justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest border border-white/30">
                            Core Module {course.code}
                        </span>
                        <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest">{course.semester}</span>
                    </div>
                    <h1 className="text-6xl font-black text-white tracking-tighter leading-none mb-6">{course.title}</h1>
                    <div className="flex gap-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                                <Users className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-white/60 uppercase tracking-widest">Instructor</p>
                                <p className="text-sm font-bold text-white">{course.instructor}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                                <GraduationCap className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-white/60 uppercase tracking-widest">Enrolled</p>
                                <p className="text-sm font-bold text-white">{course.students} Learners</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="text-right flex flex-col items-end gap-4">
                    <div className="w-48 space-y-2">
                        <div className="flex justify-between text-[10px] font-black text-white uppercase tracking-widest">
                            <span>Module Mastered</span>
                            <span>{course.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                            <div className="h-full bg-white transition-all duration-1000" style={{ width: `${course.progress}%` }}></div>
                        </div>
                    </div>
                    <Link 
                        to={`/chat/course/${course.id}`}
                        className="h-12 px-8 rounded-2xl bg-white text-primary font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:shadow-xl transition-all"
                    >
                         <MessageCircle className="w-5 h-5" />
                         Session Chat
                    </Link>
                </div>
             </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Navigation Tabs Side */}
          <div className="lg:col-span-3">
              <div className="bg-card rounded-[32px] p-4 border border-border shadow-sm sticky top-24">
                  <div className="space-y-1">
                      {[
                          { id: 'lectures', label: 'Lectures', icon: Video },
                          { id: 'assignments', label: 'Assignments', icon: FileText },
                          { id: 'resources', label: 'Resources', icon: FolderOpen },
                          { id: 'announcements', label: 'Announcements', icon: Bell },
                      ].map(tab => (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all group ${activeTab === tab.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-foreground/70 hover:bg-secondary hover:text-foreground'}`}
                          >
                            <div className="flex items-center gap-4">
                                <tab.icon className={`w-5 h-5 transition-transform ${activeTab === tab.id ? '' : 'group-hover:scale-110'}`} />
                                <span className="text-sm font-bold">{tab.label}</span>
                            </div>
                            {activeTab === tab.id && <ChevronRight className="w-4 h-4" />}
                          </button>
                      ))}
                  </div>
              </div>
          </div>

          {/* Dynamic Content Pane */}
          <div className="lg:col-span-9">
              <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                        {activeTab === 'lectures' && (
                            <div className="space-y-4">
                                {lectures.map((lecture, i) => (
                                    <div key={lecture.id} className={`p-6 rounded-[32px] bg-card border border-border flex items-center justify-between group transition-all ${lecture.status === 'locked' ? 'opacity-60 cursor-not-allowed' : 'hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5'}`}>
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-primary relative overflow-hidden">
                                                {lecture.status === 'locked' ? <Lock className="w-6 h-6" /> : <Play className={`w-6 h-6 ${lecture.status === 'completed' ? 'fill-primary' : ''}`} />}
                                                {lecture.status === 'in-progress' && <div className="absolute inset-0 border-2 border-primary border-t-transparent rounded-2xl animate-spin"></div>}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">Lecture {i + 1}</span>
                                                    {lecture.status === 'completed' && <CheckCircle2 className="w-3 h-3 text-green-500" />}
                                                </div>
                                                <h4 className="text-lg font-black text-foreground">{lecture.title}</h4>
                                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1 italic">{lecture.duration} Total Runtime</p>
                                            </div>
                                        </div>
                                        {lecture.status !== 'locked' && (
                                            <button className="h-10 px-6 rounded-xl bg-secondary text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm">
                                                Initialize Flow
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'assignments' && (
                            <div className="space-y-4">
                                 {assignments.map((assignment) => (
                                    <div key={assignment.id} className="p-8 rounded-[32px] bg-card border border-border group hover:border-primary/30 transition-all flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-black text-foreground">{assignment.title}</h4>
                                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">
                                                    Due: <span className="text-red-500">{assignment.dueDate}</span> • {assignment.points} Points Available
                                                </p>
                                            </div>
                                        </div>
                                        <button className="h-12 px-8 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                                            Submit Protocol
                                        </button>
                                    </div>
                                 ))}
                            </div>
                        )}

                        {activeTab === 'resources' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {resources.map((res) => (
                                    <div key={res.id} className="p-6 rounded-[28px] bg-card border border-border hover:border-primary transition-all flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                             <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                <File className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-foreground mb-0.5">{res.title}</p>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{res.type} • {res.size}</p>
                                            </div>
                                        </div>
                                        <button className="w-10 h-10 rounded-xl bg-secondary text-muted-foreground hover:text-primary transition-all flex items-center justify-center">
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'announcements' && (
                            <div className="py-20 text-center bg-secondary/30 rounded-[40px] border border-dashed border-border">
                                <Bell className="w-16 h-16 text-muted-foreground/20 mx-auto mb-6" />
                                <h3 className="text-xl font-bold text-foreground">Awaiting Broadcasts</h3>
                                <p className="text-sm text-muted-foreground mt-2">The instructor has not issued any global transmissions for this module.</p>
                            </div>
                        )}
                  </motion.div>
              </AnimatePresence>
          </div>
      </div>
    </div>
  );
}
