/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useAuth } from '../context/AuthContext';
import { LogIn, Github } from 'lucide-react';

export default function LoginForm() {
  const { login } = useAuth();

  return (
    <div className="w-full max-w-md overflow-hidden glass-card">
      <div className="bg-accent/20 px-8 py-10 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-white shadow-lg shadow-accent/20">
          <LogIn size={32} />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-text-primary">Welcome Back</h2>
        <p className="mt-2 text-text-secondary">Access your workspace and stay productive</p>
      </div>
      
      <div className="px-8 py-10 space-y-4">
        <button
          onClick={login}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-white/5 px-4 py-4 font-semibold text-text-primary transition hover:bg-white/10 active:scale-[0.98] group"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="h-5 w-5 grayscale group-hover:grayscale-0 transition-all" />
          Continue with Google
        </button>
        
        <div className="relative flex items-center justify-center py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <span className="relative bg-bg px-3 text-[11px] font-bold uppercase tracking-widest text-text-secondary">or</span>
        </div>

        <button
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-white/5 px-4 py-4 font-semibold text-text-primary transition hover:bg-white/10 active:scale-[0.98] group"
        >
          <Github size={20} />
          Continue with GitHub
        </button>

        <p className="mt-8 text-center text-xs text-text-secondary leading-relaxed">
          By signing in, you agree to our <span className="text-accent cursor-pointer italic hover:underline">Terms of Service</span> and <span className="text-accent cursor-pointer italic hover:underline">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}
