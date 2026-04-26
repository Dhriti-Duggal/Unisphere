import { ClipboardList, Calendar, Search, Paperclip } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { API } from '../../api/api';

const TYPE_COLORS: Record<string, string> = {
  lab: 'from-blue-500 to-cyan-500',
  project: 'from-purple-500 to-pink-500',
  homework: 'from-green-500 to-emerald-500',
  exam: 'from-red-500 to-orange-500',
  quiz: 'from-indigo-500 to-purple-500',
};

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-orange-500/10 text-orange-500',
  'in-progress': 'bg-blue-500/10 text-blue-500',
  submitted: 'bg-purple-500/10 text-purple-500',
  graded: 'bg-green-500/10 text-green-500',
  upcoming: 'bg-primary/10 text-primary',
};

export function AssignmentList() {
  const { user } = useUser();
  const [allAssignments, setAllAssignments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const rolePath = user.role === 'teacher' ? 'teacher' : 'student';

  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(API.assignments, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        setAllAssignments(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  const filteredAssignments = allAssignments.filter(a => {
    const matchesFilter = filter === 'all' || a.status === filter;
    const matchesSearch =
      (a.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.course?.code || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = [
    { label: 'Total', value: allAssignments.length, dot: 'bg-primary' },
    { label: 'Pending', value: allAssignments.filter(a => a.status === 'pending').length, dot: 'bg-orange-500' },
    { label: 'In Progress', value: allAssignments.filter(a => a.status === 'in-progress').length, dot: 'bg-blue-500' },
    { label: 'Completed', value: allAssignments.filter(a => a.status === 'graded' || a.status === 'submitted').length, dot: 'bg-green-500' },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div>
        <span className="text-[10px] font-black text-primary uppercase tracking-widest">Academic Tasks</span>
        <h1 className="text-4xl font-black text-foreground tracking-tight">Assignments</h1>
        <p className="text-sm text-muted-foreground mt-1">All assignments from your enrolled courses.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-card rounded-2xl p-6 border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <div className={`w-2 h-2 rounded-full ${s.dot}`} />
            </div>
            <h3 className="text-2xl font-bold text-foreground">{s.value}</h3>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search assignments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'pending', 'in-progress', 'graded'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 h-12 rounded-xl text-sm font-semibold transition-colors capitalize ${filter === f ? 'bg-primary text-white' : 'bg-card border border-border text-foreground hover:bg-secondary'}`}>
              {f === 'all' ? 'All' : f === 'in-progress' ? 'In Progress' : f === 'graded' ? 'Completed' : 'Pending'}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {isLoading && (
          <div className="text-center py-8 text-sm font-bold text-muted-foreground">Loading assignments...</div>
        )}
        {filteredAssignments.map((assignment) => {
          const courseCode = assignment.course?.code || 'COURSE';
          const dueDate = assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'N/A';
          const studentSubmission = user.role === 'student' ? assignment.submissions?.[0] : null;
          const grade = studentSubmission?.grade;
          const displayStatus = user.role === 'student' ? (studentSubmission?.status || assignment.status) : assignment.status;
          return (
            <Link
              key={assignment.id}
              to={`/${rolePath}/assignments/${assignment.id}`}
              id={`assignment-item-${assignment.id}`}
              className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg hover:border-primary/30 transition-all block"
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${TYPE_COLORS[assignment.type] || 'from-gray-500 to-gray-600'} flex items-center justify-center flex-shrink-0`}>
                  <ClipboardList className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h3 className="font-bold text-foreground">{assignment.title}</h3>
                    <span className="px-2 py-0.5 rounded text-xs bg-primary/10 text-primary font-bold">{courseCode}</span>
                    <span className={`px-3 py-0.5 rounded-full text-xs font-bold ${STATUS_COLORS[displayStatus] || ''}`}>
                      {displayStatus.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Due {dueDate}</span>
                    <span>• {assignment.points} pts</span>
                    {assignment.attachmentUrl && (
                      <span className="flex items-center gap-1 text-primary font-semibold">
                        <Paperclip className="w-4 h-4" /> Attachment
                      </span>
                    )}
                    {grade !== undefined && grade !== null && (
                      <span className="text-green-500 font-semibold">• Grade: {grade}/{assignment.points}</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {filteredAssignments.length === 0 && (
        <div className="text-center py-12">
          <ClipboardList className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-bold text-foreground mb-2">No assignments found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
