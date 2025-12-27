import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ArrowLeft, Check, Upload, X, Building2, Users,
  Calendar, DollarSign, Target, Briefcase, Loader2, CheckCircle2,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface FormData {
  // Step 1: About You
  name: string;
  email: string;
  company: string;
  phone: string;

  // Step 2: Project Type
  serviceType: string;
  industry: string;

  // Step 3: Project Details
  description: string;
  goals: string[];
  timeline: string;

  // Step 4: Budget & Files
  budget: string;
  files: File[];
}

const INITIAL_FORM_DATA: FormData = {
  name: '',
  email: '',
  company: '',
  phone: '',
  serviceType: '',
  industry: '',
  description: '',
  goals: [],
  timeline: '',
  budget: '',
  files: [],
};

const SERVICE_TYPES = [
  { value: 'ai_assistant', label: 'AI Assistant / Chatbot', icon: '🤖' },
  { value: 'automation', label: 'Business Automation', icon: '⚡' },
  { value: 'website', label: 'Website Development', icon: '🌐' },
  { value: 'app', label: 'Custom Application', icon: '📱' },
  { value: 'strategy', label: 'AI Strategy Consulting', icon: '🎯' },
  { value: 'other', label: 'Something Else', icon: '✨' },
];

const INDUSTRIES = [
  'Professional Services',
  'E-commerce / Retail',
  'Healthcare',
  'Finance / Banking',
  'Real Estate',
  'Education',
  'Manufacturing',
  'Technology / SaaS',
  'Non-profit',
  'Other',
];

const GOALS = [
  'Save time on repetitive tasks',
  'Improve customer experience',
  'Generate more leads',
  'Reduce operational costs',
  'Scale without hiring',
  'Gain competitive advantage',
  'Modernize existing systems',
  'Improve data insights',
];

const TIMELINES = [
  { value: 'asap', label: 'As soon as possible' },
  { value: '1month', label: 'Within 1 month' },
  { value: '3months', label: 'Within 3 months' },
  { value: '6months', label: 'Within 6 months' },
  { value: 'exploring', label: 'Just exploring options' },
];

const BUDGETS = [
  { value: 'under5k', label: 'Under $5,000' },
  { value: '5k-15k', label: '$5,000 - $15,000' },
  { value: '15k-50k', label: '$15,000 - $50,000' },
  { value: '50k-100k', label: '$50,000 - $100,000' },
  { value: 'over100k', label: '$100,000+' },
  { value: 'unsure', label: 'Not sure yet' },
];

const STEPS = [
  { id: 1, title: 'About You', icon: Users },
  { id: 2, title: 'Project Type', icon: Briefcase },
  { id: 3, title: 'Details', icon: Target },
  { id: 4, title: 'Budget & Files', icon: DollarSign },
];

interface ProjectRequestFormProps {
  onClose?: () => void;
  embedded?: boolean;
}

