import { useState } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, FileText, Bell } from 'lucide-react';

export function Portal() {
  const [activeTab, setActiveTab] = useState('attendance');

  const attendanceData = [
    { id: 1, course: 'CS101', date: '2026-03-01', status: 'present' },
    { id: 2, course: 'CS201', date: '2026-03-01', status: 'present' },
    { id: 3, course: 'CS301', date: '2026-03-02', status: 'present' },
    { id: 4, course: 'CS101', date: '2026-02-28', status: 'absent' },
    { id: 5, course: 'CS205', date: '2026-03-01', status: 'present' },
  ];

  const timetable = [
    { id: 1, day: 'Monday', time: '09:00 - 10:30', course: 'CS101', room: 'Room 301', instructor: 'Dr. Sarah Johnson' },
    { id: 2, day: 'Monday', time: '11:00 - 12:30', course: 'CS201', room: 'Lab 205', instructor: 'Prof. Michael Chen' },
    { id: 3, day: 'Tuesday', time: '10:00 - 11:30', course: 'CS301', room: 'Room 402', instructor: 'Dr. Emily Davis' },
    { id: 4, day: 'Wednesday', time: '09:00 - 10:30', course: 'CS205', room: 'Lab 108', instructor: 'Prof. James Wilson' },
    { id: 5, day: 'Thursday', time: '14:00 - 15:30', course: 'CS101', room: 'Room 301', instructor: 'Dr. Sarah Johnson' },
    { id: 6, day: 'Friday', time: '11:00 - 12:30', course: 'CS301', room: 'Lab 303', instructor: 'Dr. Emily Davis' },
  ];

  const results = [
    { id: 1, course: 'CS101', exam: 'Midterm 1', score: 88, maxScore: 100, grade: 'B+', date: '2026-02-15' },
    { id: 2, course: 'CS201', exam: 'Quiz 2', score: 45, maxScore: 50, grade: 'A', date: '2026-02-20' },
    { id: 3, course: 'CS301', exam: 'Project 1', score: 95, maxScore: 100, grade: 'A', date: '2026-02-25' },
    { id: 4, course: 'CS205', exam: 'Assignment 3', score: 42, maxScore: 50, grade: 'B', date: '2026-02-28' },
  ];

  const notices = [
    { id: 1, title: 'Spring Break Schedule', date: '2026-03-01', category: 'Academic', content: 'Spring break will be from March 20-27. Classes resume on March 28.' },
    { id: 2, title: 'Registration for Fall 2026', date: '2026-02-28', category: 'Registration', content: 'Registration opens April 1st. Please meet with your advisor.' },
    { id: 3, title: 'Library Hours Extended', date: '2026-02-25', category: 'Campus', content: 'Library will be open 24/7 during exam week.' },
    { id: 4, title: 'Career Fair Next Month', date: '2026-02-20', category: 'Events', content: 'Annual career fair on April 15. Register now!' },
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">University Portal</h1>
        <p className="text-muted-foreground">Access your academic records and university information</p>
      </div>

      {/* Tabs */}
      <div className="bg-card rounded-2xl border border-border p-2 inline-flex gap-1">
        {['attendance', 'timetable', 'results', 'notices'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-primary text-white'
                : 'text-foreground hover:bg-secondary'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Attendance Tab */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Classes</span>
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">{attendanceData.length}</h3>
            </div>
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Present</span>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                {attendanceData.filter(a => a.status === 'present').length}
              </h3>
            </div>
            <div className="bg-card rounded-2xl p-6 border border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Attendance Rate</span>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                {Math.round((attendanceData.filter(a => a.status === 'present').length / attendanceData.length) * 100)}%
              </h3>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Course</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((record, index) => (
                    <tr key={record.id} className={index !== attendanceData.length - 1 ? 'border-b border-border' : ''}>
                      <td className="px-6 py-4 text-sm text-foreground">{record.date}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{record.course}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
                          record.status === 'present'
                            ? 'bg-green-500/10 text-green-500'
                            : 'bg-red-500/10 text-red-500'
                        }`}>
                          {record.status === 'present' ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Timetable Tab */}
      {activeTab === 'timetable' && (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Day</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Course</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Room</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Instructor</th>
                </tr>
              </thead>
              <tbody>
                {timetable.map((slot, index) => (
                  <tr key={slot.id} className={index !== timetable.length - 1 ? 'border-b border-border' : ''}>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{slot.day}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {slot.time}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs bg-primary/10 text-primary">
                        {slot.course}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">{slot.room}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{slot.instructor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Results Tab */}
      {activeTab === 'results' && (
        <div className="space-y-6">
          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h3 className="font-semibold text-foreground mb-4">Semester Average</h3>
              <div className="flex items-end gap-4">
                <div className="text-4xl font-bold text-primary">88%</div>
                <div className="text-muted-foreground pb-1">GPA: 3.5</div>
              </div>
            </div>
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h3 className="font-semibold text-foreground mb-4">Course Performance</h3>
              <div className="space-y-2">
                {results.map((result) => (
                  <div key={result.id} className="flex items-center justify-between">
                    <span className="text-sm text-foreground">{result.course}</span>
                    <span className={`text-sm font-medium ${
                      result.grade.startsWith('A') ? 'text-green-500' :
                      result.grade.startsWith('B') ? 'text-blue-500' :
                      'text-orange-500'
                    }`}>
                      {result.grade}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Results Table */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Course</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Exam/Assignment</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Score</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Grade</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={result.id} className={index !== results.length - 1 ? 'border-b border-border' : ''}>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs bg-primary/10 text-primary">
                          {result.course}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">{result.exam}</td>
                      <td className="px-6 py-4 text-sm text-foreground font-medium">
                        {result.score}/{result.maxScore}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          result.grade.startsWith('A') ? 'bg-green-500/10 text-green-500' :
                          result.grade.startsWith('B') ? 'bg-blue-500/10 text-blue-500' :
                          'bg-orange-500/10 text-orange-500'
                        }`}>
                          {result.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{result.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Notices Tab */}
      {activeTab === 'notices' && (
        <div className="space-y-4">
          {notices.map((notice) => (
            <div key={notice.id} className="bg-card rounded-2xl border border-border p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bell className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-foreground">{notice.title}</h3>
                    <span className="px-2 py-0.5 rounded text-xs bg-accent/10 text-accent">
                      {notice.category}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">{notice.date}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{notice.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
