declare const puter: any;

const FONT_MAP: Record<string, string> = {
  'sans-serif': 'Inter',
  'serif': 'Playfair Display',
  'monospaced': 'JetBrains Mono',
  'handwriting': 'Dancing Script'
};

export const AiClient = {
  /**
   * Rewrites text with tone-awareness and fallback
   */
  async rewrite(text: string, tone: string = 'professional'): Promise<string> {
    const prompt = `Rewrite this text to be ${tone}. Return ONLY the rewritten text, no quotes or meta info: "${text}"`;
    
    try {
      if (typeof puter !== 'undefined') {
        const response = await puter.ai.chat(prompt);
        return response.toString().trim().replace(/^"|"$/g, '');
      }
      throw new Error("Puter not available");
    } catch (err) {
      const res = await fetch('/api/ai/workers', {
        method: 'POST',
        body: JSON.stringify({ task: 'text-gen', prompt: { messages: [{ role: 'user', content: prompt }] } })
      });
      const data = await res.json();
      return data.response || text;
    }
  },

  /**
   * Identifies font category and maps to a Google Font
   */
  async detectFont(cropDataUrl: string): Promise<string> {
    const prompt = "Categorize the font in this image: serif, sans-serif, monospaced, or handwriting. Respond with ONLY one word.";
    try {
      let category = 'sans-serif';
      if (typeof puter !== 'undefined') {
        const res = await puter.ai.chat(prompt, cropDataUrl);
        category = res.toString().toLowerCase().trim();
      }
      return FONT_MAP[category] || 'Inter';
    } catch {
      return 'Inter';
    }
  },

  /**
   * Generates project titles based on image content
   */
  async caption(imageUrl: string): Promise<string> {
    try {
      if (typeof puter !== 'undefined') {
        const res = await puter.ai.chat("Give this image a short, creative 3-word title.", imageUrl);
        return res.toString().replace(/"/g, '');
      }
      return "Untitled Design";
    } catch {
      return "My Design";
    }
  }
};
