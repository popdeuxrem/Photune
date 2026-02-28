/**
 * Photune AI Client
 * Uses Groq for fast LLM tasks, Cloudflare for image tasks
 */

const GROQ_API_URL = '/api/ai/groq';

const FONT_MAP: Record<string, string> = {
  'sans-serif': 'Inter',
  'serif': 'Playfair Display',
  'monospaced': 'JetBrains Mono',
  'handwriting': 'Dancing Script'
};

export const PhotuneAI = {
  /**
   * Rewrite text with tone-awareness using Groq
   */
  async rewrite(text: string, tone: string = 'professional'): Promise<string> {
    const toneDescriptions: Record<string, string> = {
      professional: 'professional, polished, business-appropriate',
      casual: 'casual, friendly, conversational',
      marketing: 'bold, attention-grabbing, persuasive marketing copy',
      concise: 'short, punchy, direct'
    };

    const prompt = `Rewrite this text to be ${toneDescriptions[tone] || 'professional}. 
Return ONLY the rewritten text, no quotes, no explanation, no meta information.

Original: "${text}"

Rewritten:`;

    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) throw new Error('Groq API error');

      const data = await response.json();
      return data.choices?.[0]?.message?.content?.trim() || text;
    } catch (error) {
      console.error('AI rewrite failed:', error);
      throw error;
    }
  },

  /**
   * Detect font category from image crop using Groq Vision
   */
  async detectFont(imageDataUrl: string): Promise<string> {
    const prompt = `Analyze this font image and categorize it as one of: serif, sans-serif, monospaced, or handwriting.
Respond with ONLY one word.`;

    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama-3.2-11b-vision-preview',
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: prompt },
                { type: 'image_url', image_url: { url: imageDataUrl } }
              ]
            }
          ],
          max_tokens: 50
        })
      });

      if (!response.ok) throw new Error('Groq Vision error');

      const data = await response.json();
      const category = data.choices?.[0]?.message?.content?.toLowerCase()?.trim() || 'sans-serif';
      return FONT_MAP[category] || 'Inter';
    } catch (error) {
      console.error('Font detection failed:', error);
      return 'Inter'; // Fallback
    }
  },

  /**
   * Generate image caption using Groq Vision
   */
  async caption(imageDataUrl: string): Promise<string> {
    const prompt = `Give this image a short, creative 3-word title. Respond with ONLY the title, no quotes.`;

    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama-3.2-11b-vision-preview',
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: prompt },
                { type: 'image_url', image_url: { url: imageDataUrl } }
              ]
            }
          ],
          max_tokens: 50
        })
      });

      if (!response.ok) throw new Error('Groq Vision error');

      const data = await response.json();
      return data.choices?.[0]?.message?.content?.replace(/"/g, '')?.trim() || 'Untitled';
    } catch (error) {
      console.error('Caption failed:', error);
      return 'Untitled Design';
    }
  },

  /**
   * Generate background from text prompt
   */
  async generateBackground(prompt: string): Promise<Blob> {
    // For now, delegate to Cloudflare SDXL (could swap to Groq later)
    const response = await fetch('/api/ai/workers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: 'image-gen', prompt })
    });

    if (!response.ok) throw new Error('Image generation failed');
    return response.blob();
  }
};
