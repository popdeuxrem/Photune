declare const puter: any;

/**
 * Resilient AI Client for phoTextAI
 * Primary: Puter.js (Zero Latency / Free)
 * Fallback: Cloudflare Workers AI (Edge / Free Tier)
 */
export const AiClient = {
  /**
   * Rewrites text based on a specific tone
   */
  async rewrite(text: string, tone: string = 'professional'): Promise<string> {
    const prompt = `Rewrite this text to be ${tone}. Return ONLY the rewritten text, no quotes: "${text}"`;
    
    try {
      if (typeof puter !== 'undefined') {
        const response = await puter.ai.chat(prompt);
        return response.toString().trim();
      }
      throw new Error("Puter not available");
    } catch (err) {
      console.warn("Falling back to Cloudflare for Rewrite...");
      const res = await fetch('/api/ai/workers', {
        method: 'POST',
        body: JSON.stringify({ 
          task: 'text-gen', 
          prompt: { messages: [{ role: 'user', content: prompt }] } 
        })
      });
      const data = await res.json();
      return data.response || text;
    }
  },

  /**
   * Generates a caption/description for an image
   */
  async caption(imageUrl: string): Promise<string> {
    const prompt = "Describe this image in one concise sentence for a project title.";
    try {
      if (typeof puter !== 'undefined') {
        const res = await puter.ai.chat(prompt, imageUrl);
        return res.toString();
      }
      throw new Error("Puter not available");
    } catch {
      return "AI Generated Project";
    }
  },

  /**
   * Identifies the category of font in a cropped image
   */
  async detectFont(cropDataUrl: string): Promise<string> {
    const prompt = "Categorize the font in this image: serif, sans-serif, monospaced, or handwriting. Respond with ONLY one word.";
    try {
      if (typeof puter !== 'undefined') {
        const category = await puter.ai.chat(prompt, cropDataUrl);
        return category.toString().toLowerCase().trim();
      }
      return 'sans-serif';
    } catch {
      return 'sans-serif';
    }
  }
};
