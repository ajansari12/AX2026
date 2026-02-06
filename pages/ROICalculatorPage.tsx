import React from 'react';
import { Section, Container } from '../components/UI';
import { SEO } from '../components/SEO';
import { ROICalculator } from '../components/ROICalculator';
import { useTriggerBookingModal } from '../hooks/useGlobalBookingModal';
import { Calendar, TrendingUp, Clock, DollarSign } from 'lucide-react';

const proofPoints = [
  { icon: <TrendingUp size={20} />, label: 'Average ROI', value: '312%' },
  { icon: <Clock size={20} />, label: 'Time Saved', value: '20+ hrs/mo' },
  { icon: <DollarSign size={20} />, label: 'Revenue Boost', value: '45%' },
];

export const ROICalculatorPage: React.FC = () => {
  const triggerBookingModal = useTriggerBookingModal();

  return (
    <>
      <SEO
        title="ROI Calculator | See Your Potential Returns"
        description="Calculate the return on investment from working with Axrategy. See how our AI-powered solutions can grow your business."
      />

      <Section className="pt-32 pb-12">
        <Container size="md">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
              Calculate Your ROI
            </h1>
            <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              See the potential revenue impact and time savings from automating your business systems.
            </p>
          </div>

          <div className="flex justify-center gap-8 mb-16">
            {proofPoints.map(point => (
              <div key={point.label} className="text-center">
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto mb-2">
                  {point.icon}
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{point.value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{point.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="py-0">
        <Container size="lg">
          <ROICalculator />
        </Container>
      </Section>

      <Section className="pt-16 pb-32">
        <Container size="sm">
          <div className="text-center bg-gray-900 dark:bg-white rounded-3xl p-10">
            <h2 className="text-2xl font-bold text-white dark:text-gray-900 mb-3">
              Ready to realize these returns?
            </h2>
            <p className="text-gray-400 dark:text-gray-600 mb-6">
              Book a free strategy call and we'll build a custom plan for your business.
            </p>
            <button
              onClick={() => triggerBookingModal()}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-bold rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Calendar size={18} /> Book a Free Strategy Call
            </button>
          </div>
        </Container>
      </Section>
    </>
  );
};
