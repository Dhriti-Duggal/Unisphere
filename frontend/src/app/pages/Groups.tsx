import { useState } from 'react';
import { Users, Plus, UserPlus, MessageCircle, Calendar, ChevronRight, Search } from 'lucide-react';
import { Link } from 'react-router';
import { CreateGroupModal } from '../components/groups/CreateGroupModal';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

const INITIAL_GROUPS = [
  { 
    id: 1, 
    name: 'CS101 Study Group A', 
    course: 'CS101', 
    members: 5, 
    description: 'Weekly study sessions for CS101 assignments and lab preparation.',
    color: 'from-primary to-accent',
    nextMeeting: '2026-03-04 at 2:00 PM'
  },
  { 
    id: 2, 
    name: 'Web Dev Project Team', 
    course: 'CS301', 
    members: 4, 
    description: 'Collaborative project for building a modern web application using React.',
    color: 'from-purple-500 to-pink-500',
    nextMeeting: '2026-03-05 at 4:00 PM'
  },
  { 
    id: 3, 
    name: 'Data Structures Discussion', 
    course: 'CS201', 
    members: 6, 
    description: 'Deep dive into complex algorithms and data structure problem solving.',
    color: 'from-green-500 to-emerald-500',
    nextMeeting: '2026-03-06 at 3:00 PM'
  },
];

export function Groups() {
  const [groups, setGroups] = useState(INITIAL_GROUPS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGroups = groups.filter(g => 
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    g.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addGroup = (newGroup: any) => {
    setGroups(prev => [newGroup, ...prev]);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">Collaboration Nodes</span>
            </div>
            <h1 className="text-4xl font-black text-foreground tracking-tight">Active Groups</h1>
            <p className="text-sm font-medium text-muted-foreground mt-1">Join or initialize research and study clusters.</p>
        </div>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="h-12 px-8 rounded-2xl bg-primary text-white font-bold flex items-center gap-2 hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Create Group
        </button>
      </div>

      {/* Stats Table */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
            { label: 'Network Size', value: groups.length, icon: Users, color: 'text-primary' },
            { label: 'Active Learners', value: groups.reduce((acc, g) => acc + g.members, 0), icon: UserPlus, color: 'text-secondary' },
            { label: 'Upcoming Syncs', value: 3, icon: Calendar, color: 'text-green-500' }
        ].map((stat, i) => (
             <div key={i} className="bg-card rounded-3xl p-6 border border-border shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</span>
                    <div className={`w-10 h-10 rounded-xl bg-secondary flex items-center justify-center ${stat.color}`}>
                        <stat.icon className="w-5 h-5" />
                    </div>
                </div>
                <h3 className="text-3xl font-black text-foreground">{stat.value}</h3>
            </div>
        ))}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex items-center gap-4 bg-card p-2 rounded-[24px] border border-border shadow-sm">
          <div className="flex-1 relative h-12">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search by group name or course code..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-full pl-12 pr-4 bg-secondary/50 rounded-2xl border border-transparent focus:border-primary/20 text-sm outline-none font-medium"
              />
          </div>
          <div className="hidden md:flex gap-1 pr-2">
              {['All', 'Study', 'Project', 'Research'].map(type => (
                  <button key={type} className="h-10 px-6 rounded-xl text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:bg-secondary hover:text-foreground transition-all">
                      {type}
                  </button>
              ))}
          </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AnimatePresence mode="popLayout">
            {filteredGroups.map((group) => (
                <motion.div
                    layout
                    key={group.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-card rounded-[32px] border border-border overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all group"
                >
                <div className={`h-28 bg-gradient-to-br ${group.color} p-8 flex items-center justify-between relative`}>
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    <div>
                    <span className="text-white/80 text-[10px] font-black uppercase tracking-[0.2em]">{group.course}</span>
                    <h3 className="text-white font-black text-2xl truncate w-64 tracking-tighter">{group.name}</h3>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-xl group-hover:rotate-12 transition-transform">
                    <Users className="w-7 h-7 text-white" />
                    </div>
                </div>
                <div className="p-8">
                    <p className="text-muted-foreground text-sm font-medium leading-relaxed mb-8 h-10 line-clamp-2 italic">
                        "{group.description}"
                    </p>
                    
                    <div className="flex items-center justify-between mb-8 border-y border-dashed border-border py-4">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Growth</p>
                        <span className="flex items-center gap-2 text-foreground font-black text-sm">
                            <Users className="w-4 h-4 text-primary" />
                            {group.members} Members
                        </span>
                    </div>
                    <div className="text-right space-y-1">
                         <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Registry</p>
                         <span className="text-foreground font-black text-sm uppercase tracking-tighter">{group.course}</span>
                    </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-secondary/50 border border-transparent group-hover:border-primary/20 transition-all mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-card border border-border flex items-center justify-center text-primary">
                            <Calendar className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Next Synchronization</p>
                            <p className="text-sm font-bold text-foreground">{group.nextMeeting}</p>
                        </div>
                    </div>
                    </div>

                    <div className="flex gap-4">
                        <Link
                            to={`/chat/group/${group.id}`}
                            className="flex-1 h-12 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-95"
                        >
                            <MessageCircle className="w-5 h-5" />
                            Initialize Chat
                        </Link>
                        <Link
                            to={`/groups/${group.id}`}
                            className="flex-1 h-12 rounded-2xl bg-card border border-border text-foreground font-black uppercase tracking-widest text-[10px] flex items-center justify-center hover:bg-secondary transition-all active:scale-95"
                        >
                            Node Details
                        </Link>
                    </div>
                </div>
                </motion.div>
            ))}
        </AnimatePresence>
      </div>

      {groups.length === 0 && (
          <div className="py-20 text-center bg-secondary/30 rounded-[40px] border border-dashed border-border">
              <Users className="w-20 h-20 text-muted-foreground/20 mx-auto mb-6" />
              <h2 className="text-2xl font-black text-foreground">Zero Active Clusters</h2>
              <p className="text-sm text-muted-foreground mt-2 mb-8">No research or study groups found in your immediate network.</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="h-14 px-10 rounded-2xl bg-primary text-white font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all"
              >
                  Deploy First Group
              </button>
          </div>
      )}

      {/* Suggested Section */}
      <div className="pt-12 border-t border-dashed border-border/50">
        <h2 className="text-2xl font-black text-foreground mb-1 tracking-tight uppercase">Suggested Clusters</h2>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-8">Based on your enrollment profile</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
              { id: 5, name: 'Machine Learning Study Circle', course: 'CS401', members: 8, color: 'from-indigo-500 to-purple-500' },
              { id: 6, name: 'Mobile Dev Workshop', course: 'CS302', members: 7, color: 'from-teal-500 to-green-500' },
          ].map((group) => (
            <div
              key={group.id}
              className="bg-card rounded-[32px] border border-border p-8 hover:shadow-xl transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-6">
                <div className={`w-16 h-16 rounded-[24px] bg-gradient-to-br ${group.color} flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform`}>
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-foreground text-lg leading-tight">{group.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest">{group.course}</span>
                      <div className="w-1 h-1 rounded-full bg-border"></div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{group.members} Active</span>
                  </div>
                </div>
              </div>
              <button className="h-12 px-6 rounded-2xl bg-secondary text-primary font-black uppercase tracking-widest text-[10px] hover:bg-primary hover:text-white transition-all shadow-sm">
                Request Entry
              </button>
            </div>
          ))}
        </div>
      </div>

      <CreateGroupModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={addGroup}
      />
    </div>
  );
}

