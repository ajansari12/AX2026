import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ExitIntentModal } from './components/UI';
import { ChatWidget } from './components/ChatWidget';
import { SkipLinks } from './components/a11y/SkipLinks';
import { I18nProvider } from './lib/i18n';
import { initMonitoring } from './lib/monitoring';

// Pages
import { Home } from './pages/Home';
import { Services } from './pages/Services';
import { Contact } from './pages/Contact';
import { Work } from './pages/Work';
import { Pricing } from './pages/Pricing';
import { About } from './pages/About';
import { Insights } from './pages/Insights';
import { Resources } from './pages/Resources';
import { Terms, Privacy } from './pages/Legal';
import { NotFound } from './pages/NotFound';
import { Admin } from './pages/Admin';
import { ProposalView } from './pages/ProposalView';

// Client Portal Pages
import { PortalLogin } from './pages/PortalLogin';
import { Portal } from './pages/Portal';
import { PortalDashboard } from './pages/PortalDashboard';
import { PortalProjects } from './pages/PortalProjects';
import { PortalDocuments } from './pages/PortalDocuments';
import { PortalMessages } from './pages/PortalMessages';
import { PortalInvoices } from './pages/PortalInvoices';
import { PortalTraining } from './pages/PortalTraining';

// Initialize monitoring on app load
if (typeof window !== 'undefined') {
  initMonitoring();
}

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <I18nProvider>
      <HashRouter>
        <SkipLinks />
        <ScrollToTop />
        <Routes>
          {/* Public Proposal View - No Layout */}
          <Route path="/proposal/:token" element={<ProposalView />} />

          {/* Client Portal Routes - No Layout wrapper */}
          <Route path="/portal/login" element={<PortalLogin />} />
          <Route path="/portal" element={<Portal />}>
            <Route index element={<PortalDashboard />} />
            <Route path="projects" element={<PortalProjects />} />
            <Route path="projects/:projectId" element={<PortalProjects />} />
            <Route path="documents" element={<PortalDocuments />} />
            <Route path="messages" element={<PortalMessages />} />
            <Route path="invoices" element={<PortalInvoices />} />
            <Route path="training" element={<PortalTraining />} />
          </Route>

          {/* Main Website Routes - With Layout */}
          <Route
            path="*"
            element={
              <Layout>
                <main id="main-content">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/services/:slug" element={<Services />} />

                    <Route path="/work" element={<Work />} />
                    <Route path="/work/:slug" element={<Work />} />

                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/about" element={<About />} />

                    <Route path="/insights" element={<Insights />} />
                    <Route path="/insights/:slug" element={<Insights />} />

                    <Route path="/resources" element={<Resources />} />
                    <Route path="/contact" element={<Contact />} />

                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <ExitIntentModal />
                <ChatWidget />
              </Layout>
            }
          />
        </Routes>
      </HashRouter>
    </I18nProvider>
  );
};

export default App;