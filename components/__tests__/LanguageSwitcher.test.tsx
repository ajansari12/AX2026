import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '../../src/test/utils';
import { LanguageSwitcher } from '../LanguageSwitcher';
import { I18nProvider } from '../../lib/i18n';

// Wrap component with provider for testing
const renderWithProvider = (ui: React.ReactElement) => {
  return render(
    <I18nProvider>
      {ui}
    </I18nProvider>
  );
};

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders default variant with both languages', () => {
    renderWithProvider(<LanguageSwitcher />);

    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Français')).toBeInTheDocument();
  });

  it('renders minimal variant with language codes', () => {
    renderWithProvider(<LanguageSwitcher variant="minimal" />);

    expect(screen.getByText('EN')).toBeInTheDocument();
    expect(screen.getByText('FR')).toBeInTheDocument();
  });

  it('changes language when clicked', () => {
    renderWithProvider(<LanguageSwitcher variant="minimal" />);

    const frButton = screen.getByText('FR');
    fireEvent.click(frButton);

    // Check that localStorage was updated
    expect(localStorage.setItem).toHaveBeenCalledWith('axrategy_locale', 'fr');
  });

  it('renders dropdown variant', () => {
    renderWithProvider(<LanguageSwitcher variant="dropdown" />);

    // Should show current language in button
    expect(screen.getByText(/English/)).toBeInTheDocument();
  });

  it('opens dropdown on click', () => {
    renderWithProvider(<LanguageSwitcher variant="dropdown" />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Both options should be visible
    expect(screen.getAllByText('English').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Français')).toBeInTheDocument();
  });
});
