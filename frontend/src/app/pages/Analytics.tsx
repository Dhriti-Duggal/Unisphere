import { useEffect, useMemo, useState } from 'react';
import { TrendingUp, Users, BookOpen, Activity, Clock, ClipboardCheck } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { API } from '../../api/api';
import { useUser } from '../contexts/UserContext';

export function Analytics() {
  const { user } = useUser();
  const [assignments, setAssignments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(API.assignments, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        setAssignments(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const teacherSummary = useMemo(() => {
    const allSubmissions = assignments.flatMap((a) =>
      (a.submissions || []).map((s: any) => ({
        ...s,
        assignmentTitle: a.title,
        courseCode: a.course?.code || 'COURSE',
      }))
    );
    const submitted = allSubmissions.filter((s: any) => s.status === 'submitted');
    const graded = allSubmissions.filter((s: any) => s.status === 'graded');
    const pending = submitted.length;
    const totalPoints = assignments.reduce((acc, a) => acc + (a.points || 0), 0);
    return {
      courses: new Set(assignments.map((a) => a.course?.id).filter(Boolean)).size,
      assignments: assignments.length,
      submissions: allSubmissions.length,
      pending,
      graded: graded.length,
      avgPoints: assignments.length > 0 ? Math.round(totalPoints / assignments.length) : 0,
      allSubmissions,
    };
  }, [assignments]);

  const studentSummary = useMemo(() => {
    if (user.role !== 'student') return null;
    const courseMap = new Map<string, { totalPoints: number; earnedPoints: number; gradedCount: number; completedTasks: number; totalAssignments: number }>();
    
    let aCount = 0; let bCount = 0; let cCount = 0; let dCount = 0;
    let completedTasks = 0;
    
    assignments.forEach(a => {
       const cCode = a.course?.code || 'COURSE';
       if (!courseMap.has(cCode)) {
         courseMap.set(cCode, { totalPoints: 0, earnedPoints: 0, gradedCount: 0, completedTasks: 0, totalAssignments: 0 });
       }
       const cData = courseMap.get(cCode)!;
       cData.totalAssignments += 1;
       
       const sub = a.submissions?.[0];
       if (sub && (sub.status === 'graded' || sub.status === 'submitted')) {
         completedTasks += 1;
         cData.completedTasks += 1;
       }
       if (sub && sub.grade !== null && sub.grade !== undefined) {
         cData.earnedPoints += sub.grade;
         cData.gradedCount += 1;
         cData.totalPoints += (a.points || 100);
         const pct = sub.grade / (a.points || 100);
         if (pct >= 0.9) aCount++;
         else if (pct >= 0.8) bCount++;
         else if (pct >= 0.7) cCount++;
         else dCount++;
       }
    });

    const courseProgress = Array.from(courseMap.entries()).map(([course, data]) => {
       const progress = data.totalAssignments > 0 ? Math.round((data.completedTasks / data.totalAssignments) * 100) : 0;
       const grade = data.gradedCount > 0 && data.totalPoints > 0 ? Math.round((data.earnedPoints / data.totalPoints) * 100) : 100;
       return { course, progress, grade };
    });

    const gradeDistribution = [
      { grade: 'A', count: aCount, color: '#10b981' },
      { grade: 'B', count: bCount, color: '#3b82f6' },
      { grade: 'C', count: cCount, color: '#f59e0b' },
      { grade: 'D', count: dCount, color: '#ef4444' },
    ];

    const timeSpentByCourse = courseProgress.map(c => ({
       course: c.course,
       hours: c.progress > 0 ? Math.round((c.progress / 100) * 40) : 12
    }));

    const overallGrade = courseProgress.length > 0 ? Math.round(courseProgress.reduce((acc, curr) => acc + curr.grade, 0) / courseProgress.length) : 0;
    const totalStudyTime = timeSpentByCourse.reduce((acc, curr) => acc + curr.hours, 0);

    return {
      courseProgress,
      gradeDistribution,
      timeSpentByCourse,
      totalAssignments: assignments.length,
      completedTasks,
      overallGrade,
      totalStudyTime
    };
  }, [assignments, user.role]);

  const weeklyActivity = [
    { day: 'Mon', hours: 3.5, assignments: 2 },
    { day: 'Tue', hours: 4.2, assignments: 3 },
    { day: 'Wed', hours: 5.1, assignments: 4 },
    { day: 'Thu', hours: 3.8, assignments: 2 },
    { day: 'Fri', hours: 2.5, assignments: 1 },
    { day: 'Sat', hours: 4.5, assignments: 3 },
    { day: 'Sun', hours: 6.0, assignments: 5 },
  ];

  const courseProgress = studentSummary?.courseProgress.length ? studentSummary.courseProgress : [
    { course: 'No Courses', progress: 0, grade: 0 }
  ];

  const gradeDistribution = studentSummary?.gradeDistribution || [
    { grade: 'A', count: 0, color: '#10b981' }
  ];

  const timeSpentByCourse = studentSummary?.timeSpentByCourse.length ? studentSummary.timeSpentByCourse : [
    { course: 'No Courses', hours: 0 }
  ];

  if (user.role === 'teacher') {
    const submissionStatusData = [
      { name: 'Submitted', value: teacherSummary.pending, color: '#f59e0b' },
      { name: 'Graded', value: teacherSummary.graded, color: '#10b981' },
    ];
    const submissionsByCourse = assignments.map((a) => ({
      course: a.course?.code || 'COURSE',
      submissions: (a.submissions || []).length,
    }));
    const recentSubmissions = teacherSummary.allSubmissions
      .slice()
      .sort((a: any, b: any) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
      .slice(0, 8);

    return (
      <div className="space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-primary/5 p-8 rounded-[40px] border border-primary/10">
          <div>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Teacher Analytics</span>
            <h1 className="text-4xl font-black text-foreground tracking-tight">Submission Analytics</h1>
            <p className="text-sm font-medium text-muted-foreground mt-1">
              Cohort-wise assignment submissions and grading pipeline.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-16 text-muted-foreground font-bold">Loading analytics...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                { label: 'Courses', value: teacherSummary.courses, icon: BookOpen },
                { label: 'Assignments', value: teacherSummary.assignments, icon: ClipboardCheck },
                { label: 'Total Submissions', value: teacherSummary.submissions, icon: Users },
                { label: 'Pending Review', value: teacherSummary.pending, icon: Activity },
                { label: 'Avg Points', value: teacherSummary.avgPoints, icon: Clock },
              ].map((stat) => (
                <div key={stat.label} className="bg-card rounded-[24px] p-5 border border-border">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <p className="text-2xl font-black text-foreground">{stat.value}</p>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-card rounded-[32px] p-8 border border-border">
                <h2 className="text-lg font-black text-foreground mb-6">Submissions by Course</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={submissionsByCourse}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                    <XAxis dataKey="course" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="submissions" fill="#1F5F5B" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-card rounded-[32px] p-8 border border-border">
                <h2 className="text-lg font-black text-foreground mb-6">Review Status</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={submissionStatusData} dataKey="value" innerRadius={60} outerRadius={90} paddingAngle={8}>
                      {submissionStatusData.map((entry, index) => (
                        <Cell key={`status-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-card rounded-[32px] p-6 border border-border">
              <h2 className="text-lg font-black text-foreground mb-4">Recent Student Submissions</h2>
              {recentSubmissions.length === 0 ? (
                <p className="text-sm text-muted-foreground">No submissions yet.</p>
              ) : (
                <div className="space-y-3">
                  {recentSubmissions.map((submission: any) => (
                    <div key={submission.id} className="p-4 rounded-xl bg-secondary/40 border border-border flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-foreground">{submission.student?.name || 'Student'}</p>
                        <p className="text-xs text-muted-foreground">
                          {submission.assignmentTitle || 'Assignment'} • {submission.courseCode} • {new Date(submission.submittedAt).toLocaleString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${submission.status === 'graded' ? 'bg-green-500/10 text-green-600' : 'bg-orange-500/10 text-orange-600'}`}>
                        {submission.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

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
            { label: 'Average Sync', value: `${studentSummary?.overallGrade || 0}%`, trend: 'Current', icon: TrendingUp, color: 'primary' },
            { label: 'Study Time', value: `${studentSummary?.totalStudyTime || 0}h`, trend: 'Total', icon: Clock, color: 'accent' },
            { label: 'Completion', value: `${studentSummary?.completedTasks || 0}/${studentSummary?.totalAssignments || 0}`, trend: 'Tasks', icon: BookOpen, color: 'primary' },
            { label: 'Intel Streak', value: 'Active', trend: '7 days', icon: Activity, color: 'accent' }
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
