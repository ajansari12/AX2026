import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ExitIntentModal } from './components/UI';
import { ChatWidget } from './components/ChatWidget';
import { SectionErrorBoundary } from './components/ErrorBoundary';
import { SkipLinks } from './components/a11y/SkipLinks';
import { I18nProvider } from './lib/i18n';
import { initMonitoring } from './lib/monitoring';
import { CalBookingModal } from './components/CalBookingModal';
import { useGlobalBookingModal } from './hooks/useGlobalBookingModal';
import { CookieConsentBanner } from './components/CookieConsent';

import { Home } from './pages/Home';

const Services = lazy(() => import('./pages/Services').then(m => ({ default: m.Services })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const Work = lazy(() => import('./pages/Work').then(m => ({ default: m.Work })));
const Pricing = lazy(() => import('./pages/Pricing').then(m => ({ default: m.Pricing })));
const Products = lazy(() => import('./pages/Products').then(m => ({ default: m.Products })));
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
const ForRestaurants = lazy(() => import('./pages/ForRestaurants').then(m => ({ default: m.ForRestaurants })));
const ForHomeServices = lazy(() => import('./pages/ForHomeServices').then(m => ({ default: m.ForHomeServices })));
const ForMedSpas = lazy(() => import('./pages/ForMedSpas').then(m => ({ default: m.ForMedSpas })));
const ForMortgageBrokers = lazy(() => import('./pages/ForMortgageBrokers').then(m => ({ default: m.ForMortgageBrokers })));
const ForAutoRepair = lazy(() => import('./pages/ForAutoRepair').then(m => ({ default: m.ForAutoRepair })));
const ForGyms = lazy(() => import('./pages/ForGyms').then(m => ({ default: m.ForGyms })));

const PortalLogin = lazy(() => import('./pages/PortalLogin').then(m => ({ default: m.PortalLogin })));
const AuthCallback = lazy(() => import('./pages/AuthCallback').then(m => ({ default: m.AuthCallback })));
const SetPassword = lazy(() => import('./pages/SetPassword').then(m => ({ default: m.SetPassword })));
const ResetPassword = lazy(() => import('./pages/ResetPassword').then(m => ({ default: m.ResetPassword })));
const Portal = lazy(() => import('./pages/Portal').then(m => ({ default: m.Portal })));
const PortalDashboard = lazy(() => import('./pages/PortalDashboard').then(m => ({ default: m.PortalDashboard })));
const PortalProjects = lazy(() => import('./pages/PortalProjects').then(m => ({ default: m.PortalProjects })));
const PortalDocuments = lazy(() => import('./pages/PortalDocuments').then(m => ({ default: m.PortalDocuments })));
const PortalMessages = lazy(() => import('./pages/PortalMessages').then(m => ({ default: m.PortalMessages })));
const PortalInvoices = lazy(() => import('./pages/PortalInvoices').then(m => ({ default: m.PortalInvoices })));
const PortalTraining = lazy(() => import('./pages/PortalTraining').then(m => ({ default: m.PortalTraining })));
const PortalReferrals = lazy(() => import('./pages/PortalReferrals').then(m => ({ default: m.PortalReferrals })));
const ROICalculatorPage = lazy(() => import('./pages/ROICalculatorPage').then(m => ({ default: m.ROICalculatorPage })));
const HelpCenter = lazy(() => import('./pages/HelpCenter').then(m => ({ default: m.HelpCenter })));
const BundleDetail = lazy(() => import('./pages/BundleDetail').then(m => ({ default: m.BundleDetail })));
const AISystemsAudit = lazy(() => import('./pages/AISystemsAudit').then(m => ({ default: m.AISystemsAudit })));
const Unsubscribe = lazy(() => import('./pages/Unsubscribe').then(m => ({ default: m.Unsubscribe })));

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
  <div className="min-h-screen bg-white dark:bg-gray-950">
    <div className="h-16 border-b border-gray-100 dark:border-gray-800 px-6 flex items-center justify-between">
      <div className="h-6 w-28 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
      <div className="hidden md:flex gap-6">
        {[1,2,3,4].map(i => <div key={i} className="h-4 w-16 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />)}
      </div>
      <div className="h-9 w-24 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse" />
    </div>
    <div className="max-w-5xl mx-auto px-6 pt-24 pb-12">
      <div className="h-4 w-24 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse mb-8" />
      <div className="h-12 w-2/3 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse mb-4" />
      <div className="h-12 w-1/2 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse mb-8" />
      <div className="h-5 w-full max-w-md bg-gray-100 dark:bg-gray-800 rounded animate-pulse mb-2" />
      <div className="h-5 w-3/4 max-w-md bg-gray-100 dark:bg-gray-800 rounded animate-pulse mb-10" />
      <div className="flex gap-4">
        <div className="h-12 w-36 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
        <div className="h-12 w-28 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse" />
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <I18nProvider>
      <BrowserRouter>
        <SkipLinks />
        <ScrollToTop />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/proposal/:token" element={<ProposalView />} />

            <Route path="/portal/login" element={<PortalLogin />} />
            <Route path="/portal/set-password" element={<SetPassword />} />
            <Route path="/portal/reset-password" element={<ResetPassword />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/portal" element={<Portal />}>
              <Route index element={<PortalDashboard />} />
              <Route path="projects" element={<PortalProjects />} />
              <Route path="projects/:projectId" element={<PortalProjects />} />
              <Route path="documents" element={<PortalDocuments />} />
              <Route path="messages" element={<PortalMessages />} />
              <Route path="invoices" element={<PortalInvoices />} />
              <Route path="training" element={<PortalTraining />} />
              <Route path="referrals" element={<PortalReferrals />} />
            </Route>

            <Route
              path="*"
              element={
                <Layout>
                  <main id="main-content">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/services/ai-workflow-automation" element={<Navigate to="/services/ai-assistants" replace />} />
                      <Route path="/services/no-code-low-code-solutions" element={<Navigate to="/services" replace />} />
                      <Route path="/services" element={<Services />} />
                      <Route path="/services/:slug" element={<Services />} />

                      <Route path="/work" element={<Work />} />
                      <Route path="/work/:slug" element={<Work />} />

                      <Route path="/pricing" element={<Pricing />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/products/bundle/:bundleSlug" element={<BundleDetail />} />
                      <Route path="/products/:slug" element={<Products />} />
                      <Route path="/about" element={<About />} />

                      <Route path="/insights" element={<Insights />} />
                      <Route path="/insights/:slug" element={<Insights />} />

                      <Route path="/resources" element={<Resources />} />
                      <Route path="/contact" element={<Contact />} />

                      <Route path="/terms" element={<Terms />} />
                      <Route path="/privacy" element={<Privacy />} />
                      <Route path="/admin" element={<Admin />} />
                      <Route path="/roi-calculator" element={<ROICalculatorPage />} />
                      <Route path="/help" element={<HelpCenter />} />
                      <Route path="/ai-audit" element={<AISystemsAudit />} />
                      <Route path="/unsubscribe" element={<Unsubscribe />} />

                      <Route path="/for-dentists" element={<ForDentists />} />
                      <Route path="/for-lawyers" element={<ForLawyers />} />
                      <Route path="/for-contractors" element={<ForContractors />} />
                      <Route path="/for-real-estate-agents" element={<ForRealEstateAgents />} />
                      <Route path="/for-accountants" element={<ForAccountants />} />
                      <Route path="/for-chiropractors" element={<ForChiropractors />} />
                      <Route path="/for-insurance-agents" element={<ForInsuranceAgents />} />
                      <Route path="/for-financial-advisors" element={<ForFinancialAdvisors />} />
                      <Route path="/for-veterinarians" element={<ForVeterinarians />} />
                      <Route path="/for-restaurants" element={<ForRestaurants />} />
                      <Route path="/for-home-services" element={<ForHomeServices />} />
                      <Route path="/for-med-spas" element={<ForMedSpas />} />
                      <Route path="/for-mortgage-brokers" element={<ForMortgageBrokers />} />
                      <Route path="/for-auto-repair" element={<ForAutoRepair />} />
                      <Route path="/for-gyms" element={<ForGyms />} />

                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  <SectionErrorBoundary section="promotions">
                    <ExitIntentModal />
                  </SectionErrorBoundary>
                  <SectionErrorBoundary section="chat">
                    <ChatWidget />
                  </SectionErrorBoundary>
                </Layout>
              }
            />
          </Routes>
          <GlobalBookingModal />
          <CookieConsentBanner />
        </Suspense>
      </BrowserRouter>
    </I18nProvider>
  );
};

export default App;