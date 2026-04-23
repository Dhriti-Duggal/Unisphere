import { useState, useRef, useEffect } from 'react';
import { Search, Send, Phone, Video, MoreVertical, Smile, Paperclip, Hash, Users as UsersIcon, Plus, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from '../contexts/UserContext';

export function Chat() {
  const { user } = useUser();
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showMemberPanel, setShowMemberPanel] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const chats = [
    { id: 1, name: 'CS101 Study Group', type: 'channel', lastMessage: 'Alice: Has anyone started the assignment?', time: '2m ago', unread: 3, online: 8, avatar: '#' },
    { id: 2, name: 'Alice Cooper', type: 'dm', lastMessage: 'Thanks for the help!', time: '15m ago', unread: 0, status: 'online', avatar: 'AC' },
    { id: 3, name: 'CS201 Discussion', type: 'channel', lastMessage: 'Bob: Check out this resource', time: '1h ago', unread: 1, online: 5, avatar: '#' },
    { id: 4, name: 'Project Team', type: 'group', lastMessage: 'Carol: Meeting at 3pm tomorrow', time: '2h ago', unread: 0, members: 4, avatar: 'PT' },
    { id: 5, name: 'Dr. Sarah Johnson', type: 'dm', lastMessage: 'Office hours today at 2pm', time: '1d ago', unread: 0, status: 'away', avatar: 'SJ' },
  ];

  const initialMessages = [
    { id: 1, sender: 'Alice Cooper', avatar: 'AC', content: 'Hey everyone! Has anyone started working on the assignment yet?', time: '10:30 AM', isOwn: false },
    { id: 2, sender: 'You', avatar: 'JD', content: 'Yes, I just started. The requirements look straightforward.', time: '10:32 AM', isOwn: true },
    { id: 3, sender: 'Bob Martin', avatar: 'BM', content: 'I found this helpful resource: https://example.com/guide', time: '10:35 AM', isOwn: false },
    { id: 4, sender: 'Alice Cooper', avatar: 'AC', content: 'Thanks Bob! That looks really useful.', time: '10:36 AM', isOwn: false },
    { id: 5, sender: 'You', avatar: 'JD', content: 'Should we schedule a study session this weekend?', time: '10:38 AM', isOwn: true },
  ];

  const [messages, setMessages] = useState<any[]>([]);
 
  const handleChatSelect = (id: number) => {
    setSelectedChat(id);
    setLoading(true);
    // Simulate dynamic protocol initialization
    setTimeout(() => {
      setMessages(initialMessages);
      setLoading(false);
    }, 800);
  };

  const members = [
    { id: 1, name: 'Alice Cooper', avatar: 'AC', status: 'online', role: 'Member' },
    { id: 2, name: 'Bob Martin', avatar: 'BM', status: 'online', role: 'Member' },
    { id: 3, name: 'Carol White', avatar: 'CW', status: 'away', role: 'Member' },
    { id: 4, name: 'David Lee', avatar: 'DL', status: 'online', role: 'Admin' },
    { id: 5, name: 'Emma Wilson', avatar: 'EW', status: 'offline', role: 'Member' },
  ];

  const currentChat = chats.find(c => c.id === selectedChat);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;
    const newMsg = {
      id: messages.length + 1,
      sender: 'You',
      avatar: 'JD',
      content: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true
    };
    setMessages([...messages, newMsg]);
    setMessage('');
  };

  return (
    <div className="flex gap-4 h-[calc(100vh-10rem)] md:h-[calc(100vh-8rem)]">
      {/* Chat List Sidebar */}
      <div className="w-80 bg-card rounded-3xl border border-border flex flex-col shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-2">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold text-foreground">Messages</h1>
                <button className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary transition-all hover:text-white">
                    <Plus className="w-4 h-4" />
                </button>
            </div>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                type="text"
                placeholder="Search direct or group chat..."
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-secondary/50 border border-transparent focus:border-primary/30 transition-all text-sm outline-none"
                />
            </div>
        </div>

        {/* Categories (Tabs conceptually) */}
        <div className="px-6 py-4 flex gap-2 overflow-x-auto no-scrollbar">
            {['All', 'Channels', 'Direct', 'Groups'].map((cat, i) => (
                <button 
                  key={cat} 
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${i === 0 ? 'bg-primary text-white' : 'bg-secondary text-muted-foreground hover:bg-primary/10'}`}
                >
                    {cat}
                </button>
            ))}
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto px-2">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => handleChatSelect(chat.id)}
              className={`w-full p-4 flex items-center gap-3 rounded-2xl transition-all mb-1 ${
                selectedChat === chat.id ? 'bg-primary/5 ring-1 ring-primary/20 shadow-sm' : 'hover:bg-secondary/50'
              }`}
            >
              <div className="relative flex-shrink-0">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-md ${
                  chat.type === 'channel' ? 'bg-indigo-500' : 'bg-gradient-to-br from-primary to-accent'
                }`}>
                  {chat.type === 'channel' ? <Hash className="w-6 h-6" /> : chat.avatar}
                </div>
                {chat.type === 'dm' && chat.status === 'online' && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-4 border-card shadow-sm"></div>
                )}
              </div>
              <div className="flex-1 text-left overflow-hidden">
                <div className="flex items-center justify-between mb-0.5">
                  <h3 className={`font-bold truncate ${selectedChat === chat.id ? 'text-primary' : 'text-foreground'}`}>{chat.name}</h3>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{chat.time}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate leading-relaxed">{chat.lastMessage}</p>
              </div>
              {chat.unread > 0 && (
                <div className="min-w-5 h-5 px-1.5 rounded-full bg-accent flex items-center justify-center text-white text-[10px] font-bold shadow-md">
                  {chat.unread}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 bg-card rounded-3xl border border-border flex flex-col shadow-sm overflow-hidden transition-all duration-500">
        {/* Chat Header */}
        <div className="h-20 px-8 border-b border-border flex items-center justify-between bg-card/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-md ${
              currentChat?.type === 'channel' ? 'bg-indigo-500' : 'bg-gradient-to-br from-primary to-accent'
            }`}>
              {currentChat?.type === 'channel' ? <Hash className="w-6 h-6" /> : currentChat?.avatar}
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground leading-none mb-1">{currentChat?.name}</h2>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${currentChat?.online || currentChat?.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`}></div>
                <p className="text-xs font-medium text-muted-foreground tracking-wide">
                    {currentChat?.type === 'channel' ? `${currentChat.online} members online` : 
                    currentChat?.type === 'dm' ? (currentChat.status === 'online' ? 'Active now' : 'Away') :
                    `${currentChat?.members} members`}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-xl hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary transition-all border border-transparent hover:border-border">
              <Phone className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-xl hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary transition-all border border-transparent hover:border-border">
              <Video className="w-5 h-5" />
            </button>
            <button 
                onClick={() => setShowMemberPanel(!showMemberPanel)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${showMemberPanel ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-secondary border-transparent hover:border-border'}`}
            >
              <UsersIcon className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-xl hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary transition-all border border-transparent hover:border-border">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Layout */}
        <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 flex flex-col min-w-0 relative">
                {/* Messages Area */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-thin">
                    {loading ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/80 backdrop-blur-sm z-20">
                            <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-4"></div>
                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Initializing Protocol</p>
                        </div>
                    ) : selectedChat ? (
                        messages.map((msg, i) => {
                            const isConsecutive = i > 0 && messages[i-1].sender === msg.sender;
                            return (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={msg.id}
                                    className={`flex gap-4 ${msg.isOwn ? 'flex-row-reverse' : ''} ${isConsecutive ? 'mt-[-1rem]' : ''}`}
                                >
                                    {!msg.isOwn && !isConsecutive && (
                                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white flex-shrink-0 shadow-sm">
                                            {msg.avatar}
                                        </div>
                                    )}
                                    {!msg.isOwn && isConsecutive && <div className="w-10 flex-shrink-0" />}
 
                                    <div className={`flex flex-col ${msg.isOwn ? 'items-end' : 'items-start'} max-w-[70%]`}>
                                        {!msg.isOwn && !isConsecutive && (
                                            <span className="text-xs font-bold text-muted-foreground mb-1 ml-1 tracking-wide">{msg.sender}</span>
                                        )}
                                        <div className={`relative group group-hover:scale-[1.02] transition-transform ${
                                            msg.isOwn
                                                ? 'bg-primary text-white rounded-2xl rounded-tr-none shadow-md shadow-primary/10'
                                                : 'bg-secondary/80 text-foreground rounded-2xl rounded-tl-none border border-border/50'
                                        } px-4 py-3`}>
                                            <p className="text-sm leading-relaxed font-medium">{msg.content}</p>
                                            <div className={`absolute bottom-[-1.2rem] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-[9px] font-bold text-muted-foreground tracking-tighter ${msg.isOwn ? 'right-0' : 'left-0'}`}>
                                                {msg.time}
                                            </div>
                                        </div>
                                        {!isConsecutive && <div className="h-2" />}
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                             <MessageCircle className="w-20 h-20 mb-6 text-muted-foreground/30" />
                             <h3 className="text-xl font-black text-foreground uppercase tracking-widest">Oracle Terminal</h3>
                             <p className="text-xs font-bold text-muted-foreground uppercase">Select a node to begin transmission</p>
                        </div>
                    )}
                </div>
 
                {/* Message Input */}
                <div className={`p-6 pt-2 transition-opacity ${!selectedChat ? 'opacity-20 pointer-events-none' : ''}`}>
                    <div className="bg-secondary/50 rounded-[28px] border border-border p-2 focus-within:ring-2 ring-primary/20 transition-all flex items-center gap-2 shadow-inner">
                        <button className="w-10 h-10 rounded-full hover:bg-card flex items-center justify-center text-muted-foreground hover:text-primary transition-all">
                            <Plus className="w-5 h-5" />
                        </button>
                        <button className="w-10 h-10 rounded-full hover:bg-card flex items-center justify-center text-muted-foreground hover:text-primary transition-all">
                            <Smile className="w-5 h-5" />
                        </button>
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type reaching message here..."
                            className="flex-1 h-12 bg-transparent text-sm font-medium outline-none px-2"
                        />
                        <button className="w-10 h-10 rounded-full hover:bg-card flex items-center justify-center text-muted-foreground hover:text-primary transition-all">
                            <Paperclip className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleSend}
                            disabled={!message.trim()}
                            className="w-11 h-11 rounded-full bg-primary text-white flex items-center justify-center hover:shadow-lg shadow-primary/30 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Members Panel */}
            <AnimatePresence>
                {showMemberPanel && (
                    <motion.div 
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 280, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="border-l border-border bg-card/30 flex flex-col"
                    >
                        <div className="p-6 border-b border-border flex items-center justify-between">
                            <h3 className="font-bold text-foreground tracking-tight flex items-center gap-2 text-sm uppercase">
                                <UsersIcon className="w-4 h-4 text-primary" />
                                Group Details
                            </h3>
                            <button onClick={() => setShowMemberPanel(false)} className="text-muted-foreground hover:text-foreground">
                                <Plus className="w-4 h-4 rotate-45" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-6">
                            {/* Static Info */}
                            <div className="space-y-4">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2">Group Description</p>
                                <div className="p-4 rounded-2xl bg-secondary/50 text-xs font-medium text-muted-foreground leading-relaxed">
                                    Official focus group for CS101. Discuss assignments, labs, and schedule study sessions here.
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between px-2">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Members</p>
                                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{members.length}</span>
                                </div>
                                {members.map((member) => (
                                    <div key={member.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary/50 transition-colors group cursor-pointer">
                                        <div className="relative">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary text-xs font-bold ring-1 ring-primary/10">
                                                {member.avatar}
                                            </div>
                                            {member.status === 'online' && (
                                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-card shadow-sm"></div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">{member.name}</p>
                                            <p className="text-[10px] font-bold text-muted-foreground tracking-tighter uppercase">{member.role}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Shared Resources */}
                            <div className="space-y-3">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2">Shared Files</p>
                                <div className="space-y-2">
                                    {['Ass_1_Guidelines.pdf', 'Lecture_Slides.zip'].map(file => (
                                        <div key={file} className="p-3 rounded-xl bg-secondary/30 flex items-center gap-3 border border-transparent hover:border-border cursor-pointer transition-all">
                                            <Paperclip className="w-3 h-3 text-primary" />
                                            <span className="text-[10px] font-bold text-foreground truncate">{file}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
