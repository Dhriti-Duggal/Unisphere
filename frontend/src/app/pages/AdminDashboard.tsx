import { 
    Users, BookOpen, TrendingUp, Activity, UserCheck, 
    FileText, ShieldAlert, Cpu, Server, Database, 
    ShieldCheck, BarChart3, Settings, Search, Menu
} from 'lucide-react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { useUser } from '../contexts/UserContext';
import { motion } from 'motion/react';

const SYSTEM_STATS = [
  { name: 'Mon', active: 400, load: 240 },
  { name: 'Tue', active: 450, load: 300 },
  { name: 'Wed', active: 600, load: 450 },
  { name: 'Thu', active: 550, load: 400 },
  { name: 'Fri', active: 700, load: 500 },
  { name: 'Sat', active: 850, load: 600 },
  { name: 'Sun', active: 900, load: 650 },
];

const USER_DISTRIBUTION = [
  { name: 'Students', value: 1520, color: '#1F5F5B' },
  { name: 'Teachers', value: 52, color: '#2E7D73' },
  { name: 'Admins', value: 8, color: '#4DB6AC' },
];

export function AdminDashboard() {
  const { user } = useUser();
  const firstName = user?.name?.split(' ')[0] || 'Admin';

  const recentSecurityLogs = [
    { id: 1, event: 'Multiple login failures', user: 'Unknown IP', time: '2m ago', severity: 'high' },
    { id: 2, event: 'New Teacher Verified', user: 'Dr. Sarah Smith', time: '15m ago', severity: 'low' },
    { id: 3, event: 'Platform Update Deployed', user: 'System', time: '1h ago', severity: 'medium' },
    { id: 4, event: 'DB Scaling Triggered', user: 'AWS Node', time: '2h ago', severity: 'low' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Admin Command Center Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <div className="w-2 h-2 rounded-full bg-primary"></div>
             <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-none">Root Operations</span>
          </div>
          <h1 className="text-4xl font-black text-foreground tracking-tight">System Oracle</h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">
            Global state healthy. <span className="text-primary font-bold">1,580 active nodes</span> reporting.
          </p>
        </div>

        <div className="flex items-center gap-3">
             <div className="hidden md:flex relative h-12 w-64">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                    type="text" 
                    placeholder="Global CID Search..." 
                    className="w-full h-full pl-12 pr-4 rounded-2xl bg-card border border-border text-sm outline-none focus:border-primary transition-all shadow-sm"
                />
             </div>
             <button className="h-12 px-6 rounded-2xl bg-primary text-white font-bold flex items-center gap-2 hover:shadow-xl hover:shadow-primary/20 transition-all">
                <ShieldCheck className="w-5 h-5" />
                Security Hub
             </button>
             <button className="h-12 w-12 rounded-2xl bg-card border border-border flex items-center justify-center text-foreground hover:bg-secondary">
                <Settings className="w-5 h-5" />
             </button>
        </div>
      </div>

      {/* Hero Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[
              { label: 'Total Orbitals', value: '1,580', desc: 'Total Users', icon: Users, color: 'primary' },
              { label: 'Cloud Resources', value: '98%', desc: 'Uptime Stability', icon: Server, color: 'accent' },
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
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-black text-foreground">1,580</span>
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Nodes</span>
                  </div>

                  <div className="w-full mt-10 space-y-3">
                      {USER_DISTRIBUTION.map((item, i) => (
                           <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-secondary/50 border border-transparent hover:border-primary/20 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-xs font-bold text-foreground">{item.name}</span>
                                </div>
                                <span className="text-xs font-black text-primary group-hover:scale-110 transition-transform">{item.value}</span>
                           </div>
                      ))}
                  </div>
              </div>
          </div>
      </div>

      {/* Administrative Control Section */}
      <div className="bg-card rounded-[40px] p-8 border border-border shadow-sm">
          <div className="flex items-center justify-between mb-8">
              <div>
                  <h3 className="text-xl font-black text-foreground uppercase tracking-tighter">Administrative Control</h3>
                  <p className="text-xs font-bold text-muted-foreground mt-1 uppercase tracking-widest">Platform Governance</p>
              </div>
              <div className="flex gap-4 p-1.5 bg-secondary/50 rounded-2xl">
                  {['users', 'courses'].map(tab => (
                      <button 
                        key={tab} 
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tab === 'users' ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
                      >
                          {tab === 'users' ? 'User Registry' : 'Course Moderation'}
                      </button>
                  ))}
              </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* User Management List */}
              <div className="space-y-4">
                  <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1 mb-2">Pending Verifications / Active Nodes</h4>
                  {[
                      { id: 1, name: 'John Proctor', role: 'Teacher', status: 'Pending', email: 'proctor@uni.edu' },
                      { id: 2, name: 'Sarah Miller', role: 'Student', status: 'Active', email: 'sarah@uni.edu' },
                      { id: 3, name: 'Kevin Hart', role: 'Teacher', status: 'Disabled', email: 'kevin@uni.edu' },
                  ].map(u => (
                      <div key={u.id} className="p-5 rounded-[28px] bg-secondary/30 border border-transparent hover:border-border transition-all flex items-center justify-between group">
                          <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-xs uppercase">
                                  {u.name[0]}
                              </div>
                              <div>
                                  <p className="text-sm font-bold text-foreground">{u.name}</p>
                                  <p className="text-[10px] text-muted-foreground uppercase font-black">{u.role} • {u.email}</p>
                              </div>
                          </div>
                          <div className="flex items-center gap-2">
                              {u.status === 'Pending' ? (
                                  <button className="h-8 px-4 rounded-lg bg-primary text-white text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all">Verify</button>
                              ) : (
                                  <button className={`h-8 px-4 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${u.status === 'Active' ? 'bg-red-500/10 text-red-600 hover:bg-red-600 hover:text-white' : 'bg-green-500/10 text-green-600 hover:bg-green-600 hover:text-white'}`}>
                                      {u.status === 'Active' ? 'Disable' : 'Enable'}
                                  </button>
                              )}
                          </div>
                      </div>
                  ))}
              </div>

              {/* Course Moderation List */}
              <div className="space-y-4">
                  <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest ml-1 mb-2">Module Submission Queue</h4>
                  {[
                      { id: 1, title: 'Advanced Neural Nets', instructor: 'Dr. Mike', code: 'CS502', status: 'Review' },
                      { id: 2, title: 'Sociology 101', instructor: 'Prof. Jane', code: 'SOC10', status: 'Review' },
                  ].map(c => (
                      <div key={c.id} className="p-5 rounded-[28px] bg-secondary/30 border border-transparent hover:border-border transition-all flex items-center justify-between group">
                          <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent font-black text-xs uppercase">
                                  {c.code[0]}
                              </div>
                              <div>
                                  <p className="text-sm font-bold text-foreground">{c.title}</p>
                                  <p className="text-[10px] text-muted-foreground uppercase font-black">{c.code} • {c.instructor}</p>
                              </div>
                          </div>
                          <div className="flex items-center gap-2">
                              <button className="h-8 px-4 rounded-lg bg-primary text-white text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all">Approve</button>
                              <button className="h-8 px-4 rounded-lg bg-secondary text-foreground text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Reject</button>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>
    </div>
  );
}