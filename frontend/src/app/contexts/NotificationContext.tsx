import { createContext, useContext, useState } from 'react';

export type NotificationType = 'assignment' | 'mention' | 'message' | 'announcement' | 'grade';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: string;
  read: boolean;
  link?: string;
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  markAllRead: () => void;
  markAsRead: (id: string) => void;
  addNotification: (notification: Omit<AppNotification, 'id'>) => void;
}

const initialNotifications: AppNotification[] = [
  {
    id: '1',
    type: 'assignment',
    title: 'Assignment Due Tomorrow',
    description: 'CS201 - Binary Tree Implementation due March 7',
    time: '2h ago',
    read: false,
    link: '/app/assignments',
  },
  {
    id: '2',
    type: 'mention',
    title: 'You were mentioned',
    description: 'Prof. Chen mentioned you in CS201 discussion',
    time: '4h ago',
    read: false,
    link: '/app/chat',
  },
  {
    id: '3',
    type: 'message',
    title: 'New message from Alice',
    description: '"Can you join the study group tonight?"',
    time: '5h ago',
    read: false,
    link: '/app/chat',
  },
  {
    id: '4',
    type: 'announcement',
    title: 'CS101 Midterm Rescheduled',
    description: 'The midterm exam has been moved to March 15',
    time: '1d ago',
    read: false,
    link: '/app/courses/1',
  },
  {
    id: '5',
    type: 'grade',
    title: 'Grade Posted — A-',
    description: 'Your CS301 React Portfolio has been graded',
    time: '2d ago',
    read: true,
    link: '/app/assignments',
  },
];

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  const markAsRead = (id: string) =>
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));

  const addNotification = (notification: Omit<AppNotification, 'id'>) =>
    setNotifications(prev => [
      { ...notification, id: Date.now().toString() },
      ...prev,
    ]);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllRead, markAsRead, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
}
