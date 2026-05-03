/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { GameState, Category, Difficulty, Question, UserScore } from './types';
import { CATEGORIES, QUESTION_TIMER, CORRECT_POINTS, STREAK_BONUS } from './constants';
import { generateQuestions } from './services/geminiService';
import IntroScreen from './components/views/IntroScreen';
import GameSetup from './components/views/GameSetup';
import GameScreen from './components/views/GameScreen';
import ResultScreen from './components/views/ResultScreen';
import LoadingOverlay from './components/ui/LoadingOverlay';
import { useSoundEffect } from './hooks/useSound';
import { Zap, Trophy, Shield, Cpu } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [username, setUsername] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>(CATEGORIES[0]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lastGameResult, setLastGameResult] = useState<UserScore | null>(null);
  
  const { playSound } = useSoundEffect();

  const handleStartSetup = (name: string) => {
    setUsername(name);
    setGameState('setup');
    playSound('click');
  };

  const handleStartGame = async (category: Category, difficulty: Difficulty) => {
    setSelectedCategory(category);
    setSelectedDifficulty(difficulty);
    setGameState('loading');
    setLoading(true);
    playSound('click');

    try {
      const generatedQuestions = await generateQuestions(category.name, difficulty);
      setQuestions(generatedQuestions);
      setCurrentQuestionIndex(0);
      setScore(0);
      setStreak(0);
      setGameState('playing');
    } catch (error) {
      console.error("Failed to start game", error);
      setGameState('setup');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      const bonus = streak >= 2 ? STREAK_BONUS : 0;
      setScore(prev => prev + CORRECT_POINTS + bonus);
      setStreak(prev => prev + 1);
      playSound('correct');
      if (streak >= 3) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#4f46e5', '#3b82f6']
        });
      }
    } else {
      setStreak(0);
      playSound('wrong');
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        finishGame();
      }
    }, 2000);
  };

  const finishGame = () => {
    const result: UserScore = {
      username,
      score,
      category: selectedCategory.name,
      difficulty: selectedDifficulty,
      date: new Date().toISOString()
    };
    
    setLastGameResult(result);
    setGameState('result');
    playSound('complete');
    
    const existing = JSON.parse(localStorage.getItem('quiz_leaderboard') || '[]');
    localStorage.setItem('quiz_leaderboard', JSON.stringify([result, ...existing].slice(0, 50)));

    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleRestart = () => {
    setGameState('setup');
    playSound('click');
  };

  const progress = questions.length > 0 ? (currentQuestionIndex / questions.length) * 100 : 0;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#F4F4F5] text-slate-900 select-none">
      {/* Header */}
      <header className="h-20 border-b border-slate-200 bg-white flex items-center justify-between px-10 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-indigo-900 leading-none">QUIZ BATTLE AI</span>
            <span className="label-mini text-[8px]">Real-time Intelligence Engine</span>
          </div>
        </div>

        {gameState === 'playing' && (
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-end">
              <span className="label-mini">Current Streak</span>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black text-orange-500 underline decoration-orange-200 decoration-2 underline-offset-4">x{streak}</span>
                <span className="text-lg">🔥</span>
              </div>
            </div>
            <div className="h-10 w-[1px] bg-slate-200"></div>
            <div className="flex flex-col items-end">
              <span className="label-mini">Battle Points</span>
              <span className="text-2xl font-black text-slate-800 tabular-nums leading-none">{score.toLocaleString()}</span>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-8 items-center justify-center overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="wait">
          {gameState === 'intro' && (
            <IntroScreen key="intro" onStart={handleStartSetup} />
          )}
          
          {gameState === 'setup' && (
            <GameSetup 
              key="setup" 
              onStart={handleStartGame} 
              username={username}
            />
          )}

          {gameState === 'playing' && questions.length > 0 && (
            <GameScreen
              key="playing"
              question={questions[currentQuestionIndex]}
              currentStep={currentQuestionIndex + 1}
              totalSteps={questions.length}
              score={score}
              streak={streak}
              onAnswer={handleAnswer}
              timerLimit={QUESTION_TIMER}
              category={selectedCategory.name}
              difficulty={selectedDifficulty}
            />
          )}

          {gameState === 'result' && lastGameResult && (
            <ResultScreen
              key="result"
              result={lastGameResult}
              onRestart={handleRestart}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="h-16 bg-white border-t border-slate-200 flex items-center px-10 justify-between shrink-0 shadow-[0_-1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex items-center gap-4 label-mini">
          <span>{username ? `Player: ` : 'Rank: '}<span className="text-slate-900">{username || 'Novice I'}</span></span>
          <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
          <span>Level: <span className="text-slate-900">{score > 500 ? 'Gold' : score > 200 ? 'Silver' : 'Bronze'}</span></span>
        </div>

        {gameState === 'playing' && (
          <div className="flex-1 mx-20 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-indigo-600 rounded-full"
            />
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="label-mini">AI Generating...</span>
          <div className="flex gap-1.5">
            <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }} className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
            <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }} className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.5, repeat: Infinity, delay: 1 }} className="w-1.5 h-1.5 rounded-full bg-indigo-200" />
          </div>
        </div>
      </footer>

      {(gameState === 'loading' || loading) && (
        <LoadingOverlay message="Generating AI Questions..." />
      )}
    </div>
  );
}