export const ProjectRequestForm: React.FC<ProjectRequestFormProps> = ({ onClose, embedded = false }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = useCallback((updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    // Clear errors for updated fields
    const updatedKeys = Object.keys(updates);
    setErrors(prev => {
      const newErrors = { ...prev };
      updatedKeys.forEach(key => delete newErrors[key]);
      return newErrors;
    });
  }, []);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Invalid email format';
        }
        break;
      case 2:
        if (!formData.serviceType) newErrors.serviceType = 'Please select a service type';
        break;
      case 3:
        if (!formData.description.trim()) newErrors.description = 'Please describe your project';
        if (!formData.timeline) newErrors.timeline = 'Please select a timeline';
        break;
      case 4:
        if (!formData.budget) newErrors.budget = 'Please select a budget range';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleGoalToggle = (goal: string) => {
    updateFormData({
      goals: formData.goals.includes(goal)
        ? formData.goals.filter(g => g !== goal)
        : [...formData.goals, goal],
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      updateFormData({
        files: [...formData.files, ...Array.from(files)],
      });
    }
  };

  const removeFile = (index: number) => {
    updateFormData({
      files: formData.files.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    try {
      // Upload files to Supabase storage if any
      const fileUrls: string[] = [];
      for (const file of formData.files) {
        const fileName = `${Date.now()}-${file.name}`;
        const { data: uploadData } = await supabase.storage
          .from('project-files')
          .upload(fileName, file);

        if (uploadData) {
          const { data: urlData } = supabase.storage
            .from('project-files')
            .getPublicUrl(fileName);
          fileUrls.push(urlData.publicUrl);
        }
      }

      // Create lead with all project details
      await supabase.from('leads').insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        source: 'project_request_form',
        service_interest: formData.serviceType,
        message: `
Company: ${formData.company || 'Not provided'}
Industry: ${formData.industry || 'Not provided'}
Service Type: ${SERVICE_TYPES.find(s => s.value === formData.serviceType)?.label || formData.serviceType}
Timeline: ${TIMELINES.find(t => t.value === formData.timeline)?.label || formData.timeline}
Budget: ${BUDGETS.find(b => b.value === formData.budget)?.label || formData.budget}

Project Description:
${formData.description}

Goals:
${formData.goals.length > 0 ? formData.goals.map(g => `- ${g}`).join('\n') : 'None specified'}

${fileUrls.length > 0 ? `\nAttached Files:\n${fileUrls.join('\n')}` : ''}
        `.trim(),
        status: 'new',
        metadata: {
          company: formData.company,
          industry: formData.industry,
          timeline: formData.timeline,
          budget: formData.budget,
          goals: formData.goals,
          files: fileUrls,
        },
      });

      setIsSubmitted(true);
    } catch (err) {
      console.error('Failed to submit project request:', err);
      setErrors({ submit: 'Failed to submit. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateFormData({ name: e.target.value })}
                  placeholder="John Doe"
                  className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData({ email: e.target.value })}
                  placeholder="john@company.com"
                  className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => updateFormData({ company: e.target.value })}
                  placeholder="Acme Inc."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateFormData({ phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                What type of project are you looking for? *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {SERVICE_TYPES.map((service) => (
                  <button
                    key={service.value}
                    type="button"
                    onClick={() => updateFormData({ serviceType: service.value })}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      formData.serviceType === service.value
                        ? 'border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-800'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <span className="text-2xl mb-2 block">{service.icon}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{service.label}</span>
                  </button>
                ))}
              </div>
              {errors.serviceType && <p className="text-red-500 text-xs mt-2">{errors.serviceType}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Industry
              </label>
              <select
                value={formData.industry}
                onChange={(e) => updateFormData({ industry: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">Select your industry</option>
                {INDUSTRIES.map((industry) => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tell us about your project *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateFormData({ description: e.target.value })}
                placeholder="Describe what you're looking to build, the problems you want to solve, and any specific requirements..."
                rows={4}
                className={`w-full px-4 py-3 rounded-xl border ${errors.description ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 resize-none`}
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                What are your main goals? (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {GOALS.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => handleGoalToggle(goal)}
                    className={`px-4 py-2 rounded-full text-sm transition-all ${
                      formData.goals.includes(goal)
                        ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {formData.goals.includes(goal) && <Check className="w-3 h-3 inline mr-1" />}
                    {goal}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                When do you need this completed? *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {TIMELINES.map((timeline) => (
                  <button
                    key={timeline.value}
                    type="button"
                    onClick={() => updateFormData({ timeline: timeline.value })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      formData.timeline === timeline.value
                        ? 'border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-800'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <Calendar className="w-4 h-4 inline mr-2 text-gray-500" />
                    <span className="text-gray-900 dark:text-white">{timeline.label}</span>
                  </button>
                ))}
              </div>
              {errors.timeline && <p className="text-red-500 text-xs mt-2">{errors.timeline}</p>}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                What's your approximate budget? *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {BUDGETS.map((budget) => (
                  <button
                    key={budget.value}
                    type="button"
                    onClick={() => updateFormData({ budget: budget.value })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      formData.budget === budget.value
                        ? 'border-gray-900 dark:border-white bg-gray-50 dark:bg-gray-800'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <DollarSign className="w-4 h-4 inline mr-2 text-gray-500" />
                    <span className="text-gray-900 dark:text-white">{budget.label}</span>
                  </button>
                ))}
              </div>
              {errors.budget && <p className="text-red-500 text-xs mt-2">{errors.budget}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Upload relevant files (optional)
              </label>
              <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Drop files here or <span className="text-gray-900 dark:text-white font-medium">browse</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF, DOC, TXT, PNG, JPG up to 10MB each
                  </p>
                </label>
              </div>

              {formData.files.length > 0 && (
                <div className="mt-3 space-y-2">
                  {formData.files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {file.name}
                      </span>
                      <button
                        onClick={() => removeFile(index)}
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {errors.submit && (
              <p className="text-red-500 text-sm text-center">{errors.submit}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (isSubmitted) {
    return (
      <div className={`${embedded ? '' : 'bg-white dark:bg-gray-900 rounded-2xl shadow-xl'} p-8`}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Thank You!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We've received your project request and will be in touch within 24 hours.
          </p>
          {onClose && (
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium hover:bg-gray-800 dark:hover:bg-gray-100"
            >
              Close
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`${embedded ? '' : 'bg-white dark:bg-gray-900 rounded-2xl shadow-xl'}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Start Your Project
          </h2>
          {onClose && (
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Progress steps */}
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    currentStep >= step.id
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span className={`ml-2 text-sm hidden md:block ${
                  currentStep >= step.id
                    ? 'text-gray-900 dark:text-white font-medium'
                    : 'text-gray-400'
                }`}>
                  {step.title}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${
                  currentStep > step.id
                    ? 'bg-gray-900 dark:bg-white'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Form content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-100 dark:border-gray-800 flex justify-between">
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {currentStep < STEPS.length ? (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium hover:bg-gray-800 dark:hover:bg-gray-100"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit Request
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
