import type { DrawCommand } from './types';

// פענוח פרומפט ע"י LLM
export async function decodePrompt(prompt: string): Promise<DrawCommand[]> {
  const res = await fetch('http://localhost:5042/api/Llm/draw', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt })
  });
  if (!res.ok) throw new Error('שגיאה בפענוח פרומפט');
  return res.json();
}

// שמירת ציור
export async function saveDrawing(drawing: { name: string; commands: DrawCommand[]; userId?: string }): Promise<any> {
  const res = await fetch('http://localhost:5042/api/Drawings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(drawing)
  });
  if (!res.ok) {
    // קרא את גוף התגובה (response body) וזרוק אותו לשגיאה
    let errorText = await res.text();
    console.error('שגיאה בשמירת הציור:', errorText);
    throw new Error(`שגיאה בשמירת הציור: ${errorText}`);
  }
  return res.json();
}

// טעינת ציור לפי מזהה
export async function loadDrawing(id: string): Promise<{ commands: DrawCommand[]; name: string }> {
  const res = await fetch(`http://localhost:5042/api/Drawings/${id}`);
  if (!res.ok) throw new Error('שגיאה בטעינת הציור');
  return res.json();
}

