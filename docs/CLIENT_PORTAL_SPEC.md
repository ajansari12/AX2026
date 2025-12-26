# Client Portal Specification

## Overview

A dedicated portal for clients to track their projects, access documents, view invoices, and communicate with the team. This is a major differentiator that improves client experience and reduces support overhead.

---

## User Stories

### As a Client, I want to:
- Log in with my email and see my project dashboard
- View the current status of my project
- See a timeline of completed milestones
- Access shared documents (proposals, contracts, brand assets)
- View and pay invoices
- Send messages to my project team
- Access training videos and documentation for my delivered systems

### As an Admin, I want to:
- Create client accounts linked to leads
- Share documents with specific clients
- Update project status and milestones
- Send messages to clients
- Generate and manage invoices
- See which clients have viewed documents

---

## Database Schema

```sql
-- migrations/20251226_client_portal.sql

-- Clients table (separate from leads for actual paying customers)
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  company_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'review', 'completed', 'on_hold')),
  service_type TEXT, -- ai_assistant, automation, website, app
  start_date DATE,
  estimated_end_date DATE,
  actual_end_date DATE,
  total_value DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project milestones
CREATE TABLE project_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  due_date DATE,
  completed_at TIMESTAMPTZ,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents shared with clients
CREATE TABLE client_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT, -- pdf, docx, image, video
  file_size INTEGER,
  category TEXT DEFAULT 'general' CHECK (category IN ('proposal', 'contract', 'invoice', 'asset', 'training', 'general')),
  uploaded_by TEXT,
  is_signed BOOLEAN DEFAULT FALSE,
  viewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Client messages (threaded conversations)
CREATE TABLE client_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('client', 'admin')),
  sender_email TEXT NOT NULL,
  content TEXT NOT NULL,
  attachments JSONB DEFAULT '[]',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  invoice_number TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'CAD',
  description TEXT,
  line_items JSONB DEFAULT '[]',
  due_date DATE,
  paid_at TIMESTAMPTZ,
  stripe_invoice_id TEXT,
  stripe_payment_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX clients_email_idx ON clients(email);
CREATE INDEX projects_client_id_idx ON projects(client_id);
CREATE INDEX project_milestones_project_id_idx ON project_milestones(project_id);
CREATE INDEX client_documents_client_id_idx ON client_documents(client_id);
CREATE INDEX client_messages_client_id_idx ON client_messages(client_id);
CREATE INDEX invoices_client_id_idx ON invoices(client_id);

-- RLS Policies
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Clients can only see their own data
CREATE POLICY "Clients can view own data"
  ON clients FOR SELECT
  USING (auth.jwt() ->> 'email' = email);

CREATE POLICY "Clients can view own projects"
  ON projects FOR SELECT
  USING (client_id IN (
    SELECT id FROM clients WHERE email = auth.jwt() ->> 'email'
  ));

CREATE POLICY "Clients can view own milestones"
  ON project_milestones FOR SELECT
  USING (project_id IN (
    SELECT id FROM projects WHERE client_id IN (
      SELECT id FROM clients WHERE email = auth.jwt() ->> 'email'
    )
  ));

CREATE POLICY "Clients can view own documents"
  ON client_documents FOR SELECT
  USING (client_id IN (
    SELECT id FROM clients WHERE email = auth.jwt() ->> 'email'
  ));

CREATE POLICY "Clients can view and send own messages"
  ON client_messages FOR ALL
  USING (client_id IN (
    SELECT id FROM clients WHERE email = auth.jwt() ->> 'email'
  ));

CREATE POLICY "Clients can view own invoices"
  ON invoices FOR SELECT
  USING (client_id IN (
    SELECT id FROM clients WHERE email = auth.jwt() ->> 'email'
  ));

-- Admins can do everything (authenticated users)
CREATE POLICY "Admins full access to clients"
  ON clients FOR ALL TO authenticated USING (true);

CREATE POLICY "Admins full access to projects"
  ON projects FOR ALL TO authenticated USING (true);

-- ... similar for other tables
```

