/**
 * Puter.js Free AI Integration
 * Injected via <script> in layout.tsx
 */
declare const puter: any;

export async function getAiSuggestion(text: string, tone: string = 'professional'): Promise<string> {
    try {
        const prompt = `Rewrite this text to be ${tone}. Return ONLY the rewritten text: "${text}"`;
        const response = await puter.ai.chat(prompt);
        return response.toString().trim();
    } catch (error) {
        console.error("Puter AI Error:", error);
        throw new Error("AI Rewrite failed. Ensure Puter.js is loaded.");
    }
}

export async function getVisualCaption(imageElement: HTMLImageElement): Promise<string> {
    try {
        // Convert image to base64 for Puter
        const canvas = document.createElement('canvas');
        canvas.width = imageElement.width;
        canvas.height = imageElement.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(imageElement, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');

        const response = await puter.ai.chat("Describe this image in one sentence.", dataUrl);
        return response.toString().trim();
    } catch (error) {
        console.error("Puter Vision Error:", error);
        return "Failed to generate caption.";
    }
}
