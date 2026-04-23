import { useState, useEffect } from 'react';
import { 
    Users, BookOpen, TrendingUp, Activity, UserCheck, 
    FileText, ShieldAlert, Cpu, Server, Database, 
    ShieldCheck, BarChart3, Settings, Search, Menu, MessageSquare, Plus,
    CheckCircle2, XCircle
} from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { useUser } from '../contexts/UserContext';
import { motion, AnimatePresence } from 'motion/react';
import { API } from '../../api/api';
import { toast } from 'sonner';

const SYSTEM_STATS = [
  { name: 'Mon', active: 400, load: 240 },
  { name: 'Tue', active: 450, load: 300 },
  { name: 'Wed', active: 600, load: 450 },
  { name: 'Thu', active: 550, load: 400 },
  { name: 'Fri', active: 700, load: 500 },
  { name: 'Sat', active: 850, load: 600 },
  { name: 'Sun', active: 900, load: 650 },
];

export function AdminDashboard() {
  const { user } = useUser();
  const firstName = user?.name?.split(' ')[0] || 'Admin';

  const [activeTab, setActiveTab] = useState<'users' | 'courses' | 'broadcast'>('users');
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(API.users, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAllUsers(data);
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API.userStatus(id), {
        method: 'PATCH',
        headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        toast.success(`User marked as ${status}`);
        fetchUsers(); // refresh list
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      toast.error("Error updating status");
    }
  };

  const handleBroadcast = () => {
    if (!broadcastMessage.trim()) return;
    toast.success("Global broadcast sent successfully!");
    setBroadcastMessage('');
  };

  // Stats derivation
  const studentsCount = allUsers.filter(u => u.role === 'student').length || 1520;
  const teachersCount = allUsers.filter(u => u.role === 'teacher').length || 52;
  const adminsCount = allUsers.filter(u => u.role === 'admin').length || 8;
  const totalUsersCount = allUsers.length > 0 ? allUsers.length : 1580;

  const USER_DISTRIBUTION = [
    { name: 'Students', value: studentsCount, color: '#1F5F5B' },
    { name: 'Teachers', value: teachersCount, color: '#2E7D73' },
    { name: 'Admins', value: adminsCount, color: '#4DB6AC' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Admin Command Center Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-primary/5 p-8 rounded-[40px] border border-primary/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
             <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none">Root Operations</span>
          </div>
          <h1 className="text-4xl font-black text-foreground tracking-tight">System Oracle, {firstName}</h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">
            Global state healthy. <span className="text-primary font-bold">{totalUsersCount} active nodes</span> reporting.
          </p>
        </div>

        <div className="flex items-center gap-3">
             <div className="hidden md:flex relative h-12 w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                    type="text" 
                    placeholder="Global CID Search..." 
                    className="w-full h-full pl-12 pr-4 rounded-2xl bg-card border border-border text-sm font-bold outline-none focus:border-primary transition-all shadow-sm"
                />
             </div>
             <button className="h-12 px-6 rounded-2xl bg-primary text-white font-bold flex items-center gap-2 hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95">
                <ShieldCheck className="w-5 h-5" />
                Security Hub
             </button>
             <button className="h-12 w-12 rounded-2xl bg-card border border-border flex items-center justify-center text-foreground hover:bg-secondary transition-all active:scale-95">
                <Settings className="w-5 h-5" />
             </button>
        </div>
      </div>

      {/* Hero Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[
              { label: 'Total Orbitals', value: totalUsersCount.toLocaleString(), desc: 'Registered Users', icon: Users, color: 'primary' },
              { label: 'Cloud Resources', value: '98.9%', desc: 'Uptime Stability', icon: Server, color: 'accent' },
              { label: 'Active Modules', value: '245', desc: 'Courses Moderated', icon: BookOpen, color: 'primary' },
              { label: 'Data Nodes', value: '4.2TB', desc: 'Syllabus Traffic', icon: Database, color: 'accent' }
          ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card p-6 rounded-[32px] border border-border group hover:border-primary/30 transition-all cursor-default"
              >
                  <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl bg-${stat.color === 'primary' ? 'primary' : 'accent'}/10 flex items-center justify-center text-${stat.color === 'primary' ? 'primary' : 'secondary'} group-hover:bg-${stat.color === 'primary' ? 'primary' : 'accent'} group-hover:text-white transition-all duration-500`}>
                          <stat.icon className="w-6 h-6" />
                      </div>
                      <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full tracking-tighter">+12% HP</span>
                      </div>
                  </div>
                  <h3 className="text-3xl font-black text-foreground group-hover:text-primary transition-colors">{stat.value}</h3>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">{stat.label}</p>
                  <div className="mt-4 pt-4 border-t border-dashed border-border">
                        <p className="text-[10px] font-bold text-muted-foreground">{stat.desc}</p>
                  </div>
              </motion.div>
          ))}
      </div>

      {/* Main Orchestration Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Traffic Orchestrator */}
          <div className="xl:col-span-2 bg-card rounded-[40px] p-8 border border-border shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-10">
                  <div>
                      <h3 className="text-xl font-black text-foreground uppercase tracking-tighter">Traffic Orchestrator</h3>
                      <p className="text-xs font-bold text-muted-foreground mt-1 uppercase tracking-widest">Platform Telemtry Feed</p>
                  </div>
                  <div className="flex gap-2">
                        {['Hour', 'Day', 'Week'].map(t => (
                            <button key={t} className={`h-8 px-4 rounded-full text-[10px] font-black uppercase tracking-widest ${t === 'Day' ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground'}`}>{t}</button>
                        ))}
                  </div>
              </div>
              <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={SYSTEM_STATS} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                          <defs>
                              <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#1F5F5B" stopOpacity={0.1}/>
                                  <stop offset="95%" stopColor="#1F5F5B" stopOpacity={0}/>
                              </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#64748b'}} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#64748b'}} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                          />
                          <Area type="monotone" dataKey="active" stroke="#1F5F5B" strokeWidth={3} fillOpacity={1} fill="url(#colorActive)" />
                          <Area type="monotone" dataKey="load" stroke="#A7D7C5" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
                      </AreaChart>
                  </ResponsiveContainer>
              </div>
          </div>

          {/* User Demographic Node */}
          <div className="bg-card rounded-[40px] p-8 border border-border shadow-sm flex flex-col">
              <h3 className="text-xl font-black text-foreground uppercase tracking-tighter mb-1">Entity Cluster</h3>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-10">User Demographics</p>
              
              <div className="flex-1 flex flex-col items-center justify-center relative">
                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={USER_DISTRIBUTION}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={95}
                                paddingAngle={10}
                                dataKey="value"
                            >
                                {USER_DISTRIBUTION.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="absolute flex flex-col items-center pointer-events-none">
                    <span className="text-2xl font-black text-foreground">{totalUsersCount.toLocaleString()}</span>
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Nodes</span>
                  </div>

                  <div className="w-full mt-10 space-y-3">
                      {USER_DISTRIBUTION.map((item, i) => (
                           <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-secondary/50 border border-transparent hover:border-primary/20 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-xs font-bold text-foreground">{item.name}</span>
                                </div>
                                <span className="text-xs font-black text-primary group-hover:scale-110 transition-transform">{item.value.toLocaleString()}</span>
                           </div>
                      ))}
                  </div>
              </div>
          </div>
      </div>

      {/* Administrative Control Section */}
      <div className="bg-card rounded-[40px] p-8 border border-border shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-border pb-6">
              <div>
                  <h3 className="text-xl font-black text-foreground uppercase tracking-tighter">Administrative Control</h3>
                  <p className="text-xs font-bold text-muted-foreground mt-1 uppercase tracking-widest">Platform Governance</p>
              </div>
              <div className="flex gap-2 p-1.5 bg-secondary/50 rounded-2xl">
                  {[
                    { id: 'users', label: 'User Registry' },
                    { id: 'courses', label: 'Course Mods' },
                    { id: 'broadcast', label: 'Global Broadcast' }
                  ].map(tab => (
                      <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:text-foreground'}`}
                      >
                          {tab.label}
                      </button>
                  ))}
              </div>
          </div>

          <AnimatePresence mode="wait">
              {activeTab === 'users' && (
                  <motion.div 
                    key="users"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                      <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1 mb-4 flex items-center gap-2">
                          <Users className="w-4 h-4 text-primary" /> User Verification & Management
                      </h4>
                      {isLoading ? (
                          <div className="py-10 text-center text-sm font-bold text-muted-foreground">Loading nodes...</div>
                      ) : allUsers.length > 0 ? (
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              {allUsers.map(u => (
                                  <div key={u._id} className="p-5 rounded-[28px] bg-secondary/30 border border-transparent hover:border-primary/20 transition-all flex items-center justify-between group shadow-sm">
                                      <div className="flex items-center gap-4">
                                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-sm uppercase shadow-inner ${u.role === 'teacher' ? 'bg-indigo-500' : u.role === 'admin' ? 'bg-teal-700' : 'bg-primary'}`}>
                                              {u.name?.[0] || '?'}
                                          </div>
                                          <div>
                                              <p className="text-sm font-bold text-foreground">{u.name}</p>
                                              <p className="text-[10px] text-muted-foreground uppercase font-black">{u.role} • {u.email}</p>
                                          </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                            {/* Dummy action toggles */}
                                            <button 
                                                onClick={() => updateUserStatus(u._id, 'active')}
                                                title="Mark Active"
                                                className="w-8 h-8 rounded-xl bg-green-500/10 text-green-600 hover:bg-green-600 hover:text-white flex items-center justify-center transition-all"
                                            >
                                                <CheckCircle2 className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => updateUserStatus(u._id, 'disabled')}
                                                title="Disable Node"
                                                className="w-8 h-8 rounded-xl bg-red-500/10 text-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center transition-all"
                                            >
                                                <XCircle className="w-4 h-4" />
                                            </button>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      ) : (
                          <div className="py-10 text-center text-sm font-bold text-muted-foreground">No users found. (Is backend connected?)</div>
                      )}
                  </motion.div>
              )}

              {activeTab === 'courses' && (
                  <motion.div 
                    key="courses"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                      <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1 mb-4 flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-primary" /> Module Submission Queue
                      </h4>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {[
                              { id: 1, title: 'Advanced Neural Nets', instructor: 'Dr. Mike', code: 'CS502', status: 'Review' },
                              { id: 2, title: 'Sociology 101', instructor: 'Prof. Jane', code: 'SOC10', status: 'Review' },
                          ].map(c => (
                              <div key={c.id} className="p-5 rounded-[28px] bg-secondary/30 border border-transparent hover:border-primary/20 transition-all flex items-center justify-between group shadow-sm">
                                  <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent font-black text-sm uppercase">
                                          {c.code[0]}
                                      </div>
                                      <div>
                                          <p className="text-sm font-bold text-foreground">{c.title}</p>
                                          <p className="text-[10px] text-muted-foreground uppercase font-black">{c.code} • {c.instructor}</p>
                                      </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                      <button className="h-8 px-4 rounded-xl bg-primary text-white text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-md">Approve</button>
                                      <button className="h-8 px-4 rounded-xl bg-secondary border border-border text-foreground text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Reject</button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </motion.div>
              )}

              {activeTab === 'broadcast' && (
                  <motion.div 
                    key="broadcast"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="max-w-2xl"
                  >
                      <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1 mb-4 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-primary" /> Global Platform Broadcast
                      </h4>
                      <div className="bg-secondary/30 border border-border rounded-[28px] p-6 shadow-sm">
                          <textarea 
                              value={broadcastMessage}
                              onChange={(e) => setBroadcastMessage(e.target.value)}
                              placeholder="Draft a priority alert for all active nodes..."
                              rows={4}
                              className="w-full bg-card border border-transparent focus:border-primary/40 rounded-2xl p-4 text-sm font-medium outline-none resize-none transition-all shadow-inner"
                          />
                          <div className="flex items-center justify-between mt-4">
                              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Supports markdown syntax</p>
                              <button 
                                  onClick={handleBroadcast}
                                  disabled={!broadcastMessage.trim()}
                                  className="h-10 px-6 rounded-xl bg-primary text-white text-xs font-black uppercase tracking-widest hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                              >
                                  <ShieldAlert className="w-4 h-4" /> Dispatch Alert
                              </button>
                          </div>
                      </div>
                  </motion.div>
              )}
          </AnimatePresence>
      </div>
    </div>
  );
}