import React, { useEffect, lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ExitIntentModal } from './components/UI';
import { ChatWidget } from './components/ChatWidget';
import { SkipLinks } from './components/a11y/SkipLinks';
import { I18nProvider } from './lib/i18n';
import { initMonitoring } from './lib/monitoring';
import { CalBookingModal } from './components/CalBookingModal';
import { useGlobalBookingModal } from './hooks/useGlobalBookingModal';

import { Home } from './pages/Home';

const Services = lazy(() => import('./pages/Services').then(m => ({ default: m.Services })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const Work = lazy(() => import('./pages/Work').then(m => ({ default: m.Work })));
const Pricing = lazy(() => import('./pages/Pricing').then(m => ({ default: m.Pricing })));
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const Insights = lazy(() => import('./pages/Insights').then(m => ({ default: m.Insights })));
const Resources = lazy(() => import('./pages/Resources').then(m => ({ default: m.Resources })));
const Terms = lazy(() => import('./pages/Legal').then(m => ({ default: m.Terms })));
const Privacy = lazy(() => import('./pages/Legal').then(m => ({ default: m.Privacy })));
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));
const Admin = lazy(() => import('./pages/Admin').then(m => ({ default: m.Admin })));
const ProposalView = lazy(() => import('./pages/ProposalView').then(m => ({ default: m.ProposalView })));

const ForDentists = lazy(() => import('./pages/ForDentists').then(m => ({ default: m.ForDentists })));
const ForLawyers = lazy(() => import('./pages/ForLawyers').then(m => ({ default: m.ForLawyers })));
const ForContractors = lazy(() => import('./pages/ForContractors').then(m => ({ default: m.ForContractors })));
const ForRealEstateAgents = lazy(() => import('./pages/ForRealEstateAgents').then(m => ({ default: m.ForRealEstateAgents })));
const ForAccountants = lazy(() => import('./pages/ForAccountants').then(m => ({ default: m.ForAccountants })));
const ForChiropractors = lazy(() => import('./pages/ForChiropractors').then(m => ({ default: m.ForChiropractors })));
const ForInsuranceAgents = lazy(() => import('./pages/ForInsuranceAgents').then(m => ({ default: m.ForInsuranceAgents })));
const ForFinancialAdvisors = lazy(() => import('./pages/ForFinancialAdvisors').then(m => ({ default: m.ForFinancialAdvisors })));
const ForVeterinarians = lazy(() => import('./pages/ForVeterinarians').then(m => ({ default: m.ForVeterinarians })));

const PortalLogin = lazy(() => import('./pages/PortalLogin').then(m => ({ default: m.PortalLogin })));
const AuthCallback = lazy(() => import('./pages/AuthCallback').then(m => ({ default: m.AuthCallback })));
const Portal = lazy(() => import('./pages/Portal').then(m => ({ default: m.Portal })));
const PortalDashboard = lazy(() => import('./pages/PortalDashboard').then(m => ({ default: m.PortalDashboard })));
const PortalProjects = lazy(() => import('./pages/PortalProjects').then(m => ({ default: m.PortalProjects })));
const PortalDocuments = lazy(() => import('./pages/PortalDocuments').then(m => ({ default: m.PortalDocuments })));
const PortalMessages = lazy(() => import('./pages/PortalMessages').then(m => ({ default: m.PortalMessages })));
const PortalInvoices = lazy(() => import('./pages/PortalInvoices').then(m => ({ default: m.PortalInvoices })));
const PortalTraining = lazy(() => import('./pages/PortalTraining').then(m => ({ default: m.PortalTraining })));

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

// Global booking modal wrapper component
const GlobalBookingModal: React.FC = () => {
  const bookingModal = useGlobalBookingModal();
  return (
    <CalBookingModal
      isOpen={bookingModal.isOpen}
      onClose={bookingModal.close}
      serviceInterest={bookingModal.serviceInterest}
    />
  );
};

const LoadingFallback: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-pulse text-gray-500">Loading...</div>
  </div>
);

const App: React.FC = () => {
  return (
    <I18nProvider>
      <HashRouter>
        <SkipLinks />
        <ScrollToTop />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/proposal/:token" element={<ProposalView />} />

            <Route path="/portal/login" element={<PortalLogin />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/portal" element={<Portal />}>
              <Route index element={<PortalDashboard />} />
              <Route path="projects" element={<PortalProjects />} />
              <Route path="projects/:projectId" element={<PortalProjects />} />
              <Route path="documents" element={<PortalDocuments />} />
              <Route path="messages" element={<PortalMessages />} />
              <Route path="invoices" element={<PortalInvoices />} />
              <Route path="training" element={<PortalTraining />} />
            </Route>

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

                      <Route path="/for-dentists" element={<ForDentists />} />
                      <Route path="/for-lawyers" element={<ForLawyers />} />
                      <Route path="/for-contractors" element={<ForContractors />} />
                      <Route path="/for-real-estate-agents" element={<ForRealEstateAgents />} />
                      <Route path="/for-accountants" element={<ForAccountants />} />
                      <Route path="/for-chiropractors" element={<ForChiropractors />} />
                      <Route path="/for-insurance-agents" element={<ForInsuranceAgents />} />
                      <Route path="/for-financial-advisors" element={<ForFinancialAdvisors />} />
                      <Route path="/for-veterinarians" element={<ForVeterinarians />} />

                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  <ExitIntentModal />
                  <ChatWidget />
                </Layout>
              }
            />
          </Routes>
          <GlobalBookingModal />
        </Suspense>
      </HashRouter>
    </I18nProvider>
  );
};

export default App;