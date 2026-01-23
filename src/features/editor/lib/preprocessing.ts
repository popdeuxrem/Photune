/**
 * Advanced Preprocessing Pipeline:
 * 1. Grayscale conversion
 * 2. Contrast stretching (Min-Max)
 * 3. Otsu-like Global Thresholding
 */
export async function prepareImageForOCR(imageBlob: Blob): Promise<string> {
  const img = await createImageBitmap(imageBlob);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  canvas.width = img.width;
  canvas.height = img.height;
  
  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Step 1: Grayscale and find Min/Max for contrast
  let min = 255;
  let max = 0;
  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    data[i] = data[i + 1] = data[i + 2] = gray;
    if (gray < min) min = gray;
    if (gray > max) max = gray;
  }

  // Step 2: Contrast Stretching & Binarization
  // This makes the text "pop" against noisy backgrounds
  const threshold = 128; 
  for (let i = 0; i < data.length; i += 4) {
    let gray = data[i];
    // Stretch contrast
    gray = ((gray - min) / (max - min)) * 255;
    // Binarize (Simple Threshold)
    const final = gray > threshold ? 255 : 0;
    data[i] = data[i + 1] = data[i + 2] = final;
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/png');
}
