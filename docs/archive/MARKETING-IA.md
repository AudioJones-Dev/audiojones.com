# Marketing Site Information Architecture & Governance

**Version:** 1.0  
**Last Updated:** 2025-01-25  
**Owner:** Engineering / Marketing Alignment

---

## Overview

This document defines the governance and structure for the Audio Jones public marketing site (`audiojones.com`). It ensures the website accurately reflects the integrated platform architecture connecting the Admin Portal, Client Portal, billing systems (Whop/Stripe), and internal modules.

---

## 🗺️ Site Structure

### Primary Routes

```
/                       # Homepage (EPM framework introduction)
/services               # Service offerings with Whop product integration
/systems                # Systems overview (module hub)
  /client-delivery      # Client Delivery System detail page
  /marketing-automation # Marketing Automation System detail page
  /ai-optimization      # AI Optimization System detail page
  /data-intelligence    # Data Intelligence System detail page
/creators               # Persona page for artists, podcasters, content creators
/business               # Persona page for consultants, SMBs, thought leaders
/epm                    # EPM Theory deep dive
/portal                 # Client Portal (auth-protected)
  [... protected routes]
```

### Navigation Configuration

**Source of Truth:** `src/config/nav.ts`

This file exports:
- `mainNav`: Primary site navigation (8 items)
- `portalNav`: Portal-specific navigation (2 items)
- `systemModules`: Module configuration array (4 modules)
- `funnelStages`: Customer journey stages (5 stages)

**Header Component:** `src/components/Header.tsx`  
Should consume `mainNav` and `systemModules` from the nav config for consistency.

---

## 🎯 Module-to-System Mapping

Each system module page lives at `/systems/[module]` and directly relates to internal functionality:

| Module Path                      | Internal System             | Portal Integration          | Funnel Stage |
|----------------------------------|-----------------------------|------------------------------|--------------|
| `/systems/client-delivery`       | Project Management, Files   | Client Portal → Projects     | Deliver      |
| `/systems/marketing-automation`  | Campaign Engine, Scheduling | Admin Portal → Campaigns     | Discover     |
| `/systems/ai-optimization`       | A/B Testing, ML Insights    | Admin Portal → Optimization  | Optimize     |
| `/systems/data-intelligence`     | Analytics, Reporting        | Admin Portal → Analytics     | Optimize     |

---

## 🔗 Platform Integration Points

### Portal Links

- **Client Portal:** `https://client.audiojones.com`
  - Login, Projects, Files, Bookings, Invoices
- **Admin Portal:** `https://admin.audiojones.com`
  - CRM, Campaigns, Analytics, Orders, Licenses

### Billing Systems

- **Whop:** Product licensing and customer management
  - Integration: `/api/whop/*`
  - Services page: `/services` (product catalog)
  - TODO: Map checkout URLs for each product SKU
- **Stripe:** Payment processing and customer portal
  - Integration: `/api/stripe/*`
  - TODO: Add direct checkout links on system pages

### External Links

- **ArtistHub:** Creator community and resources
  - URL: `https://hub.audiojones.com` (planned)
  - Currently featured on `/creators` page

---

## 📊 Funnel Mapping

The **5-stage funnel** connects modules to customer journey:

```
Discover → Book → Deliver → Optimize → Retain
```

| Stage      | Primary Modules                  | Key Actions                          |
|------------|----------------------------------|--------------------------------------|
| Discover   | Marketing Automation             | Content, SEO, Social Distribution    |
| Book       | Marketing Automation             | Lead Capture, Qualification, Booking |
| Deliver    | Client Delivery                  | Onboarding, Project Management       |
| Optimize   | AI Optimization, Data Intelligence | A/B Testing, Analytics, Reporting    |
| Retain     | Client Delivery, Data Intelligence | Support, Renewals, Upsells           |

---

## 🎨 Brand System

### Color Gradients

Each module uses a distinct gradient for visual differentiation:

- **Client Delivery:** `#FF4500` (orange) → `#FFD700` (gold)
- **Marketing Automation:** `#008080` (teal) → `#FFD700` (gold)
- **AI Optimization:** `#9370DB` (purple) → `#FFD700` (gold)
- **Data Intelligence:** `#4169E1` (royal blue) → `#00CED1` (turquoise)

