import { TrendingUp, Users, BookOpen, Activity, Clock } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function Analytics() {
  const weeklyActivity = [
    { day: 'Mon', hours: 3.5, assignments: 2 },
    { day: 'Tue', hours: 4.2, assignments: 3 },
    { day: 'Wed', hours: 5.1, assignments: 4 },
    { day: 'Thu', hours: 3.8, assignments: 2 },
    { day: 'Fri', hours: 2.5, assignments: 1 },
    { day: 'Sat', hours: 4.5, assignments: 3 },
    { day: 'Sun', hours: 6.0, assignments: 5 },
  ];

  const courseProgress = [
    { course: 'CS101', progress: 75, grade: 88 },
    { course: 'CS201', progress: 60, grade: 85 },
    { course: 'CS301', progress: 80, grade: 92 },
    { course: 'CS205', progress: 70, grade: 87 },
  ];

  const gradeDistribution = [
    { grade: 'A', count: 8, color: '#10b981' },
    { grade: 'B', count: 12, color: '#3b82f6' },
    { grade: 'C', count: 4, color: '#f59e0b' },
    { grade: 'D', count: 1, color: '#ef4444' },
  ];

  const timeSpentByCourse = [
    { course: 'CS101', hours: 24 },
    { course: 'CS201', hours: 32 },
    { course: 'CS301', hours: 28 },
    { course: 'CS205', hours: 20 },
  ];

  return (
    <div className="space-y-8">
      {/* Premium Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-primary/5 p-8 rounded-[40px] border border-primary/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <div className="w-2 h-2 rounded-full bg-primary"></div>
             <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none">Telemetry Data</span>
          </div>
          <h1 className="text-4xl font-black text-foreground tracking-tight">Academic Analytics</h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">
            Visualizing your intellectual trajectory across the <span className="text-primary font-bold">UniSphere</span> nodes.
          </p>
        </div>
        <div className="h-14 px-6 rounded-2xl bg-white border border-border flex flex-col justify-center shadow-sm">
            <span className="text-[10px] font-black text-muted-foreground uppercase">Aggregation Window</span>
            <span className="text-sm font-black text-foreground uppercase tracking-widest">Current Semester Node</span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
            { label: 'Average Sync', value: '88%', trend: '+5%', icon: TrendingUp, color: 'primary' },
            { label: 'Study Time', value: '29.6h', trend: 'Current', icon: Clock, color: 'accent' },
            { label: 'Completion', value: '20/20', trend: '100%', icon: BookOpen, color: 'primary' },
            { label: 'Intel Streak', value: '42', trend: '7 days', icon: Activity, color: 'accent' }
        ].map((stat, i) => (
            <div key={i} className="bg-card rounded-[32px] p-6 border border-border group hover:border-primary/30 transition-all">
                <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-2xl bg-${stat.color === 'primary' ? 'primary' : 'accent'}/10 flex items-center justify-center text-${stat.color === 'primary' ? 'primary' : 'secondary'} group-hover:bg-${stat.color === 'primary' ? 'primary' : 'accent'} group-hover:text-white transition-all`}>
                        <stat.icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase">{stat.trend}</span>
                </div>
                <h3 className="text-3xl font-black text-foreground group-hover:text-primary transition-colors">{stat.value}</h3>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card rounded-[40px] p-8 border border-border shadow-sm">
          <h2 className="text-xl font-black text-foreground uppercase tracking-tighter mb-8">Pulse Frequency</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#64748b'}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#64748b'}} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                }}
              />
              <Bar dataKey="hours" fill="#1F5F5B" name="Sync Hours" radius={[8, 8, 0, 0]} />
              <Bar dataKey="assignments" fill="#A7D7C5" name="Tasks" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Grade Distribution */}
        <div className="bg-card rounded-[40px] p-8 border border-border shadow-sm">
          <h2 className="text-xl font-black text-foreground uppercase tracking-tighter mb-8">Entity Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={gradeDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={8}
                dataKey="count"
              >
                {gradeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color === '#10b981' ? '#1F5F5B' : entry.color === '#3b82f6' ? '#2E7D73' : entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '16px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Course Progress */}
        <div className="bg-card rounded-[40px] p-8 border border-border shadow-sm">
          <h2 className="text-xl font-black text-foreground uppercase tracking-tighter mb-8">Module Masteries</h2>
          <div className="space-y-6">
            {courseProgress.map((course) => (
              <div key={course.course} className="group">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{course.course}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-muted-foreground uppercase">{course.progress}% SYNC</span>
                    <span className="text-xs font-black text-primary px-2 py-0.5 bg-primary/10 rounded-full">{course.grade}% HP</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Time Spent by Course */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <h2 className="text-lg font-semibold text-foreground mb-6">Time Spent by Course</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timeSpentByCourse} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" stroke="var(--muted-foreground)" />
              <YAxis dataKey="course" type="category" stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="hours" fill="#4f46e5" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-card rounded-2xl p-6 border border-border">
        <h2 className="text-lg font-semibold text-foreground mb-6">Performance Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <h3 className="font-medium text-green-500 mb-2">Strong Performance</h3>
            <p className="text-sm text-foreground">CS301 shows excellent progress with 92% average grade</p>
          </div>
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <h3 className="font-medium text-blue-500 mb-2">Consistent Study Pattern</h3>
            <p className="text-sm text-foreground">You maintain an average of 4.2 hours daily study time</p>
          </div>
          <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <h3 className="font-medium text-orange-500 mb-2">Area to Focus</h3>
            <p className="text-sm text-foreground">CS201 could benefit from more study time</p>
          </div>
        </div>
      </div>
    </div>
  );
}
