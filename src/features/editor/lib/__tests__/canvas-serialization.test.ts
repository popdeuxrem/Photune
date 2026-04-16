import {
  normalizeCanvasPayload,
  tryNormalizeCanvasPayload,
  serializeCanvasPayload,
  serializeCanvasSnapshot,
} from '../canvas-serialization';

describe('canvas serialization utilities', () => {
  test('normalizeCanvasPayload accepts string and object and sets default version', () => {
    const inputObj = { objects: [{ type: 'rect' }] };
    const normalized = normalizeCanvasPayload(inputObj);
    expect(normalized.version).toBe('unknown');
    expect(Array.isArray(normalized.objects)).toBe(true);
  });

  test('tryNormalizeCanvasPayload returns error for invalid JSON string', () => {
    const res = tryNormalizeCanvasPayload('{ invalid json');
    expect(res.ok).toBe(false);
    expect(typeof res.error).toBe('string');
  });

  test('serializeCanvasPayload and snapshot roundtrip', () => {
    const mockCanvas = {
      toJSON: () => ({ version: '1.2.3', objects: [{ type: 'text', text: 'hello', photuneId: 'p1' }] }),
    } as any;

    const payload = serializeCanvasPayload(mockCanvas);
    expect(payload.version).toBe('1.2.3');
    expect(payload.objects.length).toBe(1);

    const snapshot = serializeCanvasSnapshot(mockCanvas);
    expect(typeof snapshot).toBe('string');

    const parsed = JSON.parse(snapshot);
    expect(parsed.version).toBe('1.2.3');
  });
});
