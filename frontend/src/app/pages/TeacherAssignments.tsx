import { useEffect, useMemo, useState } from 'react';
import { ClipboardList, Plus } from 'lucide-react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { API } from '../../api/api';
import { useUser } from '../contexts/UserContext';

export function TeacherAssignments() {
  const { user } = useUser();
  const [courses, setCourses] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [form, setForm] = useState({
    courseId: '',
    title: '',
    description: '',
    dueDate: '',
    points: 100,
  });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [coursesRes, assignmentsRes] = await Promise.all([
        fetch(API.teacherCourses, { headers }),
        fetch(API.assignments, { headers }),
      ]);

      if (coursesRes.ok) {
        const c = await coursesRes.json();
        setCourses(c);
      }
      if (assignmentsRes.ok) {
        const a = await assignmentsRes.json();
        setAssignments(a);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load assignments');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const pendingReviewCount = useMemo(() => {
    return assignments.reduce((acc, a) => acc + (a.submissions || []).filter((s: any) => s.status === 'submitted').length, 0);
  }, [assignments]);

  const availableCourses = useMemo(() => {
    // Teacher courses endpoint is already scoped for teacher-accessible courses.
    return courses;
  }, [courses]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.courseId || !form.title || !form.dueDate) {
      toast.error('Course, title and due date are required.');
      return;
    }
    if (!form.description.trim()) {
      toast.error('Please add assignment instructions/description.');
      return;
    }
    if (new Date(form.dueDate).getTime() < Date.now() - 24 * 60 * 60 * 1000) {
      toast.error('Due date cannot be in the past.');
      return;
    }
    try {
      setIsCreating(true);
      const token = localStorage.getItem('token');
      const res = await fetch(API.assignments, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.message || 'Failed to create assignment');
        return;
      }
      toast.success('Assignment created');
      setForm({ courseId: '', title: '', description: '', dueDate: '', points: 100 });
      await fetchData();
    } catch (error) {
      console.error(error);
      toast.error('Network error while creating assignment');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div>
        <p className="text-[10px] font-black text-primary uppercase tracking-widest">Teacher Workspace</p>
        <h1 className="text-4xl font-black text-foreground tracking-tight">Assignments</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Create assignment protocols and track student submissions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-2xl p-5 border border-border">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Courses</p>
          <p className="text-2xl font-black text-foreground mt-1">{courses.length}</p>
        </div>
        <div className="bg-card rounded-2xl p-5 border border-border">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Assignments</p>
          <p className="text-2xl font-black text-foreground mt-1">{assignments.length}</p>
        </div>
        <div className="bg-card rounded-2xl p-5 border border-border">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Pending Review</p>
          <p className="text-2xl font-black text-primary mt-1">{pendingReviewCount}</p>
        </div>
      </div>

      <div className="bg-card rounded-3xl p-6 border border-border">
        <h2 className="text-lg font-black text-foreground mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" /> Create New Assignment
        </h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              required
              value={form.courseId}
              onChange={(e) => setForm((prev) => ({ ...prev, courseId: e.target.value }))}
              className="w-full h-11 px-4 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none text-sm font-medium"
            >
              <option value="">Select course</option>
              {availableCourses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.code} - {course.title}
                </option>
              ))}
            </select>
            {availableCourses.length === 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                No courses available yet. Create a course first.
              </p>
            )}
            <input
              required
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Assignment title"
              className="w-full h-11 px-4 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none text-sm font-medium"
            />
          </div>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Assignment instructions and deliverables"
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none text-sm font-medium resize-none"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              required
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm((prev) => ({ ...prev, dueDate: e.target.value }))}
              className="w-full h-11 px-4 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none text-sm font-medium"
            />
            <input
              type="number"
              min={1}
              value={form.points}
              onChange={(e) => setForm((prev) => ({ ...prev, points: Number(e.target.value) || 100 }))}
              className="w-full h-11 px-4 rounded-xl bg-secondary/50 border border-border focus:border-primary outline-none text-sm font-medium"
            />
          </div>
          <button
            type="submit"
            disabled={isCreating}
            className="h-11 px-6 rounded-xl bg-primary text-white text-sm font-black uppercase tracking-widest disabled:opacity-60"
          >
            {isCreating ? 'Creating...' : 'Create Assignment'}
          </button>
        </form>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-10 text-sm font-bold text-muted-foreground">Loading assignments...</div>
        ) : assignments.length === 0 ? (
          <div className="text-center py-10 bg-secondary/30 rounded-3xl border border-dashed border-border text-sm font-bold text-muted-foreground">
            No assignments created yet.
          </div>
        ) : (
          assignments.map((assignment) => (
            <Link
              key={assignment.id}
              to={`/teacher/assignments/${assignment.id}`}
              className="bg-card p-5 rounded-2xl border border-border hover:border-primary/30 transition-all block"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-black text-foreground">{assignment.title}</p>
                  <p className="text-xs font-bold text-muted-foreground mt-1 uppercase tracking-widest">
                    {assignment.course?.code || 'COURSE'} • Due {new Date(assignment.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Submissions</p>
                  <p className="text-sm font-black text-primary">{assignment.submissions?.length || 0}</p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
