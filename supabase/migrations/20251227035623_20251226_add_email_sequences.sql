/*
  # Email Marketing & Sequence Tables

  This migration adds tables for email marketing automation,
  including welcome sequences, drip campaigns, and email tracking.

  1. New Tables
    - `email_sequences` - Define automated email sequences
    - `email_sequence_steps` - Individual emails in a sequence
    - `email_sends` - Track individual email sends
    - `subscriber_sequences` - Track subscribers in sequences

  2. Features
    - Welcome email sequences
    - Drip campaigns based on triggers
    - Open/click tracking
    - Segment support
*/

-- Email sequences table
CREATE TABLE IF NOT EXISTS email_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('newsletter_signup', 'lead_created', 'quiz_completed', 'booking_created', 'manual')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Individual steps in a sequence
CREATE TABLE IF NOT EXISTS email_sequence_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id UUID NOT NULL REFERENCES email_sequences(id) ON DELETE CASCADE,
  step_order INTEGER NOT NULL,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  body_text TEXT,
  delay_days INTEGER DEFAULT 0, -- Days after trigger to send
  delay_hours INTEGER DEFAULT 0, -- Additional hours after delay_days
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(sequence_id, step_order)
);

-- Track all email sends
CREATE TABLE IF NOT EXISTS email_sends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  subject TEXT NOT NULL,
  sequence_id UUID REFERENCES email_sequences(id) ON DELETE SET NULL,
  step_id UUID REFERENCES email_sequence_steps(id) ON DELETE SET NULL,
  email_type TEXT NOT NULL, -- 'sequence', 'broadcast', 'transactional'
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed')),
  sent_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Track subscribers in sequences
CREATE TABLE IF NOT EXISTS subscriber_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_email TEXT NOT NULL,
  sequence_id UUID NOT NULL REFERENCES email_sequences(id) ON DELETE CASCADE,
  current_step INTEGER DEFAULT 0, -- 0 means not started
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'unsubscribed')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  last_email_sent_at TIMESTAMPTZ,
  next_email_scheduled_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(subscriber_email, sequence_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS email_sequences_trigger_idx ON email_sequences(trigger_type);
CREATE INDEX IF NOT EXISTS email_sequences_active_idx ON email_sequences(is_active);
CREATE INDEX IF NOT EXISTS email_sequence_steps_sequence_idx ON email_sequence_steps(sequence_id);
CREATE INDEX IF NOT EXISTS email_sends_recipient_idx ON email_sends(recipient_email);
CREATE INDEX IF NOT EXISTS email_sends_status_idx ON email_sends(status);
CREATE INDEX IF NOT EXISTS email_sends_created_idx ON email_sends(created_at DESC);
CREATE INDEX IF NOT EXISTS subscriber_sequences_email_idx ON subscriber_sequences(subscriber_email);
CREATE INDEX IF NOT EXISTS subscriber_sequences_status_idx ON subscriber_sequences(status);
CREATE INDEX IF NOT EXISTS subscriber_sequences_next_email_idx ON subscriber_sequences(next_email_scheduled_at);

-- RLS Policies
ALTER TABLE email_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sequence_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sends ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriber_sequences ENABLE ROW LEVEL SECURITY;

-- Only authenticated users (admins) can manage sequences
CREATE POLICY "Authenticated users can manage sequences"
  ON email_sequences FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage sequence steps"
  ON email_sequence_steps FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view email sends"
  ON email_sends FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can insert email sends"
  ON email_sends FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage subscriber sequences"
  ON subscriber_sequences FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add tags/segments to newsletter_subscribers if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'newsletter_subscribers' AND column_name = 'tags'
  ) THEN
    ALTER TABLE newsletter_subscribers ADD COLUMN tags TEXT[] DEFAULT '{}';
    ALTER TABLE newsletter_subscribers ADD COLUMN first_name TEXT;
    ALTER TABLE newsletter_subscribers ADD COLUMN last_name TEXT;
    ALTER TABLE newsletter_subscribers ADD COLUMN metadata JSONB DEFAULT '{}';
    CREATE INDEX IF NOT EXISTS newsletter_subscribers_tags_idx ON newsletter_subscribers USING GIN(tags);
  END IF;
END $$;

-- Function to enroll subscriber in sequence
CREATE OR REPLACE FUNCTION enroll_in_sequence(
  p_email TEXT,
  p_sequence_id UUID
)
RETURNS UUID AS $$
DECLARE
  first_step email_sequence_steps%ROWTYPE;
  enrollment_id UUID;
  next_scheduled TIMESTAMPTZ;
BEGIN
  -- Get the first step of the sequence
  SELECT * INTO first_step
  FROM email_sequence_steps
  WHERE sequence_id = p_sequence_id AND is_active = true
  ORDER BY step_order ASC
  LIMIT 1;

  IF first_step IS NULL THEN
    RETURN NULL;
  END IF;

  -- Calculate next scheduled time
  next_scheduled := NOW() + (first_step.delay_days || ' days')::INTERVAL + (first_step.delay_hours || ' hours')::INTERVAL;

  -- Insert or update enrollment
  INSERT INTO subscriber_sequences (
    subscriber_email,
    sequence_id,
    current_step,
    status,
    next_email_scheduled_at
  ) VALUES (
    p_email,
    p_sequence_id,
    1,
    'active',
    next_scheduled
  )
  ON CONFLICT (subscriber_email, sequence_id) DO UPDATE SET
    status = 'active',
    current_step = 1,
    started_at = NOW(),
    next_email_scheduled_at = next_scheduled,
    completed_at = NULL
  RETURNING id INTO enrollment_id;

  RETURN enrollment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-enroll newsletter subscribers
