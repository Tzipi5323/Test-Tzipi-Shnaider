import { useState } from 'react';
import type { DrawCommand } from '../types';

export function useDrawingHistory(initial: DrawCommand[] = []) {
  const [commands, setCommands] = useState<DrawCommand[]>(initial);
  const [history, setHistory] = useState<DrawCommand[][]>([]);
  const [future, setFuture] = useState<DrawCommand[][]>([]);

  const addCommands = (newCommands: DrawCommand[]) => {
    setHistory([...history, commands]);
    setCommands([...commands, ...newCommands]);
    setFuture([]);
  };

  const undo = () => {
    if (history.length) {
      setFuture([commands, ...future]);
      setCommands(history[history.length - 1]);
      setHistory(history.slice(0, -1));
    }
  };

  const redo = () => {
    if (future.length) {
      setHistory([...history, commands]);
      setCommands(future[0]);
      setFuture(future.slice(1));
    }
  };

  const clear = () => {
    setHistory([...history, commands]);
    setCommands([]);
    setFuture([]);
  };

  return {
    commands,
    addCommands,
    undo,
    redo,
    clear,
    canUndo: !!history.length,
    canRedo: !!future.length,
    canClear: !!commands.length,
  };
}