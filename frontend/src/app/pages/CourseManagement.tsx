import { useState } from 'react';
import { 
  Video, FileText, Plus, Users, Trash2, Edit2, 
  ChevronRight, Upload, PlayCircle, BookOpen,
  Calendar, CheckCircle2, AlertCircle, Search,
  Download, File
} from 'lucide-react';
import { useParams, Link, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { API } from '../../api/api';

interface Resource {
  id: string;
  type: 'video' | 'pdf' | 'note';
  title: string;
  size?: string;
  duration?: string;
  date: string;
}

interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  submissions: number;
  totalStudents: number;
}

export function CourseManagement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'content' | 'assignments' | 'students'>('content');

  const [resources, setResources] = useState<Resource[]>([
    { id: '1', type: 'video', title: '01. Course Introduction', duration: '12:45', date: '2026-04-10' },
    { id: '2', type: 'pdf', title: 'Syllabus & Curriculum', size: '2.4 MB', date: '2026-04-11' },
    { id: '3', type: 'note', title: 'Lecture 1: Computational Logic', date: '2026-04-12' },
  ]);

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New assignment form state
  const [isCreatingAssignment, setIsCreatingAssignment] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    dueDate: '',
    points: 100
  });

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API.courseAssignments(id!), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Transform backend assignment format to frontend expected format
        const formatted = data.map((a: any) => ({
          id: a._id,
          title: a.title,
          dueDate: new Date(a.dueDate).toLocaleDateString(),
          submissions: a.submissions?.length || 0,
          totalStudents: 100 // placeholder since course students length isn't fetched here yet
        }));
        setAssignments(formatted);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch on mount or when tab changes to assignments
  if (activeTab === 'assignments' && isLoading) {
    fetchAssignments();
  }

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssignment.title || !newAssignment.dueDate) {
      toast.error("Please fill in required fields (Title, Due Date)");
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API.assignments, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newAssignment,
          courseId: id
        })
      });

      if (res.ok) {
        toast.success("Assignment successfully generated!");
        setIsCreatingAssignment(false);
        setNewAssignment({ title: '', description: '', dueDate: '', points: 100 });
        setIsLoading(true); // force refetch
        fetchAssignments();
      } else {
        const errData = await res.json();
        toast.error(errData.message || "Failed to create assignment");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error creating assignment");
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Context */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-card p-8 rounded-[40px] border border-border shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">Management Console</span>
              <div className="w-1 h-1 rounded-full bg-border"></div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">CS402 • Quantum Logic</span>
            </div>
            <h1 className="text-3xl font-black text-foreground tracking-tight italic">Orchestrating Knowledge Base</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(`/teacher/courses/${id}`)} className="h-12 px-6 rounded-2xl bg-secondary text-foreground text-xs font-black uppercase tracking-widest hover:bg-border transition-all">
            Public View
          </button>
          <button onClick={handleUpload} className="h-12 px-8 rounded-2xl bg-primary text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Inject Resource
          </button>
        </div>
      </div>

      {/* Tabs Orchestrator */}
      <div className="flex gap-4 p-2 bg-card border border-border rounded-3xl w-fit">
        {[
          { id: 'content', label: 'Knowledge Assets', icon: FileText },
          { id: 'assignments', label: 'Evaluation Tasks', icon: Calendar },
          { id: 'students', label: 'Learner Nodes', icon: Users },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id 
                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'content' && (
          <motion.div 
            key="content"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((res, i) => (
                <div key={res.id} className="bg-card p-6 rounded-[32px] border border-border hover:border-primary/30 transition-all group relative">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${
                      res.type === 'video' ? 'bg-primary' : res.type === 'pdf' ? 'bg-accent' : 'bg-orange-500'
                    }`}>
                      {res.type === 'video' ? <Video className="w-6 h-6" /> : res.type === 'pdf' ? <FileText className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 rounded-xl bg-secondary text-muted-foreground hover:text-primary transition-all"><Edit2 className="w-4 h-4" /></button>
                      <button className="p-2 rounded-xl bg-secondary text-muted-foreground hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <h3 className="text-lg font-black text-foreground leading-tight group-hover:text-primary transition-colors mb-2">{res.title}</h3>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-dashed border-border">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{res.date}</span>
                    <span className="text-[10px] font-black text-primary uppercase">{res.duration || res.size || 'Note'}</span>
                  </div>
                </div>
              ))}
              <button 
                onClick={handleUpload}
                className="rounded-[32px] border-2 border-dashed border-border flex flex-col items-center justify-center p-8 gap-4 hover:bg-primary/5 hover:border-primary/50 group transition-all min-h-[200px]"
              >
                <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-border flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary transition-all">
                  <Plus className="w-6 h-6" />
                </div>
                <p className="text-xs font-black text-foreground uppercase tracking-widest">Append Asset</p>
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'assignments' && (
          <motion.div 
            key="assignments"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {isLoading ? (
              <div className="py-10 text-center text-sm font-bold text-muted-foreground">Syncing Evaluation Protocols...</div>
            ) : assignments.length === 0 && !isCreatingAssignment ? (
               <div className="py-10 text-center text-sm font-bold text-muted-foreground">No evaluation tasks exist yet.</div>
            ) : (
              assignments.map(assign => (
                <div key={assign.id} className="bg-card p-6 rounded-[32px] border border-border flex flex-col md:flex-row md:items-center justify-between hover:border-primary/30 transition-all group gap-4">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                      <Calendar className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-foreground group-hover:text-primary transition-colors leading-none mb-1">{assign.title}</h3>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest italic">Deadline: {assign.dueDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8 md:gap-12">
                     <div className="text-right">
                        <p className="text-[10px] font-black text-muted-foreground uppercase">Compliance Rate</p>
                        <p className="text-sm font-black text-primary italic">{Math.round((assign.submissions / assign.totalStudents) * 100)}% ({assign.submissions}/{assign.totalStudents})</p>
                     </div>
                     <button className="h-11 px-6 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:shadow-lg transition-all whitespace-nowrap">Audit Submissions</button>
                  </div>
                </div>
              ))
            )}
            
            {isCreatingAssignment ? (
              <div className="bg-card p-6 rounded-[32px] border border-border shadow-sm mt-6">
                <h3 className="text-base font-black text-foreground uppercase tracking-widest mb-4">New Evaluation Protocol</h3>
                <form onSubmit={handleCreateAssignment} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Title</label>
                    <input 
                      type="text" 
                      required
                      value={newAssignment.title}
                      onChange={e => setNewAssignment({...newAssignment, title: e.target.value})}
                      className="w-full h-12 px-4 rounded-xl bg-secondary border border-transparent focus:border-primary/20 outline-none text-sm font-bold" 
                      placeholder="e.g. Midterm Report"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Due Date</label>
                      <input 
                        type="date" 
                        required
                        value={newAssignment.dueDate}
                        onChange={e => setNewAssignment({...newAssignment, dueDate: e.target.value})}
                        className="w-full h-12 px-4 rounded-xl bg-secondary border border-transparent focus:border-primary/20 outline-none text-sm font-bold" 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Points</label>
                      <input 
                        type="number" 
                        value={newAssignment.points}
                        onChange={e => setNewAssignment({...newAssignment, points: Number(e.target.value)})}
                        className="w-full h-12 px-4 rounded-xl bg-secondary border border-transparent focus:border-primary/20 outline-none text-sm font-bold" 
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-4">
                    <button type="submit" className="h-10 px-6 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest">Deploy Task</button>
                    <button type="button" onClick={() => setIsCreatingAssignment(false)} className="h-10 px-6 rounded-xl bg-secondary text-foreground text-[10px] font-black uppercase tracking-widest">Cancel</button>
                  </div>
                </form>
              </div>
            ) : (
              <button 
                onClick={() => setIsCreatingAssignment(true)}
                className="w-full h-20 rounded-[32px] border-2 border-dashed border-border flex items-center justify-center gap-3 text-muted-foreground hover:bg-primary/5 hover:border-primary/50 hover:text-primary transition-all mt-4"
              >
                <Plus className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-widest">Generate New Evaluation Protocol</span>
              </button>
            )}
          </motion.div>
        )}

        {activeTab === 'students' && (
          <motion.div 
            key="students"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-card rounded-[40px] border border-border overflow-hidden"
          >
            <div className="p-6 border-b border-border bg-secondary/30 flex items-center justify-between">
              <div className="relative w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Filter Node ID..." 
                  className="w-full h-10 pl-10 pr-4 rounded-xl bg-background border border-border text-xs outline-none focus:border-primary transition-all"
                />
              </div>
              <button className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2 hover:underline">
                <Download className="w-4 h-4" /> Export Registry
              </button>
            </div>
            <table className="w-full">
              <thead className="bg-secondary/10">
                <tr>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">Learner Entity</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">Mastery Level</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-muted-foreground uppercase tracking-widest">Protocol State</th>
                  <th className="px-8 py-5 text-right text-[10px] font-black text-muted-foreground uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {enrolledStudents.map(student => (
                  <tr key={student.id} className="hover:bg-secondary/20 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-sm">
                          {student.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground leading-none mb-1">{student.name}</p>
                          <p className="text-xs text-muted-foreground">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-1.5 bg-secondary rounded-full max-w-[100px] overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${student.progress}%` }}></div>
                        </div>
                        <span className="text-xs font-black text-primary">{student.progress}%</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                        student.status === 'Active' ? 'bg-green-500/10 text-green-600' : student.status === 'At Risk' ? 'bg-red-500/10 text-red-600' : 'bg-slate-500/10 text-slate-600'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="text-[10px] font-black text-primary uppercase hover:underline">Message Node</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
