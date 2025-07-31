import React, { useState } from 'react';
import { loadDrawing } from '../api';

interface LoadFormProps {
  drawingId: string;
  setDrawingId: (id: string) => void;
  onLoadSuccess: (drawing: { name: string; commands: any[] }) => void;
}

const LoadForm: React.FC<LoadFormProps> = ({
  drawingId,
  setDrawingId,
  onLoadSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoad = async () => {
    if (!drawingId.trim()) {
      setError('יש להזין מזהה ציור');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await loadDrawing(drawingId);
      onLoadSuccess(res);
      setError('הציור נטען בהצלחה!');
      setTimeout(() => setError(null), 2500); // ייעלם אחרי 2.5 שניות
    } catch (err: any) {
      setError(err.message || 'שגיאה בטעינה');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ margin: '16px 0', display: 'flex', gap: 12, flexDirection: 'column' }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <input
          type="text"
          placeholder="מזהה ציור לטעינה"
          value={drawingId}
          onChange={e => setDrawingId(e.target.value)}
          style={{
            flex: 1,
            padding: '10px 14px',
            border: '1.5px solid #bdbdbd',
            borderRadius: 8,
            fontSize: 16,
            outline: 'none',
            transition: 'border 0.2s',
          }}
          disabled={loading}
        />
        <button
          onClick={handleLoad}
          disabled={loading}
          style={{
            background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '10px 24px',
            fontSize: 16,
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 1px 4px #1976d220',
            transition: 'background 0.2s',
          }}
        >📂 טען ציור</button>
      </div>
      {loading && <span style={{ color: '#1976d2' }}>⏳ טוען...</span>}
      {error && (
        <span style={{ color: error.includes('הצלחה') ? 'green' : 'red' }}>{error}</span>
      )}
    </div>
  );
};

export default LoadForm;
