import React from 'react';
import { Section } from '../components/UI';

export const Terms: React.FC = () => (
  <Section className="pt-32">
    <div className="max-w-3xl mx-auto prose prose-lg dark:prose-invert">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Terms of Service</h1>
      <p className="text-xl text-gray-500 mb-12">Last updated: January 1, 2026</p>
      
      <div className="space-y-12 text-gray-600 dark:text-gray-300">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Services</h3>
          <p>Axrategy provides digital consultancy, web development, and automation services. Specific deliverables, timelines, and costs are defined in individual statements of work (SOW) agreed upon by both parties.</p>
        </div>
        
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Intellectual Property</h3>
          <p>Upon full payment of all fees, Axrategy assigns to the Client all right, title, and interest in the custom deliverables created for the project. Axrategy retains the right to use the work for portfolio and marketing purposes unless a non-disclosure agreement (NDA) is signed.</p>
        </div>
        
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Payment Terms</h3>
          <p>Unless otherwise agreed, a 50% deposit is required to commence work, with the remaining balance due upon project completion or launch. Invoices are due within 15 days of receipt.</p>
        </div>
        
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Limitation of Liability</h3>
          <p>Axrategy shall not be liable for any indirect, incidental, or consequential damages arising out of the use of our services or deliverables. Our total liability is limited to the fees paid for the specific service.</p>
        </div>
      </div>
    </div>
  </Section>
);

export const Privacy: React.FC = () => (
  <Section className="pt-32">
    <div className="max-w-3xl mx-auto prose prose-lg dark:prose-invert">
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Privacy Policy</h1>
      <p className="text-xl text-gray-500 mb-12">Last updated: January 1, 2026</p>
      
      <div className="space-y-12 text-gray-600 dark:text-gray-300">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Information We Collect</h3>
          <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. This typically includes Name, Email, and Business details submitted via our contact forms.</p>
        </div>
        
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. How We Use Information</h3>
          <p>We use the information to contact you regarding your inquiry, provide services, and improve our website experience. We do not share any personally identifying information publicly or with third-parties, except when required to by law.</p>
        </div>
        
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Cookies</h3>
          <p>We use cookies to analyse website traffic and optimize your website experience. By accepting our use of cookies, your data will be aggregated with all other user data.</p>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Data Security</h3>
          <p>We take commercially reasonable steps to protect your data from loss, theft, and unauthorized access. However, no method of transmission over the internet is 100% secure.</p>
        </div>
      </div>
    </div>
  </Section>
);