import React, { useState } from 'react';
import { PromptInput, CanvasDraw } from './components';
import Toolbar from './components/Toolbar';
import SaveForm from './components/SaveForm';
import LoadForm from './components/LoadForm';
import UserPanel from './components/UserPanel';
import { decodePrompt } from './api';
import type { DrawCommand } from './types';
import type { User } from './types';

function App() {
  const [commands, setCommands] = useState<DrawCommand[]>([]);
  const [history, setHistory] = useState<DrawCommand[][]>([]);
  const [future, setFuture] = useState<DrawCommand[][]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [drawingName, setDrawingName] = useState('');
  const [drawingId, setDrawingId] = useState('');

  const handlePrompt = async (prompt: string) => {
    try {
      const newCommands = await decodePrompt(prompt);
      setHistory([...history, commands]);
      setCommands([...commands, ...newCommands]); // מוסיף במקום להחליף
      setFuture([]);
    } catch (err) {
      alert('שגיאה בפענוח פרומפט');
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
      <UserPanel currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <PromptInput onSubmit={handlePrompt} />
      <Toolbar
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClear={handleClear}
        canUndo={!!history.length}
        canRedo={!!future.length}
        canClear={!!commands.length}
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
          // המרה: כל פקודה -> JSON.parse(commandJson)
          const parsedCommands = drawing.commands.map(cmd => JSON.parse(cmd.commandJson));
          setCommands(parsedCommands);
        }}
      />
      <CanvasDraw commands={commands} width={500} height={400} />
    </div>
  );
}

export default App;
