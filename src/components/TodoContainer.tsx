/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { Todo } from '../types';
import { Plus, Check, Trash2, Calendar, Target, Zap, Waves } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';

export default function TodoContainer() {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'todos'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const todoList: Todo[] = [];
      snapshot.forEach((doc) => {
        todoList.push({ id: doc.id, ...doc.data() } as Todo);
      });
      setTodos(todoList);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'todos');
    });

    return () => unsubscribe();
  }, [user]);

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim() || !user || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'todos'), {
        text: newTodo.trim(),
        completed: false,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setNewTodo('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'todos');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      await updateDoc(doc(db, 'todos', id), {
        completed: !completed,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `todos/${id}`);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'todos', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `todos/${id}`);
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length,
    progress: todos.length > 0 ? Math.round((todos.filter(t => t.completed).length / todos.length) * 100) : 0
  };

  return (
    <div className="space-y-10">
      {/* Top Cards Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-8 border-l-4 border-l-accent">
          <div className="flex justify-between items-center mb-6">
            <span className="text-[11px] font-extrabold text-text-secondary uppercase tracking-[0.1em]">Current Focus</span>
            <span className="text-[10px] bg-accent/20 text-accent px-2.5 py-1 rounded-md font-bold uppercase tracking-tight">Active</span>
          </div>
          <h2 className="text-2xl font-bold mb-4 tracking-tight">Daily Progress</h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-6">
            You've completed {stats.completed} out of {stats.total} tasks. Keep the momentum going to reach your daily goal.
          </p>
          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
            <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${stats.progress}%` }}
               className="h-full bg-accent"
            />
          </div>
        </div>

        <div className="glass-card p-8">
          <div className="flex justify-between items-center mb-6">
            <span className="text-[11px] font-extrabold text-text-secondary uppercase tracking-[0.1em]">Quick Stats</span>
          </div>
          <div className="flex gap-16">
            <div>
              <div className="text-4xl font-extrabold tracking-tight">{stats.progress}%</div>
              <div className="text-[10px] text-text-secondary font-bold uppercase tracking-widest mt-2">Flow Rate</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold tracking-tight">{stats.active}</div>
              <div className="text-[10px] text-text-secondary font-bold uppercase tracking-widest mt-2">Open Items</div>
            </div>
            <div className="hidden sm:block">
              <div className="text-4xl font-extrabold tracking-tight">{stats.completed}</div>
              <div className="text-[10px] text-text-secondary font-bold uppercase tracking-widest mt-2">Done</div>
            </div>
          </div>
        </div>
      </div>

      {/* Task List Section */}
      <div className="glass-card min-h-[400px] flex flex-col">
        <div className="flex items-center justify-between border-b border-border px-8 py-5">
          <nav className="flex gap-6">
            {(['all', 'active', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-sm font-bold uppercase tracking-[0.05em] py-1 transition relative ${
                  filter === f ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {f}
                {filter === f && (
                  <motion.div layoutId="filterUnderline" className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-accent" />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <AnimatePresence initial={false} mode="popLayout">
            {filteredTodos.map((todo) => (
                <motion.div
                  key={todo.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="group flex items-center gap-5 px-4 py-4 border-b border-border last:border-0 transition-colors hover:bg-white/[0.02]"
                >
                  <button
                    onClick={() => toggleTodo(todo.id, todo.completed)}
                    className={`h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${
                      todo.completed
                        ? 'bg-accent border-accent text-white scale-110 shadow-lg shadow-accent/20'
                        : 'border-border text-transparent hover:border-accent group-hover:bg-white/5'
                    }`}
                  >
                    <Check size={14} strokeWidth={4} />
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className={`text-[15px] font-medium transition-all ${
                      todo.completed ? 'text-text-secondary line-through opacity-50' : 'text-text-primary underline-offset-4'
                    }`}>
                      {todo.text}
                    </p>
                    <div className="flex gap-3 mt-1.5 opacity-60">
                      <span className="flex items-center gap-1 text-[11px] font-bold text-text-secondary">
                        <Calendar size={12} />
                        {todo.createdAt ? format(todo.createdAt.toDate(), 'MMM d') : 'Now'}
                      </span>
                      {!todo.completed && (
                        <span className="flex items-center gap-1 text-[10px] font-extrabold text-accent bg-accent/10 px-2 py-0.5 rounded uppercase tracking-wider">
                          Tasks
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-text-secondary hover:text-red-400 transition-all active:scale-90"
                  >
                    <Trash2 size={18} />
                  </button>
                </motion.div>
            ))}
            {filteredTodos.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 opacity-30 text-center">
                 <Waves size={64} className="mb-4" />
                 <p className="text-xl font-bold">Oceanic Calm</p>
                 <p className="text-sm">No tasks currently adrift in this view.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Bar */}
        <div className="p-8 mt-auto">
          <form onSubmit={addTodo} className="relative group">
             <div className="absolute left-6 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none group-focus-within:text-accent transition-colors">
                <Plus size={20} />
             </div>
             <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Press 'tab' to quickly add a new task..."
                className="w-full bg-white/[0.05] border border-border rounded-2xl py-4 pl-14 pr-20 text-[15px] text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent focus:bg-white/[0.08] transition-all"
             />
             <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {isSubmitting ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent mr-2" />
                ) : (
                  <span className="text-[10px] font-bold text-text-secondary border border-border px-1.5 py-0.5 rounded bg-white/5 tracking-wider">ENTER</span>
                )}
             </div>
          </form>
        </div>
      </div>
    </div>
  );
}
