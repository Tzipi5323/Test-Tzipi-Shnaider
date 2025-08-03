import React, { useState } from 'react';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
}

const PromptInput: React.FC<PromptInputProps> = ({ onSubmit }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt);
      setPrompt('');
    }
  };

  return (
    <form
      data-testid="prompt-form"
      style={{ display: 'flex', gap: 12, margin: '16px 0' }}
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
        placeholder="הזן הוראת ציור (למשל: צייר שמש)"
        style={{
          flex: 1,
          padding: '10px 14px',
          border: '1.5px solid #bdbdbd',
          borderRadius: 8,
          fontSize: 18,
          outline: 'none',
          transition: 'border 0.2s',
        }}
        onFocus={e => (e.currentTarget.style.border = '1.5px solid #1976d2')}
        onBlur={e => (e.currentTarget.style.border = '1.5px solid #bdbdbd')}
      />
      <button
        type="submit"
        style={{
          background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '10px 24px',
          fontSize: 18,
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 2px 8px #1976d220',
          transition: 'background 0.2s',
        }}
        onMouseOver={e => (e.currentTarget.style.background = 'linear-gradient(90deg, #1565c0 0%, #1976d2 100%)')}
        onMouseOut={e => (e.currentTarget.style.background = 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)')}
      >
        🎨 צייר
      </button>
    </form>
  );
};

export default PromptInput;
