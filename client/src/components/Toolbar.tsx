import React from 'react';

interface ToolbarProps {
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  canUndo: boolean;
  canRedo: boolean;
  canClear: boolean;
  loading: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({ onUndo, onRedo, onClear, canUndo, canRedo, canClear, loading }) => (
  <div style={{ margin: '16px 0', display: 'flex', gap: 12, justifyContent: 'center' }}>
    <button
      onClick={onUndo}
      disabled={!canUndo || loading}
      style={{
        background: '#fff',
        color: '#1976d2',
        border: '1.5px solid #1976d2',
        borderRadius: 8,
        padding: '10px 18px',
        fontSize: 16,
        fontWeight: 600,
        cursor: !canUndo || loading ? 'not-allowed' : 'pointer',
        transition: 'background 0.2s',
        boxShadow: '0 1px 4px #1976d210',
      }}
    >↩️ בטל</button>
    <button
      onClick={onRedo}
      disabled={!canRedo || loading}
      style={{
        background: '#fff',
        color: '#1976d2',
        border: '1.5px solid #1976d2',
        borderRadius: 8,
        padding: '10px 18px',
        fontSize: 16,
        fontWeight: 600,
        cursor: !canRedo || loading ? 'not-allowed' : 'pointer',
        transition: 'background 0.2s',
        boxShadow: '0 1px 4px #1976d210',
      }}
    >↪️ בצע שוב</button>
    <button
      onClick={onClear}
      disabled={!canClear || loading}
      style={{
        background: 'linear-gradient(90deg, #e53935 0%, #ff7043 100%)',
        color: '#fff',
        border: 'none',
        borderRadius: 8,
        padding: '10px 18px',
        fontSize: 16,
        fontWeight: 600,
        cursor: !canClear || loading ? 'not-allowed' : 'pointer',
        boxShadow: '0 1px 4px #e5393520',
        transition: 'background 0.2s',
      }}
    >🧹 נקה</button>
  </div>
);

export default Toolbar;
