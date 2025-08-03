import { renderHook, act } from '@testing-library/react';
import { useCurrentUser } from './useCurrentUser';
import type { User } from '../types';
import { beforeEach, describe, expect, it } from 'vitest';

describe('useCurrentUser', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('מחזיר משתמש נוכחי null כאשר אין משתמש שמור', () => {
    const { result } = renderHook(() => useCurrentUser());
    expect(result.current.currentUser).toBeNull();
  });

  it('שומר משתמש חדש ב-localStorage ומחזיר אותו', () => {
    const { result } = renderHook(() => useCurrentUser());
    const user: User = { id: '1', userName: 'testuser' };
    act(() => result.current.setCurrentUser(user));
    expect(result.current.currentUser).toEqual(user);
    expect(JSON.parse(localStorage.getItem('currentUser')!)).toEqual(user);
  });

  it('מוחק משתמש מ-localStorage כאשר שולחים null', () => {
    const { result } = renderHook(() => useCurrentUser());
    const user: User = { id: '2', userName: 'deleteMe' };
    act(() => result.current.setCurrentUser(user));
    act(() => result.current.setCurrentUser(null));
    expect(result.current.currentUser).toBeNull();
    expect(localStorage.getItem('currentUser')).toBeNull();
  });

  it('מאחזר משתמש קיים מ-localStorage בעת יצירת hook', () => {
    const user: User = { id: '3', userName: 'existingUser' };
    localStorage.setItem('currentUser', JSON.stringify(user));
    const { result } = renderHook(() => useCurrentUser());
    expect(result.current.currentUser).toEqual(user);
  });

  it('לא שומר משתמש כאשר נשלח null', () => {
    const { result } = renderHook(() => useCurrentUser());
    act(() => result.current.setCurrentUser(null));
    expect(localStorage.getItem('currentUser')).toBeNull();
  });
});