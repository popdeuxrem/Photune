import { fabric } from 'fabric';

export const applyFilter = (canvas: fabric.Canvas, type: string, value: any) => {
  const bg = canvas.backgroundImage as fabric.Image;
  if (!bg) return;

  if (!bg.filters) bg.filters = [];

  // Remove existing filter of same type
  const filterMap: Record<string, any> = {
    brightness: fabric.Image.filters.Brightness,
    contrast: fabric.Image.filters.Contrast,
    blur: fabric.Image.filters.Blur,
    grayscale: fabric.Image.filters.Grayscale,
    pixelate: fabric.Image.filters.Pixelate,
  };

  const FilterClass = filterMap[type];
  if (!FilterClass) return;

  // Find existing
  const existingIdx = bg.filters.findIndex(f => f instanceof FilterClass);
  
  if (value === false || value === 0) {
    if (existingIdx > -1) bg.filters.splice(existingIdx, 1);
  } else {
    const filterInstance = new FilterClass(type === 'blur' ? { blur: value } : { [type]: value });
    if (existingIdx > -1) {
      bg.filters[existingIdx] = filterInstance;
    } else {
      bg.filters.push(filterInstance);
    }
  }

  bg.applyFilters();
  canvas.requestRenderAll();
};
