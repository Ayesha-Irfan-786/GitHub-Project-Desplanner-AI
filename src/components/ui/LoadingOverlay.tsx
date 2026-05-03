import { motion } from 'motion/react';
import { Cpu } from 'lucide-react';

export default function LoadingOverlay({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50/90 backdrop-blur-md"
    >
      <div className="relative w-24 h-24 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-4 border-indigo-100 border-t-indigo-600 rounded-full"
        />
        <Cpu className="w-8 h-8 text-indigo-600 animate-pulse" />
      </div>
      <div className="mt-8 text-center">
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-xl font-black tracking-tight text-slate-800 uppercase"
        >
          {message}
        </motion.p>
        <p className="text-slate-400 text-xs font-bold mt-2 uppercase tracking-widest">Synthesizing real-time challenge...</p>
      </div>
    </motion.div>
  );
}
