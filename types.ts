
export enum UserMood {
  NEUTRAL = 'Neutral',
  STRESSED = 'Stressed',
  FOCUSED = 'Focused',
  TIRED = 'Tired',
  OVERWHELMED = 'Overwhelmed'
}

export interface CortexaOutput {
  summary: string[];
  hideElements: string[];
  css: string;
}

export interface StudySessionState {
  pageText: string;
  mood: UserMood;
  isProcessing: boolean;
  result: CortexaOutput | null;
  error: string | null;
}
