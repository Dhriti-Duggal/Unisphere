import { useState } from 'react';
import { 
    User, Bell, Lock, Globe, Moon, Sun, Shield, 
    Eye, Mail, MessageSquare, ClipboardList, BookOpen, 
    Users, Smartphone, ChevronRight, CheckCircle2, ShieldAlert
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

type SettingsSection = 'account' | 'notifications' | 'privacy' | 'appearance' | 'security';

interface Toggle {
  id: string;
  label: string;
  description: string;
  defaultOn: boolean;
  icon?: React.ElementType;
  iconColor?: string;
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none ${
        checked ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-secondary'
      }`}
    >
      <motion.span
        animate={{ x: checked ? 24 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
      />
    </button>
  );
}

const NAV_ITEMS: { icon: React.ElementType; label: string; id: SettingsSection; color: string }[] = [
  { icon: User, label: 'Identity', id: 'account', color: 'text-primary' },
  { icon: Bell, label: 'Triggers', id: 'notifications', color: 'text-accent' },
  { icon: Eye, label: 'Stealth', id: 'privacy', color: 'text-orange-500' },
  { icon: Globe, label: 'Visuals', id: 'appearance', color: 'text-green-500' },
  { icon: Shield, label: 'Vault', id: 'security', color: 'text-red-500' },
];

export function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { user, updateUser } = useUser();
  const [activeSection, setActiveSection] = useState<SettingsSection>('account');
  const [accountSaved, setAccountSaved] = useState(false);

  // Notification toggles
  const [notifToggles, setNotifToggles] = useState<Record<string, boolean>>({
    assignment_alerts: true,
    grade_updates: true,
    message_alerts: true,
    announcements: true,
    group_activity: false,
    email_notifications: true,
    push_notifications: false,
    weekly_digest: true,
  });

  const toggleNotif = (id: string) => (v: boolean) =>
    setNotifToggles(prev => ({ ...prev, [id]: v }));

  const [accountForm, setAccountForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
  });
 
  // Password state
  const [pwForm, setPwForm] = useState({ current: '', new: '', confirm: '' });
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
  const [language, setLanguage] = useState('English');

  const handleAccountSave = async () => {
    updateUser(accountForm);
    setAccountSaved(true);
    toast.success('System Settings Updated', {
        description: 'Identity node parameters successfully synchronized.',
        duration: 3000
    });
    setTimeout(() => setAccountSaved(false), 3000);
  };

  const NOTIF_GROUPS: { title: string; items: Toggle[] }[] = [
    {
      title: 'In-App Telemetry',
      items: [
        { id: 'assignment_alerts', label: 'Deadline Triggers', description: 'Real-time alerts for impending submissions', icon: ClipboardList, iconColor: 'text-orange-500', defaultOn: true },
        { id: 'grade_updates', label: 'Assessment Feed', description: 'Be notified when faculty publish grades', icon: BookOpen, iconColor: 'text-green-500', defaultOn: true },
        { id: 'message_alerts', label: 'Comm Hub Pings', description: 'Direct messages and group mentions', icon: MessageSquare, iconColor: 'text-blue-500', defaultOn: true },
      ],
    },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Settings Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">System Preferences</span>
        </div>
        <h1 className="text-4xl font-black text-foreground tracking-tight">Configuration</h1>
        <p className="text-sm font-medium text-muted-foreground mt-1">Manage your academic node and connectivity protocols.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3">
          <div className="bg-card rounded-[32px] p-4 border border-border sticky top-24 shadow-sm">
            <nav className="space-y-1">
              {NAV_ITEMS.map(item => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl text-sm transition-all group ${
                      isActive
                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                        : 'text-foreground/70 hover:bg-secondary hover:text-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : item.color} group-hover:scale-110 transition-transform`} />
                        <span className="font-bold">{item.label}</span>
                    </div>
                    {isActive && <motion.div layoutId="activeDot" className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Dynamic Settings Content */}
        <div className="lg:col-span-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Account / Identity Section */}
              {activeSection === 'account' && (
                <div className="bg-card rounded-[40px] p-10 border border-border shadow-sm">
                   <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-foreground uppercase tracking-tight">Identity Node</h2>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Manage your global core data</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Legal Name</label>
                            <input
                                type="text"
                                value={accountForm.name}
                                onChange={e => setAccountForm(p => ({ ...p, name: e.target.value }))}
                                className="w-full h-14 px-5 rounded-[20px] bg-secondary border border-transparent focus:border-primary/30 transition-all outline-none font-bold text-foreground"
                            />
                        </div>
                        <div className="space-y-2">
                             <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Communication Channel</label>
                            <input
                                type="email"
                                value={accountForm.email}
                                onChange={e => setAccountForm(p => ({ ...p, email: e.target.value }))}
                                className="w-full h-14 px-5 rounded-[20px] bg-secondary border border-transparent focus:border-primary/30 transition-all outline-none font-bold text-foreground"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleAccountSave}
                            className="h-14 px-8 rounded-2xl bg-primary text-white font-bold hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95"
                        >
                            Sync Identity
                        </button>
                        {accountSaved && (
                            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-bold text-green-500 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5" /> Data Synchronized
                            </motion.span>
                        )}
                    </div>
                </div>
              )}

              {/* Triggers / Notifications Section */}
              {activeSection === 'notifications' && (
                  <div className="bg-card rounded-[40px] p-10 border border-border shadow-sm">
                      <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-secondary">
                            <Bell className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-foreground uppercase tracking-tight">Trigger Hub</h2>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Protocol Connectivity Feed</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {NOTIF_GROUPS[0].items.map(item => (
                            <div key={item.id} className="p-6 rounded-[28px] bg-secondary/50 border border-transparent hover:border-border transition-all flex items-center justify-between group">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                                        {item.icon && <item.icon className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-foreground">{item.label}</h4>
                                        <p className="text-xs font-medium text-muted-foreground leading-relaxed">{item.description}</p>
                                    </div>
                                </div>
                                <ToggleSwitch checked={notifToggles[item.id]} onChange={toggleNotif(item.id)} />
                            </div>
                        ))}
                        <div className="mt-8 pt-8 border-t border-border">
                            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-6">Privacy Stealth</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30">
                                    <span className="text-xs font-bold text-foreground">Public Profile Node</span>
                                    <ToggleSwitch checked={true} onChange={() => {}} />
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30">
                                    <span className="text-xs font-bold text-foreground">Activity Synchronization</span>
                                    <ToggleSwitch checked={false} onChange={() => {}} />
                                </div>
                            </div>
                        </div>
                    </div>
                  </div>
              )}

              {/* Appearance / Visuals Section */}
              {activeSection === 'appearance' && (
                  <div className="bg-card rounded-[40px] p-10 border border-border shadow-sm">
                      <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-600">
                            <Globe className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-foreground uppercase tracking-tight">Visual Engine</h2>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Customize your optic experience</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <button
                            onClick={() => theme === 'dark' && toggleTheme()}
                            className={`p-8 rounded-[32px] border-4 transition-all text-left group overflow-hidden relative ${
                                theme === 'light' ? 'border-primary bg-primary/5 shadow-2xl shadow-primary/10' : 'border-secondary bg-secondary/50'
                            }`}
                        >
                            <div className="w-12 h-12 rounded-2xl bg-white border border-border flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                                <Sun className="w-6 h-6 text-amber-500 fill-amber-500/10" />
                            </div>
                            <h4 className="text-lg font-black text-foreground leading-none mb-2">Solar Node</h4>
                            <p className="text-xs font-medium text-muted-foreground">High contrast daytime environment</p>
                            {theme === 'light' && <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary animate-ping"></div>}
                        </button>
 
                         <button
                            onClick={() => theme === 'light' && toggleTheme()}
                            className={`p-8 rounded-[32px] border-4 transition-all text-left group overflow-hidden relative ${
                                theme === 'dark' ? 'border-primary bg-primary/5 shadow-2xl shadow-primary/10' : 'border-secondary bg-secondary/50'
                            }`}
                        >
                            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                                <Moon className="w-6 h-6 text-indigo-400 fill-indigo-400/10" />
                            </div>
                            <h4 className="text-lg font-black text-foreground leading-none mb-2">Lunar Node</h4>
                            <p className="text-xs font-medium text-muted-foreground">OLED optimized nocturnal interface</p>
                            {theme === 'dark' && <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary animate-ping"></div>}
                        </button>
                    </div>

                    <div className="mt-12 pt-10 border-t border-border">
                        <h3 className="text-sm font-black text-foreground uppercase tracking-widest mb-6 flex items-center gap-3">
                            <Globe className="w-5 h-5 text-green-500" />
                            Language Translation
                        </h3>
                        <select 
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full max-w-xs h-14 px-5 rounded-[20px] bg-secondary border border-transparent focus:border-primary/30 transition-all outline-none font-bold text-foreground appearance-none"
                        >
                            <option>English</option>
                            <option>Hindi</option>
                            <option>Spanish</option>
                        </select>
                    </div>
                  </div>
              )}

              {/* Vault / Security Section */}
              {activeSection === 'security' && (
                  <div className="bg-card rounded-[40px] p-10 border border-border shadow-sm">
                      <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-600">
                            <Shield className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-foreground uppercase tracking-tight">Security Vault</h2>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Encryption & Access Control</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                         <div className="p-8 rounded-[32px] bg-secondary/30 border border-transparent space-y-6">
                            <h4 className="text-base font-black text-foreground leading-none mb-2">Password Synchronization</h4>
                            <div className="space-y-4">
                                {[
                                    { id: 'current', label: 'Current Password', placeholder: '••••••••' },
                                    { id: 'new', label: 'New Protocol', placeholder: '••••••••' },
                                    { id: 'confirm', label: 'Confirm Protocol', placeholder: '••••••••' }
                                ].map((field) => (
                                    <div key={field.id} className="relative group">
                                        <input 
                                            type={showPw[field.id as keyof typeof showPw] ? 'text' : 'password'}
                                            placeholder={field.placeholder}
                                            className="w-full h-14 px-5 pr-12 rounded-[20px] bg-card border border-border focus:border-primary/30 transition-all outline-none font-bold text-foreground"
                                        />
                                        <button 
                                            onClick={() => setShowPw(prev => ({ ...prev, [field.id]: !prev[field.id as keyof typeof showPw] }))}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            {showPw[field.id as keyof typeof showPw] ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <button className="h-12 px-8 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                                Verify & Deploy
                            </button>
                         </div>

                         <div className="p-8 rounded-[32px] border-2 border-dashed border-red-500/20 bg-red-500/5 flex items-center justify-between group">
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                                    <ShieldAlert className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-base font-black text-red-600 leading-none mb-2">Protocol Termination</h4>
                                    <p className="text-xs font-medium text-red-500/60">Permanently erase all academic node data</p>
                                </div>
                            </div>
                            <button className="h-10 px-6 rounded-xl bg-red-500 text-white text-[10px] font-black uppercase tracking-widest hover:shadow-lg hover:shadow-red-500/20 transition-all">Execute</button>
                         </div>
                    </div>
                  </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
