import { createWorker } from 'tesseract.js';

export async function runAdvancedOCR(imageSource: string | File) {
  const worker = await createWorker('eng', 1);
  
  // Create a hidden processing canvas
  const processCanvas = document.createElement('canvas');
  const ctx = processCanvas.getContext('2d')!;

  return new Promise<any[]>(async (resolve) => {
    const img = new Image();
    img.onload = async () => {
      processCanvas.width = img.width;
      processCanvas.height = img.height;
      
      // 1. Grayscale & Contrast Stretch
      ctx.filter = 'grayscale(1) contrast(1.5) brightness(1.1)';
      ctx.drawImage(img, 0, 0);
      
      const processedUrl = processCanvas.toDataURL('image/png');
      
      const { data: { blocks } } = await worker.recognize(processedUrl);
      
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
      ) || [];

      await worker.terminate();
      resolve(results);
    };
    img.src = typeof imageSource === 'string' ? imageSource : URL.createObjectURL(imageSource);
  });
}
