declare const puter: any;

/**
 * Handles AI requests using Puter.js (Free Tier)
 * Includes fallbacks to internal API routes (Cloudflare)
 */
export const AiClient = {
  async rewrite(text: string, tone: string = 'professional'): Promise<string> {
    const prompt = `Rewrite this text to be ${tone}. Return ONLY the rewritten text, no quotes or meta: "${text}"`;
    
    try {
      if (typeof puter !== 'undefined') {
        const response = await puter.ai.chat(prompt);
        return response.toString().trim();
      }
      throw new Error("Puter not loaded");
    } catch (err) {
      console.warn("Puter failed, falling back to edge worker...");
      const res = await fetch('/api/ai/workers', {
        method: 'POST',
        body: JSON.stringify({ task: 'text-gen', prompt: { messages: [{ role: 'user', content: prompt }] } })
      });
      const data = await res.json();
      return data.response || text;
    }
  },

  async caption(imageUrl: string): Promise<string> {
    try {
      if (typeof puter !== 'undefined') {
        const res = await puter.ai.chat("Describe this image in one concise sentence.", imageUrl);
        return res.toString();
      }
      return "AI Image";
    } catch {
      return "Photext Project";
    }
  }
};
