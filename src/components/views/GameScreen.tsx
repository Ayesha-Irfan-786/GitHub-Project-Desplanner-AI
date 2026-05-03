import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, Zap, Trophy, HelpCircle, Info, Check } from 'lucide-react';
import { Question } from '../../types';
import { useTimer } from '../../hooks/useTimer';

interface GameScreenProps {
  question: Question;
  currentStep: number;
  totalSteps: number;
  score: number;
  streak: number;
  timerLimit: number;
  onAnswer: (isCorrect: boolean) => void;
  category: string;
  difficulty: string;
}

export default function GameScreen({ 
  question, 
  currentStep, 
  totalSteps, 
  score, 
  streak, 
  timerLimit, 
  onAnswer,
  category,
  difficulty
}: GameScreenProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  const { seconds, start, reset } = useTimer(timerLimit, () => {
    if (!isLocked) {
      handleSelect(-1);
    }
  });

  useEffect(() => {
    setSelectedOption(null);
    setIsLocked(false);
    reset();
    start();
  }, [question, start, reset]);

  const handleSelect = (index: number) => {
    if (isLocked) return;
    setIsLocked(true);
    setSelectedOption(index);
    onAnswer(index === question.correctAnswerIndex);
  };

  const getOptionStatus = (index: number) => {
    if (!isLocked) return 'idle';
    if (index === question.correctAnswerIndex) return 'correct';
    if (index === selectedOption) return 'incorrect';
    return 'disabled';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      className="w-full max-w-4xl"
    >
      {/* Top Bar Info */}
      <div className="flex justify-between items-end mb-8 px-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-black rounded uppercase tracking-wider">
              {category}
            </span>
            <span className={`px-3 py-1 text-[10px] font-black rounded uppercase tracking-wider ${
              difficulty === 'hard' ? 'bg-rose-100 text-rose-700' : 
              difficulty === 'medium' ? 'bg-amber-100 text-amber-700' : 
              'bg-emerald-100 text-emerald-700'
            }`}>
              {difficulty}
            </span>
          </div>
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">
            Question {currentStep} of {totalSteps}
          </h2>
        </div>

        <div className="text-right flex flex-col items-end">
          <div className="flex items-center gap-4">
            {streak > 1 && (
               <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1.5 text-orange-500 mb-1">
                 <Zap className="w-4 h-4 fill-current" />
                 <span className="font-black text-xs">STREAK x{streak}</span>
               </motion.div>
            )}
            <div className={`flex items-center gap-3 ${seconds < 5 ? 'text-rose-500' : 'text-slate-800'}`}>
              <span className="text-6xl font-black tabular-nums leading-none tracking-tighter">{seconds.toString().padStart(2, '0')}</span>
            </div>
          </div>
          <span className="label-mini leading-none mt-1">Seconds Left</span>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="game-card p-12 mb-10 relative group transition-all duration-500">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-50 overflow-hidden rounded-t-[32px]">
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: `${(seconds / timerLimit) * 100}%` }}
            transition={{ duration: 1, ease: "linear" }}
            className={`h-full ${seconds < 5 ? 'bg-rose-500' : 'bg-indigo-600'}`}
          />
        </div>
        
        <h1 className="text-4xl font-bold leading-tight text-slate-900 mb-2">
          {question.question}
        </h1>
        {question.explanation && isLocked && (
          <p className="text-slate-400 text-lg font-medium mt-4 border-t border-slate-100 pt-4">
            {question.explanation}
          </p>
        )}
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {question.options.map((option, index) => {
          const status = getOptionStatus(index);
          return (
            <button
              key={index}
              disabled={isLocked}
              onClick={() => handleSelect(index)}
              className={`
                group relative bg-white border-2 p-8 rounded-2xl flex items-center gap-6 transition-all text-left overflow-hidden
                ${status === 'idle' ? 'border-slate-200 hover:border-indigo-600 hover:shadow-xl' : ''}
                ${status === 'correct' ? 'bg-indigo-600 border-indigo-600 shadow-xl shadow-indigo-100 text-white' : ''}
                ${status === 'incorrect' ? 'border-rose-500 bg-rose-50 text-rose-700 opacity-90' : ''}
                ${status === 'disabled' ? 'border-slate-100 opacity-40 bg-slate-50 text-slate-400' : ''}
              `}
            >
              <div className={`
                w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black shrink-0 transition-colors
                ${status === 'idle' ? 'bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600' : ''}
                ${status === 'correct' ? 'bg-indigo-500 text-white' : ''}
                ${status === 'incorrect' ? 'bg-rose-500 text-white' : ''}
                ${status === 'disabled' ? 'bg-slate-200 text-slate-400' : ''}
              `}>
                {String.fromCharCode(65 + index)}
              </div>
              <span className={`text-xl font-bold tracking-tight ${status === 'correct' ? 'text-white' : 'text-slate-700'}`}>
                {option}
              </span>

              {status === 'correct' && (
                <div className="absolute -right-2 -top-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                   <Check className="w-4 h-4 text-white stroke-[4px]" />
                </div>
              )}
            </button>
          )
        })}
      </div>
    </motion.div>
  );
}
