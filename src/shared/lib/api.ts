declare const puter: any;

export async function getAiSuggestion(text: string, tone: string = 'professional'): Promise<string> {
    try {
        const prompt = `Rewrite this text to be ${tone}. Return ONLY the rewritten text: "${text}"`;
        const response = await puter.ai.chat(prompt);
        return response.toString().trim();
    } catch (error) {
        console.error("Puter AI Error:", error);
        throw new Error("AI Rewrite failed.");
    }
}
