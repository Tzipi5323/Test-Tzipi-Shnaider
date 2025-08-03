import React, { useState } from 'react';
import { PromptInput, CanvasDraw } from './components';
import Toolbar from './components/Toolbar';
import SaveForm from './components/SaveForm';
import LoadForm from './components/LoadForm';
import UserPanel from './components/UserPanel';
import { decodePrompt } from './api';
import { useDrawingHistory } from './hooks/useDrawingHistory'; // ייבוא ה-hook החדש
import { useCurrentUser } from './hooks/useCurrentUser';

function App() {
  const {
    commands,
    addCommands,
    undo,
    redo,
    clear,
    canUndo,
    canRedo,
    canClear,
  } = useDrawingHistory();

  const { currentUser, setCurrentUser } = useCurrentUser();

  const [drawingName, setDrawingName] = useState('');
  const [drawingId, setDrawingId] = useState('');

  const handlePrompt = async (prompt: string) => {
    try {
      const newCommands = await decodePrompt(prompt);
      addCommands(newCommands);
    } catch {
      alert('שגיאה בפענוח פרומפט');
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 16, direction: 'rtl', fontFamily: 'Heebo, Arial, sans-serif', background: '#f7fafd', borderRadius: 16, boxShadow: '0 4px 24px #1976d210' }}>
      <h2 style={{ textAlign: 'center', color: '#1976d2', marginBottom: 24 }}>ציור בכיף עם AI :)</h2>
      <UserPanel currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <PromptInput onSubmit={handlePrompt} />
      <Toolbar
        onUndo={undo}
        onRedo={redo}
        onClear={clear}
        canUndo={canUndo}
        canRedo={canRedo}
        canClear={canClear}
        loading={false}
      />
      <SaveForm
        drawingName={drawingName}
        setDrawingName={setDrawingName}
        commands={commands}
        currentUser={currentUser}
        onSuccess={id => setDrawingId(id)}
      />
      <LoadForm
        drawingId={drawingId}
        setDrawingId={setDrawingId}
        onLoadSuccess={drawing => {
          setDrawingName(drawing.name || '');
          const parsedCommands = drawing.commands.map(cmd => JSON.parse(cmd.commandJson));
          addCommands(parsedCommands); // השתמש ב-addCommands במקום setCommands
        }}
      />
      <CanvasDraw commands={commands} width={500} height={400} />
    </div>
  );
}

export default App;
