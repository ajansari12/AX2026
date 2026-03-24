import React, { useState, useCallback } from 'react';
import { Section, Container, FadeIn } from '../components/UI';
import { SEO } from '../components/SEO';
import { CalBookingModal, useBookingModal } from '../components/CalBookingModal';
import { supabase } from '../lib/supabase';
import { Zap, Clock, DollarSign, TrendingUp, Check, ArrowRight, Calendar, CircleCheck as CheckCircle, Loader as Loader2, TriangleAlert as AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const INDUSTRY_DATA: Record<string, { hoursSaved: number; hourlyValue: number; leadValue: number; label: string }> = {
  dental: { hoursSaved: 16, hourlyValue: 250, leadValue: 800, label: 'Dental Practice' },
  legal: { hoursSaved: 12, hourlyValue: 350, leadValue: 2500, label: 'Law Firm / Legal' },
  accounting: { hoursSaved: 9, hourlyValue: 175, leadValue: 600, label: 'Accounting / Bookkeeping' },
  contractor: { hoursSaved: 14, hourlyValue: 150, leadValue: 3500, label: 'Contractor / Trades' },
  real_estate: { hoursSaved: 16, hourlyValue: 200, leadValue: 8000, label: 'Real Estate' },
  insurance: { hoursSaved: 10, hourlyValue: 175, leadValue: 1200, label: 'Insurance Agency' },
  financial: { hoursSaved: 10, hourlyValue: 225, leadValue: 3000, label: 'Financial Advisory' },
  chiropractic: { hoursSaved: 12, hourlyValue: 175, leadValue: 400, label: 'Chiropractic / Physio' },
  veterinary: { hoursSaved: 12, hourlyValue: 200, leadValue: 300, label: 'Veterinary Clinic' },
  other: { hoursSaved: 10, hourlyValue: 150, leadValue: 500, label: 'Other Professional Services' },
  restaurant: { hoursSaved: 18, hourlyValue: 150, leadValue: 200, label: 'Restaurant' },
  home_services: { hoursSaved: 14, hourlyValue: 120, leadValue: 2800, label: 'Home Services (HVAC / Plumbing)' },
  med_spa: { hoursSaved: 15, hourlyValue: 250, leadValue: 600, label: 'Med Spa / Aesthetics' },
  mortgage_broker: { hoursSaved: 11, hourlyValue: 200, leadValue: 4000, label: 'Mortgage Broker' },
  auto_repair: { hoursSaved: 12, hourlyValue: 140, leadValue: 900, label: 'Auto Repair Shop' },
  gym: { hoursSaved: 13, hourlyValue: 120, leadValue: 150, label: 'Gym / Fitness Studio' },
};

const TEAM_MULTIPLIER: Record<string, number> = {
  solo: 0.6, '2-5': 0.8, '6-20': 1.0, '21-50': 1.3, '50+': 1.5,
};

const LEAD_VOLUME_MAP: Record<string, number> = {
  'under_10': 7, '10-25': 17, '25-50': 37, '50-100': 75, '100+': 120,
};

function calculateScore(data: AuditFormData): number {
  let score = 40;
  if (data.teamSize === '6-20') score += 10;
  if (data.teamSize === '21-50') score += 15;
  if (data.tools.includes('spreadsheets')) score += 20;
  if (data.tools.includes('none')) score += 15;
  if (!data.tools.includes('crm')) score += 10;
  if (!data.tools.includes('booking')) score += 10;
  if (['25-50', '50-100', '100+'].includes(data.leadVolume) &&
      (data.tools.includes('spreadsheets') || data.tools.includes('none'))) {
    score += 20;
  }
  if (data.painPoint === 'follow_up' || data.painPoint === 'lead_tracking') score += 10;
  return Math.min(score, 100);
}

function getOpportunityText(industry: string, painPoint: string): string {
  const opportunities: Record<string, Record<string, string>> = {
    dental: {
      booking: `Your practice could reduce no-shows by 30% and recover $32K+ annually with automated appointment reminders and a waitlist system that fills cancelled slots in minutes.`,
      follow_up: `Dental practices that automate new patient follow-up see 40% more inquiries convert to booked appointments — without anyone picking up the phone.`,
      default: `Your front desk is spending 4+ hours/day on calls that an AI system could handle automatically — freeing them for patient care.`,
    },
    legal: {
      follow_up: `Law firms typically lose 40% of qualified leads to slow response. An AI intake system would respond to every inquiry in under 60 seconds — 24/7, weekends included.`,
      booking: `Automating client intake and document collection alone saves the average law firm 12 hours/week of admin time.`,
      default: `Harvard research shows 5-minute lead response is 100x more effective. Most law firms take 2+ days. This gap is directly costing you clients.`,
    },
    contractor: {
      follow_up: `Contractors who automate quote follow-up close 2.3x more jobs from the same lead volume. Most leads go cold because no one follows up after the first visit.`,
      lead_tracking: `Managing 25+ leads in spreadsheets means you're forgetting 30-40% of them. An automated CRM with reminder sequences would recover 3-5 lost jobs per month.`,
      default: `The average contractor leaves $127K/year in revenue on the table from leads that went cold before a second follow-up.`,
    },
    real_estate: {
      follow_up: `Real estate agents who respond to online leads within 5 minutes are 100x more likely to make contact. Your CRM should be doing this automatically.`,
      default: `Automated showing scheduling, document collection, and follow-up sequences can save 16+ hours/week — and close more transactions from your existing lead volume.`,
    },
    restaurant: {
      follow_up: `Restaurants that send automated review requests after every visit see 3x more Google reviews in 90 days — without asking staff to do it manually.`,
      booking: `60% of diners call to ask questions your website already answers. An AI phone agent handles reservations, hours, and menu questions so your staff focuses on guests.`,
      default: `Restaurant operators are losing 30-40% of potential bookings to missed calls during busy service hours. AI handles those calls automatically.`,
    },
    home_services: {
      follow_up: `Contractors who automate quote follow-up at days 3, 7, and 14 close 2.3x more jobs from the same lead volume. Most leads go cold because nobody follows up.`,
      booking: `Every missed call while you're on a job is an average $2,400 lost to a competitor. AI answers after hours and on-site automatically.`,
      default: `Home service businesses leave $127K/year in revenue on the table from leads that went cold before a second contact.`,
    },
    med_spa: {
      booking: `Med spas with automated pre-appointment intake forms eliminate 30 minutes of in-office paperwork per patient — while reducing no-shows by 28%.`,
      follow_up: `Automated waitlist management fills cancelled slots in minutes instead of hours. At $150-$800 per appointment, every recovered slot matters.`,
      default: `Your front desk is managing intake, confirmations, and follow-ups manually. All three can be automated — freeing staff for client care.`,
    },
    mortgage_broker: {
      follow_up: `The first broker to respond gets the deal. Harvard research shows 5-minute response is 100x more effective. Average broker response time: 2+ hours.`,
      lead_tracking: `Automated document collection checklists cut the average mortgage processing time by 3-4 weeks — and clients who can upload documents at 10pm don't switch lenders.`,
      default: `Mortgage brokers who automate lead response and document collection close 35% more deals from their existing referral volume.`,
    },
    auto_repair: {
      follow_up: `Auto shops that send automated service reminders (oil change, tire rotation, seasonal) get 40% of customers back without a single phone call.`,
      booking: `8 out of 10 customers choose the shop that responds first. AI chat handles estimates and appointment booking — even at midnight.`,
      default: `Customers who don't hear back in 2 hours call the next shop. AI handles initial contact, estimates, and scheduling while your techs focus on cars.`,
    },
    gym: {
      follow_up: `Fitness studios that automate the first 90 days of membership (check-in milestones, class suggestions, motivation messages) see 40% better member retention.`,
      lead_tracking: `52% more trial signups happen after business hours. AI chat handles membership questions and trial booking 24/7 — no front desk staff required.`,
      default: `Gyms lose 3-5 potential members per week to leads who inquired but never got followed up with. Automated sequences recover most of these.`,
    },
  };
  const indOpps = opportunities[industry] || {};
  return indOpps[painPoint] || indOpps.default || `Your business has significant automation potential based on your current tools and lead volume.`;
}

interface AuditFormData {
  industry: string;
  teamSize: string;
  painPoint: string;
  leadVolume: string;
  tools: string[];
  websiteUrl: string;
}

interface AiAnalysis {
  headline: string;
  insight: string;
  topRecommendation: { title: string; description: string; effort: string; impact: string; timeline: string };
  riskIfDelayed: string;
}

interface AuditResults {
  score: number;
  hoursSaved: number;
  monthlyImpact: number;
  opportunityText: string;
  recommendations: { title: string; desc: string; effort: string; impact: string; timeline: string }[];
  scoreBreakdown: { label: string; score: number; max: number }[];
  aiAnalysis?: AiAnalysis | null;
}

type Step = 'form' | 'analyzing' | 'results';

const SCORE_COLOR_MAP: Record<string, string> = {
  critical: 'emerald',
  high: 'orange',
  ready: 'blue',
  starting: 'gray',
};

function getScoreMeta(score: number): { color: string; label: string } {
  if (score >= 80) return { color: 'emerald', label: 'Critical Opportunity' };
  if (score >= 60) return { color: 'orange', label: 'High Potential' };
  if (score >= 40) return { color: 'blue', label: 'Ready to Automate' };
  return { color: 'gray', label: 'Getting Started' };
}

export const AISystemsAudit: React.FC = () => {
  const [step, setStep] = useState<Step>('form');
  const [formData, setFormData] = useState<AuditFormData>({
    industry: 'dental',
    teamSize: '6-20',
    painPoint: 'follow_up',
    leadVolume: '25-50',
    tools: [],
    websiteUrl: '',
  });
  const [results, setResults] = useState<AuditResults | null>(null);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const bookingModal = useBookingModal();

  const auditSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Free AI Systems Audit | Axrategy",
    "description": "Answer 6 questions about your business. See your Automation Score and top 3 recommendations in 2 minutes.",
  };

  const handleToolToggle = (tool: string) => {
    setFormData(prev => ({
      ...prev,
      tools: prev.tools.includes(tool)
        ? prev.tools.filter(t => t !== tool)
        : [...prev.tools, tool],
    }));
  };

  const runAudit = useCallback(async () => {
    setStep('analyzing');

    await new Promise(resolve => setTimeout(resolve, 3000));

    const ind = INDUSTRY_DATA[formData.industry] || INDUSTRY_DATA.other;
    const multiplier = TEAM_MULTIPLIER[formData.teamSize] || 1;
    const score = calculateScore(formData);
    const hoursSaved = Math.round(ind.hoursSaved * multiplier);
    const leads = LEAD_VOLUME_MAP[formData.leadVolume] || 17;
    const recoveredLeads = leads * 0.12;
    const monthlyImpact = Math.round(hoursSaved * ind.hourlyValue + recoveredLeads * ind.leadValue);

    const isHealthcare = ['dental', 'chiropractic', 'veterinary'].includes(formData.industry);

    const recs = [
      {
        title: formData.painPoint === 'booking' ? 'Automated Appointment System' : 'AI Lead Response (Speed-to-Lead)',
        desc: `Respond to every new inquiry in under 60 seconds automatically. Studies show this improves conversion 100x vs. waiting hours.`,
        effort: 'Low', impact: 'High', timeline: 'Week 1',
      },
      {
        title: formData.tools.includes('crm') ? 'Automated Follow-Up Sequences' : 'CRM Setup with Automation',
        desc: formData.tools.includes('crm')
          ? `Your CRM isn't working for you if follow-ups aren't automated. Set up sequences that send at 24hrs, 3 days, and 7 days post-inquiry.`
          : `Centralize all leads in one place with automatic follow-up emails and texts. Every lead tracked, none forgotten.`,
        effort: 'Medium', impact: 'High', timeline: 'Month 1',
      },
      {
        title: isHealthcare ? 'Appointment Reminder System' : 'Reporting Dashboard',
        desc: isHealthcare
          ? `SMS reminders at 48hrs, 24hrs, and 2hrs before appointments. Patients confirm with one tap. No-show rates drop 30-50%.`
          : `See exactly where leads come from, what they convert at, and which campaigns are working — in one simple dashboard.`,
        effort: 'Medium', impact: 'Medium', timeline: 'Month 2',
      },
    ];

    const scoreBreakdown = [
      { label: 'Lead Capture & Response', score: Math.round(score * 0.3), max: 30 },
      { label: 'Booking & Scheduling', score: Math.round(score * 0.25), max: 25 },
      { label: 'Follow-up & Nurturing', score: Math.round(score * 0.25), max: 25 },
      { label: 'Reporting & CRM', score: Math.round(score * 0.2), max: 20 },
    ];

    const auditResults: AuditResults = {
      score,
      hoursSaved,
      monthlyImpact,
      opportunityText: getOpportunityText(formData.industry, formData.painPoint),
      recommendations: recs,
      scoreBreakdown,
    };

    try {
      await supabase.from('ai_audits').insert({
        industry: formData.industry,
        team_size: formData.teamSize,
        pain_point: formData.painPoint,
        lead_volume: formData.leadVolume,
        tools: formData.tools,
        website_url: formData.websiteUrl || null,
        automation_score: score,
        hours_saved: hoursSaved,
        monthly_impact: monthlyImpact,
      });
    } catch {
      console.log('Could not save audit result');
    }

    let aiAnalysis: AiAnalysis | null = null;
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      const aiResponse = await fetch(`${supabaseUrl}/functions/v1/ai-audit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          ...formData,
          score,
          monthlyImpact,
          hoursSaved,
        }),
      });
      if (aiResponse.ok) {
        const aiData = await aiResponse.json();
        if (aiData.success) aiAnalysis = aiData.analysis;
      }
    } catch (e) {
      console.warn('AI analysis unavailable, using defaults', e);
    }

    setResults({ ...auditResults, aiAnalysis });
    setStep('results');
  }, [formData]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !results) return;
    setIsSubmittingEmail(true);
    try {
      await supabase.from('leads').upsert({
        email,
        name: 'AI Audit Lead',
        source: 'ai_audit',
        service_interest: `AI Audit - ${INDUSTRY_DATA[formData.industry]?.label || formData.industry}`,
        message: `Automation Score: ${results.score}/100. Monthly impact estimate: $${results.monthlyImpact.toLocaleString()}. Pain point: ${formData.painPoint}`,
        status: 'new',
      }, { onConflict: 'email' });
      setEmailSent(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  const scoreMeta = results ? getScoreMeta(results.score) : { color: 'gray', label: '' };

  const scoreColorClasses: Record<string, { badge: string; ring: string; stroke: string }> = {
    emerald: {
      badge: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800',
      ring: 'text-emerald-500',
      stroke: 'text-emerald-500',
    },
    orange: {
      badge: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-100 dark:border-orange-800',
      ring: 'text-orange-500',
      stroke: 'text-orange-500',
    },
    blue: {
      badge: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-800',
      ring: 'text-blue-500',
      stroke: 'text-blue-500',
    },
    gray: {
      badge: 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700',
      ring: 'text-gray-400',
      stroke: 'text-gray-400',
    },
  };

  const colorClasses = scoreColorClasses[scoreMeta.color] || scoreColorClasses.gray;

  return (
    <>
      <SEO
        title="Free AI Systems Audit — See Your Automation Score in 2 Minutes"
        description="Answer 6 questions about your business. We calculate exactly how much time and revenue you're leaving on the table — and show you the 3 automations that would fix it."
        schema={auditSchema}
      />

      <Section className="pt-32 md:pt-40 pb-20">
        <Container size="md">

          <AnimatePresence mode="wait">
            {step === 'form' && (
              <motion.div
                key="header"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center mb-16"
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest mb-8 border border-emerald-100 dark:border-emerald-800">
                  Free · No Email Required
                </div>
                <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
                  Your Free AI<br />Systems Audit
                </h1>
                <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                  6 questions. 2 minutes. See your Automation Score, how many hours you're losing, and the 3 systems that would fix it — before you talk to anyone.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {step === 'form' && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-200 dark:border-gray-800 p-8 md:p-12 shadow-sm"
              >
                <div className="space-y-10">

                  <div>
                    <label className="block text-base font-bold text-gray-900 dark:text-white mb-4">
                      1. What type of business do you run?
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries(INDUSTRY_DATA).map(([key, { label }]) => (
                        <button
                          key={key}
                          onClick={() => setFormData(prev => ({ ...prev, industry: key }))}
                          className={`px-4 py-3 rounded-xl text-sm font-medium text-left transition-all border-2 ${
                            formData.industry === key
                              ? 'border-gray-900 dark:border-white bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-base font-bold text-gray-900 dark:text-white mb-4">
                      2. How many people work in your business?
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {[
                        { value: 'solo', label: 'Just me' },
                        { value: '2-5', label: '2–5 people' },
                        { value: '6-20', label: '6–20 people' },
                        { value: '21-50', label: '21–50 people' },
                        { value: '50+', label: '50+ people' },
                      ].map(({ value, label }) => (
                        <button
                          key={value}
                          onClick={() => setFormData(prev => ({ ...prev, teamSize: value }))}
                          className={`px-5 py-3 rounded-xl text-sm font-medium transition-all border-2 ${
                            formData.teamSize === value
                              ? 'border-gray-900 dark:border-white bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-base font-bold text-gray-900 dark:text-white mb-4">
                      3. What's taking the most of your time right now?
                    </label>
                    <div className="space-y-3">
                      {[
                        { value: 'calls', label: 'Answering calls and messages manually' },
                        { value: 'follow_up', label: 'Following up with leads who went cold' },
                        { value: 'booking', label: 'Booking and rescheduling appointments' },
                        { value: 'admin', label: 'Writing emails, quotes, and admin documents' },
                        { value: 'lead_tracking', label: 'Tracking leads and customers manually' },
                      ].map(({ value, label }) => (
                        <button
                          key={value}
                          onClick={() => setFormData(prev => ({ ...prev, painPoint: value }))}
                          className={`w-full text-left px-5 py-4 rounded-xl text-sm font-medium transition-all border-2 ${
                            formData.painPoint === value
                              ? 'border-gray-900 dark:border-white bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-base font-bold text-gray-900 dark:text-white mb-4">
                      4. How many new leads or inquiries do you get per month?
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {[
                        { value: 'under_10', label: 'Under 10' },
                        { value: '10-25', label: '10–25' },
                        { value: '25-50', label: '25–50' },
                        { value: '50-100', label: '50–100' },
                        { value: '100+', label: '100+' },
                      ].map(({ value, label }) => (
                        <button
                          key={value}
                          onClick={() => setFormData(prev => ({ ...prev, leadVolume: value }))}
                          className={`px-5 py-3 rounded-xl text-sm font-medium transition-all border-2 ${
                            formData.leadVolume === value
                              ? 'border-gray-900 dark:border-white bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-base font-bold text-gray-900 dark:text-white mb-4">
                      5. Which of these do you currently use? (Select all that apply)
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: 'spreadsheets', label: 'Spreadsheets / pen & paper' },
                        { value: 'crm', label: 'CRM (HubSpot, Salesforce, etc.)' },
                        { value: 'booking', label: 'Booking software (Calendly, etc.)' },
                        { value: 'email_marketing', label: 'Email marketing tool' },
                        { value: 'none', label: 'None of the above' },
                      ].map(({ value, label }) => (
                        <button
                          key={value}
                          onClick={() => handleToolToggle(value)}
                          className={`px-4 py-3 rounded-xl text-sm font-medium text-left transition-all border-2 flex items-center gap-3 ${
                            formData.tools.includes(value)
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center ${
                            formData.tools.includes(value)
                              ? 'border-emerald-500 bg-emerald-500'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}>
                            {formData.tools.includes(value) && <Check size={12} className="text-white" />}
                          </div>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-base font-bold text-gray-900 dark:text-white mb-2">
                      6. Your website URL <span className="text-gray-400 font-normal">(optional — unlocks website analysis)</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://yourbusiness.com"
                      value={formData.websiteUrl}
                      onChange={e => setFormData(prev => ({ ...prev, websiteUrl: e.target.value }))}
                      className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-gray-900 dark:focus:border-white transition-all"
                    />
                  </div>

                  <button
                    onClick={runAudit}
                    className="w-full py-5 px-8 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-bold text-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-all active:scale-95 flex items-center justify-center gap-3"
                  >
                    <Zap size={22} />
                    Analyze My Business
                    <ArrowRight size={20} />
                  </button>
                  <p className="text-center text-sm text-gray-400">No email required to see your results</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {step === 'analyzing' && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-20"
              >
                <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-8">
                  <Loader2 className="animate-spin text-gray-500" size={36} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Analyzing your business...</h2>
                <div className="space-y-2 text-gray-500 dark:text-gray-400 text-sm">
                  {[
                    'Mapping your industry and team profile...',
                    'Calculating automation potential...',
                    'Identifying your biggest time losses...',
                    'Building your personalized recommendations...',
                  ].map((msg, i) => (
                    <motion.p
                      key={msg}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.7 }}
                    >
                      {msg}
                    </motion.p>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {step === 'results' && results && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border ${colorClasses.badge}`}>
                    {scoreMeta.label}
                  </div>
                  <div className="flex items-center justify-center mb-4">
                    <div className="relative w-36 h-36">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" className="text-gray-100 dark:text-gray-800" strokeWidth="10" />
                        <circle
                          cx="50" cy="50" r="42" fill="none"
                          stroke="currentColor"
                          className={colorClasses.stroke}
                          strokeWidth="10"
                          strokeDasharray={`${results.score * 2.638} 263.8`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold text-gray-900 dark:text-white">{results.score}</span>
                        <span className="text-xs text-gray-400">/100</span>
                      </div>
                    </div>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">Your Automation Score</h1>
                  <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
                    {results.score >= 70
                      ? "You have significant untapped automation potential. Here's exactly where to start."
                      : "You're in a good starting position. Here's how to build on it."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-6">
                    <Clock className="text-blue-600 dark:text-blue-400 mb-3" size={24} />
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-1">{results.hoursSaved} hrs/month</p>
                    <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Time You Could Recover</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">Based on your industry and team size</p>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl p-6">
                    <DollarSign className="text-emerald-600 dark:text-emerald-400 mb-3" size={24} />
                    <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mb-1">${results.monthlyImpact.toLocaleString()}/mo</p>
                    <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Revenue Opportunity</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">Time saved + recovered leads estimate</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                    <TrendingUp className="text-gray-600 dark:text-gray-400 mb-3" size={24} />
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">$697–$1,197/mo</p>
                    <p className="text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Investment Range</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Or $11,500+ one-time</p>
                  </div>
                </div>

                <div className="bg-gray-900 dark:bg-white rounded-2xl p-8 md:p-10">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center flex-shrink-0">
                      <Zap className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2">Your Biggest Opportunity</p>
                      <p className="text-white dark:text-gray-900 text-lg leading-relaxed font-medium">{results.opportunityText}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-6">Score Breakdown</h3>
                  <div className="space-y-4">
                    {results.scoreBreakdown.map(({ label, score, max }) => (
                      <div key={label}>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>
                          <span className="font-bold text-gray-900 dark:text-white">{score}/{max}</span>
                        </div>
                        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                            style={{ width: `${(score / max) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {results.aiAnalysis && (
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-white dark:to-gray-100 rounded-2xl p-6 md:p-8 text-white dark:text-gray-900">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                      <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 dark:text-emerald-600">AI Analysis — Personalized for You</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold mb-4">{results.aiAnalysis.headline}</h3>
                    <p className="text-gray-300 dark:text-gray-600 mb-6 leading-relaxed">{results.aiAnalysis.insight}</p>

                    <div className="bg-white/10 dark:bg-black/10 rounded-xl p-5 mb-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-bold uppercase tracking-wide text-emerald-400 dark:text-emerald-600">Top Priority</span>
                      </div>
                      <h4 className="font-bold text-lg mb-2">{results.aiAnalysis.topRecommendation.title}</h4>
                      <p className="text-sm text-gray-300 dark:text-gray-600 mb-4">{results.aiAnalysis.topRecommendation.description}</p>
                      <div className="flex gap-3 flex-wrap">
                        <span className="text-xs px-2 py-1 bg-white/20 dark:bg-black/20 rounded-full">Effort: {results.aiAnalysis.topRecommendation.effort}</span>
                        <span className="text-xs px-2 py-1 bg-white/20 dark:bg-black/20 rounded-full">Impact: {results.aiAnalysis.topRecommendation.impact}</span>
                        <span className="text-xs px-2 py-1 bg-white/20 dark:bg-black/20 rounded-full">{results.aiAnalysis.topRecommendation.timeline}</span>
                      </div>
                    </div>

                    <div className="border-t border-white/20 dark:border-black/20 pt-5">
                      <div className="flex items-start gap-2">
                        <AlertTriangle size={15} className="text-amber-300 dark:text-amber-700 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-300 dark:text-amber-700 font-medium">{results.aiAnalysis.riskIfDelayed}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Your Top 3 Recommendations</h3>
                  <div className="space-y-4">
                    {results.recommendations.map((rec, i) => (
                      <FadeIn key={i} delay={i * 0.1}>
                        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                          <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center flex-shrink-0 text-white dark:text-gray-900 font-bold text-sm">
                              {i + 1}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-900 dark:text-white mb-2">{rec.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">{rec.desc}</p>
                              <div className="flex gap-3 text-xs">
                                <span className="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium">Effort: {rec.effort}</span>
                                <span className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-medium">Impact: {rec.impact}</span>
                                <span className="px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium">{rec.timeline}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </FadeIn>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-[2rem] p-8 md:p-12">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Ready to fix this?
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                        Book a free 15-minute call. We'll walk through your results and give you a specific plan — no pitch, no pressure.
                      </p>
                      <button
                        onClick={bookingModal.open}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-bold rounded-2xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all text-base"
                      >
                        <Calendar size={18} />
                        Book a Free Call
                      </button>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Get your full report by email</p>
                      {emailSent ? (
                        <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                          <CheckCircle className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" size={20} />
                          <p className="text-emerald-700 dark:text-emerald-400 text-sm font-medium">Report on its way! Check your inbox.</p>
                        </div>
                      ) : (
                        <form onSubmit={handleEmailSubmit} className="flex gap-3">
                          <input
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                          />
                          <button
                            type="submit"
                            disabled={isSubmittingEmail}
                            className="px-5 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-sm hover:bg-gray-800 transition-all disabled:opacity-50"
                          >
                            {isSubmittingEmail ? <Loader2 className="animate-spin" size={16} /> : 'Send'}
                          </button>
                        </form>
                      )}
                      <p className="text-xs text-gray-400 mt-2">Includes 30-day action plan and tool recommendations</p>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    onClick={() => { setStep('form'); setResults(null); setEmail(''); setEmailSent(false); }}
                    className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    ← Start over with different answers
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Container>
      </Section>

      <CalBookingModal isOpen={bookingModal.isOpen} onClose={bookingModal.close} />
    </>
  );
};
