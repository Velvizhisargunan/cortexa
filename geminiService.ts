
import { GoogleGenAI } from "@google/genai";
import { CortexaOutput, UserMood } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const detectMoodFromImage = async (base64Image: string): Promise<UserMood> => {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Analyze this user's facial expression and posture. 
    Determine their current cognitive/emotional state for studying.
    Return ONLY one of these exact words: Focused, Neutral, Tired, Overwhelmed, Stressed.
    Do not provide any other text.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image
            }
          }
        ]
      },
    });

    const moodStr = response.text?.trim() || "Neutral";
    const validMoods = Object.values(UserMood);
    
    // Validate if the returned string matches our Enum
    const detectedMood = validMoods.find(m => m.toLowerCase() === moodStr.toLowerCase()) as UserMood;
    return detectedMood || UserMood.NEUTRAL;
  } catch (error) {
    console.error("Mood detection error:", error);
    return UserMood.NEUTRAL;
  }
};

export const distillContent = async (pageText: string, mood: UserMood): Promise<CortexaOutput> => {
  const model = "gemini-3-flash-preview";

  const systemInstruction = `
    You are Cortexa, an emotion-aware AI study assistant. 
    The user is currently feeling ${mood}. 
    Your goal is to reduce cognitive load and improve focus.

    STRICT RULES:
    - Do NOT explain your reasoning.
    - Do NOT include markdown blocks.
    - Output must be structured exactly as requested.
    - Summary must be max 6 bullet points.
    - Hide elements must be valid CSS selectors only.
    - CSS must be standard CSS rules only.
  `;

  const prompt = `
    SYSTEM ROLE: Cortexa
    OBJECTIVE: Distill content, identify distractions, generate cleanup CSS.

    OUTPUT FORMAT:
    SUMMARY:
    - (bullet 1)
    - (bullet 2)
    - (bullet 3)
    - (bullet 4)
    - (bullet 5)
    - (bullet 6)

    HIDE_ELEMENTS:
    (one selector per line)

    CSS:
    (valid CSS only)

    INPUT CONTENT:
    ${pageText}
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.3,
      },
    });

    const text = response.text || "";
    return parseCortexaOutput(text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to process content. Please try again.");
  }
};

const parseCortexaOutput = (text: string): CortexaOutput => {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l !== '');
  
  const output: CortexaOutput = {
    summary: [],
    hideElements: [],
    css: ""
  };

  let currentSection: 'NONE' | 'SUMMARY' | 'HIDE' | 'CSS' = 'NONE';

  for (const line of lines) {
    if (line.startsWith('SUMMARY:')) {
      currentSection = 'SUMMARY';
      continue;
    } else if (line.startsWith('HIDE_ELEMENTS:')) {
      currentSection = 'HIDE';
      continue;
    } else if (line.startsWith('CSS:')) {
      currentSection = 'CSS';
      continue;
    }

    if (currentSection === 'SUMMARY' && line.startsWith('-')) {
      output.summary.push(line.replace('-', '').trim());
    } else if (currentSection === 'HIDE') {
      output.hideElements.push(line);
    } else if (currentSection === 'CSS') {
      output.css += line + '\n';
    }
  }

  if (output.summary.length === 0) output.summary = ["No clear summary found. Check content length."];
  return output;
};
