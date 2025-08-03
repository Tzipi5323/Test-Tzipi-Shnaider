import { render, fireEvent } from '@testing-library/react';
import Toolbar from './Toolbar';
import { vi } from 'vitest';

describe('Toolbar', () => {
  it('calls onUndo/onRedo/onClear', () => {
    const onUndo = vi.fn();
    const onRedo = vi.fn();
    const onClear = vi.fn();
    const { getByText } = render(
      <Toolbar
        onUndo={onUndo}
        onRedo={onRedo}
        onClear={onClear}
        canUndo={true}
        canRedo={true}
        canClear={true}
        loading={false}
      />
    );
    fireEvent.click(getByText(/בטל/));
    fireEvent.click(getByText(/בצע שוב/));
    fireEvent.click(getByText(/נקה/));
    expect(onUndo).toHaveBeenCalled();
    expect(onRedo).toHaveBeenCalled();
    expect(onClear).toHaveBeenCalled();
  });
});