import React from 'react';

interface LoadFormProps {
  drawingId: string;
  setDrawingId: (id: string) => void;
  onLoad: () => void;
  loading: boolean;
}

const LoadForm: React.FC<LoadFormProps> = ({ drawingId, setDrawingId, onLoad, loading }) => (
  <div style={{ margin: '16px 0', display: 'flex', gap: 12 }}>
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
      onClick={onLoad}
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
);

export default LoadForm;
