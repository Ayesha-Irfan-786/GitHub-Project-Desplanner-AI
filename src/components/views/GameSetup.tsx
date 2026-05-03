import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { CATEGORIES, DIFFICULTIES } from '../../constants';
import { Category, Difficulty } from '../../types';
import * as Icons from 'lucide-react';

interface GameSetupProps {
  onStart: (category: Category, difficulty: Difficulty) => void;
  username: string;
}

export default function GameSetup({ onStart, username }: GameSetupProps) {
  const [category, setCategory] = useState<Category>(CATEGORIES[0]);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');

  const renderIcon = (iconName: string, className: string) => {
    const IconComponent = (Icons as any)[iconName];
    return <IconComponent className={className} />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full max-w-5xl"
    >
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div>
          <h2 className="text-3xl font-black tracking-tight mb-1">CONFIGURE BATTLE</h2>
          <p className="text-slate-400 font-medium">Player session active: <span className="text-indigo-600 font-bold">{username}</span></p>
        </div>
        
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
           {DIFFICULTIES.map((d) => (
            <button
              key={d.id}
              onClick={() => setDifficulty(d.id as Difficulty)}
              className={`px-6 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                difficulty === d.id ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5 mb-12">
        {CATEGORIES.map((cat, index) => (
          <motion.button
            key={cat.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setCategory(cat)}
            className={`group relative overflow-hidden text-left p-6 rounded-3xl border-2 transition-all duration-300 h-44 ${
              category.id === cat.id 
              ? 'border-indigo-600 bg-white shadow-xl shadow-indigo-100 ring-4 ring-indigo-50' 
              : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className={`w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mb-6 transition-colors ${category.id === cat.id ? 'bg-indigo-600 text-white' : 'text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600'}`}>
              {renderIcon(cat.icon, "w-5 h-5")}
            </div>
            
            <div>
              <span className="label-mini block mb-1">Field</span>
              <h3 className={`text-lg font-bold leading-tight ${category.id === cat.id ? 'text-slate-900' : 'text-slate-500'}`}>
                {cat.name}
              </h3>
            </div>
            
            {category.id === cat.id && (
              <motion.div 
                layoutId="setup-check"
                className="absolute top-4 right-4 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg"
              >
                <div className="w-2.5 h-2.5 border-2 border-white border-t-0 border-l-0 rotate-45 mb-0.5" />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => onStart(category, difficulty)}
          className="game-button-primary px-16 py-5 rounded-2xl flex items-center gap-4 text-xl group"
        >
          INITIATE GENERATION
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
}
