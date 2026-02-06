import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useNewsletter } from '../useNewsletter';

vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      upsert: vi.fn(),
    })),
  },
}));

vi.mock('../../lib/spamProtection', () => ({
  performSpamCheck: vi.fn(() => ({ isSpam: false })),
  incrementRateLimit: vi.fn(),
  checkRateLimit: vi.fn(() => ({ allowed: true, remaining: 5, resetIn: 3600000 })),
}));

import { supabase } from '../../lib/supabase';

describe('useNewsletter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns initial state', () => {
    const { result } = renderHook(() => useNewsletter());

    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.subscribe).toBe('function');
    expect(typeof result.current.reset).toBe('function');
  });

  it('successfully subscribes an email', async () => {
    const mockUpsert = vi.fn().mockResolvedValue({ error: null });
    (supabase.from as any).mockReturnValue({ upsert: mockUpsert });

    const { result } = renderHook(() => useNewsletter());

    let response: { success: boolean; error?: string } | undefined;

    await act(async () => {
      response = await result.current.subscribe('test@example.com', 'footer');
    });

    expect(response?.success).toBe(true);
    expect(result.current.isSuccess).toBe(true);
    expect(mockUpsert).toHaveBeenCalled();
  });

  it('handles subscription error', async () => {
    const mockError = { message: 'Database error' };
    const mockUpsert = vi.fn().mockResolvedValue({ error: mockError });
    (supabase.from as any).mockReturnValue({ upsert: mockUpsert });

    const { result } = renderHook(() => useNewsletter());

    let response: { success: boolean; error?: string } | undefined;

    await act(async () => {
      response = await result.current.subscribe('test@example.com', 'footer');
    });

    expect(response?.success).toBe(false);
    expect(response?.error).toBe('Database error');
    expect(result.current.error).toBe('Database error');
  });

  it('sets isSubmitting during subscription', async () => {
    const mockUpsert = vi.fn().mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ error: null }), 100))
    );
    (supabase.from as any).mockReturnValue({ upsert: mockUpsert });

    const { result } = renderHook(() => useNewsletter());

    expect(result.current.isSubmitting).toBe(false);

    act(() => {
      result.current.subscribe('test@example.com', 'footer');
    });

    expect(result.current.isSubmitting).toBe(true);
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSubmitting).toBe(false);
    });
  });

  it('resets state correctly', async () => {
    const mockUpsert = vi.fn().mockResolvedValue({ error: null });
    (supabase.from as any).mockReturnValue({ upsert: mockUpsert });

    const { result } = renderHook(() => useNewsletter());

    await act(async () => {
      await result.current.subscribe('test@example.com');
    });

    expect(result.current.isSuccess).toBe(true);

    act(() => {
      result.current.reset();
    });

    expect(result.current.isSuccess).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
