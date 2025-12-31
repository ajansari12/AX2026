import React from 'react';
import { Section } from '../components/UI';
import { SEO } from '../components/SEO';

const currentYear = new Date().getFullYear();

export const Terms: React.FC = () => (
  <>
    <SEO
      title="Terms of Service"
      description="Terms of Service for Axrategy digital consultancy, web development, and automation services. Learn about our service agreement, payment terms, and policies."
    />
    <Section className="pt-32">
      <div className="max-w-3xl mx-auto prose prose-lg dark:prose-invert">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Terms of Service</h1>
        <p className="text-xl text-gray-500 mb-12">Last updated: December 30, {currentYear}</p>

        <div className="space-y-12 text-gray-600 dark:text-gray-300">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Services</h3>
            <p>Axrategy provides digital consultancy, web development, AI automation, and related technology services. Specific deliverables, timelines, and costs are defined in individual statements of work (SOW) agreed upon by both parties prior to project commencement.</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Intellectual Property</h3>
            <p>Upon full payment of all fees, Axrategy assigns to the Client all right, title, and interest in the custom deliverables created for the project. Axrategy retains the right to use the work for portfolio and marketing purposes unless a non-disclosure agreement (NDA) is signed.</p>
            <p className="mt-4">Third-party software, libraries, and tools integrated into deliverables remain subject to their respective licenses. Axrategy will provide documentation of any third-party components used.</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Payment Terms</h3>
            <p>Unless otherwise agreed in writing:</p>
            <ul className="list-disc pl-6 mt-4 space-y-2">
              <li>A 50% deposit is required to commence work</li>
              <li>The remaining balance is due upon project completion or launch</li>
              <li>Invoices are due within 15 days of receipt</li>
              <li>Late payments may incur a 1.5% monthly interest charge</li>
            </ul>
            <p className="mt-4">For monthly service agreements, payment is due on the 1st of each month. Failed payments may result in service suspension after a 7-day grace period.</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Refunds and Cancellations</h3>
            <p><strong>Project-Based Work:</strong> The initial deposit is non-refundable once work has commenced. If you cancel a project mid-way, you will be billed for work completed to date at our standard hourly rate ($150 CAD/hour), with any remaining deposit balance refunded.</p>
            <p className="mt-4"><strong>Monthly Services:</strong> You may cancel monthly services with 30 days written notice. No refunds are provided for partial months. Upon cancellation, we will provide all necessary credentials and documentation for you to maintain your systems independently.</p>
            <p className="mt-4"><strong>Satisfaction Guarantee:</strong> If you are unsatisfied with deliverables, notify us within 14 days of delivery. We will work with you to address concerns. If we cannot reach a satisfactory resolution, we will refund the portion of fees attributable to the disputed work.</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Limitation of Liability</h3>
            <p>Axrategy shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of the use of our services or deliverables. Our total liability is limited to the fees paid for the specific service giving rise to the claim.</p>
            <p className="mt-4">We are not responsible for any damages or losses resulting from third-party services, hosting providers, or integrations, even if we recommended or implemented them.</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Warranties and Disclaimers</h3>
            <p>Axrategy warrants that all services will be performed in a professional manner consistent with industry standards. We do not guarantee specific business outcomes, revenue increases, or lead generation results.</p>
            <p className="mt-4">EXCEPT AS EXPRESSLY PROVIDED HEREIN, ALL SERVICES ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Governing Law</h3>
            <p>These Terms shall be governed by and construed in accordance with the laws of the Province of Ontario, Canada, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in Toronto, Ontario.</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. Dispute Resolution</h3>
            <p>Before initiating any legal action, both parties agree to attempt to resolve disputes through good-faith negotiation. If negotiation fails, disputes shall be submitted to binding arbitration administered by ADR Chambers in Toronto, Ontario, in accordance with its Commercial Arbitration Rules.</p>
            <p className="mt-4">The arbitrator's decision shall be final and binding. Each party shall bear its own costs, with arbitration fees split equally unless the arbitrator determines otherwise.</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">9. Modifications to Terms</h3>
            <p>Axrategy reserves the right to modify these Terms at any time. Material changes will be communicated via email to active clients at least 30 days before taking effect. Continued use of our services after modifications constitutes acceptance of the updated Terms.</p>
            <p className="mt-4">For project-based agreements, the Terms in effect at the time of signing the SOW shall govern that engagement.</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">10. Confidentiality</h3>
            <p>Both parties agree to maintain the confidentiality of proprietary information shared during the engagement. This obligation survives termination of the agreement for a period of two (2) years.</p>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h3>
            <p>For questions about these Terms of Service, please contact us at:</p>
            <p className="mt-2">
              <strong>Email:</strong> legal@axrategy.com<br />
              <strong>General Inquiries:</strong> hello@axrategy.com
            </p>
          </div>
        </div>
      </div>
    </Section>
  </>
);

