declare const puter: any;

const FONT_MAP: Record<string, string> = {
  'sans-serif': 'Montserrat',
  'serif': 'Playfair Display',
  'monospaced': 'Courier Prime',
  'handwriting': 'Lobster'
};

export async function matchFontFromCrop(dataUrl: string): Promise<string> {
  try {
    const category = await puter.ai.chat(`Categorize font in image: serif, sans-serif, monospaced, handwriting. Respond only with the word.`, dataUrl);
    const key = category.toString().toLowerCase().trim();
    return FONT_MAP[key] || 'Arial';
  } catch {
    return 'Arial';
  }
}
