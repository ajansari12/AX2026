# Axrategy Enhancement Roadmap

## Priority Framework

Each feature is scored on:
- **Impact**: Business value (revenue, conversion, retention)
- **Effort**: Development complexity
- **Dependencies**: What needs to exist first

---

## Phase 1: Foundation & Quick Wins (Weeks 1-2)

These are high-impact, low-effort improvements that fix critical gaps.

### 1.1 Admin Search & Filtering (Priority: CRITICAL)
**Impact: High | Effort: Low**

Currently, the admin panel has no way to search or filter data. As leads grow, this becomes unusable.

```
Features:
- Global search across leads, conversations, bookings
- Filter by status, source, date range
- Sort by any column
- Persist filter preferences in localStorage
```

### 1.2 Data Export (Priority: CRITICAL)
**Impact: High | Effort: Low**

Admins can't export data for reporting, CRM import, or backup purposes.

```
Features:
- Export leads to CSV/Excel
- Export subscribers list
- Export conversation transcripts
- Include all metadata (UTM, source, timestamps)
```

### 1.3 Lead Notes & Activity Timeline (Priority: HIGH)
**Impact: High | Effort: Medium**

No way to track interactions with leads or add internal notes.

```
Features:
- Add notes to any lead
- Automatic activity logging (status changes, emails sent)
- Timeline view of all interactions
- @mentions for team collaboration (future)
```

### 1.4 Form Spam Protection (Priority: HIGH)
**Impact: High | Effort: Low**

No CAPTCHA or rate limiting - vulnerable to spam and abuse.

```
Features:
- Add hCaptcha or Cloudflare Turnstile (privacy-friendly)
- Rate limit form submissions by IP
- Honeypot fields for bot detection
- Block disposable email domains
```

### 1.5 Basic Analytics Dashboard (Priority: HIGH)
**Impact: High | Effort: Medium**

Admin overview shows numbers but no trends or insights.

```
Features:
- Weekly/monthly lead trends chart
- Lead source breakdown (pie chart)
- Conversion rate by source
- Response time metrics
```

---

## Phase 2: User Experience & Conversion (Weeks 3-4)

Focus on converting more visitors and improving the lead journey.

### 2.1 Enhanced Chat Widget (Priority: HIGH)
**Impact: High | Effort: Medium**

Current chat is functional but misses conversion opportunities.

```
Features:
- Proactive greeting based on page (e.g., "Questions about pricing?")
- Request human callback option
- Email capture before chat ends
- Typing indicator improvements
- Chat rating/feedback
- File/image sharing
```

### 2.2 Booking Enhancements (Priority: HIGH)
**Impact: High | Effort: Medium**

Current booking flow is basic - missing key conversion features.

```
Features:
- Email confirmation with .ics calendar attachment
- SMS reminder 24h and 1h before meeting
- Easy reschedule/cancel link
- Pre-meeting questionnaire
- Multiple meeting types (15min intro, 30min deep dive)
```

### 2.3 Social Proof Notifications (Priority: MEDIUM)
**Impact: Medium | Effort: Low**

Add urgency and trust signals.

```
Features:
- "Someone from Toronto just booked a call" popups
- Real-time activity feed
- "X people viewing this page" indicators
- Review/testimonial carousel with video support
```

### 2.4 Service Recommendation Quiz (Priority: MEDIUM)
**Impact: Medium | Effort: Medium**

Help visitors self-qualify and find the right service.

```
Features:
- 5-7 question interactive quiz
- "What's your biggest challenge?" flow
- Personalized recommendation at end
- Lead capture with quiz results
- Admin sees quiz responses with lead
```

### 2.5 Search Functionality (Priority: MEDIUM)
**Impact: Medium | Effort: Medium**

No way to search content on the site.

```
Features:
- Global search modal (Cmd+K)
- Search blog posts, services, case studies
- Recent searches
- Keyboard navigation
- Highlight matching text
```

---

## Phase 3: Client Portal & Retention (Weeks 5-6)

Build features that serve existing clients and improve retention.

### 3.1 Client Portal (Priority: HIGH)
**Impact: Very High | Effort: High**

Major differentiator - gives clients a place to manage their relationship.

```
Features:
- Client login (separate from admin)
- Project status dashboard
- Document sharing (proposals, contracts, assets)
- Invoice history and payment status
- Direct messaging with team
- Knowledge base access
```

### 3.2 Project Request Form (Priority: HIGH)
**Impact: High | Effort: Medium**

More detailed intake than basic contact form.

```
Features:
- Multi-step form wizard
- Budget range selector
- Timeline preferences
- File upload (briefs, examples, assets)
- Industry/business type selection
- Conditional questions based on service
```

### 3.3 Email Marketing Integration (Priority: HIGH)
**Impact: High | Effort: Medium**

Newsletter subscribers just sit in database - no nurturing.

```
Features:
- Integrate with Resend or ConvertKit
- Welcome email sequence
- Weekly newsletter automation
- Lead nurturing drip campaigns
- Unsubscribe handling
```

### 3.4 Admin Notifications (Priority: MEDIUM)
**Impact: Medium | Effort: Low**

Admins don't know when new leads come in.

```
Features:
- Email notification for new leads
- Slack/Discord webhook integration
- Daily digest email option
- Push notifications (PWA)
- Customizable notification preferences
```

---

## Phase 4: Advanced Admin & Operations (Weeks 7-8)

Scale the admin experience for growth.

### 4.1 Blog CMS (Priority: HIGH)
**Impact: High | Effort: Medium**

Blog posts are hardcoded in constants.ts - can't add/edit without deploying.

