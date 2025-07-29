import { useState } from 'react';
import { PromptInput, CanvasDraw } from './components';
import Toolbar from './components/Toolbar';
import SaveForm from './components/SaveForm';
import LoadForm from './components/LoadForm';
import Notification from './components/Notification';
import type { DrawCommand } from './types';
import { decodePrompt as decodePromptApi, saveDrawing, loadDrawing } from './api';

function App() {
  const [commands, setCommands] = useState<DrawCommand[]>([]);
  const [history, setHistory] = useState<DrawCommand[][]>([]);
  const [future, setFuture] = useState<DrawCommand[][]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drawingName, setDrawingName] = useState('');
  const [drawingId, setDrawingId] = useState('');
  // שמירת ציור
  const handleSave = async () => {
    if (!drawingName.trim()) {
      setError('יש להזין שם לציור');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await saveDrawing({ name: drawingName, commands });
      setDrawingId(res.id || '');
      setError('הציור נשמר בהצלחה!');
    } catch (err: any) {
      setError(err.message || 'שגיאה בשמירה');
    } finally {
      setLoading(false);
    }
  };

  // טעינת ציור
  const handleLoad = async () => {
    if (!drawingId.trim()) {
      setError('יש להזין מזהה ציור');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await loadDrawing(drawingId);
      setCommands(res.commands);
      setDrawingName(res.name || '');
      setError('הציור נטען בהצלחה!');
    } catch (err: any) {
      setError(err.message || 'שגיאה בטעינה');
    } finally {
      setLoading(false);
    }
  };

  const handlePrompt = async (prompt: string) => {
    setLoading(true);
    setError(null);
    try {
      const newCommands = await decodePromptApi(prompt);
      if (newCommands.length) {
        setHistory([...history, commands]);
        setCommands([...commands, ...newCommands]);
        setFuture([]);
      } else {
        setError('לא התקבלו פקודות ציור מהשרת');
      }
    } catch (err: any) {
      setError(err.message || 'שגיאה לא ידועה');
    } finally {
      setLoading(false);
    }
  };

  const handleUndo = () => {
    if (history.length) {
      setFuture([commands, ...future]);
      setCommands(history[history.length - 1]);
      setHistory(history.slice(0, -1));
    }
  };

  const handleRedo = () => {
    if (future.length) {
      setHistory([...history, commands]);
      setCommands(future[0]);
      setFuture(future.slice(1));
    }
  };

  const handleClear = () => {
    setHistory([...history, commands]);
    setCommands([]);
    setFuture([]);
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 16, direction: 'rtl', fontFamily: 'Heebo, Arial, sans-serif', background: '#f7fafd', borderRadius: 16, boxShadow: '0 4px 24px #1976d210' }}>
      <h2 style={{ textAlign: 'center', color: '#1976d2', marginBottom: 24 }}>ציור בכיף עם AI :)</h2>
      <PromptInput onSubmit={handlePrompt} />
      <Toolbar
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClear={handleClear}
        canUndo={!!history.length}
        canRedo={!!future.length}
        canClear={!!commands.length}
        loading={loading}
      />
      <SaveForm
        drawingName={drawingName}
        setDrawingName={setDrawingName}
        onSave={handleSave}
        canSave={!!commands.length}
        loading={loading}
      />
      <LoadForm
        drawingId={drawingId}
        setDrawingId={setDrawingId}
        onLoad={handleLoad}
        loading={loading}
      />
      {loading && (
        <div style={{ textAlign: 'center', margin: '16px 0' }}>
          <span style={{ fontSize: 22, color: '#1976d2' }}>⏳</span>
          <span style={{ marginRight: 8 }}>טוען...</span>
        </div>
      )}
      {error && (
        <Notification
          message={error}
          type={error.includes('הצלחה') ? 'success' : 'error'}
        />
      )}
      <CanvasDraw commands={commands} width={500} height={400} />
    </div>
  );
}

export default App;
