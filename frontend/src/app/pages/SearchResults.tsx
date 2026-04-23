import { useState } from 'react';
import { useSearchParams, Link } from 'react-router';
import { Search, BookOpen, ClipboardList, User, MessageSquare, ChevronRight, Inbox } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

// ─── Mock data ────────────────────────────────────────────────────────────────
const ALL_COURSES = [
  { id: 1, name: 'Introduction to Computer Science', code: 'CS101', teacher: 'Dr. Sarah Johnson', students: 120, color: 'from-primary to-accent' },
  { id: 2, name: 'Data Structures & Algorithms', code: 'CS201', teacher: 'Prof. Michael Chen', students: 85, color: 'from-teal-600 to-emerald-500' },
  { id: 3, name: 'Web Development', code: 'CS301', teacher: 'Dr. Emily Davis', students: 95, color: 'from-primary/80 to-accent/80' },
  { id: 4, name: 'Database Systems', code: 'CS205', teacher: 'Prof. James Wilson', students: 78, color: 'from-cyan-600 to-teal-700' },
  { id: 5, name: 'Software Engineering', code: 'CS401', teacher: 'Dr. Sarah Johnson', students: 60, color: 'from-primary to-emerald-600' },
  { id: 6, name: 'Computer Networks', code: 'CS302', teacher: 'Prof. Michael Chen', students: 72, color: 'from-accent to-primary' },
];

const ALL_USERS = [
  { id: 1, name: 'Alice Cooper', role: 'Student', department: 'CS', year: 'Junior', avatar: 'AC', color: 'from-primary to-accent' },
  { id: 2, name: 'Bob Martin', role: 'Student', department: 'CS', year: 'Sophomore', avatar: 'BM', color: 'from-teal-600 to-emerald-500' },
  { id: 3, name: 'Dr. Sarah Johnson', role: 'Teacher', department: 'CS', year: '', avatar: 'SJ', color: 'from-primary/80 to-accent/80' },
  { id: 4, name: 'Prof. Michael Chen', role: 'Teacher', department: 'CS', year: '', avatar: 'MC', color: 'from-cyan-600 to-teal-700' },
  { id: 5, name: 'Carol White', role: 'Student', department: 'Math', year: 'Senior', avatar: 'CW', color: 'from-primary to-emerald-600' },
  { id: 6, name: 'David Lee', role: 'Student', department: 'CS', year: 'Freshman', avatar: 'DL', color: 'from-accent to-primary' },
];

const ALL_ASSIGNMENTS = [
  { id: 1, title: 'Lab Report 3', course: 'CS101', dueDate: '2026-03-05', status: 'pending' },
  { id: 2, title: 'Binary Tree Implementation', course: 'CS201', dueDate: '2026-03-07', status: 'pending' },
  { id: 3, title: 'React Portfolio Project', course: 'CS301', dueDate: '2026-03-10', status: 'in-progress' },
  { id: 4, title: 'SQL Query Assignment', course: 'CS205', dueDate: '2026-03-12', status: 'pending' },
  { id: 5, title: 'Network Topology Design', course: 'CS302', dueDate: '2026-03-15', status: 'not-started' },
  { id: 6, title: 'Algorithm Analysis Essay', course: 'CS201', dueDate: '2026-03-20', status: 'not-started' },
];

const ALL_MESSAGES = [
  { id: 1, from: 'Alice Cooper', content: 'Hey, can we review the binary tree assignment together?', time: '2h ago', channel: '#cs201-general' },
  { id: 2, from: 'Prof. Michael Chen', content: 'Office hours are rescheduled to Friday 2–4 PM.', time: '4h ago', channel: '#cs201-announcements' },
  { id: 3, from: 'Bob Martin', content: 'Did anyone finish the SQL assignment yet?', time: '1d ago', channel: '#cs205-general' },
  { id: 4, from: 'Dr. Emily Davis', content: 'New React lecture notes have been uploaded.', time: '2d ago', channel: '#cs301-resources' },
];

type Tab = 'courses' | 'users' | 'assignments' | 'messages';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'courses', label: 'Courses', icon: BookOpen },
  { id: 'users', label: 'Users', icon: User },
  { id: 'assignments', label: 'Assignments', icon: ClipboardList },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
];

function filterByQuery<T extends Record<string, unknown>>(items: T[], query: string, fields: (keyof T)[]): T[] {
  if (!query.trim()) return items;
  const q = query.toLowerCase();
  return items.filter(item => fields.some(f => String(item[f] ?? '').toLowerCase().includes(q)));
}

function EmptyState({ query, tab }: { query: string; tab: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
        <Inbox className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">No {tab} found</h3>
      <p className="text-muted-foreground text-sm max-w-xs">
        No {tab} matched "<span className="text-foreground font-medium">{query}</span>". Try a different search term.
      </p>
    </div>
  );
}

