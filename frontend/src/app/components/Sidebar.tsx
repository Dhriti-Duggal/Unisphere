import {
  BookOpen,
  MessageCircle,
  ClipboardList,
  PlusCircle,
  Users,
  Building,
  BarChart3,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  ShieldCheck,
  LayoutDashboard,
  Video,
} from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { useUser } from '../contexts/UserContext';
import { useMemo } from 'react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  children?: NavItem[];
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const { user } = useUser();

  const role = user.role || 'student';

  const menuGroups = useMemo(() => {
    const groups: { label?: string; items: NavItem[] }[] = [];

    const studentItems: NavItem[] = [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/student/dashboard' },
      { icon: BookOpen, label: 'Courses', path: '/student/courses' },
      { icon: ClipboardList, label: 'Assignments', path: '/student/assignments' },
      { icon: BarChart3, label: 'Analytics', path: '/student/analytics' },
      { icon: Video, label: 'Live Class', path: '/student/live-class' },
      { icon: Users, label: 'Groups', path: '/student/groups' },
      { icon: MessageCircle, label: 'Chat', path: '/student/chat' },
    ];

    const teacherItems: NavItem[] = [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/teacher/dashboard' },
      {
        icon: BookOpen,
        label: 'Courses',
        path: '/teacher/courses',
        children: [
          { icon: PlusCircle, label: 'Create Course', path: '/teacher/create-course' },
          { icon: ClipboardList, label: 'Create Assignment', path: '/teacher/assignments' },
        ],
      },
      { icon: BarChart3, label: 'Analytics', path: '/teacher/analytics' },
      { icon: MessageCircle, label: 'Chat', path: '/teacher/chat' },
    ];

    const adminItems: NavItem[] = [
      { icon: ShieldCheck, label: 'Root Oracle', path: '/admin/dashboard' },
      { icon: BarChart3, label: 'System Analytics', path: '/admin/analytics' },
    ];

    if (role === 'student') groups.push({ items: studentItems });
    else if (role === 'teacher') groups.push({ items: teacherItems });
    else if (role === 'admin') groups.push({ items: adminItems });

    return groups;
  }, [role]);

  const bottomNav: NavItem[] = [
    { icon: User, label: 'Profile', path: `/${role}/profile` },
    { icon: Settings, label: 'Settings', path: `/${role}/settings` },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || (path !== `/${role}/dashboard` && location.pathname.startsWith(path));
  };

  return (
    <aside
      className={`fixed left-0 top-16 bottom-0 bg-card border-r border-border transition-all duration-300 z-40 hidden md:flex flex-col ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors z-10"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
        {menuGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1">
            {group.label && !collapsed && (
              <p className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                {group.label}
              </p>
            )}
            {group.items.map(item => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <div key={item.path} className="space-y-1">
                  <Link
                    to={item.path}
                    title={collapsed ? item.label : undefined}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all mb-0.5 group ${
                      active
                        ? 'bg-primary text-white shadow-md shadow-primary/20'
                        : 'text-foreground/70 hover:bg-secondary hover:text-foreground'
                    } ${collapsed ? 'justify-center' : ''}`}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 transition-transform ${active ? '' : 'group-hover:scale-110'}`} />
                    {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                  </Link>
                  {!collapsed && item.children && (
                    <div className="ml-4 pl-3 border-l border-border/70 space-y-1">
                      {item.children.map((child) => {
                        const ChildIcon = child.icon;
                        const childActive = location.pathname === child.path || location.pathname.startsWith(`${child.path}/`);
                        return (
                          <Link
                            key={child.path}
                            to={child.path}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-xs font-semibold ${
                              childActive
                                ? 'bg-primary/10 text-primary'
                                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                            }`}
                          >
                            <ChildIcon className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{child.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="px-3 py-4 border-t border-border space-y-0.5">
        {bottomNav.map(item => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                active
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'text-foreground/70 hover:bg-secondary hover:text-foreground'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 transition-transform ${active ? '' : 'group-hover:scale-110'}`} />
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}