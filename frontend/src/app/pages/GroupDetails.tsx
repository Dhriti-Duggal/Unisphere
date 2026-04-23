import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { 
  Users, Calendar, MessageCircle, FileText, 
  ExternalLink, Clock, FolderOpen, UserPlus,
  ChevronLeft, MoreVertical, Shield, BookOpen
} from 'lucide-react';
import { motion } from 'motion/react';

export function GroupDetails() {
  const { id } = useParams();
  
  // Mock data for the specific group
  const group = {
    id: id,
    name: 'CS101 Study Group A',
    course: 'CS101',
    courseName: 'Introduction to Computer Science',
    description: 'A collaborative study cluster focused on mastering fundamental programming concepts, algorithm analysis, and preparing for upcoming technical assessments.',
    members: [
      { id: 1, name: 'Alice Cooper', role: 'Leader', status: 'online' },
      { id: 2, name: 'Bob Martin', role: 'Member', status: 'offline' },
      { id: 3, name: 'Charlie Davis', role: 'Member', status: 'online' },
      { id: 4, name: 'Diana Prince', role: 'Member', status: 'online' },
      { id: 5, name: 'Ethan Hunt', role: 'Member', status: 'offline' },
    ],
    schedule: [
      { day: 'Monday', time: '2:00 PM', topic: 'Algorithm Basics' },
      { day: 'Wednesday', time: '4:00 PM', topic: 'Data Structures' },
    ],
    files: [
      { name: 'Lecture_Notes_W3.pdf', size: '2.4 MB', type: 'PDF' },
      { name: 'Practice_Problems.docx', size: '1.1 MB', type: 'DOCX' },
    ],
    color: 'from-primary to-accent'
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Cinematic Header */}
      <div className="relative h-64 rounded-[40px] overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${group.color} opacity-90`}></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
          
          <div className="absolute inset-0 p-10 flex flex-col justify-end">
              <Link to="/student/groups" className="absolute top-8 left-8 flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-widest text-[10px]">Back to Grid</span>
              </Link>
              
              <div className="flex items-end justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest border border-white/30">
                            {group.course} Registry
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest">Active Node</span>
                    </div>
                    <h1 className="text-5xl font-black text-white tracking-tighter leading-none">{group.name}</h1>
                    <p className="text-white/80 mt-4 max-w-2xl font-medium italic">
                        "{group.courseName}"
                    </p>
                  </div>
                  
                  <div className="flex gap-3">
                      <Link 
                        to={`/chat/group/${group.id}`}
                        className="h-14 px-8 rounded-2xl bg-white text-primary font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:shadow-2xl transition-all"
                      >
                         <MessageCircle className="w-5 h-5" />
                         Access Comm Hub
                      </Link>
                      <button className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center border border-white/30 hover:bg-white/30 transition-all">
                          <MoreVertical className="w-6 h-6" />
                      </button>
                  </div>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Side */}
          <div className="lg:col-span-8 space-y-8">
              {/* Mission Protocol */}
              <div className="bg-card rounded-[32px] p-8 border border-border shadow-sm">
                  <h3 className="text-lg font-black text-foreground uppercase tracking-tight mb-6 flex items-center gap-3">
                      <Shield className="w-5 h-5 text-primary" />
                      Cluster Mission
                  </h3>
                  <p className="text-muted-foreground leading-relaxed font-medium">
                      {group.description}
                  </p>
              </div>

              {/* Shared Knowledge Base (Files) */}
              <div className="bg-card rounded-[32px] p-8 border border-border shadow-sm">
                   <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-black text-foreground uppercase tracking-tight flex items-center gap-3">
                            <FolderOpen className="w-5 h-5 text-primary" />
                            Knowledge Base
                        </h3>
                        <button className="text-[10px] font-black uppercase text-primary border-b-2 border-primary/20 hover:border-primary transition-all pb-0.5">Upload Asset</button>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {group.files.map((file, i) => (
                            <div key={i} className="p-5 rounded-2xl bg-secondary/50 border border-transparent hover:border-border transition-all flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-foreground truncate w-40">{file.name}</p>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase">{file.type} • {file.size}</p>
                                    </div>
                                </div>
                                <button className="w-10 h-10 rounded-xl hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all flex items-center justify-center">
                                    <ExternalLink className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                   </div>
              </div>
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-4 space-y-8">
               {/* Member Directory */}
               <div className="bg-card rounded-[32px] p-8 border border-border shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Collective</h3>
                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">{group.members.length} Active</span>
                    </div>
                    
                    <div className="space-y-4">
                        {group.members.map(member => (
                            <div key={member.id} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-xs font-bold text-foreground">
                                            {member.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-card ${member.status === 'online' ? 'bg-green-500' : 'bg-muted-foreground'}`}></div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-foreground leading-none">{member.name}</p>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter mt-1">{member.role}</p>
                                    </div>
                                </div>
                                <button className="w-8 h-8 rounded-lg bg-secondary/0 group-hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary transition-all">
                                    <UserPlus className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                    
                    <button className="w-full mt-8 h-12 rounded-xl border border-dashed border-border text-[10px] font-black uppercase text-muted-foreground hover:border-primary hover:text-primary transition-all">
                        Invite Contributor
                    </button>
               </div>

               {/* Sync Schedule */}
               <div className="bg-card rounded-[32px] p-8 border border-border shadow-sm">
                    <h3 className="text-sm font-black text-foreground uppercase tracking-widest mb-8">Registry Sync</h3>
                    <div className="space-y-6">
                        {group.schedule.map((sync, i) => (
                            <div key={i} className="relative pl-6 border-l-2 border-primary/20">
                                <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-primary"></div>
                                <p className="text-[10px] font-black text-primary uppercase tracking-widest">{sync.day} @ {sync.time}</p>
                                <p className="text-sm font-bold text-foreground mt-1">{sync.topic}</p>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-8 p-4 rounded-2xl bg-primary/5 border border-primary/20">
                        <div className="flex items-center gap-3 mb-2">
                            <Clock className="w-4 h-4 text-primary" />
                            <span className="text-[10px] font-black text-primary uppercase">Countdown</span>
                        </div>
                        <p className="text-xs font-bold text-foreground">T-Minus 4 Hours until next synchronization.</p>
                    </div>
               </div>
          </div>
      </div>
    </div>
  );
}