---

## Authentication Flow

### Client Magic Link Authentication

```typescript
// hooks/useClientAuth.ts
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';

interface Client {
  id: string;
  email: string;
  name: string;
  company_name: string | null;
  avatar_url: string | null;
}

export function useClientAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user?.email) {
        fetchClientData(session.user.email);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (session?.user?.email) {
          fetchClientData(session.user.email);
        } else {
          setClient(null);
          setIsLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchClientData = async (email: string) => {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('email', email)
      .single();

    if (data) {
      setClient(data);
      // Update last login
      await supabase
        .from('clients')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', data.id);
    }
    setIsLoading(false);
  };

  const sendMagicLink = async (email: string) => {
    // First check if client exists
    const { data: existingClient } = await supabase
      .from('clients')
      .select('id')
      .eq('email', email)
      .single();

    if (!existingClient) {
      return { success: false, error: 'No account found with this email. Please contact us.' };
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/#/portal`,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setClient(null);
  };

  return {
    session,
    client,
    isLoading,
    isAuthenticated: !!session && !!client,
    sendMagicLink,
    signOut,
  };
}
```

### Login Page Component

```typescript
// pages/PortalLogin.tsx
import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { useClientAuth } from '../hooks/useClientAuth';

export const PortalLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { sendMagicLink } = useClientAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await sendMagicLink(email);

    if (result.success) {
      setSent(true);
    } else {
      setError(result.error || 'Failed to send login link');
    }
    setIsLoading(false);
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Check your email
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            We sent a magic link to <strong>{email}</strong>. Click the link to sign in to your client portal.
          </p>
          <button
            onClick={() => setSent(false)}
            className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white"
          >
            Use a different email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gray-900 dark:bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white dark:text-gray-900">A</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Client Portal
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Sign in to view your projects and documents
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Send Magic Link
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Don't have an account?{' '}
            <a href="/#/contact" className="text-gray-900 dark:text-white font-medium hover:underline">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
```

---

## Portal Dashboard

```typescript
// pages/Portal.tsx
import React from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import {
  LayoutDashboard, FolderOpen, FileText, MessageSquare,
  CreditCard, GraduationCap, LogOut, Loader2
} from 'lucide-react';
import { useClientAuth } from '../hooks/useClientAuth';
import { PortalLogin } from './PortalLogin';
import { PortalDashboard } from './portal/Dashboard';
import { PortalProjects } from './portal/Projects';
import { PortalDocuments } from './portal/Documents';
import { PortalMessages } from './portal/Messages';
import { PortalInvoices } from './portal/Invoices';
import { PortalTraining } from './portal/Training';

