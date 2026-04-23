import { ClipboardList, Calendar, Filter, Search } from 'lucide-react';
import { Link } from 'react-router';
import { useState } from 'react';

export function AssignmentList() {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const assignments = [
    { id: 1, title: 'CS101 - Lab Report 3', course: 'CS101', dueDate: '2026-03-05', status: 'pending', points: 100, type: 'lab' },
    { id: 2, title: 'CS201 - Binary Tree Implementation', course: 'CS201', dueDate: '2026-03-07', status: 'pending', points: 150, type: 'project' },
    { id: 3, title: 'CS301 - React Portfolio Project', course: 'CS301', dueDate: '2026-03-10', status: 'in-progress', points: 200, type: 'project' },
    { id: 4, title: 'CS205 - SQL Query Assignment', course: 'CS205', dueDate: '2026-03-12', status: 'pending', points: 100, type: 'homework' },
    { id: 5, title: 'CS101 - Midterm Exam', course: 'CS101', dueDate: '2026-03-15', status: 'upcoming', points: 300, type: 'exam' },
    { id: 6, title: 'CS201 - Algorithm Analysis', course: 'CS201', dueDate: '2026-02-28', status: 'submitted', points: 150, type: 'homework' },
    { id: 7, title: 'CS301 - JavaScript Quiz', course: 'CS301', dueDate: '2026-02-25', status: 'graded', points: 50, grade: 48, type: 'quiz' },
  ];

  const filteredAssignments = assignments.filter(assignment => {
    const matchesFilter = filter === 'all' || assignment.status === filter;
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assignment.course.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-500/10 text-orange-500';
      case 'in-progress':
        return 'bg-blue-500/10 text-blue-500';
      case 'submitted':
        return 'bg-purple-500/10 text-purple-500';
      case 'graded':
        return 'bg-green-500/10 text-green-500';
      case 'upcoming':
        return 'bg-primary/10 text-primary';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    const colors = {
      lab: 'from-blue-500 to-cyan-500',
      project: 'from-purple-500 to-pink-500',
      homework: 'from-green-500 to-emerald-500',
      exam: 'from-red-500 to-orange-500',
      quiz: 'from-indigo-500 to-purple-500',
    };
    return colors[type as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Assignments</h1>
        <p className="text-muted-foreground">Manage your coursework and track deadlines</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total</span>
            <ClipboardList className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">{assignments.length}</h3>
        </div>
        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Pending</span>
            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
          </div>
          <h3 className="text-2xl font-bold text-foreground">
            {assignments.filter(a => a.status === 'pending').length}
          </h3>
        </div>
        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">In Progress</span>
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          </div>
          <h3 className="text-2xl font-bold text-foreground">
            {assignments.filter(a => a.status === 'in-progress').length}
          </h3>
        </div>
        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Completed</span>
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
          </div>
          <h3 className="text-2xl font-bold text-foreground">
            {assignments.filter(a => a.status === 'graded' || a.status === 'submitted').length}
          </h3>
        </div>
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
            className="w-full h-12 pl-12 pr-4 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 h-12 rounded-lg text-sm transition-colors ${
              filter === 'all'
                ? 'bg-primary text-white'
                : 'bg-card border border-border text-foreground hover:bg-secondary'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 h-12 rounded-lg text-sm transition-colors ${
              filter === 'pending'
                ? 'bg-primary text-white'
                : 'bg-card border border-border text-foreground hover:bg-secondary'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('in-progress')}
            className={`px-4 h-12 rounded-lg text-sm transition-colors ${
              filter === 'in-progress'
                ? 'bg-primary text-white'
                : 'bg-card border border-border text-foreground hover:bg-secondary'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilter('graded')}
            className={`px-4 h-12 rounded-lg text-sm transition-colors ${
              filter === 'graded'
                ? 'bg-primary text-white'
                : 'bg-card border border-border text-foreground hover:bg-secondary'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Assignments List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredAssignments.map((assignment) => (
          <Link
            key={assignment.id}
            to={`/assignments/${assignment.id}`}
            className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getTypeIcon(assignment.type)} flex items-center justify-center`}>
                <ClipboardList className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-foreground">{assignment.title}</h3>
                  <span className="px-2 py-0.5 rounded text-xs bg-primary/10 text-primary">
                    {assignment.course}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(assignment.status)}`}>
                    {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1).replace('-', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Due {assignment.dueDate}
                  </span>
                  <span>•</span>
                  <span>{assignment.points} points</span>
                  {assignment.grade !== undefined && (
                    <>
                      <span>•</span>
                      <span className="text-green-500">Grade: {assignment.grade}/{assignment.points}</span>
                    </>
                  )}
                  <span>•</span>
                  <span className="capitalize">{assignment.type}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredAssignments.length === 0 && (
        <div className="text-center py-12">
          <ClipboardList className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No assignments found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