```
Features:
- WYSIWYG editor (TipTap or Slate)
- Image upload to Supabase Storage
- Draft/publish workflow
- Schedule posts for future
- SEO meta fields
- Categories and tags management
```

### 4.2 Lead Scoring & Pipeline (Priority: HIGH)
**Impact: High | Effort: Medium**

All leads treated equally - no prioritization.

```
Features:
- Automatic scoring based on:
  - Pages visited
  - Chat engagement
  - Resource downloads
  - Email opens
- Kanban pipeline view
- Deal value tracking
- Win/loss tracking with reasons
```

### 4.3 Bulk Actions (Priority: MEDIUM)
**Impact: Medium | Effort: Low**

Can only update one lead at a time.

```
Features:
- Select multiple rows
- Bulk status update
- Bulk delete
- Bulk export selected
- Bulk assign to team member (future)
```

### 4.4 Advanced Analytics (Priority: MEDIUM)
**Impact: Medium | Effort: Medium**

Deeper insights for decision making.

```
Features:
- Conversion funnel visualization
- Attribution reporting (first/last touch)
- Page-level analytics
- Chat analytics (common questions, resolution rate)
- ROI calculator based on closed deals
```

### 4.5 Audit Log (Priority: MEDIUM)
**Impact: Medium | Effort: Low**

No record of admin actions.

```
Features:
- Log all data changes
- Who changed what and when
- Filter by user, action type, date
- Export audit trail
```

---

## Phase 5: Growth & Integrations (Weeks 9-10)

Features that support scaling and external tool integration.

### 5.1 CRM Integration (Priority: HIGH)
**Impact: High | Effort: Medium**

Sync leads to external CRM systems.

```
Features:
- HubSpot integration
- Pipedrive integration
- Zapier webhook for any CRM
- Two-way sync option
- Field mapping configuration
```

### 5.2 Payment Integration (Priority: HIGH)
**Impact: Very High | Effort: Medium**

Can't collect payments through the site.

```
Features:
- Stripe Checkout integration
- Deposit collection for projects
- Invoice generation and payment
- Payment status in client portal
- Subscription billing (for monthly plans)
```

### 5.3 Proposal Generator (Priority: MEDIUM)
**Impact: Medium | Effort: Medium**

Streamline the sales process.

```
Features:
- Template-based proposals
- Drag-and-drop sections
- E-signature integration (DocuSign/HelloSign)
- Proposal tracking (viewed, signed)
- Auto-convert to invoice on acceptance
```

### 5.4 Multi-language Support (Priority: MEDIUM)
**Impact: Medium | Effort: High**

Expand to French-Canadian market.

```
Features:
- i18n infrastructure
- French translation
- Language switcher
- SEO for both languages
- Content management per language
```

### 5.5 API & Webhooks (Priority: LOW)
**Impact: Low | Effort: Medium**

For power users and custom integrations.

```
Features:
- RESTful API for leads, bookings
- Webhook events for new lead, booking, etc.
- API key management
- Rate limiting
- Documentation
```

---

## Phase 6: Technical Excellence (Ongoing)

Improvements that run parallel to feature development.

### 6.1 Testing Infrastructure (Priority: HIGH)
**Impact: High | Effort: Medium**

Zero tests in the codebase.

```
Features:
- Unit tests with Vitest
- Component tests with Testing Library
- E2E tests with Playwright
- CI/CD pipeline with GitHub Actions
- Test coverage reporting
```

### 6.2 Performance Optimization (Priority: MEDIUM)
**Impact: Medium | Effort: Low**

Several quick wins available.

```
Features:
- Route-based code splitting
- Image optimization (WebP, srcset)
- Lazy loading components
- Bundle size analysis
- Core Web Vitals monitoring
```

### 6.3 Accessibility (Priority: HIGH)
**Impact: High | Effort: Medium**

Limited accessibility support.

```
Features:
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- Focus management
- Color contrast fixes
- Skip links
```

### 6.4 Security Hardening (Priority: HIGH)
**Impact: Very High | Effort: Medium**

Several security gaps.

```
Features:
- Admin 2FA
- Password reset flow
- Session timeout
- Rate limiting on all endpoints
- Security headers
- Dependency vulnerability scanning
```

### 6.5 Monitoring & Observability (Priority: MEDIUM)
**Impact: Medium | Effort: Low**

No visibility into production issues.

```
Features:
- Error tracking (Sentry)
- Uptime monitoring
- Edge function logging
- Performance monitoring
- Alerting for errors
```

---

## Implementation Summary

| Phase | Duration | Focus Area | Key Deliverables |
|-------|----------|------------|------------------|
| 1 | Weeks 1-2 | Admin Foundation | Search, Export, Notes, Spam Protection |
| 2 | Weeks 3-4 | Conversion | Chat, Booking, Social Proof, Quiz |
| 3 | Weeks 5-6 | Client Experience | Portal, Intake Form, Email Marketing |
| 4 | Weeks 7-8 | Operations | CMS, Lead Scoring, Bulk Actions |
| 5 | Weeks 9-10 | Integrations | CRM, Payments, Proposals |
| 6 | Ongoing | Technical | Testing, Performance, Security |

---

## Recommended Starting Point

Based on impact and dependencies, start with these 5 items:

1. **Admin Search & Filtering** - Critical for usability
2. **Form Spam Protection** - Security requirement
3. **Data Export** - Quick win, high value
4. **Lead Notes** - Foundation for sales process
5. **Email Notifications** - Know when leads come in

These can all be implemented in the first sprint and immediately improve the admin experience.
