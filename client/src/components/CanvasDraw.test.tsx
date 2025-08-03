import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import CanvasDraw from './CanvasDraw';
import type { DrawCommand } from '../types';

describe('CanvasDraw', () => {
  it('renders canvas', () => {
    const commands: DrawCommand[] = [{ type: 'circle', x: 10, y: 10, radius: 5 }];
    const { container } = render(<CanvasDraw commands={commands} />);
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });
});