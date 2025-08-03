import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { useDrawingHistory } from './useDrawingHistory';
import type { DrawCommand } from '../types';

describe('useDrawingHistory', () => {
  it('adds commands and supports undo/redo/clear', () => {
    const { result } = renderHook(() => useDrawingHistory());

    const cmd1: DrawCommand = { type: 'circle', x: 10, y: 10, radius: 5 };
    const cmd2: DrawCommand = { type: 'rect', x: 0, y: 0, width: 10, height: 10 };

    act(() => result.current.addCommands([cmd1]));
    expect(result.current.commands).toHaveLength(1);

    act(() => result.current.addCommands([cmd2]));
    expect(result.current.commands).toHaveLength(2);

    act(() => result.current.undo());
    expect(result.current.commands).toHaveLength(1);

    act(() => result.current.redo());
    expect(result.current.commands).toHaveLength(2);

    act(() => result.current.clear());
    expect(result.current.commands).toHaveLength(0);
  });
});