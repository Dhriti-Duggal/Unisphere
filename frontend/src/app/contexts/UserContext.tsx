import { createContext, useContext, useState, useEffect } from 'react';
 
export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  bio: string;
  department: string;
  departmentId: string;
  location: string;
  studentId: string;
  major: string;
  year: string;
  gpa: string;
  enrollmentDate: string;
  role: 'student' | 'teacher' | 'admin';
  avatarColor: string;
  avatarUrl?: string;
  onboardingComplete: boolean;
}
 
interface UserContextType {
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
  replaceUser: (newUser: UserProfile) => void;
  resetUser: () => void;
}
 
const defaultUser: UserProfile = {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1 234 567 890',
  bio: 'Computer Science student passionate about decentralized systems.',
  department: 'Computer Science & Engineering',
  departmentId: 'cse',
  location: 'New York, USA',
  studentId: 'STU-2024-001',
  major: 'Software Engineering',
  year: '3rd Year',
  gpa: '3.8',
  enrollmentDate: 'Sept 2021',
  role: 'student',
  avatarColor: 'from-primary to-accent',
  onboardingComplete: false,
};
 
const UserContext = createContext<UserContextType | undefined>(undefined);
 
export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('unisphere_user');
    return saved ? JSON.parse(saved) : defaultUser;
  });
 
  useEffect(() => {
    localStorage.setItem('unisphere_user', JSON.stringify(user));
  }, [user]);
 
  const updateUser = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };
 
  const replaceUser = (newUser: UserProfile) => {
    setUser(newUser);
  };
 
  const resetUser = () => {
    setUser(defaultUser);
    localStorage.removeItem('token');
    localStorage.removeItem('unisphere_user');
  };
 
  return (
    <UserContext.Provider value={{ user, updateUser, replaceUser, resetUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}