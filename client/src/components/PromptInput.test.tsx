import { render, fireEvent } from '@testing-library/react';
import PromptInput from './PromptInput';
import { describe, expect, it, vi } from 'vitest';

describe('PromptInput', () => {
  it('calls onSubmit with prompt', () => {
    const onSubmit = vi.fn();
    const { getByPlaceholderText, getByTestId } = render(<PromptInput onSubmit={onSubmit} />);
    const input = getByPlaceholderText(/הזן הוראת ציור/i);
    fireEvent.change(input, { target: { value: 'צייר עיגול' } });
    fireEvent.submit(getByTestId('prompt-form'));
    expect(onSubmit).toHaveBeenCalledWith('צייר עיגול');
  });
});