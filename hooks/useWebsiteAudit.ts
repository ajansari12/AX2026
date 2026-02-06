import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface AuditScores {
  performance: number;
  seo: number;
  accessibility: number;
  bestPractices: number;
}

export interface AuditMetric {
  value: number;
  display: string;
  score: number;
}

export interface AuditIssue {
  title: string;
  description: string;
  severity: 'critical' | 'warning';
}

export interface AuditResult {
  id: string;
  url: string;
  mobileScores: AuditScores;
  desktopScores: AuditScores;
  metrics: {
    lcp: AuditMetric;
    fcp: AuditMetric;
    cls: AuditMetric;
    tbt: AuditMetric;
    si: AuditMetric;
    tti: AuditMetric;
  };
  topIssues: AuditIssue[];
  screenshotUrl: string;
}

type AuditPhase =
  | 'idle'
  | 'connecting'
  | 'scanning'
  | 'analyzing'
  | 'checking_seo'
  | 'generating'
  | 'done'
  | 'error';

const PHASE_LABELS: Record<AuditPhase, string> = {
  idle: '',
  connecting: 'Connecting to server...',
  scanning: 'Scanning pages...',
  analyzing: 'Analyzing performance...',
  checking_seo: 'Checking SEO & accessibility...',
  generating: 'Generating report...',
  done: '',
  error: '',
};

const PHASE_SEQUENCE: AuditPhase[] = [
  'connecting',
  'scanning',
  'analyzing',
  'checking_seo',
  'generating',
];

const getVisitorId = (): string => {
  const key = 'axrategy_visitor_id';
  let visitorId = localStorage.getItem(key);
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem(key, visitorId);
  }
  return visitorId;
};

export function useWebsiteAudit() {
  const [result, setResult] = useState<AuditResult | null>(null);
  const [phase, setPhase] = useState<AuditPhase>('idle');
  const [error, setError] = useState<string | null>(null);
  const [auditId, setAuditId] = useState<string | null>(null);

  const phaseLabel = PHASE_LABELS[phase];
  const isLoading = phase !== 'idle' && phase !== 'done' && phase !== 'error';

  const runAudit = useCallback(async (url: string) => {
    setError(null);
    setResult(null);
    setPhase('connecting');

    const visitorId = getVisitorId();

    await supabase.from('product_events').insert({
      event_type: 'audit_started',
      product_slug: 'website-teardown-report',
      visitor_id: visitorId,
      metadata: { url },
    });

    let phaseIndex = 0;
    const phaseInterval = setInterval(() => {
      phaseIndex++;
      if (phaseIndex < PHASE_SEQUENCE.length) {
        setPhase(PHASE_SEQUENCE[phaseIndex]);
      }
    }, 3500);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/website-audit`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ url, visitorId }),
      });

      clearInterval(phaseInterval);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to analyze website');
      }

      const data: AuditResult = await response.json();
      setResult(data);
      setAuditId(data.id);
      setPhase('done');
    } catch (err) {
      clearInterval(phaseInterval);
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setPhase('error');
    }
  }, []);

  const captureEmail = useCallback(
    async (email: string) => {
      if (!auditId) return;

      const visitorId = getVisitorId();

      await supabase
        .from('website_audits')
        .update({ email })
        .eq('id', auditId);

      await supabase.from('product_events').insert({
        event_type: 'audit_email_captured',
        product_slug: 'website-teardown-report',
        visitor_id: visitorId,
        metadata: { auditId, email },
      });
    },
    [auditId]
  );

  const reset = useCallback(() => {
    setResult(null);
    setPhase('idle');
    setError(null);
    setAuditId(null);
  }, []);

  return {
    result,
    phase,
    phaseLabel,
    isLoading,
    error,
    auditId,
    runAudit,
    captureEmail,
    reset,
  };
}
