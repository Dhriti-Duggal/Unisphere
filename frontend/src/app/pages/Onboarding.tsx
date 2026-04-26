import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight, ArrowLeft, CheckCircle2, Sparkles,
  GraduationCap, User, BookOpen, Building2, Briefcase, Users
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { DEPARTMENTS } from '../data/departments';
import { API } from '../../api/api';

const STUDENT_YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate'];
const TEACHER_TITLES = ['Assistant Professor', 'Associate Professor', 'Professor', 'Lecturer', 'Visiting Faculty'];
const GROUPS = ['Group 1', 'Group 2', 'Group 3', 'Group 4', 'Group 5'];

export function Onboarding() {
  const navigate = useNavigate();
  const { user, updateUser } = useUser();

  const isTeacher = user.role === 'teacher';
  const isAdmin = user.role === 'admin';

  const [step, setStep] = useState(1);
  const [selectedDeptId, setSelectedDeptId] = useState(user.departmentId || '');
  const [year, setYear] = useState(user.year || '');
  const [group, setGroup] = useState(user.group || '');
  const [teachingGroups, setTeachingGroups] = useState<string[]>(user.teachingGroups || []);
  const [bio, setBio] = useState(user.bio || '');
  const [idField, setIdField] = useState(user.studentId || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [university, setUniversity] = useState(user.university || 'Chitkara University');
  const [city, setCity] = useState(user.city || '');
  const [state, setState] = useState(user.state || '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');
  const [isSaving, setIsSaving] = useState(false);

  const toggleTeachingGroup = (g: string) => {
    setTeachingGroups(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]);
  };

  const selectedDept = DEPARTMENTS.find(d => d.id === selectedDeptId);

  const canProceedStep1 = !!selectedDeptId;
  const canProceedStep2 =
    (!!phone.trim() && !!university.trim() && !!city.trim() && !!state.trim()) &&
    (isTeacher ? teachingGroups.length > 0 : true) &&
    (isAdmin ? true : !!year) &&
    (isTeacher || isAdmin ? true : !!group && !!bio.trim() && !!avatarUrl.trim());

  const handleFinish = async () => {
    setIsSaving(true);

    const onboardingPayload = isTeacher
      ? {
          role: 'teacher',
          departmentId: selectedDeptId,
          department: selectedDept?.name || '',
          major: selectedDept?.shortName || '',
          year: year || 'Faculty',
          bio: bio || `${selectedDept?.name} faculty at UniSphere.`,
          studentId: idField.trim() || `EMP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
          teachingGroups,
          phone: phone.trim(),
          university: university.trim(),
          city: city.trim(),
          state: state.trim(),
          location: [city.trim(), state.trim()].filter(Boolean).join(', '),
          avatarUrl: avatarUrl.trim(),
          enrollmentDate: `April ${new Date().getFullYear()}`,
          onboardingComplete: true,
        }
      : isAdmin
      ? {
          role: 'admin',
          departmentId: selectedDeptId,
          department: selectedDept?.name || '',
          major: selectedDept?.shortName || '',
          year: year || 'Administrator',
          bio: bio.trim(),
          studentId: idField.trim() || `ADM-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
          phone: phone.trim(),
          university: university.trim(),
          city: city.trim(),
          state: state.trim(),
          location: [city.trim(), state.trim()].filter(Boolean).join(', '),
          avatarUrl: avatarUrl.trim(),
          enrollmentDate: `April ${new Date().getFullYear()}`,
          onboardingComplete: true,
        }
      : {
          role: 'student',
          departmentId: selectedDeptId,
          department: selectedDept?.name || '',
          major: selectedDept?.shortName || '',
          year,
          bio: bio.trim(),
          studentId: idField.trim() || `STU-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
          group,
          phone: phone.trim(),
          university: university.trim(),
          city: city.trim(),
          state: state.trim(),
          location: [city.trim(), state.trim()].filter(Boolean).join(', '),
          avatarUrl: avatarUrl.trim(),
          enrollmentDate: `April ${new Date().getFullYear()}`,
          onboardingComplete: true,
        };

    updateUser(onboardingPayload);

    try {
      const token = localStorage.getItem('token');
      const isValidToken = !!token && token !== 'null' && token !== 'undefined';
      if (!isValidToken) {
        throw new Error('Authentication token missing. Please log in again.');
      }

      const response = await fetch(API.profile, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(onboardingPayload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          localStorage.removeItem('token');
          throw new Error('Session expired. Please log in again.');
        }
        throw new Error(errorData?.message || 'Failed to save onboarding details to database.');
      }

      const saved = await response.json().catch(() => ({}));
      if (saved?.user) {
        updateUser({
          role: saved.user.role || user.role,
          departmentId: saved.user.departmentId || '',
          department: saved.user.department || '',
          studentId: saved.user.studentId || '',
          year: saved.user.year || '',
          group: saved.user.group || '',
          teachingGroups: saved.user.teachingGroups || [],
          bio: saved.user.bio || '',
          phone: saved.user.phone || '',
          university: saved.user.university || '',
          city: saved.user.city || '',
          state: saved.user.state || '',
          location: saved.user.location || '',
          avatarUrl: saved.user.avatarUrl || '',
          onboardingComplete: !!saved.user.onboardingComplete,
        });
      }
    } catch (error) {
      setIsSaving(false);
      const message = error instanceof Error ? error.message : 'Failed to save onboarding details.';
      window.alert(message);
      if (message.toLowerCase().includes('authentication token missing') || message.toLowerCase().includes('session expired')) {
        navigate('/login');
      }
      return;
    }

    await new Promise(r => setTimeout(r, 400));
    setIsSaving(false);
    navigate(isTeacher ? '/teacher/dashboard' : isAdmin ? '/admin/dashboard' : '/student/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-3xl">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">U</span>
          </div>
          <span className="text-xl font-bold text-foreground tracking-tight">UniSphere</span>
          {/* Role badge */}
          <span className={`ml-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isTeacher ? 'bg-indigo-500/10 text-indigo-600 border border-indigo-200' : 'bg-primary/10 text-primary border border-primary/20'}`}>
            {isTeacher ? '👨‍🏫 Teacher Setup' : '🎓 Student Setup'}
          </span>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-3 mb-10">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm border-2 transition-all duration-300 ${
                step > s
                  ? 'bg-primary border-primary text-white'
                  : step === s
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'bg-card border-border text-muted-foreground'
              }`}>
                {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
              </div>
              <span className={`text-sm font-bold hidden sm:block ${step === s ? 'text-foreground' : 'text-muted-foreground'}`}>
                {s === 1
                  ? (isTeacher ? 'Your Department' : 'Your Department')
                  : (isTeacher ? 'Faculty Profile' : 'Profile Details')}
              </span>
              {s < 2 && (
                <div className={`h-0.5 w-12 rounded-full transition-all ${step > s ? 'bg-primary' : 'bg-border'}`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ── Step 1: Department ── */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  <span className="text-xs font-black text-primary uppercase tracking-widest">Step 1 of 2</span>
                </div>
                <h1 className="text-4xl font-black text-foreground tracking-tight leading-tight">
                  {isTeacher ? 'Which department\ndo you teach in?' : isAdmin ? 'Which department\nwill you manage?' : 'Which department\nare you in?'}
                </h1>
                <p className="text-muted-foreground mt-2 font-medium">
                  {isTeacher
                    ? 'We\'ll set up your course management and student access accordingly.'
                    : isAdmin
                    ? 'We\'ll configure your administration scope based on this department.'
                    : 'We\'ll personalize your courses and assignments based on this.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                {DEPARTMENTS.map((dept) => {
                  const isSelected = selectedDeptId === dept.id;
                  return (
                    <motion.button
                      key={dept.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedDeptId(dept.id)}
                      className={`relative text-left p-5 rounded-[28px] border-2 transition-all duration-200 overflow-hidden group ${
                        isSelected
                          ? 'border-primary bg-primary/5 shadow-xl shadow-primary/10'
                          : 'border-border bg-card hover:border-primary/40 hover:shadow-lg'
                      }`}
                    >
                      <div className={`absolute -top-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br ${dept.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${dept.color} flex items-center justify-center text-2xl mb-4 shadow-lg`}>
                        {dept.icon}
                      </div>
                      <h3 className={`text-sm font-black leading-tight mb-1 ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                        {dept.name}
                      </h3>
                      <p className="text-[11px] font-medium text-muted-foreground">{dept.description}</p>
                      {isSelected && (
                        <motion.div layoutId="deptCheck" className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-md">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  disabled={!canProceedStep1}
                  onClick={() => setStep(2)}
                  className="h-14 px-10 rounded-2xl bg-primary text-white font-black text-sm flex items-center gap-3 shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── Step 2: Profile Details ── */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }}>
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  {isTeacher ? <Briefcase className="w-5 h-5 text-primary" /> : <User className="w-5 h-5 text-primary" />}
                  <span className="text-xs font-black text-primary uppercase tracking-widest">Step 2 of 2</span>
                </div>
                <h1 className="text-4xl font-black text-foreground tracking-tight leading-tight">
                  {isTeacher ? 'Your faculty\nprofile' : isAdmin ? 'Admin\nprofile setup' : 'A little about\nyourself'}
                </h1>
                <p className="text-muted-foreground mt-2 font-medium">
                  {isTeacher
                    ? 'Set up your faculty profile to manage courses and students.'
                    : isAdmin
                    ? 'Complete your administrator profile to continue.'
                    : 'Complete your student profile to get started.'}
                </p>
              </div>

              {/* Dept chip */}
              {selectedDept && (
                <div className="flex items-center gap-3 mb-8 p-4 rounded-2xl bg-primary/5 border border-primary/20">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedDept.color} flex items-center justify-center text-lg shadow-md`}>
                    {selectedDept.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">
                    {isTeacher ? 'Teaching Department' : isAdmin ? 'Administration Department' : 'Selected Department'}
                    </p>
                    <p className="text-sm font-bold text-foreground">{selectedDept.name}</p>
                  </div>
                  <button onClick={() => setStep(1)} className="ml-auto text-[10px] font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
                    Change
                  </button>
                </div>
              )}

              <div className="space-y-5 mb-8">
                {/* Teacher: title picker / Student: year of study */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground/80 ml-1 flex items-center gap-2">
                    {isTeacher ? <Briefcase className="w-4 h-4 text-primary" /> : <GraduationCap className="w-4 h-4 text-primary" />}
                    {isTeacher ? 'Faculty Title' : isAdmin ? 'Admin Title' : 'Year of Study'}{' '}
                    {!isTeacher && !isAdmin && <span className="text-red-500">*</span>}
                    {(isTeacher || isAdmin) && <span className="text-muted-foreground font-normal">(optional)</span>}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {(isTeacher ? TEACHER_TITLES : isAdmin ? ['Administrator', 'Coordinator', 'Department Admin'] : STUDENT_YEARS).map(opt => (
                      <button
                        key={opt} type="button" onClick={() => setYear(opt)}
                        className={`py-3 rounded-xl text-xs font-bold border-2 transition-all ${
                          year === opt
                            ? 'border-primary bg-primary text-white shadow-lg shadow-primary/20'
                            : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {!isAdmin && (
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground/80 ml-1 flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      {isTeacher ? 'Groups You Teach' : 'Your Class Group'}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                      {GROUPS.map(opt => {
                        const isSelected = isTeacher ? teachingGroups.includes(opt) : group === opt;
                        return (
                          <button
                            key={opt} type="button" 
                            onClick={() => isTeacher ? toggleTeachingGroup(opt) : setGroup(opt)}
                            className={`py-3 rounded-xl text-xs font-bold border-2 transition-all ${
                              isSelected
                                ? 'border-primary bg-primary text-white shadow-lg shadow-primary/20'
                                : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ID field */}
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-foreground/80 ml-1">
                    {isTeacher ? 'Employee ID' : 'Student ID'}{' '}
                    <span className="text-muted-foreground font-normal">(optional — auto-generated if blank)</span>
                  </label>
                  <input
                    type="text"
                    value={idField}
                    onChange={e => setIdField(e.target.value)}
                    placeholder={isTeacher ? 'e.g. EMP-2024-0042' : 'e.g. STU-2024-0042'}
                    className="w-full h-12 px-4 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-foreground/80 ml-1">University <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={university}
                      onChange={e => setUniversity(e.target.value)}
                      placeholder="Chitkara University"
                      className="w-full h-12 px-4 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-foreground/80 ml-1">Phone <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full h-12 px-4 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm font-medium"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-foreground/80 ml-1">City <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      placeholder="e.g. Chandigarh"
                      className="w-full h-12 px-4 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-foreground/80 ml-1">State <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={state}
                      onChange={e => setState(e.target.value)}
                      placeholder="e.g. Punjab"
                      className="w-full h-12 px-4 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-foreground/80 ml-1">Profile Image URL {isTeacher || isAdmin ? <span className="text-muted-foreground font-normal">(optional)</span> : <span className="text-red-500">*</span>}</label>
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={e => setAvatarUrl(e.target.value)}
                    placeholder="https://example.com/your-profile-image.jpg"
                    className="w-full h-12 px-4 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm font-medium"
                  />
                </div>

                {/* Bio */}
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-foreground/80 ml-1 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    Short Bio {isTeacher ? <span className="text-muted-foreground font-normal">(optional)</span> : <span className="text-red-500">*</span>}
                  </label>
                  <textarea
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    placeholder={isTeacher
                      ? 'Tell your students about your teaching experience and expertise...'
                      : 'Tell the UniSphere community a bit about yourself...'}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm font-medium resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button onClick={() => setStep(1)} className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  disabled={!canProceedStep2 || isSaving}
                  onClick={handleFinish}
                  className="h-14 px-10 rounded-2xl bg-primary text-white font-black text-sm flex items-center gap-3 shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><Sparkles className="w-5 h-5" /> {isTeacher ? 'Enter Control Centre' : isAdmin ? 'Enter Admin Centre' : 'Enter UniSphere'}</>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-xs font-medium text-muted-foreground mt-10">
          Welcome, <span className="text-foreground font-bold">{user.name}</span>!{' '}
          {isTeacher ? '🏫 Your teaching journey starts here.' : isAdmin ? '🛡️ Your admin journey starts here.' : '🎓 Your academic journey starts here.'}
        </p>
      </div>
    </div>
  );
}
