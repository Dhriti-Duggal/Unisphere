import { BookOpen, Users, Search, GraduationCap } from 'lucide-react';
import { Link } from 'react-router';
import { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  getCoursesByDepartment, getDepartmentById, ALL_COURSES, DEPARTMENTS, type Course,
} from '../data/departments';

export function CoursesList() {
  const { user } = useUser();
  const deptId = user.departmentId || 'cse';
  const dept = getDepartmentById(deptId);
  const baseCourses: Course[] = user.role === 'student' ? getCoursesByDepartment(deptId) : ALL_COURSES;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('all');

  const filteredCourses = baseCourses.filter(course => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDeptFilter === 'all' || course.departmentId === selectedDeptFilter;
    return matchesSearch && matchesDept;
  });

  const rolePath = user.role === 'admin' ? 'admin' : user.role === 'teacher' ? 'teacher' : 'student';

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] font-black text-primary uppercase tracking-widest">Academic Registry</span>
          <h1 className="text-4xl font-black text-foreground tracking-tight">My Courses</h1>
          {user.role === 'student' && dept && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xl">{dept.icon}</span>
              <p className="text-sm text-muted-foreground font-medium">
                Courses for <span className="font-bold text-foreground">{dept.name}</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4 bg-card p-2 rounded-[24px] border border-border shadow-sm">
        <div className="flex-1 relative h-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by title or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-full pl-12 pr-4 bg-secondary/50 rounded-2xl border border-transparent focus:border-primary/20 text-sm outline-none font-medium"
          />
        </div>
      </div>

      {/* Dept filter for non-students */}
      {user.role !== 'student' && (
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setSelectedDeptFilter('all')}
            className={`h-9 px-5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all ${selectedDeptFilter === 'all' ? 'bg-primary text-white' : 'bg-card border border-border text-muted-foreground hover:text-foreground'}`}>
            All
          </button>
          {DEPARTMENTS.map(d => (
            <button key={d.id} onClick={() => setSelectedDeptFilter(d.id)}
              className={`h-9 px-5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${selectedDeptFilter === d.id ? 'bg-primary text-white' : 'bg-card border border-border text-muted-foreground hover:text-foreground'}`}>
              {d.icon} {d.shortName}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredCourses.map((course) => (
            <motion.div layout key={course.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
              <Link to={`/${rolePath}/courses/${course.id}`} id={`course-${course.id}`}
                className="bg-card rounded-[32px] border border-border overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all group block">
                <div className={`h-32 bg-gradient-to-br ${course.color} p-8 flex items-start justify-between relative`}>
                  <div>
                    <h3 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-1">{course.code}</h3>
                    <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest">{course.category}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:rotate-12 transition-transform">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-black text-foreground mb-4 group-hover:text-primary transition-colors leading-tight">{course.title}</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-muted-foreground">Instructor</span>
                      <span className="text-foreground">{course.instructor}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-muted-foreground">Enrolled</span>
                      <span className="flex items-center gap-1.5 text-foreground"><Users className="w-4 h-4 text-primary" />{course.students}</span>
                    </div>
                    <div className="pt-4 border-t border-dashed border-border">
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-primary">{course.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r ${course.color}`} style={{ width: `${course.progress}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">Open Course →</span>
                    <span className="text-[10px] font-bold text-muted-foreground">{course.credits} Credits</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-20 bg-secondary/30 rounded-[40px] border border-dashed border-border">
          <GraduationCap className="w-16 h-16 text-muted-foreground/30 mx-auto mb-6" />
          <h3 className="text-2xl font-black text-foreground mb-2">No Courses Found</h3>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">Try adjusting your search.</p>
        </div>
      )}
    </div>
  );
}