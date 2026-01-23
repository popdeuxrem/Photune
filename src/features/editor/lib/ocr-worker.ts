import { createWorker } from 'tesseract.js';

export async function runOCR(imageSource: string | File) {
  const worker = await createWorker('eng');
  const { data: { blocks } } = await worker.recognize(imageSource);
  
  const results = blocks?.flatMap(block => 
    block.paragraphs.flatMap(para => 
      para.lines.map(line => ({
        text: line.text.trim(),
        left: line.bbox.x1,
        top: line.bbox.y1,
        width: line.bbox.x2 - line.bbox.x1,
        height: line.bbox.y2 - line.bbox.y1,
        fontSize: Math.round((line.bbox.y2 - line.bbox.y1) * 0.8)
      }))
    )
  );

  await worker.terminate();
  return results || [];
}
