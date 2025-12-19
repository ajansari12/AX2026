import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ExitIntentModal } from './components/UI';
import { ChatWidget } from './components/ChatWidget';

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

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <ScrollToTop />
      <Layout>
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
      </Layout>
      <ExitIntentModal />
      <ChatWidget />
    </HashRouter>
  );
};

export default App;