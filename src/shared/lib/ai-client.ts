import { PhotuneAI, type Tone } from '@/shared/lib/ai/photune-ai';

export const AiClient = {
  async rewrite(text: string, tone: Tone = 'professional'): Promise<string> {
    return PhotuneAI.rewrite(text, tone);
  },

  async detectFont(cropDataUrl: string): Promise<string> {
    const suggestion = await PhotuneAI.detectFont(cropDataUrl);
    return suggestion.family;
  },

  async caption(imageUrl: string): Promise<string> {
    return PhotuneAI.generateProjectTitle(imageUrl);
  },

  async generateBackground(prompt: string): Promise<Blob> {
    return PhotuneAI.generateBackground(prompt);
  },
};
