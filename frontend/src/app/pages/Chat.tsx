import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, Send, Hash, Users as UsersIcon, MessageCircle, Plus } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { useUser } from '../contexts/UserContext';
import { API, BASE_URL } from '../../api/api';

type ChatThread = {
  id: string;
  type: 'direct' | 'group';
  title: string;
  course?: { id: string; title: string; code: string };
  participants: Array<{ user: { id: string; name: string; email: string; role: string; group?: string } }>;
  messages?: Array<{ content: string; createdAt: string; sender?: { name: string } }>;
  updatedAt: string;
};

type ChatMessage = {
  id: string;
  threadId: string;
  content: string;
  createdAt: string;
  sender: { id: string; name: string; email: string; role: string };
};

export function Chat() {
  const { user } = useUser();
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  const token = localStorage.getItem('token') || '';

  const threadName = (thread: ChatThread) => {
    if (thread.type === 'group') {
      return thread.course ? `${thread.course.code} Group` : thread.title || 'Course Group';
    }
    const other = thread.participants.find((p) => p.user.id !== user.id)?.user;
    return other?.name || 'Direct Chat';
  };

  const filteredThreads = useMemo(() => {
    if (!search.trim()) return threads;
    return threads.filter((t) => threadName(t).toLowerCase().includes(search.toLowerCase()));
  }, [threads, search]);

  const selectedThread = threads.find((t) => t.id === selectedThreadId);

  const fetchThreads = async (autoSelect = true) => {
    try {
      const res = await fetch(API.chatThreads, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setThreads(data);
      if (autoSelect && data.length && !selectedThreadId) {
        setSelectedThreadId(data[0].id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMessages = async (threadId: string) => {
    if (!threadId) return;
    try {
      setIsLoadingMessages(true);
      const res = await fetch(API.chatThreadMessages(threadId), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchThreads(true);
    const fetchCourses = async () => {
      const endpoint = user.role === 'teacher' ? API.teacherCourses : API.studentCourses;
      try {
        const res = await fetch(endpoint, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) setCourses(await res.json());
      } catch (error) {
        console.error(error);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    if (!token) return;
    const socket = io(BASE_URL.replace('/api', ''), {
      auth: { token },
      transports: ['websocket'],
    });
    socketRef.current = socket;

    socket.on('chat:message', (incoming: ChatMessage) => {
      if (incoming.threadId === selectedThreadId) {
        setMessages((prev) => [...prev, incoming]);
      }
      setThreads((prev) =>
        prev
          .map((thread) =>
            thread.id === incoming.threadId
              ? { ...thread, updatedAt: incoming.createdAt, messages: [{ content: incoming.content, createdAt: incoming.createdAt, sender: { name: incoming.sender.name } }] }
              : thread
          )
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      );
    });

    socket.on('connect_error', () => {
      toast.error('Chat socket connection failed');
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedThreadId, token]);

  useEffect(() => {
    if (selectedThreadId) fetchMessages(selectedThreadId);
  }, [selectedThreadId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim() || !selectedThreadId || !socketRef.current) return;
    socketRef.current.emit(
      'chat:send',
      { threadId: selectedThreadId, content: message.trim() },
      (ack: { ok: boolean; message?: string }) => {
        if (!ack?.ok) toast.error(ack?.message || 'Failed to send message');
      }
    );
    setMessage('');
  };

  const createGroupThread = async (courseId: string) => {
    try {
      const res = await fetch(API.createOrGetGroupThread, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ courseId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.message || 'Failed to open course group chat');
        return;
      }
      await fetchThreads(false);
      setSelectedThreadId(data.id);
    } catch (error) {
      console.error(error);
      toast.error('Failed to open group chat');
    }
  };

  const createDirectThread = async (teacherId?: string, studentId?: string) => {
    try {
      const payload = user.role === 'teacher' ? { studentId } : { teacherId };
      const res = await fetch(API.createOrGetDirectThread, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.message || 'Failed to open direct chat');
        return;
      }
      await fetchThreads(false);
      setSelectedThreadId(data.id);
    } catch (error) {
      console.error(error);
      toast.error('Failed to open direct chat');
    }
  };

  const teacherTargets =
    user.role === 'teacher'
      ? courses.flatMap((course: any) =>
          (course.students || []).map((studentRel: any) => {
            const student = studentRel.user || studentRel;
            return { id: student.id, name: student.name, email: student.email, courseCode: course.code };
          })
        )
      : [];
  const uniqueTeacherTargets = Array.from(new Map(teacherTargets.map((s) => [s.id, s])).values());

  const studentTeacherTargets =
    user.role === 'student'
      ? Array.from(
          new Map(
            courses
              .filter((course: any) => course.teacher?.id)
              .map((course: any) => [course.teacher.id, { ...course.teacher, courseCode: course.code }])
          ).values()
        )
      : [];

  return (
    <div className="flex gap-4 h-[calc(100vh-10rem)] md:h-[calc(100vh-8rem)] p-4 md:p-6">
      <div className="w-96 bg-card rounded-3xl border border-border flex flex-col shadow-sm overflow-hidden">
        <div className="p-5 border-b border-border">
          <h1 className="text-xl font-black text-foreground">Chats</h1>
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search chats..."
              className="w-full h-10 pl-9 pr-3 rounded-xl bg-secondary/40 border border-border outline-none focus:border-primary text-sm"
            />
          </div>
        </div>

        <div className="p-4 space-y-3 border-b border-border">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Start Conversation</p>
          {user.role === 'teacher' ? (
            <>
              <select
                className="w-full h-10 rounded-xl bg-secondary/40 border border-border px-3 text-xs font-bold outline-none focus:border-primary"
                onChange={(e) => e.target.value && createGroupThread(e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>Create/Open Course Group Chat</option>
                {courses.map((course: any) => (
                  <option key={course.id} value={course.id}>{course.code} - {course.title}</option>
                ))}
              </select>
              <select
                className="w-full h-10 rounded-xl bg-secondary/40 border border-border px-3 text-xs font-bold outline-none focus:border-primary"
                onChange={(e) => e.target.value && createDirectThread(undefined, e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>Direct message a student</option>
                {uniqueTeacherTargets.map((student: any) => (
                  <option key={student.id} value={student.id}>{student.name} ({student.courseCode})</option>
                ))}
              </select>
            </>
          ) : (
            <select
              className="w-full h-10 rounded-xl bg-secondary/40 border border-border px-3 text-xs font-bold outline-none focus:border-primary"
              onChange={(e) => e.target.value && createDirectThread(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>Message your teacher</option>
              {studentTeacherTargets.map((teacher: any) => (
                <option key={teacher.id} value={teacher.id}>{teacher.name} ({teacher.courseCode})</option>
              ))}
            </select>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {filteredThreads.map((thread) => (
            <button
              key={thread.id}
              onClick={() => setSelectedThreadId(thread.id)}
              className={`w-full p-3 rounded-2xl text-left mb-1 border transition-all ${
                selectedThreadId === thread.id ? 'bg-primary/5 border-primary/20' : 'border-transparent hover:bg-secondary/40'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
                    {thread.type === 'group' ? <Hash className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />}
                  </div>
                  <p className="text-sm font-bold text-foreground truncate">{threadName(thread)}</p>
                </div>
                <span className="text-[10px] text-muted-foreground font-bold">
                  {new Date(thread.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate mt-1">
                {thread.messages?.[0] ? `${thread.messages[0].sender?.name || 'User'}: ${thread.messages[0].content}` : 'No messages yet'}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-card rounded-3xl border border-border flex flex-col overflow-hidden">
        <div className="h-16 px-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              {selectedThread?.type === 'group' ? <UsersIcon className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />}
            </div>
            <div>
              <p className="text-sm font-black text-foreground">{selectedThread ? threadName(selectedThread) : 'Select a conversation'}</p>
              {selectedThread?.type === 'group' && (
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                  {(selectedThread.participants || []).length} participants
                </p>
              )}
            </div>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-3">
          {!selectedThreadId ? (
            <div className="h-full flex items-center justify-center text-sm font-bold text-muted-foreground">Open or create a chat to start messaging.</div>
          ) : isLoadingMessages ? (
            <div className="h-full flex items-center justify-center text-sm font-bold text-muted-foreground">Loading messages...</div>
          ) : (
            messages.map((msg) => {
              const isOwn = msg.sender.id === user.id;
              return (
                <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${isOwn ? 'bg-primary text-white' : 'bg-secondary/40 text-foreground border border-border'}`}>
                    <p className="text-[11px] font-black uppercase tracking-widest mb-1 opacity-75">{isOwn ? 'You' : msg.sender.name}</p>
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-[10px] mt-1 ${isOwn ? 'text-white/80' : 'text-muted-foreground'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className={`p-4 border-t border-border ${!selectedThreadId ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="flex gap-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Write your message..."
              className="flex-1 h-11 rounded-xl bg-secondary/40 border border-border px-3 text-sm outline-none focus:border-primary"
            />
            <button
              onClick={sendMessage}
              disabled={!message.trim()}
              className="h-11 px-4 rounded-xl bg-primary text-white text-xs font-black uppercase tracking-widest disabled:opacity-60 flex items-center gap-1"
            >
              <Send className="w-4 h-4" /> Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
