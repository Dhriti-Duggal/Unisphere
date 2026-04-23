import { useParams, Link, useNavigate } from 'react-router';
import {
  ArrowLeft, Calendar, Award, ClipboardList, CheckCircle2,
  Upload, FileText, Clock, AlertCircle, BookOpen, ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { getAssignmentById, getCourseById } from '../data/departments';
import { useUser } from '../contexts/UserContext';

const TYPE_GRADIENTS: Record<string, string> = {
  lab: 'from-blue-500 to-cyan-500',
  project: 'from-purple-500 to-pink-500',
  homework: 'from-green-500 to-emerald-500',
  exam: 'from-red-500 to-orange-500',
  quiz: 'from-indigo-500 to-purple-500',
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending:       { label: 'Pending',     color: 'text-orange-600', bg: 'bg-orange-500/10 border-orange-200' },
  'in-progress': { label: 'In Progress', color: 'text-blue-600',   bg: 'bg-blue-500/10 border-blue-200' },
  submitted:     { label: 'Submitted',   color: 'text-purple-600', bg: 'bg-purple-500/10 border-purple-200' },
  graded:        { label: 'Graded',      color: 'text-green-600',  bg: 'bg-green-500/10 border-green-200' },
  upcoming:      { label: 'Upcoming',    color: 'text-primary',    bg: 'bg-primary/10 border-primary/20' },
};

export function AssignmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const rolePath = user.role === 'teacher' ? 'teacher' : 'student';

  const assignment = getAssignmentById(Number(id));
  const course = assignment ? getCourseById(assignment.courseId) : null;

  if (!assignment || !course) {
    return (
      <div className="text-center py-20">
        <ClipboardList className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
        <h2 className="text-2xl font-black text-foreground mb-4">Assignment Not Found</h2>
        <button onClick={() => navigate(-1)} className="text-primary font-bold hover:underline">Go Back</button>
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[assignment.status] || STATUS_CONFIG['upcoming'];
  const gradient = TYPE_GRADIENTS[assignment.type] || 'from-primary to-accent';
  const isSubmittable = assignment.status === 'pending' || assignment.status === 'in-progress';
  const isGraded = assignment.status === 'graded';

  const daysUntilDue = Math.ceil(
    (new Date(assignment.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="space-y-8 pb-20">
      {/* Back */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <span className="text-muted-foreground/40">•</span>
        <Link to={`/${rolePath}/courses/${course.id}`} className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
          <BookOpen className="w-4 h-4" /> {course.title}
        </Link>
        <ChevronRight className="w-3 h-3 text-muted-foreground/40" />
        <span className="text-sm font-bold text-foreground truncate">{assignment.title}</span>
      </div>

      {/* Hero Card */}
      <div className={`relative rounded-[40px] overflow-hidden bg-gradient-to-br ${gradient} p-10 shadow-2xl`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10">
          {/* Type + Status Row */}
          <div className="flex items-center gap-3 mb-6">
            <span className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest border border-white/30">
              {assignment.type}
            </span>
            <span className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest border border-white/30">
              {course.code}
            </span>
          </div>

          <h1 className="text-5xl font-black text-white tracking-tight leading-none mb-6">
            {assignment.title}
          </h1>

          {/* Meta Row */}
          <div className="flex flex-wrap gap-8">
            <div>
              <p className="text-[9px] font-black text-white/60 uppercase tracking-widest">Due Date</p>
              <p className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4" /> {assignment.dueDate}
              </p>
            </div>
            <div>
              <p className="text-[9px] font-black text-white/60 uppercase tracking-widest">Points</p>
              <p className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4" /> {assignment.points} pts
              </p>
            </div>
            <div>
              <p className="text-[9px] font-black text-white/60 uppercase tracking-widest">Instructor</p>
              <p className="text-base font-bold text-white">{course.instructor}</p>
            </div>
            {!isGraded && daysUntilDue > 0 && (
              <div>
                <p className="text-[9px] font-black text-white/60 uppercase tracking-widest">Time Left</p>
                <p className={`text-base font-bold flex items-center gap-2 ${daysUntilDue <= 2 ? 'text-red-300 animate-pulse' : 'text-white'}`}>
                  <Clock className="w-4 h-4" /> {daysUntilDue} day{daysUntilDue !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
        </div>
        {/* Glow */}
        <div className="absolute top-[-20%] right-[-10%] w-[40%] h-[40%] bg-white/10 rounded-full blur-[80px]" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Description + Instructions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-card rounded-[32px] border border-border p-8">
            <h2 className="text-lg font-black text-foreground mb-4 flex items-center gap-3">
              <FileText className="w-5 h-5 text-primary" /> Description
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
              {assignment.description}
            </p>
          </div>

          {/* Instructions */}
          {assignment.instructions && assignment.instructions.length > 0 && (
            <div className="bg-card rounded-[32px] border border-border p-8">
              <h2 className="text-lg font-black text-foreground mb-6 flex items-center gap-3">
                <ClipboardList className="w-5 h-5 text-primary" /> Instructions
              </h2>
              <div className="space-y-4">
                {assignment.instructions.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-secondary/40 border border-transparent hover:border-border transition-all"
                  >
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xs font-black flex-shrink-0 shadow-md`}>
                      {i + 1}
                    </div>
                    <p className="text-sm font-medium text-foreground leading-relaxed pt-1">{step}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Graded result */}
          {isGraded && assignment.grade !== undefined && (
            <div className="bg-green-500/5 border border-green-500/20 rounded-[32px] p-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-green-500 flex items-center justify-center text-white shadow-lg">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-xs font-black text-green-600 uppercase tracking-widest mb-1">Assignment Graded</p>
                  <p className="text-3xl font-black text-foreground">
                    {assignment.grade} <span className="text-muted-foreground text-lg font-bold">/ {assignment.points}</span>
                  </p>
                  <p className="text-sm font-bold text-green-600 mt-1">
                    {Math.round((assignment.grade / assignment.points) * 100)}% — {assignment.grade / assignment.points >= 0.9 ? 'Excellent' : assignment.grade / assignment.points >= 0.75 ? 'Good' : 'Needs Improvement'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Status + Submission */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-card rounded-[32px] border border-border p-6">
            <h3 className="text-sm font-black text-foreground uppercase tracking-widest mb-4">Status</h3>
            <div className={`flex items-center gap-3 p-4 rounded-2xl border ${statusCfg.bg}`}>
              <div className={`w-2.5 h-2.5 rounded-full ${statusCfg.color.replace('text-', 'bg-')}`} />
              <span className={`text-sm font-black uppercase tracking-widest ${statusCfg.color}`}>
                {statusCfg.label}
              </span>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-muted-foreground uppercase tracking-widest">Points Available</span>
                <span className="text-foreground">{assignment.points}</span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-muted-foreground uppercase tracking-widest">Type</span>
                <span className="text-foreground capitalize">{assignment.type}</span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-muted-foreground uppercase tracking-widest">Course</span>
                <span className="text-foreground">{course.code}</span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-muted-foreground uppercase tracking-widest">Due</span>
                <span className={daysUntilDue <= 2 && !isGraded ? 'text-red-500 font-black' : 'text-foreground'}>
                  {assignment.dueDate}
                </span>
              </div>
            </div>
          </div>

          {/* Submission Box */}
          {isSubmittable && (
            <div className="bg-card rounded-[32px] border border-border p-6 space-y-4">
              <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Submit Work</h3>

              {daysUntilDue <= 2 && daysUntilDue >= 0 && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-200">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-xs font-bold text-red-600">
                    Due in {daysUntilDue} day{daysUntilDue !== 1 ? 's' : ''}! Submit soon.
                  </p>
                </div>
              )}

              {/* File drop area */}
              <div className="border-2 border-dashed border-border hover:border-primary rounded-2xl p-6 text-center transition-colors cursor-pointer group">
                <Upload className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2 group-hover:text-primary transition-colors" />
                <p className="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                  Drop files here or click to upload
                </p>
                <p className="text-[10px] text-muted-foreground/60 mt-1">PDF, ZIP, DOCX — max 50MB</p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full h-12 rounded-2xl bg-primary text-white font-black text-sm shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
              >
                Submit Assignment
              </motion.button>
            </div>
          )}

          {/* Course Quick Link */}
          <Link
            to={`/${rolePath}/courses/${course.id}`}
            className="flex items-center justify-between p-5 rounded-2xl bg-secondary/50 border border-border hover:border-primary transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center`}>
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-black text-foreground">{course.title}</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase">{course.code}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </Link>
        </div>
      </div>
    </div>
  );
}
