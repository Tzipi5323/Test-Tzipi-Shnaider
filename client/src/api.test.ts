import { decodePrompt, saveDrawing, loadDrawing } from './api';

global.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  // דימוי fetch לפי הנתיב
  if (typeof input === 'string' && input.includes('/api/Llm/draw')) {
    return {
      ok: true,
      json: async () => [{ type: 'circle', x: 1, y: 2, radius: 3 }],
    } as Response;
  }
  if (typeof input === 'string' && input.includes('/api/Drawings') && init?.method === 'POST') {
    return {
      ok: true,
      json: async () => ({ id: 'drawing123' }),
      text: async () => '',
    } as Response;
  }
  if (typeof input === 'string' && input.includes('/api/Drawings/')) {
    return {
      ok: true,
      json: async () => ({ name: 'test', commands: [{ type: 'rect', x: 1, y: 2, width: 3, height: 4 }] }),
    } as Response;
  }
  return { ok: false, text: async () => 'error' } as Response;
};

describe('api', () => {
  it('decodePrompt returns commands', async () => {
    const res = await decodePrompt('צייר עיגול');
    expect(res[0].type).toBe('circle');
  });

  it('saveDrawing returns id', async () => {
    const res = await saveDrawing({ name: 'test', commands: [], userId: '1' });
    expect(res.id).toBe('drawing123');
  });

  it('loadDrawing returns drawing', async () => {
    const res = await loadDrawing('drawing123');
    expect(res.name).toBe('test');
    expect(res.commands[0].type).toBe('rect');
  });
});