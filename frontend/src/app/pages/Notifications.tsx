import { 
    Bell, CheckCircle2, AlertCircle, Clock, BookOpen, 
    MessageSquare, Trash2, Search, Filter, MoreVertical 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

const NOTIF_DATA = [
  { 
    id: 1, 
    title: 'Assessment Synchronized', 
    desc: 'Dr. Sarah Smith just posted grades for CS101: Introduction to AI.', 
    time: '2m ago', 
    type: 'grade', 
    read: false,
    color: 'bg-green-500'
  },
  { 
    id: 2, 
    title: 'Deadline Imminent', 
    desc: 'Assignment "Neural Networks Lab" is due in exactly 4 hours.', 
    time: '15m ago', 
    type: 'deadline', 
    read: false,
    color: 'bg-red-500'
  },
  { 
    id: 3, 
    title: 'Comm Hub Mention', 
    desc: 'Michael Chen mentioned you in "Web Architecture" study group.', 
    time: '1h ago', 
    type: 'chat', 
    read: true,
    color: 'bg-blue-500'
  }
];

export function Notifications() {
  const [notifications, setNotifications] = useState(NOTIF_DATA);
  const [filter, setFilter] = useState('all');

  const deleteNotif = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="space-y-8 pb-20 max-w-5xl">
       {/* Header Control Center */}
       <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">Telemetry Feed</span>
            </div>
            <h1 className="text-4xl font-black text-foreground tracking-tight">Intelligence Hub</h1>
            <p className="text-sm font-medium text-muted-foreground mt-1">Real-time status updates from your academic registry.</p>
          </div>

          <div className="flex items-center gap-3">
              <button 
                onClick={markAllRead}
                className="h-12 px-6 rounded-2xl bg-secondary text-foreground text-xs font-black uppercase tracking-widest border border-border hover:bg-primary hover:text-white transition-all shadow-sm"
              >
                  Mark All Read
              </button>
              <button className="h-12 w-12 rounded-2xl bg-card border border-border flex items-center justify-center text-red-500 hover:bg-red-50 transition-all">
                  <Trash2 className="w-5 h-5" />
              </button>
          </div>
       </div>

       {/* Filter Bar */}
       <div className="flex items-center justify-between bg-card p-2 rounded-3xl border border-border shadow-sm overflow-x-auto">
            <div className="flex gap-1">
                {['all', 'unread', 'mentions', 'deadlines'].map(t => (
                    <button 
                        key={t} 
                        onClick={() => setFilter(t)}
                        className={`h-10 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === t ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
                    >
                        {t}
                    </button>
                ))}
            </div>
            <div className="hidden md:flex relative h-10 w-64 ml-4">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                <input 
                    type="text" 
                    placeholder="Search intelligence..." 
                    className="w-full h-full pl-10 pr-4 rounded-2xl bg-secondary border border-transparent focus:border-primary/20 text-xs outline-none"
                />
            </div>
       </div>

       {/* Notifications Feed */}
       <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {notifications.map((notif, i) => (
                <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                    className={`p-6 rounded-[32px] bg-card border transition-all flex items-start gap-6 group relative overflow-hidden ${notif.read ? 'border-border/50 opacity-80' : 'border-primary/20 shadow-xl shadow-primary/5'}`}
                >
                    <div className={`w-14 h-14 rounded-2xl ${notif.read ? 'bg-secondary' : 'bg-primary/10'} flex items-center justify-center relative flex-shrink-0`}>
                        {notif.type === 'grade' && <CheckCircle2 className={`w-6 h-6 ${notif.read ? 'text-muted-foreground' : 'text-green-500'}`} />}
                        {notif.type === 'deadline' && <Clock className={`w-6 h-6 ${notif.read ? 'text-muted-foreground' : 'text-red-500'}`} />}
                        {notif.type === 'chat' && <MessageSquare className={`w-6 h-6 ${notif.read ? 'text-muted-foreground' : 'text-blue-500'}`} />}
                        {!notif.read && <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-card ${notif.color}`}></div>}
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                            <h3 className={`text-base font-black tracking-tight ${notif.read ? 'text-foreground/70' : 'text-foreground'}`}>
                                {notif.title}
                            </h3>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">{notif.time}</span>
                        </div>
                        <p className={`text-sm leading-relaxed ${notif.read ? 'text-muted-foreground' : 'text-foreground/80 font-medium'}`}>
                            {notif.desc}
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={() => deleteNotif(notif.id)}
                            className="w-10 h-10 rounded-xl bg-secondary text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center shadow-sm"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="w-10 h-10 rounded-xl bg-secondary text-muted-foreground hover:text-primary transition-all flex items-center justify-center shadow-sm">
                            <MoreVertical className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Gradient Accent for unread */}
                    {!notif.read && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary"></div>}
                </motion.div>
            ))}
          </AnimatePresence>

          {notifications.length === 0 && (
             <div className="py-20 text-center bg-card rounded-[40px] border border-dashed border-border">
                <Bell className="w-16 h-16 text-muted-foreground/20 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-foreground">Registry Silent</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2">All notifications have been processed. Your environment is stable.</p>
             </div>
          )}
       </div>
    </div>
  );
}
