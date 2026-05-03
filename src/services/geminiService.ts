import { GoogleGenAI, Type } from "@google/genai";
import { Question, Difficulty } from "../types";

const API_KEY = process.env.GEMINI_API_KEY;
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const FALLBACK_QUESTIONS: Record<string, Question[]> = {
  "General Knowledge": [
    {
      question: "Which country is home to the Canal du Midi?",
      options: ["France", "Italy", "Spain", "Germany"],
      correctAnswerIndex: 0,
      explanation: "The Canal du Midi is a 240 km long canal in Southern France."
    },
    {
      question: "What is the capital of Japan?",
      options: ["Seoul", "Beijing", "Tokyo", "Bangkok"],
      correctAnswerIndex: 2,
      explanation: "Tokyo is the capital and largest city of Japan."
    },
    {
      question: "Which of these is not a primary color?",
      options: ["Red", "Green", "Blue", "Yellow"],
      correctAnswerIndex: 1,
      explanation: "In the subtractive color model (RYB), Green is a secondary color made by mixing Blue and Yellow."
    }
  ],
  "Science": [
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctAnswerIndex: 1,
      explanation: "Mars is often called the 'Red Planet' because of iron minerals in its soil."
    },
    {
      question: "What is the chemical symbol for Gold?",
      options: ["Gd", "Go", "Ag", "Au"],
      correctAnswerIndex: 3,
      explanation: "Au comes from the Latin word for gold, 'aurum'."
    }
  ],
  "Tech & AI": [
    {
      question: "What does 'CPU' stand for?",
      options: ["Central Process Unit", "Computer Personal Unit", "Central Processing Unit", "Central Processor Universal"],
      correctAnswerIndex: 2,
      explanation: "The CPU is the primary component of a computer that acts as its 'control center'."
    },
    {
      question: "Who is known as the 'Father of AI'?",
      options: ["Steve Jobs", "Alan Turing", "Elon Musk", "John McCarthy"],
      correctAnswerIndex: 3,
      explanation: "John McCarthy coined the term 'Artificial Intelligence' in 1955."
    }
  ],
  "Entertainment": [
    {
      question: "Which movie won the first-ever Academy Award for Best Picture?",
      options: ["Wings", "The Jazz Singer", "Sunrise", "Metropolis"],
      correctAnswerIndex: 0,
      explanation: "Wings (1927) was the first film to win the Oscar for Best Picture."
    }
  ],
  "History": [
    {
      question: "In what year did the Titanic sink?",
      options: ["1905", "1912", "1918", "1923"],
      correctAnswerIndex: 1,
      explanation: "The RMS Titanic sank in the early morning hours of 15 April 1912."
    }
  ]
};

export async function generateQuestions(category: string, difficulty: Difficulty, count: number = 5): Promise<Question[]> {
  if (!ai) {
    console.warn("Gemini API key missing. Using fallback questions.");
    return getRandomFallback(category, count);
  }

  const prompt = `
    Generate ${count} multiple choice questions for a quiz battle.
    Category: ${category}
    Difficulty: ${difficulty}

    Rules:
    1. Return the response ONLY as a JSON array of objects.
    2. Ensure the questions are engaging, accurate, and follow the difficulty level ${difficulty}.
    3. Each object MUST have: question, options (4 strings), correctAnswerIndex (0-3), and explanation.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                minItems: 4,
                maxItems: 4
              },
              correctAnswerIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING }
            },
            required: ["question", "options", "correctAnswerIndex", "explanation"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response text from AI");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating questions:", error);
    return getRandomFallback(category, count);
  }
}

function getRandomFallback(category: string, count: number): Question[] {
  const categoryQuestions = FALLBACK_QUESTIONS[category] || FALLBACK_QUESTIONS["General Knowledge"];
  // Shuffle and return requested count
  return [...categoryQuestions].sort(() => Math.random() - 0.5).slice(0, count);
}
