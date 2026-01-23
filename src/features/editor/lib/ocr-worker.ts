import { createWorker } from 'tesseract.js';

/**
 * Executes OCR on the provided image source.
 * In Tesseract.js v5, the Bbox properties are x0, y0, x1, y1.
 */
export async function runOCR(imageSource: string | File) {
  const worker = await createWorker('eng');
  
  try {
    const { data: { blocks } } = await worker.recognize(imageSource);
    
    const results = blocks?.flatMap(block => 
      block.paragraphs.flatMap(para => 
        para.lines.map(line => {
          const { x0, y0, x1, y1 } = line.bbox;
          return {
            text: line.text.trim(),
            left: x0,
            top: y0,
            width: x1 - x0,
            height: y1 - y0,
            fontSize: Math.round((y1 - y0) * 0.8)
          };
        })
      )
    );

    return results || [];
  } finally {
    // Ensure worker is terminated to free up memory
    await worker.terminate();
  }
}
