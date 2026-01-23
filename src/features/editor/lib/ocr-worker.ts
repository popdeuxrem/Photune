import { createWorker } from 'tesseract.js';

export type OCRResult = {
  text: string;
  left: number;
  top: number;
  width: number;
  height: number;
  fontSize: number;
};

export async function runOCR(imageSource: string | File): Promise<OCRResult[]> {
  const worker = await createWorker('eng');
  
  const { data: { blocks } } = await worker.recognize(imageSource);
  
  const results: OCRResult[] = [];

  blocks?.forEach(block => {
    block.paragraphs.forEach(para => {
      para.lines.forEach(line => {
        const bbox = line.bbox;
        // Basic heuristic for font size based on line height
        const fontSize = Math.round((bbox.y2 - bbox.y1) * 0.8);
        
        results.push({
          text: line.text.trim(),
          left: bbox.x1,
          top: bbox.y1,
          width: bbox.x2 - bbox.x1,
          height: bbox.y2 - bbox.y1,
          fontSize: fontSize > 0 ? fontSize : 16
        });
      });
    });
  });

  await worker.terminate();
  return results;
}
