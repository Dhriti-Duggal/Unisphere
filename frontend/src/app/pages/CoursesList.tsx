import { BookOpen, Users, Search, Filter, Plus, ChevronRight, GraduationCap } from 'lucide-react';
import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import { API } from "../../api/api";
import { useUser } from '../contexts/UserContext';
import { motion, AnimatePresence } from 'motion/react';

const INITIAL_COURSES = [
  {
    id: 1,
    title: "Web Development",
    code: "CS301",
    instructor: "Dr. Michael Chen",
    description: "Master the art of building scalable, modern web applications with React and Node.js.",
    category: "Software Engineering",
    students: 120,
    progress: 45,
    color: "from-primary to-accent"
  },
  {
    id: 2,
    title: "Artificial Intelligence",
    code: "CS401",
    instructor: "Prof. Sarah Johnson",
    description: "Deep dive into machine learning algorithms, neural networks, and expert systems.",
    category: "AI & ML",
    students: 85,
    progress: 30,
    color: "from-purple-500 to-pink-500"
  },
  {
    id: 3,
    title: "Data Structures",
    code: "CS201",
    instructor: "Dr. Alan Turing",
    description: "Core conceptual frameworks for efficient data organization and algorithm analysis.",
    category: "Computer Science",
    students: 200,
    progress: 60,
    color: "from-green-500 to-emerald-500"
  },
];

export function CoursesList() {
  const { user } = useUser();
  const [courses, setCourses] = useState(INITIAL_COURSES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Software Engineering', 'AI & ML', 'Computer Science', 'Data Science'];

  const filteredCourses = courses.filter(course => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || course.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const rolePath = user.role === 'admin' ? 'admin' : user.role === 'teacher' ? 'teacher' : 'student';

  return (
    <div className="space-y-8 pb-20">
      {/* Cinematic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">Academic Registry</span>
            </div>
            <h1 className="text-4xl font-black text-foreground tracking-tight">Active Courses</h1>
            <p className="text-sm font-medium text-muted-foreground mt-1">Access your enrolled modules and research materials.</p>
        </div>
        {user.role === 'teacher' && (
            <Link
                to="/teacher/create-course"
                className="h-12 px-8 rounded-2xl bg-primary text-white font-bold flex items-center gap-2 hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95"
            >
                <Plus className="w-5 h-5" />
                Initialize Course
            </Link>
        )}
      </div>

      {/* Registry Navigation & Search */}
      <div className="flex items-center gap-4 bg-card p-2 rounded-[24px] border border-border shadow-sm">
          <div className="flex-1 relative h-12">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Query registry by title or course code..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-full pl-12 pr-4 bg-secondary/50 rounded-2xl border border-transparent focus:border-primary/20 text-sm outline-none font-medium"
              />
          </div>
          <div className="hidden md:flex gap-1 pr-2">
              {categories.map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setSelectedCategory(cat)}
                    className={`h-10 px-6 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${selectedCategory === cat ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
                  >
                      {cat === 'all' ? 'Universal' : cat}
                  </button>
              ))}
          </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
            {filteredCourses.map((course) => (
            <motion.div
                layout
                key={course.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
            >
                <Link
                    to={`/${rolePath}/courses/${course.id}`}
                    className="bg-card rounded-[32px] border border-border overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all group block"
                >
                    <div className={`h-32 bg-gradient-to-br ${course.color} p-8 flex items-start justify-between relative`}>
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                        <div>
                            <h3 className="text-white font-black text-xs uppercase tracking-[0.2em] mb-1">{course.code}</h3>
                            <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest">{course.category}</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:rotate-12 transition-transform">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                    </div>

                    <div className="p-8">
                        <h3 className="text-xl font-black text-foreground mb-4 group-hover:text-primary transition-colors leading-tight">
                            {course.title}
                        </h3>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                <span className="text-muted-foreground">Expertise</span>
                                <span className="text-foreground">{course.instructor}</span>
                            </div>

                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                <span className="text-muted-foreground">Cluster Size</span>
                                <span className="flex items-center gap-1.5 text-foreground">
                                    <Users className="w-4 h-4 text-primary" />
                                    {course.students}
                                </span>
                            </div>

                            <div className="pt-4 border-t border-dashed border-border">
                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest mb-3">
                                    <span className="text-muted-foreground">Mastery Profile</span>
                                    <span className="text-primary">{course.progress}% Completed</span>
                                </div>
                                <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                                    <div
                                        className={`h-full bg-gradient-to-r ${course.color} transition-all duration-1000`}
                                        style={{ width: `${course.progress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-8 flex items-center justify-between">
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                                Open Module <ChevronRight className="w-4 h-4" />
                            </span>
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
          <h3 className="text-2xl font-black text-foreground mb-2">No Registry Matches</h3>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto italic">
            "The data you seek is currently unavailable in our curated academic directories."
          </p>
        </div>
      )}
    </div>
  );
}