### Typography

- **Font Stack:** Geist Sans (primary), Geist Mono (code)
- **Heading Hierarchy:** `text-5xl md:text-7xl` (h1), `text-3xl md:text-4xl` (h2)

---

## 🔧 Page Structure Template

All system module pages (`/systems/[module]/page.tsx`) follow this consistent structure:

1. **Hero Section**: Headline, tagline, description
2. **How This Connects**: Links to Client Portal, Admin Portal, Billing
3. **5-Step Pipeline**: Visual funnel with module-specific stages
4. **CTA Section**: Call-to-action for booking or viewing services

### Code Pattern

```tsx
// Hero
<h1>
  <span className="bg-gradient-to-r from-[#COLOR1] to-[#COLOR2] bg-clip-text text-transparent">
    Module Name
  </span>
</h1>

// Connection Cards
<Link href="https://client.audiojones.com" target="_blank" rel="noopener noreferrer">
  Client Portal
</Link>

// Pipeline Steps
{steps.map((step, idx) => (
  <div key={idx} className="p-6 rounded-2xl border border-white/10">
    <h3>{step.title}</h3>
    <p>{step.description}</p>
  </div>
))}

// CTA
<Link href="https://client.audiojones.com/login" className="gradient-button">
  Book a Session
</Link>
```

---

## ⚠️ TODO: Pending Integrations

The following integration points require product mapping before deployment:

### Whop Checkout URLs

**Location:** All system pages have TODO comments for Whop checkout links.

**Required Actions:**
1. Map Whop product SKUs to system modules
2. Replace placeholder text in "How This Connects → Billing" sections
3. Update `/services` page with direct checkout links

**Example:**
```tsx
// TODO: Replace with actual Whop checkout URL for [module] product
<Link href="https://whop.com/audiojones/[PRODUCT_SKU]">
  Purchase This Module
</Link>
```

### Stripe Customer Portal

**Location:** CTA sections on module pages

**Required Actions:**
1. Implement session-aware Stripe portal links
2. Add payment method management
3. Link subscription tiers to module access

---

## 📝 Governance Rules

### Content Updates

1. **Navigation Changes**: Update `src/config/nav.ts` first, then dependent components
2. **New Modules**: Add to `systemModules` array with required fields (id, name, href, icon, color, funnelStage)
3. **Persona Pages**: Follow structure pattern from `/creators` and `/business`

### Code Standards

- **TypeScript**: All pages must export `Metadata` for SEO
- **Links**: Use `next/link` for internal routes, add `target="_blank" rel="noopener noreferrer"` for external
- **Styling**: Tailwind CSS with design tokens from brand system
- **Accessibility**: Proper heading hierarchy, alt text on images, keyboard navigation

### Testing Requirements

Before deployment:
1. Run `npm run build` to verify no type errors
2. Check all internal links resolve (no 404s)
3. Verify portal links use correct subdomains
4. Test responsive layouts on mobile/tablet/desktop

---

## 🚀 Deployment Process

1. **Edit Phase**: Make changes to marketing pages
2. **Build Phase**: Run `npm run build` until clean
3. **Review Phase**: Verify changes in dev environment
4. **Commit**: Use semantic commit messages (`feat:`, `fix:`, `docs:`)
5. **Push**: Deploy to `main` branch triggers Vercel production deploy

---

## 📚 Reference Links

- **Navigation Config:** `src/config/nav.ts`
- **Header Component:** `src/components/Header.tsx`
- **Systems Hub:** `src/app/systems/page.tsx`
- **Module Pages:** `src/app/systems/[module]/page.tsx`
- **Persona Pages:** `src/app/creators/page.tsx`, `src/app/business/page.tsx`
- **EPM Theory:** `.github/copilot-instructions.md` (EPM framework section)

---

## 🔄 Version History

| Version | Date       | Changes                                      | Author |
|---------|------------|----------------------------------------------|--------|
| 1.0     | 2025-01-25 | Initial IA documentation for M1 governance   | System |

---

**Next Review Date:** 2025-02-25  
**Contact:** Engineering team for technical changes, Marketing team for content updates
