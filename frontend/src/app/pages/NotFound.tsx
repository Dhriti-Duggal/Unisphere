import { Link } from 'react-router';
import { Home, ArrowLeft, Search, Compass } from 'lucide-react';
import { motion } from 'motion/react';

export function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px]" />

      <div className="max-w-2xl w-full text-center relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 40 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <div className="mb-8 relative inline-block">
                <div className="text-[180px] font-black text-primary/10 leading-none select-none">404</div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-[40px] bg-card border border-border shadow-2xl flex items-center justify-center text-primary animate-bounce">
                        <Compass className="w-16 h-16" strokeWidth={1.5} />
                    </div>
                </div>
            </div>

            <h1 className="text-5xl font-black text-foreground tracking-tighter mb-4">Node Disconnected</h1>
            <p className="text-xl text-muted-foreground font-medium mb-10 max-w-md mx-auto">
              The coordinate you are searching for does not exist in the UniSphere registry. It may have been relocated or purged.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                    to="/"
                    className="h-14 px-10 rounded-2xl bg-primary text-white font-black uppercase tracking-widest flex items-center gap-3 hover:shadow-2xl hover:shadow-primary/30 transition-all active:scale-95"
                >
                    <Home className="w-5 h-5" />
                    Return Home
                </Link>
                <button
                    onClick={() => window.history.back()}
                    className="h-14 px-10 rounded-2xl bg-card border border-border text-foreground font-black uppercase tracking-widest flex items-center gap-3 hover:bg-secondary transition-all active:scale-95"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Previous Node
                </button>
            </div>

            <div className="mt-20 pt-10 border-t border-dashed border-border/50">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-6">Common Registry Targets</p>
                <div className="flex flex-wrap justify-center gap-3">
                    {['Courses', 'Assignments', 'Student Hub', 'Support'].map(tag => (
                        <span key={tag} className="px-4 py-2 rounded-full bg-secondary/50 border border-border text-[10px] font-bold text-foreground/60 uppercase hover:text-primary hover:border-primary/30 cursor-pointer transition-all">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
      </div>
    </div>
  );
}