export const Portal: React.FC = () => {
  const { client, isLoading, isAuthenticated, signOut } = useClientAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <PortalLogin />;
  }

  const navItems = [
    { path: '/portal', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/portal/projects', icon: FolderOpen, label: 'Projects' },
    { path: '/portal/documents', icon: FileText, label: 'Documents' },
    { path: '/portal/messages', icon: MessageSquare, label: 'Messages' },
    { path: '/portal/invoices', icon: CreditCard, label: 'Invoices' },
    { path: '/portal/training', icon: GraduationCap, label: 'Training' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-900 dark:bg-white rounded-xl flex items-center justify-center">
              <span className="text-lg font-bold text-white dark:text-gray-900">A</span>
            </div>
            <div>
              <p className="font-bold text-gray-900 dark:text-white text-sm">
                {client?.name}
              </p>
              <p className="text-xs text-gray-500">{client?.company_name}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`
              }
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={signOut}
            className="flex items-center gap-3 px-4 py-3 w-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <Routes>
          <Route index element={<PortalDashboard />} />
          <Route path="projects/*" element={<PortalProjects />} />
          <Route path="documents" element={<PortalDocuments />} />
          <Route path="messages" element={<PortalMessages />} />
          <Route path="invoices" element={<PortalInvoices />} />
          <Route path="training" element={<PortalTraining />} />
          <Route path="*" element={<Navigate to="/portal" replace />} />
        </Routes>
      </main>
    </div>
  );
};
```

---

## Portal Sub-Pages

### Dashboard

```typescript
// pages/portal/Dashboard.tsx
import React from 'react';
import { FolderOpen, FileText, MessageSquare, CreditCard, ArrowRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useClientProjects } from '../../hooks/useClientProjects';
import { useClientMessages } from '../../hooks/useClientMessages';
import { useClientInvoices } from '../../hooks/useClientInvoices';

export const PortalDashboard: React.FC = () => {
  const { projects } = useClientProjects();
  const { unreadCount } = useClientMessages();
  const { pendingInvoices } = useClientInvoices();

  const activeProject = projects.find(p => p.status === 'in_progress');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Here's what's happening with your projects
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <QuickStat
          label="Active Projects"
          value={projects.filter(p => p.status === 'in_progress').length}
          icon={<FolderOpen />}
          href="/portal/projects"
        />
        <QuickStat
          label="Documents"
          value={12}
          icon={<FileText />}
          href="/portal/documents"
        />
        <QuickStat
          label="Unread Messages"
          value={unreadCount}
          icon={<MessageSquare />}
          href="/portal/messages"
          highlight={unreadCount > 0}
        />
        <QuickStat
          label="Pending Invoices"
          value={pendingInvoices.length}
          icon={<CreditCard />}
          href="/portal/invoices"
          highlight={pendingInvoices.length > 0}
        />
      </div>

      {/* Active Project */}
      {activeProject && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Current Project
            </h2>
            <NavLink
              to={`/portal/projects/${activeProject.id}`}
              className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center gap-1"
            >
              View Details <ArrowRight size={16} />
            </NavLink>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">
                {activeProject.name}
              </h3>
              <p className="text-sm text-gray-500">{activeProject.description}</p>
            </div>

            {/* Progress */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Progress</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {activeProject.completed_milestones}/{activeProject.total_milestones} milestones
                </span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all"
                  style={{
                    width: `${(activeProject.completed_milestones / activeProject.total_milestones) * 100}%`
                  }}
                />
              </div>
            </div>

            {/* Next Milestone */}
            {activeProject.next_milestone && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                  Next Milestone
                </p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {activeProject.next_milestone.title}
                </p>
                {activeProject.next_milestone.due_date && (
                  <p className="text-sm text-gray-500 mt-1">
                    Due: {new Date(activeProject.next_milestone.due_date).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {/* Activity items would be fetched and rendered here */}
          <ActivityItem
            type="document"
            title="Contract signed"
            description="Service agreement was signed"
            time="2 hours ago"
          />
          <ActivityItem
            type="milestone"
            title="Discovery phase completed"
            description="Initial research and planning finished"
            time="Yesterday"
          />
          <ActivityItem
            type="message"
            title="New message from Alex"
            description="Hey! Just wanted to share a quick update..."
            time="2 days ago"
          />
        </div>
      </div>
    </div>
  );
};

const QuickStat: React.FC<{
  label: string;
  value: number;
  icon: React.ReactNode;
  href: string;
  highlight?: boolean;
}> = ({ label, value, icon, href, highlight }) => (
  <NavLink
    to={href}
    className={`block p-6 rounded-2xl border transition-all hover:shadow-lg ${
      highlight
        ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-transparent'
        : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800'
    }`}
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
      highlight
        ? 'bg-white/20 dark:bg-gray-900/20'
        : 'bg-gray-100 dark:bg-gray-800'
    }`}>
      {React.cloneElement(icon as React.ReactElement, { size: 20 })}
    </div>
    <p className="text-3xl font-bold mb-1">{value}</p>
    <p className={`text-sm ${highlight ? 'opacity-80' : 'text-gray-500 dark:text-gray-400'}`}>
      {label}
    </p>
  </NavLink>
);

const ActivityItem: React.FC<{
  type: 'document' | 'milestone' | 'message';
  title: string;
  description: string;
  time: string;
}> = ({ type, title, description, time }) => (
  <div className="flex gap-4">
    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
      {type === 'document' && <FileText size={18} className="text-blue-500" />}
      {type === 'milestone' && <FolderOpen size={18} className="text-emerald-500" />}
      {type === 'message' && <MessageSquare size={18} className="text-purple-500" />}
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-medium text-gray-900 dark:text-white">{title}</p>
      <p className="text-sm text-gray-500 truncate">{description}</p>
    </div>
    <p className="text-xs text-gray-400 flex-shrink-0">{time}</p>
  </div>
);
```

---

## Stripe Payment Integration

```typescript
// hooks/usePayment.ts
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export function usePayment() {
  const [isProcessing, setIsProcessing] = useState(false);

  const createCheckoutSession = async (invoiceId: string) => {
    setIsProcessing(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { invoiceId },
      });

      if (error) throw error;

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      console.error('Payment error:', err);
      return { success: false, error: 'Failed to create payment session' };
    } finally {
      setIsProcessing(false);
    }
  };

  return { createCheckoutSession, isProcessing };
}
```

### Stripe Checkout Edge Function

```typescript
// supabase/functions/create-checkout/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@13.0.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
});

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const { invoiceId } = await req.json();

  // Fetch invoice details
  const { data: invoice, error } = await supabase
    .from('invoices')
    .select('*, clients(*)')
    .eq('id', invoiceId)
    .single();

  if (error || !invoice) {
    return new Response(JSON.stringify({ error: 'Invoice not found' }), { status: 404 });
  }

  // Create Stripe Checkout session
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: invoice.clients.email,
    line_items: invoice.line_items.map((item: any) => ({
      price_data: {
        currency: invoice.currency.toLowerCase(),
        product_data: {
          name: item.description,
        },
        unit_amount: Math.round(item.amount * 100),
      },
      quantity: item.quantity || 1,
    })),
    success_url: `${Deno.env.get('SITE_URL')}/#/portal/invoices?success=true&invoice=${invoiceId}`,
    cancel_url: `${Deno.env.get('SITE_URL')}/#/portal/invoices?cancelled=true`,
    metadata: {
      invoiceId,
    },
  });

  // Update invoice with Stripe IDs
  await supabase
    .from('invoices')
    .update({
      stripe_invoice_id: session.id,
      stripe_payment_url: session.url,
      status: 'sent',
    })
    .eq('id', invoiceId);

  return new Response(JSON.stringify({ url: session.url }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

---

## Admin: Client Management

```typescript
// Admin panel additions for managing clients

// hooks/useAdminClients.ts
export function useAdminClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    const { data } = await supabase
      .from('clients')
      .select(`
        *,
        projects(id, name, status),
        invoices(id, status, amount)
      `)
      .order('created_at', { ascending: false });

    if (data) setClients(data);
    setIsLoading(false);
  };

  const createClient = async (leadId: string) => {
    // Convert lead to client
    const { data: lead } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (!lead) throw new Error('Lead not found');

    const { data: client, error } = await supabase
      .from('clients')
      .insert({
        lead_id: leadId,
        email: lead.email,
        name: lead.name,
      })
      .select()
      .single();

    if (error) throw error;

    // Update lead status
    await supabase
      .from('leads')
      .update({ status: 'converted' })
      .eq('id', leadId);

    setClients(prev => [client, ...prev]);
    return client;
  };

  return {
    clients,
    isLoading,
    createClient,
    refetch: fetchClients,
  };
}
```

---

## Summary

The Client Portal includes:

1. **Magic Link Authentication** - Passwordless login for clients
2. **Dashboard** - Overview of projects, messages, invoices
3. **Project Tracking** - Status, milestones, timeline
4. **Document Sharing** - Proposals, contracts, assets with view tracking
5. **Messaging** - Direct communication with the team
6. **Invoicing** - View and pay invoices via Stripe
7. **Training Center** - Access to documentation and videos

This creates a professional, self-service experience for clients while reducing support burden on the team.
