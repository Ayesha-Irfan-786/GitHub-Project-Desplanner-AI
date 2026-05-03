import { useState } from 'react';
import { motion } from 'motion/react';
import { Cpu, Play, Info } from 'lucide-react';

interface IntroScreenProps {
  onStart: (name: string) => void;
}

export default function IntroScreen({ onStart }: IntroScreenProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onStart(name.trim());
    } else {
      setError(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-lg"
    >
      <div className="text-center mb-12 animate-float">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white border border-slate-200 rounded-2xl shadow-sm mb-6">
          <Cpu className="w-8 h-8 text-indigo-600" />
        </div>
        <h1 className="text-4xl font-black tracking-tight mb-2 text-slate-900">
           QUIZ BATTLE <span className="text-indigo-600">AI</span>
        </h1>
        <p className="text-slate-400 font-medium">Real-time competitive trivia powered by Gemini</p>
      </div>

      <div className="game-card p-10 bg-white">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="label-mini mb-3 block px-1">ENTER PLAYER IDENTIFIER</label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(false); }}
              placeholder="e.g. NeuronSurfer_01"
              className={`w-full bg-slate-50 border ${error ? 'border-red-400' : 'border-slate-200'} rounded-2xl px-6 py-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-lg font-semibold placeholder:text-slate-300`}
              maxLength={20}
            />
            {error && <p className="text-red-500 text-[10px] font-bold uppercase mt-2 px-1 tracking-wider">Identification required to proceed</p>}
          </div>

          <button
            type="submit"
            className="game-button-primary w-full py-5 rounded-2xl flex items-center justify-center gap-3 text-lg group"
          >
            <Play className="w-5 h-5 fill-current" />
            INITIALIZE BATTLE
          </button>
        </form>

        <div className="mt-10 flex items-start gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="w-8 h-8 bg-white border border-slate-100 rounded-lg flex items-center justify-center shrink-0">
             <Info className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-slate-500 text-xs leading-relaxed font-medium">
            Every question is synthesized on-the-fly. The difficulty scaling uses advanced heuristics to challenge your domain expertise.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
