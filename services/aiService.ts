
import { GoogleGenAI } from "@google/genai";
import { GameState } from "../types";

export class AIService {
  private ai: GoogleGenAI;

  constructor() {
    // Correctly initialize with a named parameter using process.env.API_KEY directly
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async getEncouragement(state: GameState): Promise<string> {
    try {
      const prompt = `
        You are an enthusiastic game commentator for a color swiping game called ChromaSwipe.
        Current Stats:
        - Score: ${state.score}
        - Current Streak: ${state.streak}
        - Best Streak: ${state.bestStreak}
        
        Write a very short, punchy, and encouraging comment (max 10 words) to motivate the player. 
        Use a playful and high-energy tone. If they have a high streak, mention their focus.
        If they just started, welcome them.
      `;

      // Use the recommended model for basic text tasks
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      // Directly access the .text property as it is a getter returning a string
      return response.text?.trim() || "Keep swiping, you're doing great!";
    } catch (error) {
      console.error("AI Error:", error);
      return "Focus on the colors! You got this!";
    }
  }
}

export const aiService = new AIService();