CREATE OR REPLACE FUNCTION auto_enroll_newsletter()
RETURNS TRIGGER AS $$
DECLARE
  sequence_record email_sequences%ROWTYPE;
BEGIN
  -- Find active sequence for newsletter signups
  FOR sequence_record IN
    SELECT * FROM email_sequences
    WHERE trigger_type = 'newsletter_signup' AND is_active = true
  LOOP
    PERFORM enroll_in_sequence(NEW.email, sequence_record.id);
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for newsletter auto-enrollment
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'newsletter_sequence_trigger') THEN
    CREATE TRIGGER newsletter_sequence_trigger
      AFTER INSERT ON newsletter_subscribers
      FOR EACH ROW
      EXECUTE FUNCTION auto_enroll_newsletter();
  END IF;
END $$;

-- Trigger to auto-enroll new leads
CREATE OR REPLACE FUNCTION auto_enroll_lead()
RETURNS TRIGGER AS $$
DECLARE
  sequence_record email_sequences%ROWTYPE;
BEGIN
  -- Find active sequence for lead creation
  FOR sequence_record IN
    SELECT * FROM email_sequences
    WHERE trigger_type = 'lead_created' AND is_active = true
  LOOP
    PERFORM enroll_in_sequence(NEW.email, sequence_record.id);
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for lead auto-enrollment
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'lead_sequence_trigger') THEN
    CREATE TRIGGER lead_sequence_trigger
      AFTER INSERT ON leads
      FOR EACH ROW
      EXECUTE FUNCTION auto_enroll_lead();
  END IF;
END $$;

-- Insert default welcome sequence
INSERT INTO email_sequences (id, name, description, trigger_type)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Welcome Sequence',
  'Automated welcome emails for new newsletter subscribers',
  'newsletter_signup'
) ON CONFLICT DO NOTHING;

-- Insert default welcome email steps
INSERT INTO email_sequence_steps (sequence_id, step_order, subject, body_html, delay_days, delay_hours)
VALUES
  (
    'a0000000-0000-0000-0000-000000000001',
    1,
    'Welcome to Axrategy!',
    '<h1>Welcome to Axrategy!</h1>
<p>Thank you for subscribing to our newsletter. We''re excited to have you join our community of forward-thinking business leaders.</p>
<p>At Axrategy, we help businesses leverage AI and automation to work smarter, not harder.</p>
<p>Here''s what you can expect from us:</p>
<ul>
  <li>Weekly insights on AI and automation trends</li>
  <li>Practical tips to improve your business operations</li>
  <li>Case studies from real client transformations</li>
  <li>Exclusive offers and early access to new services</li>
</ul>
<p>Stay tuned for our next email!</p>
<p>Best,<br>The Axrategy Team</p>',
    0,
    0
  ),
  (
    'a0000000-0000-0000-0000-000000000001',
    2,
    'How AI is Transforming Small Businesses',
    '<h1>How AI is Transforming Small Businesses</h1>
<p>Did you know that businesses using AI assistants save an average of 20 hours per week?</p>
<p>In this email, we want to share some quick wins you can implement today:</p>
<ol>
  <li><strong>Automated Customer Support</strong> - AI chatbots can handle 80% of routine inquiries</li>
  <li><strong>Smart Scheduling</strong> - Let AI manage your calendar and bookings</li>
  <li><strong>Content Generation</strong> - Create first drafts in seconds, not hours</li>
</ol>
<p>Curious how this applies to your business? <a href="https://axrategy.com/services">Check out our services</a> or <a href="https://axrategy.com/contact">book a free consultation</a>.</p>
<p>Best,<br>The Axrategy Team</p>',
    3,
    0
  ),
  (
    'a0000000-0000-0000-0000-000000000001',
    3,
    'Ready to Take the Next Step?',
    '<h1>Ready to Transform Your Business?</h1>
<p>By now, you''ve seen how AI and automation can revolutionize the way you work.</p>
<p>We''d love to learn more about your business and show you exactly how we can help.</p>
<p>Here are your next steps:</p>
<ul>
  <li><a href="https://axrategy.com/work">View our case studies</a> - See real results from businesses like yours</li>
  <li><a href="https://axrategy.com/pricing">Check our pricing</a> - Transparent, flexible options for every budget</li>
  <li><a href="https://axrategy.com/contact">Book a free call</a> - Let''s discuss your specific needs</li>
</ul>
<p>No pressure, no sales pitch - just a friendly conversation about your goals.</p>
<p>Looking forward to hearing from you!</p>
<p>Best,<br>The Axrategy Team</p>',
    7,
    0
  )
ON CONFLICT DO NOTHING;