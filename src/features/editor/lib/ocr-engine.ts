import { createWorker } from 'tesseract.js';

/**
 * Pre-processes an image for better OCR results.
 * Applies grayscale, contrast enhancement, and thresholding using a hidden canvas.
 */
async function preprocessImage(imageSource: string | File): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      canvas.width = img.width;
      canvas.height = img.height;

      // 1. Draw original
      ctx.drawImage(img, 0, 0);

      // 2. Get image data for manual manipulation
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        // Simple Grayscale
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        
        // Increase Contrast & Thresholding
        // Values < 128 become black, > 128 become white
        const threshold = 120;
        const val = avg < threshold ? 0 : 255;
        
        data[i] = val;     // R
        data[i + 1] = val; // G
        data[i + 2] = val; // B
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    
    if (typeof imageSource === 'string') {
      img.src = imageSource;
    } else {
      img.src = URL.createObjectURL(imageSource);
    }
  });
}

export async function runAdvancedOCR(imageSource: string | File) {
  // Pre-process for Tesseract
  const processedDataUrl = await preprocessImage(imageSource);
  
  const worker = await createWorker('eng', 1, {
    logger: m => console.log(`[OCR]: ${m.status} - ${Math.round(m.progress * 100)}%`),
  });

  try {
    const { data: { blocks } } = await worker.recognize(processedDataUrl);
    
    return blocks?.flatMap(block => 
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
  } finally {
    await worker.terminate();
  }
}
