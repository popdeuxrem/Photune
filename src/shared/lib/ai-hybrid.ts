import { getAiSuggestion } from './api';

export async function hybridTextEdit(text: string, tone: string) {
    try {
        // Primary: Puter.js (Free/Fast)
        return await getAiSuggestion(text, tone);
    } catch (err) {
        // Fallback: Cloudflare Workers AI
        const response = await fetch('/api/ai/workers', {
            method: 'POST',
            body: JSON.stringify({
                task: 'text-gen',
                prompt: { messages: [{ role: 'user', content: `Rewrite this to be ${tone}: ${text}` }] }
            })
        });
        const data = await response.json();
        return data.response;
    }
}
