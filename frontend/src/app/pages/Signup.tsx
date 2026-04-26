import { Link, useNavigate } from 'react-router';
import { useState } from 'react';
import { GraduationCap, BookOpen, ShieldCheck, Eye, EyeOff, CheckCircle2, AlertCircle, UserPlus } from 'lucide-react';
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
}[] = [
  {
    id: 'student',
    label: 'Student',
    desc: 'Access courses & assignments',
    icon: GraduationCap,
    color: 'from-primary to-accent',
  },
  {
    id: 'teacher',
    label: 'Teacher',
    desc: 'Manage courses & grade',
    icon: BookOpen,
    color: 'from-accent to-primary',
  },
  {
    id: 'admin',
    label: 'Admin',
    desc: 'Platform administration',
    icon: ShieldCheck,
    color: 'from-primary/80 to-accent/80',
  },
];

export function Signup() {
  const navigate = useNavigate();
  const { replaceUser } = useUser();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const hydrateUserAndRoute = (data: any, fallbackRole: Role, fallbackName: string, fallbackEmail: string) => {
    if (data.token) {
      localStorage.setItem('token', data.token);
    }

    const userRole = data.user?.role || fallbackRole;
    const userRoleData = ROLES.find((r) => r.id === userRole) || ROLES.find((r) => r.id === fallbackRole)!;

    replaceUser({
      id: data.user?.id || '',
      name: data.user?.name || fallbackName,
      email: data.user?.email || fallbackEmail,
      phone: data.user?.phone || '',
      bio: data.user?.bio || '',
      department: data.user?.department || '',
      departmentId: data.user?.departmentId || '',
      group: data.user?.group || '',
      teachingGroups: data.user?.teachingGroups || [],
      university: data.user?.university || 'Chitkara University',
      city: data.user?.city || '',
      state: data.user?.state || '',
      location: data.user?.location || '',
      studentId: data.user?.studentId || '',
      major: '',
      year: data.user?.year || '',
      gpa: '',
      enrollmentDate: '',
      role: userRole,
      avatarColor: userRoleData.color,
      avatarUrl: data.user?.avatarUrl || '',
      onboardingComplete: !!data.user?.onboardingComplete,
    });

    navigate(data.user?.onboardingComplete ? (userRole === 'teacher' ? '/teacher/dashboard' : userRole === 'admin' ? '/admin/dashboard' : '/student/dashboard') : '/onboarding');
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPassword) {
      setErrorMessage('Please enter name, email and password.');
      return;
    }
    if (trimmedName.length < 2) {
      setErrorMessage('Name must be at least 2 characters.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (trimmedPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(API.signup, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          password: trimmedPassword,
          role: selectedRole,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Common during testing: account already exists for same email.
        // Fall back to login so token is available and onboarding/profile save can proceed.
        if (response.status === 400 && typeof data.message === 'string' && data.message.toLowerCase().includes('already exists')) {
          const loginResponse = await fetch(API.login, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword }),
          });
          const loginData = await loginResponse.json();

          if (loginResponse.ok && loginData.user) {
            hydrateUserAndRoute(loginData, loginData.user?.role || selectedRole, trimmedName, trimmedEmail);
            return;
          }
        }

        setErrorMessage(data.message || 'Signup failed. Please try again.');
        return;
      }

      hydrateUserAndRoute(data, selectedRole, trimmedName, trimmedEmail);
    } catch (error) {
      setErrorMessage('Server error. Please check backend connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row overflow-hidden">
      {/* Right Side: Signup Form (Moved left on desktop for variety or kept right) */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-20 bg-background relative order-2 md:order-1">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="md:hidden flex flex-col items-center mb-8">
             <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-3 shadow-lg">
              <span className="text-white font-bold text-xl">U</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">UniSphere</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Create Account</h2>
            <p className="text-muted-foreground">Join the UniSphere community today</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
             <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground/80 ml-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full h-12 px-4 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm font-medium"
                />
              </div>

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
                <label className="text-sm font-semibold text-foreground/80 ml-1">Password</label>
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

            {/* Role Selection */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground/80 ml-1">Join as</label>
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
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center text-white shadow-lg`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-[10px] font-bold ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
                        {role.label}
                      </span>
                      {isSelected && (
                        <motion.div 
                          layoutId="activeSignupRole"
                          className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-white rounded-full flex items-center justify-center shadow-md"
                        >
                          <CheckCircle2 className="w-2.5 h-2.5" />
                        </motion.div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2 rounded-2xl border border-border bg-card/40 p-4">
              <p className="text-xs font-bold uppercase tracking-widest text-primary">What happens next</p>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>- Create account with name, email and password</li>
                <li>- Go to onboarding page to select department and add personal details</li>
                <li>- Account is marked complete after onboarding is submitted</li>
              </ul>
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
                    Create Account <UserPlus className="w-5 h-5 transition-transform group-hover:scale-110" />
                  </>
                )}
              </span>
            </button>

            <p className="text-center text-sm text-muted-foreground pt-2 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-bold hover:underline">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>

       {/* Left Side: Branding & Illustration (Visible on MD+) */}
       <div className="hidden md:flex md:w-1/2 bg-gradient-to-tr from-primary/20 via-background to-primary/10 relative p-12 flex-col justify-between overflow-hidden order-1 md:order-2 border-l border-border">
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/20 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <span className="text-white font-bold text-xl">U</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">UniSphere</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-sm mt-20">
          <h1 className="text-5xl font-bold text-foreground mb-6 leading-tight">Master your academic journey.</h1>
          <p className="text-lg text-muted-foreground font-medium">Join thousands of students and educators in the most advanced learning ecosystem on the planet.</p>
        </div>

        <div className="relative z-10">
          <div className="flex -space-x-3 mb-4">
             {[1,2,3,4].map(i => (
               <div key={i} className={`w-10 h-10 rounded-full border-2 border-background bg-primary flex items-center justify-center text-[10px] font-bold text-white shadow-lg`}>U{i}</div>
             ))}
             <div className="w-10 h-10 rounded-full border-2 border-background bg-card flex items-center justify-center text-[10px] font-bold text-foreground shadow-lg border-dashed">+5k</div>
          </div>
          <p className="text-xs font-bold text-muted-foreground tracking-widest uppercase mb-1">Standardized Identity Flow</p>
          <div className="h-1 w-32 bg-secondary rounded-full overflow-hidden">
             <div className="h-full w-2/3 bg-primary/40" />
          </div>
        </div>
      </div>
    </div>
  );
}