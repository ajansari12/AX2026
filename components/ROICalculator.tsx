import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, Clock, DollarSign } from 'lucide-react';

interface ROIInputs {
  clientValue: number;
  additionalAppointments: number;
  adminHoursPerWeek: number;
}

export const ROICalculator: React.FC = () => {
  const [inputs, setInputs] = useState<ROIInputs>({
    clientValue: 500,
    additionalAppointments: 5,
    adminHoursPerWeek: 10
  });

  const calculations = useMemo(() => {
    const monthlyRevenue = inputs.additionalAppointments * inputs.clientValue;
    const annualRevenue = monthlyRevenue * 12;
    const monthlyHoursSaved = inputs.adminHoursPerWeek * 4;
    const annualHoursSaved = monthlyHoursSaved * 12;
    const hourlyValue = 75;
    const timeValueSaved = annualHoursSaved * hourlyValue;
    const totalAnnualValue = annualRevenue + timeValueSaved;

    const starterOneTime = 3500;
    const growthOneTime = 7500;
    const professionalMonthlyTotal = 1200 + (349 * 6);

    const starterPaybackMonths = Math.ceil(starterOneTime / monthlyRevenue);
    const growthPaybackMonths = Math.ceil(growthOneTime / monthlyRevenue);
    const monthlyPaybackMonths = Math.ceil(professionalMonthlyTotal / monthlyRevenue);

    return {
      monthlyRevenue,
      annualRevenue,
      monthlyHoursSaved,
      annualHoursSaved,
      timeValueSaved,
      totalAnnualValue,
      starterPaybackMonths,
      growthPaybackMonths,
      monthlyPaybackMonths
    };
  }, [inputs]);

  const handleInputChange = (field: keyof ROIInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
      <div className="p-8 md:p-12">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
            <Calculator className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Calculate Your ROI</h3>
            <p className="text-gray-500 dark:text-gray-400">See how quickly the investment pays for itself</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Average value of a new client/appointment
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                <input
                  type="number"
                  value={inputs.clientValue}
                  onChange={(e) => handleInputChange('clientValue', parseInt(e.target.value) || 0)}
                  className="w-full pl-10 pr-4 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium text-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
              <input
                type="range"
                min="100"
                max="5000"
                step="100"
                value={inputs.clientValue}
                onChange={(e) => handleInputChange('clientValue', parseInt(e.target.value))}
                className="w-full mt-3 accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>$100</span>
                <span>$5,000</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Extra appointments per month from automation
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={inputs.additionalAppointments}
                  onChange={(e) => handleInputChange('additionalAppointments', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium text-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={inputs.additionalAppointments}
                onChange={(e) => handleInputChange('additionalAppointments', parseInt(e.target.value))}
                className="w-full mt-3 accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>1/mo</span>
                <span>30/mo</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Hours spent on admin work per week
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={inputs.adminHoursPerWeek}
                  onChange={(e) => handleInputChange('adminHoursPerWeek', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-medium text-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">hrs/week</span>
              </div>
              <input
                type="range"
                min="1"
                max="40"
                step="1"
                value={inputs.adminHoursPerWeek}
                onChange={(e) => handleInputChange('adminHoursPerWeek', parseInt(e.target.value))}
                className="w-full mt-3 accent-emerald-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>1 hr</span>
                <span>40 hrs</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <motion.div
              key={calculations.annualRevenue}
              initial={{ scale: 0.95, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-6 border border-emerald-100 dark:border-emerald-800"
            >
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">Potential Annual Revenue</span>
              </div>
              <p className="text-4xl font-bold text-emerald-700 dark:text-emerald-300">
                {formatCurrency(calculations.annualRevenue)}
              </p>
              <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-2">
                {formatCurrency(calculations.monthlyRevenue)}/month from new appointments
              </p>
            </motion.div>

            <motion.div
              key={calculations.annualHoursSaved}
              initial={{ scale: 0.95, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800"
            >
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">Time Saved</span>
              </div>
              <p className="text-4xl font-bold text-blue-700 dark:text-blue-300">
                {calculations.annualHoursSaved} hours/year
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                Worth {formatCurrency(calculations.timeValueSaved)} at $75/hr
              </p>
            </motion.div>

            <motion.div
              key={calculations.starterPaybackMonths}
              initial={{ scale: 0.95, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Payback Period</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Starter ($3,500)</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {calculations.starterPaybackMonths <= 12 ? `${calculations.starterPaybackMonths} months` : '12+ months'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Growth ($7,500)</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {calculations.growthPaybackMonths <= 12 ? `${calculations.growthPaybackMonths} months` : '12+ months'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Monthly Professional</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {calculations.monthlyPaybackMonths <= 12 ? `${calculations.monthlyPaybackMonths} months` : '12+ months'}
                  </span>
                </div>
              </div>
            </motion.div>

            <div className="bg-black dark:bg-white rounded-2xl p-6 text-center">
              <p className="text-white dark:text-black font-bold text-lg">
                Total Annual Value: {formatCurrency(calculations.totalAnnualValue)}
              </p>
              <p className="text-gray-400 dark:text-gray-600 text-sm mt-1">
                Revenue + time savings combined
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
