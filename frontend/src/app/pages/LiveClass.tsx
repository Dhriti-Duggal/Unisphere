import { useState, useEffect } from 'react';
import { 
  Users, Mic, MicOff, Video, VideoOff, 
  MessageSquare, Settings, LogOut, Shield,
  Clock, Share, MoreHorizontal, Send, 
  Maximize2, Volume2, Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, useParams } from 'react-router';

export function LiveClass() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const participants = [
    { id: 1, name: 'Dr. Michael Chen', role: 'Teacher', avatar: 'MC', isSpeaking: true },
    { id: 2, name: 'Alice Cooper', role: 'Student', avatar: 'AC', isSpeaking: false },
    { id: 3, name: 'Bob Martin', role: 'Student', avatar: 'BM', isSpeaking: false },
    { id: 4, name: 'Charlie Davis', role: 'Student', avatar: 'CD', isSpeaking: false },
  ];

  return (
    <div className="fixed inset-0 bg-[#0A0D0C] z-[100] flex flex-col font-sans overflow-hidden">
      {/* Top Telemetry Bar */}
      <header className="h-16 px-6 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-xl">
          <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                      <Globe className="w-5 h-5 text-white" />
                  </div>
                  <div>
                      <h2 className="text-sm font-black text-white uppercase tracking-tighter">Live Session Cluster</h2>
                      <p className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none">Node ID: {id || 'LECTURE-882'}</p>
                  </div>
              </div>
              <div className="h-8 w-px bg-white/10 hidden md:block"></div>
              <div className="flex items-center gap-4 hidden md:flex">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                      <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Live Transmitting</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{formatTime(timer)} Elapsed</span>
                  </div>
              </div>
          </div>

          <div className="flex items-center gap-4">
              <div className="flex -space-x-2 mr-2">
                  {participants.slice(0, 3).map((p, i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0A0D0C] bg-secondary flex items-center justify-center text-[10px] font-bold text-foreground">
                          {p.avatar}
                      </div>
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-[#0A0D0C] bg-primary flex items-center justify-center text-[10px] font-black text-white">
                      +{participants.length - 3}
                  </div>
              </div>
              <button className="h-10 px-4 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all font-black text-[10px] uppercase tracking-widest">
                  Invite Node
              </button>
          </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
          {/* Main Visual Deck (Video Area) */}
          <div className="relative flex-1 bg-black overflow-hidden flex flex-col">
              <div className="absolute top-6 left-6 z-10 space-y-4">
                  {/* Speaker Overlay */}
                  <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-4 flex items-center gap-4 border-l-4 border-l-primary">
                      <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white">
                          <Mic className="w-6 h-6" />
                      </div>
                      <div>
                          <p className="text-[10px] font-black text-primary uppercase tracking-widest">Primary Instructor</p>
                          <h3 className="text-sm font-bold text-white">Dr. Michael Chen</h3>
                      </div>
                  </div>
              </div>

              {/* Central Video Mockup */}
              <div className="flex-1 flex items-center justify-center p-8">
                  <div className="w-full h-full max-w-5xl rounded-[40px] bg-gradient-to-br from-secondary/5 to-primary/5 border border-white/5 relative group overflow-hidden shadow-2xl flex flex-col items-center justify-center">
                       <div className="w-32 h-32 rounded-[40px] bg-primary/20 flex items-center justify-center text-primary mb-6 animate-float">
                           <Video className="w-12 h-12" />
                       </div>
                       <h1 className="text-3xl font-black text-white/40 tracking-tighter uppercase">Initializing Visual Stream</h1>
                       <p className="text-xs font-bold text-primary/40 uppercase tracking-[0.3em] mt-4">Waiting for synchronization...</p>
                       
                       {/* Control Bar (floating inside video) */}
                       <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 p-4 rounded-[32px] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl scale-125 transition-transform">
                            <button 
                              onClick={() => setIsMicOn(!isMicOn)}
                              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isMicOn ? 'bg-white/10 text-white hover:bg-white/20 shadow-xl' : 'bg-red-500 text-white shadow-2xl shadow-red-500/20'}`}
                            >
                                {isMicOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                            </button>
                            <button 
                              onClick={() => setIsCamOn(!isCamOn)}
                              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isCamOn ? 'bg-white/10 text-white hover:bg-white/20 shadow-xl' : 'bg-red-500 text-white shadow-2xl shadow-red-500/20'}`}
                            >
                                {isCamOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                            </button>
                            <div className="w-px h-10 bg-white/10 mx-2"></div>
                            <button className="w-14 h-14 rounded-2xl bg-white/10 text-white hover:bg-white/20 transition-all flex items-center justify-center shadow-xl">
                                <Share className="w-6 h-6" />
                            </button>
                            <button className="w-14 h-14 rounded-2xl bg-white/10 text-white hover:bg-white/20 transition-all flex items-center justify-center shadow-xl">
                                <Maximize2 className="w-6 h-6" />
                            </button>
                             <button className="w-14 h-14 rounded-2xl bg-white/10 text-white hover:bg-white/20 transition-all flex items-center justify-center shadow-xl">
                                <Settings className="w-6 h-6" />
                            </button>
                            <div className="w-px h-10 bg-white/10 mx-2"></div>
                            <button 
                              onClick={() => navigate(-1)}
                              className="h-14 px-8 rounded-2xl bg-red-500 text-white font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:bg-red-600 transition-all shadow-2xl shadow-red-500/20"
                            >
                                <LogOut className="w-5 h-5" />
                                Terminate
                            </button>
                       </div>
                  </div>
              </div>
          </div>

          {/* Right Intel Side (Chat & Participants) */}
          <AnimatePresence>
            {showChat && (
              <motion.aside 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-[400px] border-l border-white/5 bg-[#0D1110] flex flex-col shadow-2xl"
              >
                  {/* Tabs */}
                  <div className="flex p-4 gap-2">
                       <button className="flex-1 h-12 rounded-xl bg-white/5 text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border border-white/10">
                           <MessageSquare className="w-4 h-4 text-primary" />
                           Intel Feed
                       </button>
                       <button className="flex-1 h-12 rounded-xl text-white/40 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/5 transition-all">
                           <Users className="w-4 h-4" />
                           Nodes ({participants.length})
                       </button>
                  </div>

                  {/* Chat Content */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                       {[
                         { user: 'Dr. Michael Chen', text: 'Welcome everyone to the advanced React architecture module.', time: '10:02' },
                         { user: 'Alice Cooper', text: 'Will we be covering the latest server actions?', time: '10:05' },
                         { user: 'Dr. Michael Chen', text: 'Absolutely, that is part of the core deployment protocol.', time: '10:06' },
                       ].map((msg, i) => (
                           <div key={i} className="space-y-2">
                               <div className="flex items-center justify-between">
                                   <span className="text-[10px] font-black text-primary uppercase tracking-widest">{msg.user}</span>
                                   <span className="text-[9px] font-bold text-white/20">{msg.time}</span>
                               </div>
                               <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-sm text-white/80 font-medium">
                                   {msg.text}
                               </div>
                           </div>
                       ))}
                  </div>

                  {/* Input */}
                  <div className="p-6 border-t border-white/5 bg-black/20">
                       <div className="relative">
                            <input 
                              type="text" 
                              placeholder="Synchronize thought..."
                              className="w-full h-14 pl-6 pr-16 rounded-[20px] bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/40 transition-all font-medium"
                            />
                            <button className="absolute right-2 top-2 w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                                <Send className="w-5 h-5" />
                            </button>
                       </div>
                  </div>
              </motion.aside>
            )}
          </AnimatePresence>
      </main>

      {/* Floating Toggle for Chat */}
      {!showChat && (
          <button 
            onClick={() => setShowChat(true)}
            className="fixed right-6 bottom-6 w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-2xl shadow-primary/20 hover:scale-110 transition-transform z-50"
          >
              <MessageSquare className="w-6 h-6" />
          </button>
      )}
    </div>
  );
}