export const Privacy: React.FC = () => (
  <>
    <SEO
      title="Privacy Policy"
      description="Privacy Policy for Axrategy. Learn how we collect, use, and protect your personal information. GDPR, CCPA, and PIPEDA compliant."
    />
    <Section className="pt-32">
      <div className="max-w-3xl mx-auto prose prose-lg dark:prose-invert">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Privacy Policy</h1>
        <p className="text-xl text-gray-500 mb-12">Last updated: December 30, {currentYear}</p>

        <div className="space-y-12 text-gray-600 dark:text-gray-300">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Information We Collect</h3>
            <p>We only collect personal information when necessary to provide services. Information is collected by fair and lawful means, with your knowledge and consent.</p>
            <p className="mt-4"><strong>Information you provide directly:</strong></p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Name and contact information (email, phone number)</li>
              <li>Business name and details</li>
              <li>Project requirements and preferences</li>
              <li>Payment information (processed securely by Stripe)</li>
            </ul>
            <p className="mt-4"><strong>Information collected automatically:</strong></p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>IP address and approximate location</li>
              <li>Browser type and device information</li>
              <li>Pages visited and time spent on site</li>
              <li>Referring website</li>
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. How We Use Information</h3>
            <p>We use collected information to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Respond to your inquiries and provide requested services</li>
              <li>Process payments and send invoices</li>
              <li>Improve our website and services</li>
              <li>Send occasional updates about our services (with your consent)</li>
              <li>Comply with legal obligations</li>
            </ul>
            <p className="mt-4">We do not share personally identifying information with third parties except when required by law or with your explicit consent.</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Data Retention</h3>
            <p>We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li><strong>Client records:</strong> 7 years after the last transaction (for tax and legal purposes)</li>
              <li><strong>Contact form submissions:</strong> 2 years, or until you request deletion</li>
              <li><strong>Analytics data:</strong> 26 months (anonymized)</li>
              <li><strong>Email marketing:</strong> Until you unsubscribe</li>
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Cookies and Tracking</h3>
            <p>We use cookies to analyze website traffic and optimize your experience. Types of cookies we use:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li><strong>Essential cookies:</strong> Required for website functionality</li>
              <li><strong>Analytics cookies:</strong> Help us understand how visitors use our site</li>
              <li><strong>Preference cookies:</strong> Remember your settings (e.g., dark mode)</li>
            </ul>
            <p className="mt-4">You can manage cookie preferences through your browser settings. Disabling certain cookies may affect website functionality.</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Third-Party Services</h3>
            <p>We use the following third-party services that may collect data:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li><strong>Supabase:</strong> Database and authentication (data stored in North America)</li>
              <li><strong>Stripe:</strong> Payment processing (PCI-DSS compliant)</li>
              <li><strong>Cloudflare:</strong> Security and performance</li>
              <li><strong>Cal.com:</strong> Appointment scheduling</li>
            </ul>
            <p className="mt-4">Each service has its own privacy policy governing data use.</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Data Security</h3>
            <p>We take commercially reasonable steps to protect your data:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>All data transmitted via HTTPS encryption</li>
              <li>Secure password hashing and authentication</li>
              <li>Regular security audits and updates</li>
              <li>Limited employee access to personal data</li>
            </ul>
            <p className="mt-4">No method of transmission over the internet is 100% secure. We cannot guarantee absolute security but will notify affected users promptly in the event of a data breach.</p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Your Rights Under PIPEDA (Canada)</h3>
            <p>Under Canada's Personal Information Protection and Electronic Documents Act (PIPEDA), you have the right to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Access your personal information held by us</li>
              <li>Request correction of inaccurate information</li>
              <li>Withdraw consent for data collection (subject to legal limitations)</li>
              <li>File a complaint with the Privacy Commissioner of Canada</li>
            </ul>
            <p className="mt-4">To exercise these rights, contact us at privacy@axrategy.com. We will respond within 30 days.</p>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">8. Your Rights Under GDPR (European Union)</h3>
            <p>If you are a resident of the European Economic Area (EEA), you have additional rights:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
              <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your data ("right to be forgotten")</li>
              <li><strong>Right to Restrict Processing:</strong> Limit how we use your data</li>
              <li><strong>Right to Data Portability:</strong> Receive your data in a structured format</li>
              <li><strong>Right to Object:</strong> Object to processing for marketing purposes</li>
            </ul>
            <p className="mt-4"><strong>Legal Basis for Processing:</strong> We process data based on contract performance, legitimate interests, and/or your consent.</p>
            <p className="mt-2">To exercise GDPR rights, contact privacy@axrategy.com. We will respond within 30 days. You may also lodge a complaint with your local supervisory authority.</p>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">9. Your Rights Under CCPA (California)</h3>
            <p>If you are a California resident, the California Consumer Privacy Act (CCPA) provides you with specific rights:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li><strong>Right to Know:</strong> Request disclosure of personal information collected, used, and shared</li>
              <li><strong>Right to Delete:</strong> Request deletion of your personal information</li>
              <li><strong>Right to Opt-Out:</strong> Opt out of the sale of personal information (we do not sell personal data)</li>
              <li><strong>Right to Non-Discrimination:</strong> Equal service regardless of exercising privacy rights</li>
            </ul>
            <p className="mt-4">To exercise these rights, contact privacy@axrategy.com or call +1-647-607-3046. We will verify your identity before processing requests. We will respond within 45 days.</p>
            <p className="mt-2"><strong>We do not sell personal information.</strong> We do not discriminate against users who exercise their privacy rights.</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">10. International Data Transfers</h3>
            <p>Your data may be transferred to and processed in countries other than your own, including Canada and the United States. We ensure appropriate safeguards are in place, including:</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Standard contractual clauses approved by relevant authorities</li>
              <li>Working only with service providers who maintain adequate data protection</li>
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">11. Children's Privacy</h3>
            <p>Our services are not directed to individuals under 16 years of age. We do not knowingly collect personal information from children. If we become aware that we have collected data from a child, we will delete it promptly.</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">12. Changes to This Policy</h3>
            <p>We may update this Privacy Policy from time to time. Material changes will be communicated via email or a prominent notice on our website at least 30 days before taking effect. Continued use of our services after changes constitutes acceptance of the updated policy.</p>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h3>
            <p>For privacy-related questions or to exercise your rights, contact us at:</p>
            <p className="mt-2">
              <strong>Privacy Inquiries:</strong> privacy@axrategy.com<br />
              <strong>General Inquiries:</strong> hello@axrategy.com<br />
              <strong>Phone:</strong> +1-647-607-3046
            </p>
            <p className="mt-4 text-sm text-gray-500">
              Axrategy Inc.<br />
              Toronto, Ontario, Canada
            </p>
          </div>
        </div>
      </div>
    </Section>
  </>
);
