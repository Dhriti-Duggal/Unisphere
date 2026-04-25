import { useState, useRef, useEffect } from 'react';
import {
  User, Mail, Phone, MapPin, BookOpen, Award,
  Camera, Check, Lock, Palette, Save,
  Building, Briefcase, GraduationCap, Github, Twitter, Linkedin,
  ShieldCheck, ArrowLeft
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router';
import { DEPARTMENTS as DEPT_LIST } from '../data/departments';
import { API } from '../../api/api';

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
  const navigate = useNavigate();

  const [form, setForm] = useState({ ...user });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keep form in sync if context changes externally
  useEffect(() => { setForm({ ...user }); }, [user]);

  const initials = form.name
    ? form.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const handleField = (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setSaveStatus('idle');
    };

  const handleAvatarColor = (color: string) => {
    setForm((prev) => ({ ...prev, avatarColor: color }));
    setSaveStatus('idle');
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm((prev) => ({ ...prev, avatarUrl: ev.target?.result as string }));
      setSaveStatus('idle');
    };
    reader.readAsDataURL(file);
  };

  // Save: update context (localStorage) + call backend if token exists
  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      updateUser(form);

      const token = localStorage.getItem('token');
      const isValidToken = !!token && token !== 'null' && token !== 'undefined';
      if (isValidToken) {
        const response = await fetch(API.profile, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: form.name,
            bio: form.bio,
            phone: form.phone,
            university: form.university || '',
            city: form.city || '',
            state: form.state || '',
            location: form.location,
            avatarUrl: form.avatarUrl || '',
            departmentId: form.departmentId,
            department: form.department,
            studentId: form.studentId,
            year: form.year,
          }),
        });

        if (response.status === 401) {
          localStorage.removeItem('token');
          toast.error('Session expired', { description: 'Please log in again.' });
          setSaveStatus('idle');
          navigate('/login');
          return;
        }
      }

      setSaveStatus('saved');
      toast.success('Profile Saved', {
        description: 'Your profile has been updated successfully.',
        duration: 3000,
      });
    } catch {
      toast.error('Save failed', { description: 'Local changes saved. Backend sync failed.' });
      setSaveStatus('idle');
    }
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  const handlePasswordSave = () => {
    setPwError('');
    if (!pwForm.current) return setPwError('Enter your current password.');
    if (pwForm.newPw.length < 8) return setPwError('New password must be at least 8 characters.');
    if (pwForm.newPw !== pwForm.confirm) return setPwError('Passwords do not match.');
    toast.success('Password updated');
    setPwForm({ current: '', newPw: '', confirm: '' });
    setShowPasswordSection(false);
  };

  const rolePath = user.role === 'teacher' ? '/teacher' : user.role === 'admin' ? '/admin' : '/student';

  return (
    <div className="space-y-8 max-w-6xl pb-20">
      {/* Back to Dashboard */}
      <Link
        to={`${rolePath}/dashboard`}
        className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      {/* Hero Header */}
      <div className="relative h-64 rounded-[48px] bg-gradient-to-tr from-slate-950 via-indigo-950 to-slate-900 border border-white/10 overflow-hidden shadow-2xl">
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[5%] w-64 h-64 bg-accent/10 rounded-full blur-[80px]" />

        <div className="absolute inset-0 flex items-end p-10 pb-8 gap-8 bg-gradient-to-t from-black/60 to-transparent">
          {/* Avatar */}
          <div className="relative group flex-shrink-0">
            <div className={`w-32 h-32 rounded-[40px] bg-gradient-to-br ${form.avatarColor} border-4 border-card flex items-center justify-center text-white text-4xl font-black shadow-2xl overflow-hidden`}>
              {form.avatarUrl
                ? <img src={form.avatarUrl} alt={form.name} className="w-full h-full object-cover" />
                : initials}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-xl border-4 border-card hover:scale-110 transition-transform"
              title="Upload photo"
            >
              <Camera className="w-5 h-5" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
          </div>

          {/* Name / Info */}
          <div className="flex-1 mb-2">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-4xl font-black text-white tracking-tight">{form.name || 'Your Name'}</h1>
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/80 text-[10px] font-black uppercase tracking-widest">
                {user.role}
              </span>
            </div>
            <p className="text-white/60 font-medium flex flex-wrap items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {form.email}</span>
              {form.department && (
                <span className="flex items-center gap-1.5"><Building className="w-4 h-4" /> {form.department}</span>
              )}
              {form.year && (
                <span className="flex items-center gap-1.5"><GraduationCap className="w-4 h-4" /> {form.year}</span>
              )}
            </p>
          </div>

          {/* Save Button */}
          <div className="mb-2">
            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className={`h-12 px-6 rounded-2xl font-bold flex items-center gap-2 shadow-xl transition-all active:scale-95 ${
                saveStatus === 'saved'
                  ? 'bg-green-500 text-white'
                  : 'bg-primary text-white hover:bg-primary/90 shadow-primary/20'
              }`}
            >
              {saveStatus === 'saved' ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
              {saveStatus === 'saved' ? 'Saved!' : saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ── Left: Main Form ── */}
        <div className="lg:col-span-8 space-y-6">

          {/* Core Identity */}
          <div className="bg-card rounded-[40px] p-10 border border-border shadow-sm">
            <h3 className="text-lg font-black text-foreground uppercase tracking-widest mb-8 border-b border-border pb-4 flex items-center gap-3">
              <User className="w-6 h-6 text-primary" /> Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Full Name', field: 'name', type: 'text' },
                { label: 'Email Address', field: 'email', type: 'email' },
                { label: 'Phone Number', field: 'phone', type: 'tel' },
                { label: 'Location', field: 'location', type: 'text' },
              ].map(({ label, field, type }) => (
                <div key={field} className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">{label}</label>
                  <input
                    type={type}
                    value={((form as Record<string, unknown>)[field] as string) || ''}
                    onChange={handleField(field)}
                    className="w-full h-14 px-5 rounded-[20px] bg-secondary border border-transparent focus:border-primary/30 transition-all outline-none font-bold text-foreground"
                  />
                </div>
              ))}

              {/* Department */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Department</label>
                <select
                  value={form.departmentId || ''}
                  onChange={(e) => {
                    const d = DEPT_LIST.find((x) => x.id === e.target.value);
                    setForm((prev) => ({
                      ...prev,
                      departmentId: e.target.value,
                      department: d?.name || '',
                    }));
                    setSaveStatus('idle');
                  }}
                  className="w-full h-14 px-5 rounded-[20px] bg-secondary border border-transparent focus:border-primary/30 transition-all outline-none font-bold text-foreground appearance-none"
                >
                  <option value="">Select department...</option>
                  {DEPT_LIST.map((d) => (
                    <option key={d.id} value={d.id}>{d.icon} {d.name}</option>
                  ))}
                </select>
              </div>

              {/* Year/Title */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                  {user.role === 'teacher' ? 'Faculty Title' : 'Year of Study'}
                </label>
                <select
                  value={form.year || ''}
                  onChange={handleField('year')}
                  className="w-full h-14 px-5 rounded-[20px] bg-secondary border border-transparent focus:border-primary/30 transition-all outline-none font-bold text-foreground appearance-none"
                >
                  <option value="">Select...</option>
                  {user.role === 'teacher' ? (
                    ['Assistant Professor', 'Associate Professor', 'Professor', 'Lecturer', 'Visiting Faculty'].map(y => <option key={y} value={y}>{y}</option>)
                  ) : (
                    ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate'].map(y => <option key={y} value={y}>{y}</option>)
                  )}
                </select>
              </div>

              {/* Group/Class */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                  {user.role === 'teacher' ? 'Teaching Groups (Comma Separated)' : 'Class Group'}
                </label>
                <input
                  type="text"
                  value={user.role === 'teacher' ? (form.teachingGroups?.join(', ') || '') : (form.group || '')}
                  onChange={(e) => {
                    if (user.role === 'teacher') {
                      setForm(prev => ({ ...prev, teachingGroups: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }));
                    } else {
                      setForm(prev => ({ ...prev, group: e.target.value }));
                    }
                    setSaveStatus('idle');
                  }}
                  className="w-full h-14 px-5 rounded-[20px] bg-secondary border border-transparent focus:border-primary/30 transition-all outline-none font-bold text-foreground"
                  placeholder={user.role === 'teacher' ? 'Group 1, Group 2' : 'Group 1'}
                />
              </div>

              {/* Bio */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Bio</label>
                <textarea
                  value={form.bio || ''}
                  onChange={handleField('bio')}
                  rows={4}
                  placeholder="Tell the community about yourself..."
                  className="w-full p-5 rounded-[24px] bg-secondary border border-transparent focus:border-primary/30 transition-all outline-none font-medium text-foreground resize-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Academic Info */}
          <div className="bg-card rounded-[40px] p-10 border border-border shadow-sm">
            <h3 className="text-lg font-black text-foreground uppercase tracking-widest mb-8 border-b border-border pb-4 flex items-center gap-3">
              <GraduationCap className="w-6 h-6 text-primary" /> Academic Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: user.role === 'teacher' ? 'Employee ID' : 'Student ID', field: 'studentId' },
                { label: user.role === 'teacher' ? 'Specialisation' : 'Major / Specialisation', field: 'major' },
                { label: user.role === 'teacher' ? 'Performance Rating' : 'GPA', field: 'gpa' },
                { label: user.role === 'teacher' ? 'Join Date' : 'Enrollment Date', field: 'enrollmentDate' },
              ].map(({ label, field }) => (
                <div key={field} className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">{label}</label>
                  <input
                    type="text"
                    value={((form as Record<string, unknown>)[field] as string) || ''}
                    onChange={handleField(field)}
                    className="w-full h-14 px-5 rounded-[20px] bg-secondary border border-transparent focus:border-primary/30 transition-all outline-none font-bold text-foreground"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-card rounded-[40px] p-10 border border-border shadow-sm">
            <h3 className="text-lg font-black text-foreground uppercase tracking-widest mb-8 flex items-center gap-3">
              <Briefcase className="w-6 h-6 text-primary" /> Social Links
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: Github, placeholder: 'github.com/username' },
                { icon: Linkedin, placeholder: 'linkedin.com/in/username' },
                { icon: Twitter, placeholder: '@twitter_handle' },
              ].map((s, i) => (
                <div key={i} className="p-4 rounded-2xl bg-secondary/50 border border-transparent hover:border-border transition-all flex items-center gap-3 group">
                  <s.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                  <input
                    type="text"
                    placeholder={s.placeholder}
                    className="bg-transparent outline-none text-xs font-bold text-foreground w-full placeholder:text-muted-foreground/50"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Save */}
          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className={`w-full h-14 rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-xl transition-all ${
              saveStatus === 'saved' ? 'bg-green-500 text-white' : 'bg-primary text-white hover:bg-primary/90 shadow-primary/20'
            }`}
          >
            {saveStatus === 'saving' ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : saveStatus === 'saved' ? (
              <><Check className="w-5 h-5" /> Profile Saved!</>
            ) : (
              <><Save className="w-5 h-5" /> Save All Changes</>
            )}
          </button>
        </div>

        {/* ── Right Sidebar ── */}
        <div className="lg:col-span-4 space-y-8">
          {/* Avatar Color */}
          <div className="bg-card rounded-[40px] p-8 border border-border shadow-sm">
            <h3 className="text-base font-black text-foreground uppercase tracking-widest mb-6 flex items-center gap-3">
              <Palette className="w-5 h-5 text-primary" /> Avatar Color
            </h3>
            <div className="grid grid-cols-3 gap-3 mb-8">
              {AVATAR_COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => handleAvatarColor(c.value)}
                  title={c.label}
                  className={`h-12 rounded-2xl bg-gradient-to-br ${c.value} transition-all hover:scale-105 active:scale-95 shadow-lg ${
                    form.avatarColor === c.value ? 'ring-4 ring-primary ring-offset-4 ring-offset-card' : 'ring-1 ring-white/10'
                  }`}
                />
              ))}
            </div>
            <div className="space-y-3">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Interface Theme</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => theme === 'dark' && toggleTheme()}
                  className={`h-12 rounded-2xl border-2 flex items-center justify-center gap-2 transition-all text-xs font-black uppercase ${theme === 'light' ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-secondary text-muted-foreground'}`}
                >
                  ☀️ Light
                </button>
                <button
                  onClick={() => theme === 'light' && toggleTheme()}
                  className={`h-12 rounded-2xl border-2 flex items-center justify-center gap-2 transition-all text-xs font-black uppercase ${theme === 'dark' ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-secondary text-muted-foreground'}`}
                >
                  🌙 Dark
                </button>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-card rounded-[40px] p-8 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-black text-foreground uppercase tracking-widest flex items-center gap-3">
                <Lock className="w-5 h-5 text-orange-500" /> Security
              </h3>
              <button
                onClick={() => setShowPasswordSection(!showPasswordSection)}
                className="text-[10px] font-black uppercase text-primary hover:underline"
              >
                {showPasswordSection ? 'Cancel' : 'Change'}
              </button>
            </div>

            <AnimatePresence>
              {showPasswordSection ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-3 overflow-hidden"
                >
                  {[
                    { key: 'current', placeholder: 'Current Password' },
                    { key: 'newPw', placeholder: 'New Password' },
                    { key: 'confirm', placeholder: 'Confirm New Password' },
                  ].map(({ key, placeholder }) => (
                    <input
                      key={key}
                      type="password"
                      placeholder={placeholder}
                      value={pwForm[key as keyof typeof pwForm]}
                      onChange={(e) => setPwForm((p) => ({ ...p, [key]: e.target.value }))}
                      className="w-full h-12 px-4 rounded-xl bg-secondary border border-transparent focus:border-primary/20 outline-none text-xs font-bold"
                    />
                  ))}
                  {pwError && <p className="text-xs text-red-500 font-bold">{pwError}</p>}
                  <button
                    onClick={handlePasswordSave}
                    className="w-full h-12 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg"
                  >
                    Update Password
                  </button>
                </motion.div>
              ) : (
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/30">
                  <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center text-primary shadow-sm">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-foreground uppercase tracking-widest">Account Secured</p>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase opacity-60">Password protected</p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Stats */}
          <div className="bg-card rounded-[40px] p-8 border border-border shadow-sm">
            <h3 className="text-base font-black text-foreground uppercase tracking-widest mb-6 flex items-center gap-3">
              <Award className="w-5 h-5 text-primary" /> Highlights
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Courses Enrolled', count: '4', icon: '📚', color: 'bg-blue-500/10' },
                { label: 'Assignment Streak', count: '14 Days', icon: '🔥', color: 'bg-orange-500/10' },
                { label: 'Department', count: form.department || '—', icon: '🎓', color: 'bg-primary/10' },
              ].map((ac, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/50 hover:bg-primary/5 transition-all">
                  <div className={`w-12 h-12 rounded-xl ${ac.color} flex items-center justify-center text-2xl`}>
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