import { useState, useRef } from 'react';
import {
  User, Mail, Phone, MapPin, BookOpen, Award,
  Camera, Check, Eye, EyeOff, Lock, Palette, Save,
  Building, Briefcase, GraduationCap, Github, Twitter, Linkedin
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { Skeleton } from '../components/Skeleton';

const DEPARTMENTS = [
  'Computer Science', 'Mathematics', 'Physics', 'Chemistry',
  'Biology', 'Engineering', 'Business', 'Arts & Humanities', 'Social Sciences',
];

const AVATAR_COLORS = [
  { label: 'Teal Forest', value: 'from-teal-600 to-emerald-600' },
  { label: 'Deep Indigo', value: 'from-indigo-600 to-blue-600' },
  { label: 'Royal Purple', value: 'from-purple-600 to-pink-600' },
  { label: 'Sunset Orange', value: 'from-orange-500 to-red-600' },
  { label: 'Midnight Slate', value: 'from-slate-700 to-slate-900' },
  { label: 'Sea Breeze', value: 'from-cyan-400 to-blue-500' },
];

export function Profile() {
  const { user, updateUser } = useUser();
  const { theme, toggleTheme } = useTheme();

  // Form state
  const [form, setForm] = useState({ ...user });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    // Simulate initial protocol fetch
    setTimeout(() => setLoading(false), 1200);
  }, []);

  // Password change state
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const [pwSaved, setPwSaved] = useState(false);

  // Avatar upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials = form.name ? form.name.split(' ').map(n => n[0]).join('').toUpperCase() : '?';

  const handleField = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    setSaveStatus('idle');
  };

  const handleAvatarColor = (color: string) => {
    setForm(prev => ({ ...prev, avatarColor: color }));
    setSaveStatus('idle');
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setForm(prev => ({ ...prev, avatarUrl: ev.target?.result as string }));
      setSaveStatus('idle');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    await new Promise(r => setTimeout(r, 800));
    updateUser(form);
    setSaveStatus('saved');
    toast.success('Identity Synchronized', {
        description: 'Your profile data has been successfully deployed to the node.',
        duration: 3000
    });
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  const handlePasswordSave = () => {
    setPwError('');
    if (!pwForm.current) return setPwError('Please enter your current password.');
    if (pwForm.newPw.length < 8) return setPwError('New password must be at least 8 characters.');
    if (pwForm.newPw !== pwForm.confirm) return setPwError('Passwords do not match.');
    setPwSaved(true);
    setPwForm({ current: '', newPw: '', confirm: '' });
    setTimeout(() => { setPwSaved(false); setShowPasswordSection(false); }, 2000);
  };

  return (
    <div className="space-y-8 max-w-6xl pb-20">
      {/* Dynamic Profile Header */}
      <div className="relative h-64 rounded-[48px] bg-gradient-to-tr from-slate-950 via-indigo-950 to-slate-900 border border-white/10 overflow-hidden shadow-2xl">
          <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[5%] w-64 h-64 bg-accent/10 rounded-full blur-[80px]"></div>
          
          <div className="absolute inset-0 flex items-end p-10 pb-8 gap-8 bg-gradient-to-t from-black/60 to-transparent">
              <div className="relative group">
                {loading ? (
                    <Skeleton className="w-32 h-32" variant="rounded" />
                ) : (
                    <>
                        <div className={`w-32 h-32 rounded-[40px] bg-gradient-to-br ${form.avatarColor} border-4 border-card flex items-center justify-center text-white text-4xl font-black shadow-2xl overflow-hidden`}>
                        {form.avatarUrl ? (
                                <img src={form.avatarUrl} alt={form.name} className="w-full h-full object-cover" />
                            ) : (
                                initials
                            )}
                        </div>
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-xl border-4 border-card hover:scale-110 transition-transform active:scale-95"
                        >
                            <Camera className="w-5 h-5" />
                        </button>
                    </>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </div>
 
              <div className="flex-1 mb-2">
                  <div className="flex items-center gap-3 mb-1">
                      {loading ? (
                          <Skeleton className="w-48 h-10" variant="rounded" />
                      ) : (
                          <>
                            <h1 className="text-4xl font-black text-white tracking-tight">{form.name || 'Set Your Name'}</h1>
                            <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/80 text-[10px] font-black uppercase tracking-widest">{user.role}</span>
                          </>
                      )}
                  </div>
                  {loading ? (
                      <Skeleton className="w-64 h-4 mt-2" variant="rounded" />
                  ) : (
                    <p className="text-white/60 font-medium flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {form.email}</span>
                        <span className="flex items-center gap-1.5"><Building className="w-4 h-4" /> {form.department}</span>
                    </p>
                  )}
              </div>

              <div className="flex gap-3 mb-2">
                  <button className="h-12 px-6 rounded-2xl bg-white text-slate-900 font-bold hover:shadow-xl transition-all active:scale-95 flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Preview
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={saveStatus === 'saving'}
                    className={`h-12 px-6 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-primary/20 transition-all active:scale-95 ${saveStatus === 'saved' ? 'bg-green-500 text-white' : 'bg-primary text-white hover:bg-primary/90'}`}
                  >
                    {saveStatus === 'saved' ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                    {saveStatus === 'saved' ? 'Synchronized' : saveStatus === 'saving' ? 'Processing...' : 'Deploy Changes'}
                  </button>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Form Area */}
          <div className="lg:col-span-8 space-y-6">
              <div className="bg-card rounded-[40px] p-10 border border-border shadow-sm">
                  <h3 className="text-lg font-black text-foreground uppercase tracking-widest mb-10 border-b border-border pb-4 flex items-center gap-3">
                      <User className="w-6 h-6 text-primary" />
                      Core Identity Data
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Legal Full Name</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={handleField('name')}
                            className="w-full h-14 px-5 rounded-[20px] bg-secondary border border-transparent focus:border-primary/30 transition-all outline-none font-bold text-foreground"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Academic Email</label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={handleField('email')}
                            className="w-full h-14 px-5 rounded-[20px] bg-secondary border border-transparent focus:border-primary/30 transition-all outline-none font-bold text-foreground"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Cellular Contact</label>
                        <input
                            type="tel"
                            value={form.phone}
                            onChange={handleField('phone')}
                            className="w-full h-14 px-5 rounded-[20px] bg-secondary border border-transparent focus:border-primary/30 transition-all outline-none font-bold text-foreground"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Geospatial Origin</label>
                        <input
                            type="text"
                            value={form.location}
                            onChange={handleField('location')}
                            className="w-full h-14 px-5 rounded-[20px] bg-secondary border border-transparent focus:border-primary/30 transition-all outline-none font-bold text-foreground"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Departmental Node</label>
                        <select
                            value={form.department}
                            onChange={handleField('department')}
                            className="w-full h-14 px-5 rounded-[20px] bg-secondary border border-transparent focus:border-primary/30 transition-all outline-none font-bold text-foreground appearance-none"
                        >
                            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Professional Abstract</label>
                        <textarea
                            value={form.bio}
                            onChange={handleField('bio')}
                            rows={4}
                            className="w-full p-5 rounded-[24px] bg-secondary border border-transparent focus:border-primary/30 transition-all outline-none font-medium text-foreground resize-none leading-relaxed"
                            placeholder="Describe your academic focus..."
                        />
                      </div>
                  </div>
              </div>

              {/* Academic Domain */}
              <div className="bg-card rounded-[40px] p-10 border border-border shadow-sm">
                  <h3 className="text-lg font-black text-foreground uppercase tracking-widest mb-10 border-b border-border pb-4 flex items-center gap-3">
                      <GraduationCap className="w-6 h-6 text-primary" />
                      Academic Profile
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">University / College</label>
                        <input
                            type="text"
                            value={form.university || 'UniSphere Academy'}
                            onChange={handleField('university')}
                            className="w-full h-14 px-5 rounded-[20px] bg-secondary border border-transparent focus:border-primary/30 transition-all outline-none font-bold text-foreground"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Course / Major</label>
                        <input
                            type="text"
                            value={form.major}
                            onChange={handleField('major')}
                            className="w-full h-14 px-5 rounded-[20px] bg-secondary border border-transparent focus:border-primary/30 transition-all outline-none font-bold text-foreground"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Year / Semester</label>
                        <input
                            type="text"
                            value={form.year}
                            onChange={handleField('year')}
                            className="w-full h-14 px-5 rounded-[20px] bg-secondary border border-transparent focus:border-primary/30 transition-all outline-none font-bold text-foreground"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Enrollment ID</label>
                        <input
                            type="text"
                            value={form.studentId}
                            onChange={handleField('studentId')}
                            className="w-full h-14 px-5 rounded-[20px] bg-secondary border border-transparent focus:border-primary/30 transition-all outline-none font-bold text-foreground"
                        />
                      </div>
                  </div>
              </div>

              {/* Social & Integrations */}
              <div className="bg-card rounded-[40px] p-10 border border-border shadow-sm">
                  <h3 className="text-lg font-black text-foreground uppercase tracking-widest mb-10 flex items-center gap-3">
                      <Briefcase className="w-6 h-6 text-primary" />
                      External Nodes
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { icon: Github, label: 'GitHub', placeholder: 'github.com/user' },
                            { icon: Linkedin, label: 'LinkedIn', placeholder: 'linkedin.com/in/user' },
                            { icon: Twitter, label: 'Twitter', placeholder: '@username' }
                        ].map((soc, i) => (
                            <div key={i} className="p-4 rounded-2xl bg-secondary/50 border border-transparent hover:border-border transition-all flex items-center gap-3 group">
                                <soc.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                <input 
                                    type="text" 
                                    placeholder={soc.placeholder} 
                                    className="bg-transparent outline-none text-xs font-bold text-foreground w-full placeholder:text-muted-foreground/50"
                                />
                            </div>
                        ))}
                  </div>
              </div>
          </div>

          {/* Sidebar Panels */}
          <div className="lg:col-span-4 space-y-8">
              {/* Branding Customizer */}
              <div className="bg-card rounded-[40px] p-8 border border-border shadow-sm">
                   <h3 className="text-base font-black text-foreground uppercase tracking-widest mb-6 flex items-center gap-3">
                      <Palette className="w-5 h-5 text-primary" />
                      UI Persona
                  </h3>
                  <div className="grid grid-cols-3 gap-3 mb-8">
                    {AVATAR_COLORS.map(c => (
                        <button 
                            key={c.value} 
                            onClick={() => handleAvatarColor(c.value)}
                            className={`h-12 rounded-2xl bg-gradient-to-br ${c.value} transition-all hover:scale-105 active:scale-95 shadow-lg ${form.avatarColor === c.value ? 'ring-4 ring-primary ring-offset-4 ring-offset-card' : 'ring-1 ring-white/10'}`}
                            title={c.label}
                        />
                    ))}
                  </div>
                  <div className="space-y-4">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Interface Theme</p>
                      <div className="grid grid-cols-2 gap-3">
                           <button 
                             onClick={() => theme === 'dark' && toggleTheme()}
                             className={`h-14 rounded-2xl border-2 flex items-center justify-center gap-2 transition-all ${theme === 'light' ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-secondary text-muted-foreground'}`}>
                               <Palette className="w-4 h-4" />
                               <span className="text-xs font-black uppercase">Prism</span>
                           </button>
                           <button 
                             onClick={() => theme === 'light' && toggleTheme()}
                             className={`h-14 rounded-2xl border-2 flex items-center justify-center gap-2 transition-all ${theme === 'dark' ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-secondary text-muted-foreground'}`}>
                               <Palette className={`w-4 h-4 ${theme === 'dark' ? 'fill-primary' : ''}`} />
                               <span className="text-xs font-black uppercase">Void</span>
                           </button>
                      </div>
                  </div>
              </div>

              {/* Security Guard */}
              <div className="bg-card rounded-[40px] p-8 border border-border shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                      <h3 className="text-base font-black text-foreground uppercase tracking-widest flex items-center gap-3">
                          <Lock className="w-5 h-5 text-orange-500" />
                          Vault
                      </h3>
                      <button 
                        onClick={() => setShowPasswordSection(!showPasswordSection)}
                        className="text-[10px] font-black uppercase text-primary hover:underline transition-all"
                      >
                        {showPasswordSection ? 'Exit' : 'Unlock'}
                      </button>
                  </div>
                  
                  <AnimatePresence>
                    {showPasswordSection ? (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="space-y-4 overflow-hidden"
                        >
                            <input 
                                type="password" 
                                placeholder="Root Password" 
                                className="w-full h-12 px-4 rounded-xl bg-secondary border border-transparent focus:border-primary/20 outline-none text-xs font-bold"
                            />
                             <input 
                                type="password" 
                                placeholder="New Protocol" 
                                className="w-full h-12 px-4 rounded-xl bg-secondary border border-transparent focus:border-primary/20 outline-none text-xs font-bold"
                            />
                            <button className="w-full h-12 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                                Verify & Deploy
                            </button>
                        </motion.div>
                    ) : (
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/30 relative">
                             <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center text-primary shadow-sm">
                                <ShieldCheck className="w-5 h-5" />
                             </div>
                             <div>
                                <p className="text-[10px] font-black text-foreground uppercase tracking-widest">Protocol Healthy</p>
                                <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-60">Last sync 2h ago</p>
                             </div>
                        </div>
                    )}
                  </AnimatePresence>
              </div>

              {/* Academic Highlights */}
              <div className="bg-card rounded-[40px] p-8 border border-border shadow-sm">
                    <h3 className="text-base font-black text-foreground uppercase tracking-widest mb-8 flex items-center gap-3">
                        <Award className="w-5 h-5 text-primary" />
                        Achievements
                    </h3>
                    <div className="space-y-3">
                        {[
                            { label: 'Completed Courses', count: '12', icon: '🎓', color: 'bg-green-500/10' },
                            { label: 'Assignment Streak', count: '14 Days', icon: '🔥', color: 'bg-orange-500/10' },
                            { label: 'Top Contributor', count: 'Gold Badge', icon: '🌟', color: 'bg-yellow-500/10' }
                        ].map((ac, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/50 group hover:bg-primary/5 transition-all">
                                <div className={`w-12 h-12 rounded-xl ${ac.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                                    {ac.icon}
                                </div>
                                <div>
                                    <p className="text-xs font-black text-foreground">{ac.label}</p>
                                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{ac.count}</p>
                                </div>
                            </div>
                        ))}
                    </div>
              </div>
          </div>
      </div>
    </div>
  );
}