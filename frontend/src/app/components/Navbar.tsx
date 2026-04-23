import { useState, useRef, useEffect } from 'react';
import {
  Search, Bell, MessageSquare, Moon, Sun, Menu, X,
  LogOut, Settings, User, AtSign, BookOpen, ClipboardList,
  Check, ChevronRight, GraduationCap,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { useNotifications, AppNotification } from '../contexts/NotificationContext';
import { Link, useNavigate } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';

// ─── Mock search data ─────────────────────────────────────────────────────────
const SEARCH_DATA = {
  courses: [
    { id: 1, label: 'Introduction to Computer Science', code: 'CS101' },
    { id: 2, label: 'Data Structures & Algorithms', code: 'CS201' },
    { id: 3, label: 'Web Development', code: 'CS301' },
    { id: 4, label: 'Database Systems', code: 'CS205' },
    { id: 5, label: 'Software Engineering', code: 'CS401' },
  ],
  assignments: [
    { id: 1, label: 'Lab Report 3', course: 'CS101' },
    { id: 2, label: 'Binary Tree Implementation', course: 'CS201' },
    { id: 3, label: 'React Portfolio Project', course: 'CS301' },
    { id: 4, label: 'SQL Query Assignment', course: 'CS205' },
  ],
  people: [
    { id: 1, label: 'Alice Cooper', role: 'Student' },
    { id: 2, label: 'Dr. Sarah Johnson', role: 'Teacher' },
    { id: 3, label: 'Prof. Michael Chen', role: 'Teacher' },
    { id: 4, label: 'Bob Martin', role: 'Student' },
  ],
};

type SearchPreviewItem = { id: number; label: string; category: string; link: string; sub?: string };

function getPreviewResults(query: string, role: string, category: string = 'all'): SearchPreviewItem[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  const results: SearchPreviewItem[] = [];

  const rolePath = role === 'admin' ? 'admin' : role === 'teacher' ? 'teacher' : 'student';

  if (category === 'all' || category === 'courses') {
    SEARCH_DATA.courses
      .filter(c => c.label.toLowerCase().includes(q) || c.code.toLowerCase().includes(q))
      .slice(0, category === 'all' ? 2 : 5)
      .forEach(c => results.push({ id: c.id, label: c.label, category: 'Course', sub: c.code, link: `/${rolePath}/courses/${c.id}` }));
  }

  if (category === 'all' || category === 'assignments') {
    SEARCH_DATA.assignments
      .filter(a => a.label.toLowerCase().includes(q) || a.course.toLowerCase().includes(q))
      .slice(0, category === 'all' ? 2 : 5)
      .forEach(a => results.push({ id: a.id, label: a.label, category: 'Assignment', sub: a.course, link: `/${rolePath}/assignments` }));
  }

  if (category === 'all' || category === 'people') {
    SEARCH_DATA.people
      .filter(p => p.label.toLowerCase().includes(q))
      .slice(0, category === 'all' ? 2 : 5)
      .forEach(p => results.push({ id: p.id, label: p.label, category: 'Person', sub: p.role, link: `/${rolePath}/profile` }));
  }

  return results.slice(0, 10);
}

// ─── Notification icon helpers ────────────────────────────────────────────────
const NOTIF_ICON_MAP: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  assignment: { icon: ClipboardList, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  mention: { icon: AtSign, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  message: { icon: MessageSquare, color: 'text-green-500', bg: 'bg-green-500/10' },
  announcement: { icon: Bell, color: 'text-accent', bg: 'bg-accent/10' },
  grade: { icon: GraduationCap, color: 'text-primary', bg: 'bg-primary/10' },
};

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useUser();
  const { notifications, unreadCount, markAllRead, markAsRead } = useNotifications();
  const navigate = useNavigate();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('all');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [previewResults, setPreviewResults] = useState<SearchPreviewItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);

  // Notification state
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Profile dropdown state
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Search: update preview while typing
  useEffect(() => {
    if (searchQuery.length > 0) {
      setPreviewResults(getPreviewResults(searchQuery, user.role, searchCategory));
      setShowSearchDropdown(true);
      setActiveIndex(-1);
    } else {
      setPreviewResults([]);
      setShowSearchDropdown(false);
    }
  }, [searchQuery, searchCategory, user.role]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const rolePath = user.role === 'admin' ? 'admin' : user.role === 'teacher' ? 'teacher' : 'student';
      navigate(`/${rolePath}/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchDropdown(false);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < previewResults.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > -1 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && activeIndex < previewResults.length) {
        navigate(previewResults[activeIndex].link);
        setShowSearchDropdown(false);
        setSearchQuery('');
      } else {
        handleSearch();
      }
    } else if (e.key === 'Escape') {
      setShowSearchDropdown(false);
    }
  };

  const handleNotifClick = (notif: AppNotification) => {
    markAsRead(notif.id);
    if (notif.link) navigate(notif.link);
    setShowNotifications(false);
  };

  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50 shadow-sm">
        <div className="h-full px-4 md:px-6 flex items-center justify-between gap-4">
          {/* Left: Mobile Menu + Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              className="md:hidden w-10 h-10 rounded-lg hover:bg-secondary flex items-center justify-center text-foreground transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to={`/${user.role}/dashboard`} className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">U</span>
              </div>
              <span className="text-lg font-black text-foreground hidden sm:block tracking-tighter uppercase">
                UniSphere
              </span>
            </Link>
          </div>

          {/* Center: Search Bar (desktop) */}
          <div className="flex-1 max-w-2xl hidden md:block" ref={searchRef}>
            <div className="relative">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    onFocus={() => searchQuery && setShowSearchDropdown(true)}
                    placeholder="Search courses, assignments, people..."
                    className="w-full h-10 pl-10 pr-4 rounded-xl bg-secondary border border-transparent focus:border-primary/20 text-foreground placeholder:text-muted-foreground focus:outline-none transition-all text-sm font-medium"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="h-10 px-6 rounded-xl bg-primary text-white hover:shadow-lg hover:shadow-primary/20 active:scale-95 transition-all text-xs font-black uppercase tracking-widest flex items-center gap-2 flex-shrink-0"
                >
                  <Search className="w-4 h-4" />
                  Identify
                </button>
              </div>

              {/* Search Dropdown Preview */}
              <AnimatePresence>
                {showSearchDropdown && previewResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-popover rounded-[24px] border border-border shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="flex items-center gap-1 p-3 border-b border-border bg-secondary/30">
                        {['all', 'courses', 'assignments', 'people'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSearchCategory(cat)}
                                className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${searchCategory === cat ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground hover:bg-secondary'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="p-2 max-h-[400px] overflow-y-auto">
                      {previewResults.map((result, i) => {
                        const Icon =
                          result.category === 'Course' ? BookOpen :
                          result.category === 'Assignment' ? ClipboardList :
                          User;
                        const isFocused = i === activeIndex;
                        return (
                          <Link
                            key={`${result.category}-${result.id}-${i}`}
                            to={result.link}
                            onMouseEnter={() => setActiveIndex(i)}
                            onClick={() => { setShowSearchDropdown(false); setSearchQuery(''); }}
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${isFocused ? 'bg-primary text-white' : 'hover:bg-secondary'}`}
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${isFocused ? 'bg-white/20' : 'bg-primary/10'}`}>
                              <Icon className={`w-5 h-5 ${isFocused ? 'text-white' : 'text-primary'}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-bold truncate ${isFocused ? 'text-white' : 'text-foreground'}`}>{result.label}</p>
                              <p className={`text-[10px] font-black uppercase tracking-widest ${isFocused ? 'text-white/70' : 'text-muted-foreground'}`}>{result.category} · {result.sub}</p>
                            </div>
                            <ChevronRight className={`w-4 h-4 transition-all ${isFocused ? 'opacity-100 translate-x-1' : 'opacity-0 group-hover:opacity-100'}`} />
                          </Link>
                        );
                      })}
                    </div>
                    <div className="px-4 py-3 border-t border-border bg-secondary/50">
                      <button
                        onClick={handleSearch}
                        className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
                      >
                        <Search className="w-3 h-3" />
                        Full Registry Search →
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>


          {/* Right Actions */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Mobile Search Toggle */}
            <button
              className="md:hidden w-10 h-10 rounded-lg hover:bg-secondary flex items-center justify-center text-foreground transition-colors"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-lg hover:bg-secondary flex items-center justify-center text-foreground transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {/* Chat */}
            <Link
              to={`/${user.role}/chat`}
              className="relative w-10 h-10 rounded-lg hover:bg-secondary flex items-center justify-center text-foreground transition-colors hidden sm:flex"
              aria-label="Chat"
            >
              <MessageSquare className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-500 rounded-full border border-card" />
            </Link>

            {/* Notifications */}
            <div className="relative hidden sm:block" ref={notifRef}>
              <button
                onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
                className="relative w-10 h-10 rounded-lg hover:bg-secondary flex items-center justify-center text-foreground transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 rounded-full border-2 border-card flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold leading-none px-0.5">{unreadCount > 9 ? '9+' : unreadCount}</span>
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-96 bg-popover rounded-xl border border-border shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground text-sm">Notifications</h3>
                        {unreadCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-primary text-white text-xs font-medium">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllRead}
                          className="text-xs text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center">
                          <Bell className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                          <p className="text-sm text-muted-foreground">No notifications yet</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-border">
                          {notifications.map(notif => {
                            const meta = NOTIF_ICON_MAP[notif.type] || NOTIF_ICON_MAP.announcement;
                            const Icon = meta.icon;
                            return (
                              <button
                                key={notif.id}
                                onClick={() => handleNotifClick(notif)}
                                className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-secondary transition-colors text-left ${!notif.read ? 'bg-primary/5' : ''}`}
                              >
                                <div className={`w-9 h-9 rounded-lg ${meta.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                  <Icon className={`w-4 h-4 ${meta.color}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <p className={`text-sm ${!notif.read ? 'font-semibold text-foreground' : 'font-medium text-foreground'} leading-snug`}>
                                      {notif.title}
                                    </p>
                                    {!notif.read && (
                                      <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                                    )}
                                  </div>
                                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{notif.description}</p>
                                  <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="px-4 py-2.5 border-t border-border bg-secondary/30">
                      <Link
                        to={`/${user.role}/settings`}
                        onClick={() => setShowNotifications(false)}
                        className="text-xs text-primary hover:text-primary/80 transition-colors"
                      >
                        Notification Settings →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Avatar + Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
                className={`w-10 h-10 rounded-full bg-gradient-to-br ${user.avatarColor || 'from-primary to-accent'} flex items-center justify-center text-white shadow-sm hover:shadow-md transition-all hover:scale-105 active:scale-95`}
                aria-label="Profile menu"
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-sm font-semibold">{initials}</span>
                )}
              </button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-64 bg-popover rounded-xl border border-border shadow-2xl z-50 overflow-hidden"
                  >
                    {/* User Info */}
                    <div className="px-4 py-4 border-b border-border">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${user.avatarColor || 'from-primary to-accent'} flex items-center justify-center text-white flex-shrink-0 shadow-sm`}>
                          {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <span className="text-sm font-semibold">{initials}</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium capitalize">
                            {user.role}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      <Link
                        to={`/${user.role}/profile`}
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary transition-colors text-sm text-foreground font-medium"
                      >
                        <User className="w-4 h-4 text-muted-foreground" />
                        View Profile
                      </Link>
                      <Link
                        to={`/${user.role}/settings`}
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary transition-colors text-sm text-foreground font-medium"
                      >
                        <Settings className="w-4 h-4 text-muted-foreground" />
                        Settings
                      </Link>
                    </div>

                    <div className="p-2 border-t border-border">
                      <Link
                        to="/login"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-500/10 transition-colors text-sm text-red-500 w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <AnimatePresence>
          {mobileSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-border bg-card overflow-hidden"
            >
              <div className="px-4 py-3 flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    placeholder="Search..."
                    autoFocus
                    className="w-full h-10 pl-10 pr-4 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>
                <button
                  onClick={() => { handleSearch(); setMobileSearchOpen(false); }}
                  className="h-10 px-4 rounded-lg bg-primary text-white text-sm hover:bg-primary/90 transition-colors"
                >
                  Go
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile Slide-in Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-card border-r border-border z-50 md:hidden flex flex-col pt-16"
            >
              <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                {[
                  { label: 'Dashboard', path: `/${user.role}/dashboard`, icon: '🏠' },
                  { label: 'Courses', path: `/${user.role}/courses`, icon: '📚' },
                  { label: 'Chat', path: `/${user.role}/chat`, icon: '💬' },
                  { label: 'Assignments', path: `/${user.role}/assignments`, icon: '📋' },
                  { label: 'Groups', path: `/${user.role}/groups`, icon: '👥' },
                  { label: 'Analytics', path: `/${user.role}/analytics`, icon: '📊' },
                  { label: 'Profile', path: `/${user.role}/profile`, icon: '👤' },
                  { label: 'Settings', path: `/${user.role}/settings`, icon: '⚙️' },
                ].map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-foreground hover:bg-secondary transition-colors"
                  >
                    <span className="text-base">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="px-3 py-4 border-t border-border">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
