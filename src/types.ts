export type Difficulty = 'easy' | 'medium' | 'hard';

export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
};

export type Question = {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
};

export type GameState = 'intro' | 'setup' | 'loading' | 'playing' | 'result';

export type UserScore = {
  username: string;
  score: number;
  category: string;
  difficulty: Difficulty;
  date: string;
};
