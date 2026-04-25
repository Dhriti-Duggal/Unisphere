import { Link, useNavigate } from 'react-router';
import { useState } from 'react';
import { GraduationCap, BookOpen, ShieldCheck, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { API } from '../../api/api';
import { useUser } from '../contexts/UserContext';
import { motion, AnimatePresence } from 'motion/react';

type Role = 'student' | 'teacher' | 'admin';

const ROLES: {
  id: Role;
  label: string;
  desc: string;
  icon: React.ElementType;
  color: string;
  path: string;
}[] = [
  {
    id: 'student',
    label: 'Student',
    desc: 'Access courses & assignments',
    icon: GraduationCap,
    color: 'from-primary to-accent',
    path: '/student/dashboard',
  },
  {
    id: 'teacher',
    label: 'Teacher',
    desc: 'Manage courses & grade',
    icon: BookOpen,
    color: 'from-accent to-primary',
    path: '/teacher/dashboard',
  },
  {
    id: 'admin',
    label: 'Admin',
    desc: 'Platform administration',
    icon: ShieldCheck,
    color: 'from-primary/80 to-accent/80',
    path: '/admin/dashboard',
  },
];

export function Login() {
  const navigate = useNavigate();
  const { replaceUser } = useUser();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const selectedRoleData = ROLES.find((r) => r.id === selectedRole)!;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(API.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: trimmedEmail,
          password: trimmedPassword,
          role: selectedRole,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || 'Login failed. Please try again.');
        return;
      }

      if (!data.token || !data.user) {
        setErrorMessage('Invalid server response.');
        return;
      }

      localStorage.setItem('token', data.token);

      const userRole = data.user.role || selectedRole;
      const userRoleData = ROLES.find((r) => r.id === userRole) || selectedRoleData;

      replaceUser({
        id: data.user.id || '',
        name: data.user.name || '',
        email: data.user.email || '',
        phone: data.user.phone || '',
        bio: data.user.bio || '',
        department: data.user.department || '',
        departmentId: data.user.departmentId || '',
        group: data.user.group || '',
        teachingGroups: data.user.teachingGroups || [],
        university: data.user.university || 'Chitkara University',
        city: data.user.city || '',
        state: data.user.state || '',
        location: data.user.location || '',
        studentId: data.user.studentId || '',
        major: '',
        year: data.user.year || '',
        gpa: '',
        enrollmentDate: '',
        role: userRole,
        avatarColor: userRoleData.color,
        avatarUrl: data.user.avatarUrl || '',
        onboardingComplete: !!data.user.onboardingComplete,
      });

      navigate(userRole === 'teacher' ? '/teacher/dashboard' : userRole === 'admin' ? '/admin/dashboard' : '/student/dashboard');
    } catch (error) {
      setErrorMessage('Server error. Please check backend connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row overflow-hidden">
      {/* Left Side: Branding & Illustration (Visible on MD+) */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-tr from-primary/20 via-background to-primary/10 relative p-12 flex-col justify-between overflow-hidden border-r border-border">
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">U</span>
            </div>
            <span className="text-foreground font-bold text-xl tracking-tight">UniSphere</span>
          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-foreground mb-6 leading-tight"
          >
            Empowering the next generation of <span className="text-primary">collaboration</span>.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground font-medium"
          >
            The most advanced university management ecosystem. Streamlined, secure, and built for you.
          </motion.p>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border shadow-sm max-w-sm">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Trust and Security</p>
              <p className="text-xs text-muted-foreground">Enterprise-grade encryption for all your academic data.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-20 bg-background relative">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="md:hidden flex flex-col items-center mb-8">
             <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-3">
              <span className="text-white font-bold text-xl">U</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">UniSphere</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2 tracking-tight">Welcome back</h2>
            <p className="text-muted-foreground font-medium">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-4">
              <label className="text-sm font-semibold text-foreground/80 ml-1 mb-2 block">Sign in as</label>
              <div className="grid grid-cols-3 gap-3">
                {ROLES.map((role) => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.id;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={`relative flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-200 ${
                        isSelected 
                          ? 'border-primary bg-primary/5 ring-4 ring-primary/10'
                          : 'border-border bg-card hover:border-primary/50 hover:bg-secondary/50'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center text-white shadow-lg`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-xs font-bold ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                        {role.label}
                      </span>
                      {isSelected && (
                        <motion.div 
                          layoutId="activeRole"
                          className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center shadow-md border-2 border-background"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                        </motion.div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground/80 ml-1">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full h-12 px-4 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-1">
                  <label className="text-sm font-semibold text-foreground/80">Password</label>
                  <Link to="/forgot-password" size="sm" className="text-xs font-bold text-primary hover:text-accent">
                    Forgot?
                  </Link>
                </div>
                <div className="relative group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-12 px-4 pr-12 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {errorMessage && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-600"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm font-medium">{errorMessage}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
            >
               <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign in as {selectedRoleData.label} <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </span>
            </button>

            <p className="text-center text-sm text-muted-foreground pt-2 font-medium">
              New to UniSphere?{' '}
              <Link to="/signup" className="text-primary font-bold hover:underline">
                Create Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}