export function SearchResults() {
  const { user } = useUser();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState<Tab>('courses');

  const filteredCourses = filterByQuery(ALL_COURSES, query, ['name', 'code', 'teacher']);
  const filteredUsers = filterByQuery(ALL_USERS, query, ['name', 'role', 'department']);
  const filteredAssignments = filterByQuery(ALL_ASSIGNMENTS, query, ['title', 'course']);
  const filteredMessages = filterByQuery(ALL_MESSAGES, query, ['from', 'content', 'channel']);

  const counts = {
    courses: filteredCourses.length,
    users: filteredUsers.length,
    assignments: filteredAssignments.length,
    messages: filteredMessages.length,
  };
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Search className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Search Results for "<span className="text-primary">{query}</span>"
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {total > 0 ? `Found ${total} result${total !== 1 ? 's' : ''} across all categories` : 'No results found'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-secondary p-1 rounded-xl w-full sm:w-auto sm:inline-flex overflow-x-auto">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const count = counts[tab.id];
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {count > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-primary text-white' : 'bg-secondary-foreground/10 text-muted-foreground'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div>
        {/* Courses */}
        {activeTab === 'courses' && (
          filteredCourses.length === 0 ? (
            <EmptyState query={query} tab="courses" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCourses.map(course => (
                <Link
                  key={course.id}
                  to={`/${user.role}/courses/${course.id}`}
                  className="bg-card rounded-2xl p-5 border border-border hover:shadow-lg hover:border-primary/30 transition-all group flex items-center gap-4"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center flex-shrink-0`}>
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">{course.name}</h3>
                    <p className="text-sm text-muted-foreground">{course.code} · {course.teacher}</p>
                    <p className="text-xs text-muted-foreground mt-1">{course.students} students</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </Link>
              ))}
            </div>
          )
        )}

        {/* Users */}
        {activeTab === 'users' && (
          filteredUsers.length === 0 ? (
            <EmptyState query={query} tab="users" />
          ) : (
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              {filteredUsers.map((user, i) => (
                <div
                  key={user.id}
                  className={`flex items-center gap-4 p-4 hover:bg-secondary transition-colors ${i !== filteredUsers.length - 1 ? 'border-b border-border' : ''}`}
                >
                  <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${user.color} flex items-center justify-center text-white text-sm font-semibold flex-shrink-0`}>
                    {user.avatar}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.role} · {user.department}{user.year ? ` · ${user.year}` : ''}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.role === 'Teacher' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'
                  }`}>
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          )
        )}

        {/* Assignments */}
        {activeTab === 'assignments' && (
          filteredAssignments.length === 0 ? (
            <EmptyState query={query} tab="assignments" />
          ) : (
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              {filteredAssignments.map((a, i) => (
                <Link
                  key={a.id}
                  to={`/${user.role}/assignments/${a.id}`}
                  className={`flex items-center gap-4 p-4 hover:bg-secondary transition-colors group ${i !== filteredAssignments.length - 1 ? 'border-b border-border' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    a.status === 'in-progress' ? 'bg-accent/10' :
                    a.status === 'not-started' ? 'bg-muted-foreground/10' :
                    'bg-primary/10'
                  }`}>
                    <ClipboardList className={`w-5 h-5 ${
                      a.status === 'in-progress' ? 'text-accent' :
                      a.status === 'not-started' ? 'text-muted-foreground' :
                      'text-primary'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">{a.title}</h3>
                    <p className="text-sm text-muted-foreground">{a.course} · Due {a.dueDate}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                    a.status === 'in-progress' ? 'bg-accent/10 text-accent' :
                    a.status === 'not-started' ? 'bg-secondary-foreground/10 text-muted-foreground' :
                    'bg-primary/10 text-primary'
                  }`}>
                    {a.status.replace('-', ' ')}
                  </span>
                </Link>
              ))}
            </div>
          )
        )}

        {/* Messages */}
        {activeTab === 'messages' && (
          filteredMessages.length === 0 ? (
            <EmptyState query={query} tab="messages" />
          ) : (
            <div className="space-y-3">
              {filteredMessages.map(msg => (
                <Link
                  key={msg.id}
                  to={`/${user.role}/chat`}
                  className="bg-card rounded-xl border border-border p-4 hover:shadow-md hover:border-primary/30 transition-all block group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                      {msg.from.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">{msg.from}</span>
                        <span className="text-xs text-muted-foreground">in {msg.channel}</span>
                        <span className="text-xs text-muted-foreground ml-auto flex-shrink-0">{msg.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{msg.content}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
