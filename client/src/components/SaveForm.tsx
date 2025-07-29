import React from 'react';
import type { DrawCommand } from '../types';

interface SaveFormProps {
  drawingName: string;
  setDrawingName: (name: string) => void;
  onSave: () => void;
  canSave: boolean;
  loading: boolean;
}

const SaveForm: React.FC<SaveFormProps> = ({ drawingName, setDrawingName, onSave, canSave, loading }) => (
  <div style={{ margin: '16px 0', display: 'flex', gap: 12 }}>
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
      onClick={onSave}
      disabled={!canSave || loading}
      style={{
        background: 'linear-gradient(90deg, #388e3c 0%, #66bb6a 100%)',
        color: '#fff',
        border: 'none',
        borderRadius: 8,
        padding: '10px 24px',
        fontSize: 16,
        fontWeight: 600,
        cursor: !canSave || loading ? 'not-allowed' : 'pointer',
        boxShadow: '0 1px 4px #388e3c20',
        transition: 'background 0.2s',
      }}
    >💾 שמור ציור</button>
  </div>
);

export default SaveForm;
