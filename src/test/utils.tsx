import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { I18nProvider } from '../../lib/i18n';

interface WrapperProps {
  children: React.ReactNode;
}

// Custom wrapper that includes all providers
const AllProviders: React.FC<WrapperProps> = ({ children }) => {
  return (
    <MemoryRouter>
      <I18nProvider>
        {children}
      </I18nProvider>
    </MemoryRouter>
  );
};

// Custom render function that includes providers
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Helper to create mock data
export const createMockLead = (overrides = {}) => ({
  id: 'test-lead-id',
  name: 'Test User',
  email: 'test@example.com',
  phone: '+1234567890',
  service_interest: 'ai_assistant',
  pricing_preference: 'growth',
  message: 'Test message',
  source: 'website',
  status: 'new',
  score: 50,
  pipeline_stage: 'new',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

export const createMockBooking = (overrides = {}) => ({
  id: 'test-booking-id',
  name: 'Test User',
  email: 'test@example.com',
  scheduled_time: new Date().toISOString(),
  notes: 'Test notes',
  status: 'confirmed',
  created_at: new Date().toISOString(),
  ...overrides,
});

export const createMockBlogPost = (overrides = {}) => ({
  id: 'test-post-id',
  slug: 'test-post',
  title: 'Test Blog Post',
  excerpt: 'This is a test excerpt',
  content: '<p>Test content</p>',
  category: 'Technology',
  read_time: '5 min read',
  published_date: new Date().toISOString(),
  image_url: 'https://example.com/image.jpg',
  featured: false,
  status: 'published',
  author: {
    id: 'author-id',
    name: 'Test Author',
    role: 'Writer',
    avatar_url: 'https://example.com/avatar.jpg',
  },
  ...overrides,
});

// Wait helper for async operations
export const waitFor = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock fetch helper
export const mockFetch = (response: any, ok = true) => {
  return vi.spyOn(global, 'fetch').mockResolvedValue({
    ok,
    json: () => Promise.resolve(response),
    text: () => Promise.resolve(JSON.stringify(response)),
  } as Response);
};
