# CORE RESOLUTION GROUP INC. — Corporate Landing Website

Premium corporate landing website built with vanilla HTML5, CSS3, and JavaScript (ES6+).

## Quick Start

### Option A: Local Server (Recommended)
```bash
# Using Node.js
npx -y serve .

# Or using Python
python -m http.server 8080
```

### Option B: Direct File
Open `index.html` directly in a modern browser. All features work without a build step.

## Project Structure

```
core-resolution-group/
├── index.html              # Main landing page
├── css/
│   ├── styles.css          # Design system & component styles
│   ├── animations.css      # Animation system (scroll reveals, transitions)
│   └── responsive.css      # Responsive breakpoints (360px – 1440px+)
├── js/
│   ├── main.js             # Header, nav, scroll, FAQ, back-to-top
│   ├── company-lookup.js   # Company code lookup logic
│   ├── contact-form.js     # Contact form validation & demo submission
│   └── data.js             # Mock company dataset (demo only)
├── robots.txt              # SEO — update domain before production
├── sitemap.xml             # SEO — update domain before production
└── README.md               # This file
```

## Implemented Sections

| Section | Status | Notes |
|---------|--------|-------|
| Header / Navigation | ✅ | Sticky, mobile hamburger, keyboard accessible |
| Hero | ✅ | Animated entrance, geometric visual |
| Company Code Lookup | ✅ | Mock data, loading/error/success states |
| About Us | ✅ | Proposed copy for client review |
| Services | ✅ | 4 service cards with hover effects |
| How It Works | ✅ | 4-step process with connecting line |
| Why Choose Us | ✅ | Dark section, 4 principle cards |
| Trust & Credibility | ✅ | 3 capability cards (ready for real content) |
| FAQ | ✅ | Accordion with keyboard support |
| Contact Form | ✅ | Validation, demo submission flow |
| Footer | ✅ | Full links, placeholder contact info |
| Scroll Animations | ✅ | Intersection Observer with stagger |
| Back-to-Top | ✅ | Smooth scroll with visibility toggle |
| Scroll Progress | ✅ | Top-of-page progress indicator |
| Help Modal | ✅ | Company code help dialog |

## Demo Data

The company lookup uses three sample records:
- **CRG-DEMO-001** — Meridian Logistics Partners
- **CRG-DEMO-002** — Pinnacle Advisory Services
- **CRG-DEMO-003** — Catalyst Infrastructure Group

These are clearly labeled as demonstration data throughout the interface.

## Content Required From the Client

- [ ] Official company logo
- [ ] Confirmed company description and messaging
- [ ] Verified service offerings
- [ ] Actual business process / workflow
- [ ] Client testimonials (approved for publication)
- [ ] Industry credentials or certifications
- [ ] Office address, email, phone number
- [ ] Privacy Policy and Terms of Use content
- [ ] Confirmed domain name
- [ ] Company code database or API endpoint
- [ ] Approved photography or imagery

## Backend Integrations Required

| Feature | Current State | Production Requirement |
|---------|---------------|----------------------|
| Company Lookup | Mock data (data.js) | API endpoint (/api/company-lookup) |
| Contact Form | Demo simulation | Backend endpoint + email service |
| Privacy Policy | Placeholder link | Legal-approved page |
| Terms of Use | Placeholder link | Legal-approved page |

## Known Limitations

1. **Company lookup** uses static demo data — not connected to a real database
2. **Contact form** does not send data anywhere — demo simulation only
3. **Contact details** in footer are placeholders awaiting client input
4. **Service descriptions** are proposed copy, not confirmed offerings
5. **Logo** is a temporary text wordmark with a geometric SVG symbol
6. **Icons** loaded from Lucide CDN — consider bundling for production
7. **No analytics** or cookie consent implemented

## Browser Support

Tested for:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Accessibility

- Semantic HTML5 landmarks
- ARIA labels and roles
- Keyboard-navigable components
- prefers-reduced-motion support
- Visible focus indicators
- Color contrast compliance
