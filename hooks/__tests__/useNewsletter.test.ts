import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useNewsletter } from '../useNewsletter';

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      upsert: vi.fn(),
    })),
  },
}));

import { supabase } from '../../lib/supabase';

describe('useNewsletter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns initial state', () => {
    const { result } = renderHook(() => useNewsletter());

    expect(result.current.isSubmitting).toBe(false);
    expect(typeof result.current.subscribe).toBe('function');
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
    expect(mockUpsert).toHaveBeenCalledWith(
      {
        email: 'test@example.com',
        source: 'footer',
        is_active: true,
      },
      {
        onConflict: 'email',
        ignoreDuplicates: false,
      }
    );
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

    // Should be submitting immediately after call
    expect(result.current.isSubmitting).toBe(true);

    // Wait for completion
    await waitFor(() => {
      expect(result.current.isSubmitting).toBe(false);
    });
  });
});
