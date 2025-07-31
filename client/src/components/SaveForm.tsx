import React, { useState } from 'react';
import { saveDrawing } from '../api';
import type { DrawCommand } from '../types';

interface SaveFormProps {
  drawingName: string;
  setDrawingName: (name: string) => void;
  commands: DrawCommand[];
  currentUser: { id: string } | null;
  onSuccess: (drawingId: string) => void;
}

const SaveForm: React.FC<SaveFormProps> = ({
  drawingName,
  setDrawingName,
  commands,
  currentUser,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  const handleSave = async () => {
    if (!drawingName.trim()) {
      setError('יש להזין שם לציור');
      return;
    }
    if (!currentUser) {
      setError('יש להתחבר קודם');
      return;
    }
    setLoading(true);
    setError(null);
    setSavedId(null);
    try {
      const commandsForServer = commands.map(cmd => ({
        commandJson: JSON.stringify(cmd),
      }));
      const res = await saveDrawing({
        name: drawingName,
        userId: currentUser.id,
        commands: commandsForServer,
      });
      onSuccess(res.id || '');
      setSavedId(res.id || null); // שמור את ה-ID שהתקבל
      setError('הציור נשמר בהצלחה!');
      setTimeout(() => {
        setError(null);
        setSavedId(null); // ייעלם אחרי 2.5 שניות
      }, 2500);
    } catch (err: any) {
      setError(err.message || 'שגיאה בשמירה');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ margin: '16px 0', display: 'flex', gap: 12, flexDirection: 'column' }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <input
          type="text"
          placeholder="שם ציור לשמירה"
          value={drawingName}
          onChange={e => setDrawingName(e.target.value)}
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
          onClick={handleSave}
          disabled={!commands.length || loading}
          style={{
            background: 'linear-gradient(90deg, #388e3c 0%, #66bb6a 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '10px 24px',
            fontSize: 16,
            fontWeight: 600,
            cursor: !commands.length || loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 1px 4px #388e3c20',
            transition: 'background 0.2s',
          }}
        >💾 שמור ציור</button>
      </div>
      {loading && <span style={{ color: '#1976d2' }}>⏳ שומר...</span>}
      {error && (
        <span style={{ color: error.includes('הצלחה') ? 'green' : 'red' }}>{error}</span>
      )}
      {savedId && (
        <span style={{ color: '#1976d2', direction: 'ltr' }}>
          מזהה הציור שלך: <b>{savedId}</b>
        </span>
      )}
    </div>
  );
};

export default SaveForm;
