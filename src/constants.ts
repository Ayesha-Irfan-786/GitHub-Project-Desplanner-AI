import { Category } from './types';

export const CATEGORIES: Category[] = [
  { id: 'general', name: 'General Knowledge', icon: 'Globe', color: 'from-blue-500 to-cyan-400' },
  { id: 'science', name: 'Science', icon: 'Beaker', color: 'from-emerald-500 to-teal-400' },
  { id: 'tech', name: 'Tech & AI', icon: 'Cpu', color: 'from-purple-500 to-indigo-400' },
  { id: 'entertainment', name: 'Entertainment', icon: 'Clapperboard', color: 'from-pink-500 to-rose-400' },
  { id: 'history', name: 'History', icon: 'History', color: 'from-orange-500 to-amber-400' },
];

export const DIFFICULTIES = [
  { id: 'easy', name: 'Easy', color: 'bg-green-500/20 text-green-400 border-green-500/50' },
  { id: 'medium', name: 'Medium', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' },
  { id: 'hard', name: 'Hard', color: 'bg-red-500/20 text-red-400 border-red-500/50' },
];

export const QUESTION_TIMER = 15;
export const CORRECT_POINTS = 10;
export const STREAK_BONUS = 5;
