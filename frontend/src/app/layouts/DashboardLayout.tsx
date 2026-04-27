import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router';
import { ChevronRight } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { AIAssistant } from '../components/AIAssistant';

export function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  const segments = location.pathname.split('/').filter(Boolean);
  const role = segments[0] || '';
  const pageSegments = segments.slice(1);
  const isCoursePath = pageSegments[0] === 'courses';

  const titleize = (value: string) =>
    value
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex flex-1 pt-16">
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'} ml-0`}>
          <div className="px-4 md:px-6 py-4 border-b border-border/70 bg-card/40 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground overflow-x-auto whitespace-nowrap">
              <Link to={`/${role}/dashboard`} className="hover:text-foreground transition-colors">Home</Link>
              {pageSegments.map((segment, idx) => {
                const href = `/${role}/${pageSegments.slice(0, idx + 1).join('/')}`;
                const isLast = idx === pageSegments.length - 1;
                return (
                  <div key={href} className="flex items-center gap-2">
                    <ChevronRight className="w-3 h-3 text-muted-foreground/60" />
                    {isLast ? (
                      <span className="text-primary">{titleize(segment)}</span>
                    ) : (
                      <Link to={href} className="hover:text-foreground transition-colors">
                        {titleize(segment)}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className={isCoursePath ? "p-0" : "p-4 md:p-8"}>
            <Outlet />
          </div>
        </main>
      </div>
      <AIAssistant />
    </div>
  );
}