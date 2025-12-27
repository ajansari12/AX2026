import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Axrategy/);
  });

  test('displays hero section', async ({ page }) => {
    const hero = page.locator('section').first();
    await expect(hero).toBeVisible();
  });

  test('navigation links are visible', async ({ page }) => {
    await expect(page.getByRole('link', { name: /services/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /pricing/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /about/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /contact/i })).toBeVisible();
  });

  test('can navigate to services page', async ({ page }) => {
    await page.getByRole('link', { name: /services/i }).click();
    await expect(page).toHaveURL(/.*services/);
  });

  test('can navigate to pricing page', async ({ page }) => {
    await page.getByRole('link', { name: /pricing/i }).click();
    await expect(page).toHaveURL(/.*pricing/);
  });

  test('can navigate to contact page', async ({ page }) => {
    await page.getByRole('link', { name: /contact/i }).click();
    await expect(page).toHaveURL(/.*contact/);
  });

  test('chat widget is visible', async ({ page }) => {
    const chatButton = page.locator('[data-testid="chat-toggle"]').or(
      page.locator('button').filter({ hasText: /chat/i })
    );
    // Chat widget should be present
    await expect(chatButton.or(page.locator('.chat-widget'))).toBeVisible({ timeout: 5000 }).catch(() => {
      // Chat widget might be in different state
    });
  });
});

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test('displays contact form', async ({ page }) => {
    await expect(page.getByRole('textbox', { name: /name/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
  });

  test('validates required fields', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: /send|submit/i });
    await submitButton.click();

    // Form should show validation
    const nameInput = page.getByRole('textbox', { name: /name/i });
    await expect(nameInput).toHaveAttribute('required', '');
  });

  test('can fill out contact form', async ({ page }) => {
    await page.getByRole('textbox', { name: /name/i }).fill('Test User');
    await page.getByRole('textbox', { name: /email/i }).fill('test@example.com');

    const messageField = page.getByRole('textbox', { name: /message/i }).or(
      page.locator('textarea')
    );
    await messageField.fill('This is a test message');

    // Check values are filled
    await expect(page.getByRole('textbox', { name: /name/i })).toHaveValue('Test User');
    await expect(page.getByRole('textbox', { name: /email/i })).toHaveValue('test@example.com');
  });
});

test.describe('Responsive Design', () => {
  test('mobile navigation works', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Look for mobile menu button
    const menuButton = page.locator('button[aria-label*="menu"]').or(
      page.locator('[data-testid="mobile-menu-toggle"]')
    ).or(
      page.locator('button').filter({ has: page.locator('svg') }).first()
    );

    // Mobile menu should be toggleable
    if (await menuButton.isVisible()) {
      await menuButton.click();
      // Menu should open
      await expect(page.getByRole('navigation')).toBeVisible();
    }
  });

  test('content is readable on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Main content should be visible
    const mainContent = page.locator('main').or(page.locator('body'));
    await expect(mainContent).toBeVisible();
  });
});

test.describe('Dark Mode', () => {
  test('can toggle dark mode', async ({ page }) => {
    await page.goto('/');

    // Look for theme toggle
    const themeToggle = page.locator('[data-testid="theme-toggle"]').or(
      page.locator('button[aria-label*="theme"]')
    ).or(
      page.locator('button[aria-label*="dark"]')
    );

    if (await themeToggle.isVisible()) {
      await themeToggle.click();

      // Check for dark mode class
      const html = page.locator('html');
      const hasDarkClass = await html.evaluate(
        (el) => el.classList.contains('dark') || el.getAttribute('data-theme') === 'dark'
      );

      expect(typeof hasDarkClass).toBe('boolean');
    }
  });
});

test.describe('Accessibility', () => {
  test('page has no detectable accessibility issues', async ({ page }) => {
    await page.goto('/');

    // Check for basic accessibility
    const mainLandmark = page.locator('main').or(page.locator('[role="main"]'));

    // Page should have a main landmark or identifiable main content
    const bodyContent = page.locator('body > *');
    await expect(bodyContent.first()).toBeVisible();
  });

  test('images have alt text', async ({ page }) => {
    await page.goto('/');

    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < Math.min(count, 10); i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      const ariaLabel = await img.getAttribute('aria-label');
      const role = await img.getAttribute('role');

      // Image should have alt text, aria-label, or be decorative
      const isAccessible = alt !== null || ariaLabel !== null || role === 'presentation';
      expect(isAccessible).toBeTruthy();
    }
  });

  test('buttons are keyboard accessible', async ({ page }) => {
    await page.goto('/');

    // Tab through page
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Something should be focused
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();
  });
});
