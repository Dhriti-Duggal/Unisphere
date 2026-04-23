import { Link } from 'react-router';
import { motion } from 'motion/react';

export function Welcome() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-4">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[100px]" />
      </div>

      <div className="text-center relative z-10">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 rounded-[32px] bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/20"
        >
          <span className="text-white font-bold text-5xl">U</span>
        </motion.div>
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-7xl font-black text-foreground mb-6 tracking-tighter"
        >
          UniSphere
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl font-bold text-primary uppercase tracking-[0.2em] mb-4"
        >
          Smart University Collaboration
        </motion.p>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-muted-foreground mb-12 max-w-xl mx-auto font-medium leading-relaxed"
        >
          The next-generation ecosystem combining the best of academic management, real-time collaboration, and university portals.
        </motion.p>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to="/login"
            className="px-10 py-5 rounded-2xl bg-primary text-white font-black uppercase tracking-widest hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 hover:scale-105 active:scale-95"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="px-10 py-5 rounded-2xl bg-secondary text-foreground font-black uppercase tracking-widest hover:bg-border transition-all hover:scale-105 active:scale-95 border border-border"
          >
            Create Account
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
