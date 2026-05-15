/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AuthProvider, useAuth } from './context/AuthContext';
import LoginForm from './components/LoginForm';
import TodoContainer from './components/TodoContainer';
import { LogOut, LayoutDashboard, Clock, BarChart3, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function AppContent() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-bg">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-accent" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LoginForm />
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col sm:flex-row font-sans text-text-primary overflow-hidden">
      {/* Sidebar */}
      <aside className="w-full sm:w-[260px] bg-sidebar border-b sm:border-b-0 sm:border-r border-border p-8 flex flex-col shrink-0">
        <div className="flex items-center gap-3 text-accent font-extrabold text-xl tracking-tight mb-12">
          <Layers size={24} strokeWidth={2.5} />
          ZENITH
        </div>

        <nav className="space-y-8 flex-1">
          <div className="space-y-3">
            <h3 className="text-[11px] font-semibold text-text-secondary uppercase tracking-[0.1em] mb-4">Main Menu</h3>
            <a href="#" className="flex items-center gap-3 text-sm text-text-primary py-1 font-medium group">
              <LayoutDashboard size={18} className="text-accent" />
              Dashboard
            </a>
            <a href="#" className="flex items-center gap-3 text-sm text-text-secondary py-1 transition hover:text-text-primary group">
              <Clock size={18} />
              Timeline
            </a>
            <a href="#" className="flex items-center gap-3 text-sm text-text-secondary py-1 transition hover:text-text-primary group">
              <BarChart3 size={18} />
              Analytics
            </a>
          </div>

          <div className="space-y-3">
            <h3 className="text-[11px] font-semibold text-text-secondary uppercase tracking-[0.1em] mb-4">Workspaces</h3>
            <a href="#" className="flex items-center gap-3 text-sm text-text-secondary py-1 transition hover:text-text-primary">
              <span className="h-2 w-2 rounded-full bg-accent" />
              Product Design
            </a>
            <a href="#" className="flex items-center gap-3 text-sm text-text-secondary py-1 transition hover:text-text-primary">
              <span className="h-2 w-2 rounded-full bg-pink-400" />
              Marketing
            </a>
            <a href="#" className="flex items-center gap-3 text-sm text-text-secondary py-1 transition hover:text-text-primary">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Personal Goals
            </a>
          </div>
        </nav>

        {/* User Profile */}
        <div className="mt-8 pt-6 border-t border-border flex items-center gap-3">
          {user.photoURL && (
            <img 
              src={user.photoURL} 
              referrerPolicy="no-referrer"
              className="h-10 w-10 rounded-full border border-border" 
              alt="Avatar" 
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{user.displayName}</p>
            <p className="text-[11px] text-text-secondary">Premium Member</p>
          </div>
          <button 
            onClick={() => logout()}
            className="text-text-secondary hover:text-red-400 transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 sm:p-12 overflow-y-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Good morning, {user.displayName?.split(' ')[0]}</h1>
            <p className="text-text-secondary text-sm sm:text-base">
              {new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).format(new Date())} • Stay focused and productive
            </p>
          </div>
          
          <div className="flex gap-3">
            <button className="bg-card border border-border px-4 py-2.5 rounded-xl text-sm font-medium transition hover:bg-white/5 active:scale-95">
              Search
            </button>
          </div>
        </header>

        <TodoContainer />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
