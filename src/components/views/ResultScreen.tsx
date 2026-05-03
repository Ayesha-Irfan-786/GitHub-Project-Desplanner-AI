import { motion } from 'motion/react';
import { Trophy, RefreshCcw, LayoutGrid, Calendar, User, Target } from 'lucide-react';
import { UserScore } from '../../types';

interface ResultScreenProps {
  result: UserScore;
  onRestart: () => void;
}

export default function ResultScreen({ result, onRestart }: ResultScreenProps) {
  const leaderboard = JSON.parse(localStorage.getItem('quiz_leaderboard') || '[]') as UserScore[];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
    >
      {/* Left Column: Result & Actions */}
      <div className="lg:col-span-5 space-y-8">
        <div className="game-card p-12 text-center group">
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-2xl mb-8 shadow-xl shadow-indigo-100 transition-transform group-hover:scale-110 duration-500">
               <Trophy className="w-10 h-10 text-white" />
            </div>
            
            <span className="label-mini block mb-2">Battle Summation</span>
            <div className="text-8xl font-black tracking-tighter text-slate-900 mb-6 tabular-nums">
              {result.score}
            </div>
            
            <div className="flex flex-wrap justify-center gap-2 mb-10">
               <div className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider">
                 {result.category}
               </div>
               <div className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider">
                 {result.difficulty}
               </div>
            </div>

            <div className="space-y-4 mb-10">
               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Target className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Accuracy</span>
                  </div>
                  <span className="font-black text-slate-900">{Math.round((result.score / 50) * 100)}%</span>
               </div>
            </div>

            <button
              onClick={onRestart}
              className="game-button-primary w-full py-5 rounded-2xl flex items-center justify-center gap-4 text-lg group"
            >
              <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700" />
              NEW SESSION
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Leaderboard */}
      <div className="lg:col-span-7 space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-2xl font-black tracking-tight">GLOBAL STATS</h3>
          <div className="flex items-center gap-2 label-mini">
            <LayoutGrid className="w-4 h-4" />
            LAST 50 SESSIONS
          </div>
        </div>

        <div className="game-card p-3 overflow-hidden border-slate-200">
           <div className="overflow-y-auto max-h-[550px] pr-2 custom-scrollbar space-y-2.5">
             {leaderboard.length > 0 ? (
               leaderboard.map((entry, idx) => (
                 <motion.div
                   key={idx}
                   initial={{ opacity: 0, x: 10 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: idx * 0.03 }}
                   className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                     idx === 0 
                     ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
                     : 'bg-white border-slate-100'
                   }`}
                 >
                   <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${
                        idx === 0 ? 'bg-indigo-600 text-white scale-110 shadow-lg shadow-indigo-100' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {idx + 1}
                      </div>
                      <div>
                        <div className="font-black text-slate-900 text-sm flex items-center gap-2">
                          {entry.username}
                          {idx === 0 && <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />}
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 flex items-center gap-2 uppercase tracking-wide">
                           <span className="flex items-center gap-1">
                             {entry.category}
                           </span>
                           <span>•</span>
                           <span className="text-slate-500">{entry.difficulty}</span>
                        </div>
                      </div>
                   </div>
                   <div className={`text-xl font-black tabular-nums ${idx === 0 ? 'text-indigo-600' : 'text-slate-800'}`}>
                     {entry.score}
                   </div>
                 </motion.div>
               ))
             ) : (
               <div className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                 Awaiting initial signal...
               </div>
             )}
           </div>
        </div>
      </div>
    </motion.div>
  );
}
