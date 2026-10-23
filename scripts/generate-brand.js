/**
 * Brand Assets Generator for CORE RESOLUTION GROUP INC.
 * Generates:
 * - logo-icon.svg (master icon badge)
 * - logo-mark.svg (transparent background vector mark)
 * - logo.svg (horizontal full lockup for dark headers)
 * - logo-light.svg (horizontal full lockup for light themes)
 * - favicon.svg (browser favicon)
 * - site.webmanifest
 */

const fs = require('fs');
const path = require('path');

const brandDir = path.join(__dirname, '..', 'assets', 'brand');
if (!fs.existsSync(brandDir)) {
  fs.mkdirSync(brandDir, { recursive: true });
}

// ── 1. Master Icon Badge (logo-icon.svg) ───────────────────────────
// Premium squircle badge with deep midnight gradient, layered geometric nexus ribbons,
// and central glowing resolution core diamond.
const logoIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128" fill="none">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F224A"/>
      <stop offset="50%" stop-color="#08142C"/>
      <stop offset="100%" stop-color="#040A17"/>
    </linearGradient>

    <!-- Subtle Border Stroke Gradient -->
    <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#60A5FA" stop-opacity="0.8"/>
      <stop offset="35%" stop-color="#3B82F6" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#1E3A8A" stop-opacity="0.15"/>
    </linearGradient>

    <!-- Inner Radial Glow -->
    <radialGradient id="innerGlow" cx="50%" cy="45%" r="60%">
      <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.22"/>
      <stop offset="50%" stop-color="#1D4ED8" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#08142C" stop-opacity="0"/>
    </radialGradient>

    <!-- Ribbon 1: Upper-Right Facet (Intake/Cyan-Blue) -->
    <linearGradient id="ribbon1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#2563EB"/>
    </linearGradient>

    <!-- Ribbon 2: Bottom-Right Facet (Coordination/Royal Blue) -->
    <linearGradient id="ribbon2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#60A5FA"/>
      <stop offset="60%" stop-color="#1D4ED8"/>
      <stop offset="100%" stop-color="#1E3A8A"/>
    </linearGradient>

    <!-- Ribbon 3: Left Sweeping Facet (Resolution/Indigo-Cobalt) -->
    <linearGradient id="ribbon3" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#93C5FD"/>
      <stop offset="50%" stop-color="#3B82F6"/>
      <stop offset="100%" stop-color="#1D4ED8"/>
    </linearGradient>

    <!-- Central Core Glow Gradient -->
    <linearGradient id="coreGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="50%" stop-color="#93C5FD"/>
      <stop offset="100%" stop-color="#38BDF8"/>
    </linearGradient>

    <!-- Core Radial Flare -->
    <radialGradient id="coreFlare" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="35%" stop-color="#60A5FA" stop-opacity="0.9"/>
      <stop offset="70%" stop-color="#38BDF8" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#2563EB" stop-opacity="0"/>
    </radialGradient>

    <!-- Drop Shadow Filter for Layer Depth -->
    <filter id="layerShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#020617" flood-opacity="0.6"/>
    </filter>

    <filter id="coreGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Squircle Base Tile -->
  <rect x="4" y="4" width="120" height="120" rx="30" fill="url(#bgGrad)"/>
  <rect x="4" y="4" width="120" height="120" rx="30" fill="url(#innerGlow)"/>
  <rect x="4.5" y="4.5" width="119" height="119" rx="29.5" stroke="url(#borderGrad)" stroke-width="1.5"/>

  <!-- Subtle Precision Grid Accent (Hex Ring) -->
  <circle cx="64" cy="64" r="38" stroke="#38BDF8" stroke-width="1" stroke-dasharray="2 6" opacity="0.25"/>

  <!-- Interlocking Dynamic Nexus Facets -->
  <g filter="url(#layerShadow)">
    <!-- Facet Left: Sweeping "C" Curve Foundation -->
    <path d="M 64 26
             C 44 26, 29 42, 29 64
             C 29 84, 43 99, 61 101
             C 53 93, 47 81, 47 67
             C 47 48, 56 36, 64 26 Z"
          fill="url(#ribbon3)"/>

    <!-- Facet Bottom-Right: Dynamic Rising Resolution Strut -->
    <path d="M 64 102
             C 83 100, 99 85, 99 64
             C 99 55, 95 47, 88 40
             C 89 50, 85 62, 77 71
             C 71 78, 64 88, 64 102 Z"
          fill="url(#ribbon2)"/>

    <!-- Facet Top-Right: Forward Precision Apex Wing -->
    <path d="M 87 39
             C 81 31, 73 26, 64 26
             C 67 36, 73 45, 81 51
             C 88 57, 94 66, 95 76
             C 98 71, 99 66, 99 60
             C 99 50, 94 42, 87 39 Z"
          fill="url(#ribbon1)"/>

    <!-- Geometric Intersection Ribbons (Creating 3D Origami Prism Fold) -->
    <path d="M 64 26 L 87 39 L 77 56 L 64 46 Z" fill="#60A5FA" opacity="0.85"/>
    <path d="M 64 102 L 47 88 L 61 74 L 74 86 Z" fill="#2563EB" opacity="0.85"/>
    <path d="M 32 54 L 47 43 L 57 58 L 44 68 Z" fill="#38BDF8" opacity="0.9"/>
  </g>

  <!-- Central Luminous Core Nexus -->
  <circle cx="64" cy="64" r="14" fill="url(#coreFlare)" opacity="0.75"/>
  
  <!-- Precision 4-Point Radiant Diamond Core -->
  <path d="M 64 47
           L 68.5 59.5
           L 81 64
           L 68.5 68.5
           L 64 81
           L 59.5 68.5
           L 47 64
           L 59.5 59.5 Z"
        fill="url(#coreGlowGrad)"
        filter="url(#coreGlow)"/>

  <!-- Micro Center Sparkle -->
  <circle cx="64" cy="64" r="3.5" fill="#FFFFFF"/>
</svg>`;

// ── 2. Vector Mark (logo-mark.svg - transparent background) ─────────
const logoMarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100" fill="none">
  <defs>
    <linearGradient id="markRibbon1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#2563EB"/>
    </linearGradient>
    <linearGradient id="markRibbon2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#60A5FA"/>
      <stop offset="60%" stop-color="#1D4ED8"/>
      <stop offset="100%" stop-color="#1E3A8A"/>
    </linearGradient>
    <linearGradient id="markRibbon3" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#93C5FD"/>
      <stop offset="50%" stop-color="#3B82F6"/>
      <stop offset="100%" stop-color="#1D4ED8"/>
    </linearGradient>
    <linearGradient id="markCoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="50%" stop-color="#93C5FD"/>
      <stop offset="100%" stop-color="#38BDF8"/>
    </linearGradient>
    <radialGradient id="markCoreFlare" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="40%" stop-color="#60A5FA" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#2563EB" stop-opacity="0"/>
    </radialGradient>
    <filter id="markShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#020617" flood-opacity="0.45"/>
    </filter>
  </defs>

  <g filter="url(#markShadow)">
    <!-- Facet Left -->
    <path d="M 50 12
             C 30 12, 15 28, 15 50
             C 15 70, 29 85, 47 87
             C 39 79, 33 67, 33 53
             C 33 34, 42 22, 50 12 Z"
          fill="url(#markRibbon3)"/>

    <!-- Facet Bottom-Right -->
    <path d="M 50 88
             C 69 86, 85 71, 85 50
             C 85 41, 81 33, 74 26
             C 75 36, 71 48, 63 57
             C 57 64, 50 74, 50 88 Z"
          fill="url(#markRibbon2)"/>

    <!-- Facet Top-Right -->
    <path d="M 73 25
             C 67 17, 59 12, 50 12
             C 53 22, 59 31, 67 37
             C 74 43, 80 52, 81 62
             C 84 57, 85 52, 85 46
             C 85 36, 80 28, 73 25 Z"
          fill="url(#markRibbon1)"/>

    <!-- Geometric Intersection Ribbons -->
    <path d="M 50 12 L 73 25 L 63 42 L 50 32 Z" fill="#60A5FA" opacity="0.85"/>
    <path d="M 50 88 L 33 74 L 47 60 L 60 72 Z" fill="#2563EB" opacity="0.85"/>
    <path d="M 18 40 L 33 29 L 43 44 L 30 54 Z" fill="#38BDF8" opacity="0.9"/>
  </g>

  <!-- Core Flare -->
  <circle cx="50" cy="50" r="12" fill="url(#markCoreFlare)" opacity="0.8"/>
  
  <!-- 4-Point Diamond Core -->
  <path d="M 50 34
           L 54.5 45.5
           L 66 50
           L 54.5 54.5
           L 50 66
           L 45.5 54.5
           L 34 50
           L 45.5 45.5 Z"
        fill="url(#markCoreGrad)"/>

  <!-- Core Center -->
  <circle cx="50" cy="50" r="3" fill="#FFFFFF"/>
</svg>`;

// ── 3. Horizontal Full Lockup (logo.svg - for dark backgrounds) ──────
const fullLogoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 64" width="320" height="64" fill="none">
  <defs>
    <linearGradient id="hdrBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F224A"/>
      <stop offset="100%" stop-color="#060F20"/>
    </linearGradient>
    <linearGradient id="hdrBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#60A5FA" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#1D4ED8" stop-opacity="0.2"/>
    </linearGradient>
    <linearGradient id="hdrRibbon1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#2563EB"/>
    </linearGradient>
    <linearGradient id="hdrRibbon2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#60A5FA"/>
      <stop offset="100%" stop-color="#1D4ED8"/>
    </linearGradient>
    <linearGradient id="hdrRibbon3" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#93C5FD"/>
      <stop offset="100%" stop-color="#2563EB"/>
    </linearGradient>
    <linearGradient id="hdrTextGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#60A5FA"/>
      <stop offset="100%" stop-color="#93C5FD"/>
    </linearGradient>
  </defs>

  <!-- Left Icon Emblem Badge -->
  <g transform="translate(4, 4)">
    <rect width="56" height="56" rx="15" fill="url(#hdrBgGrad)"/>
    <rect x="0.5" y="0.5" width="55" height="55" rx="14.5" stroke="url(#hdrBorderGrad)" stroke-width="1"/>
    
    <!-- Scaled Mark inside 56x56 box -->
    <g transform="translate(8, 8) scale(0.4)">
      <!-- Left Facet -->
      <path d="M 50 12 C 30 12, 15 28, 15 50 C 15 70, 29 85, 47 87 C 39 79, 33 67, 33 53 C 33 34, 42 22, 50 12 Z" fill="url(#hdrRibbon3)"/>
      <!-- Bottom-Right Facet -->
      <path d="M 50 88 C 69 86, 85 71, 85 50 C 85 41, 81 33, 74 26 C 75 36, 71 48, 63 57 C 57 64, 50 74, 50 88 Z" fill="url(#hdrRibbon2)"/>
      <!-- Top-Right Facet -->
      <path d="M 73 25 C 67 17, 59 12, 50 12 C 53 22, 59 31, 67 37 C 74 43, 80 52, 81 62 C 84 57, 85 52, 85 46 C 85 36, 80 28, 73 25 Z" fill="url(#hdrRibbon1)"/>
      <!-- Core Diamond -->
      <path d="M 50 36 L 53.5 46.5 L 64 50 L 53.5 53.5 L 50 64 L 46.5 53.5 L 36 50 L 46.5 46.5 Z" fill="#FFFFFF"/>
      <circle cx="50" cy="50" r="3.5" fill="#38BDF8"/>
    </g>
  </g>

  <!-- Brand Typography -->
  <g transform="translate(74, 25)">
    <text font-family="'Manrope', -apple-system, BlinkMacSystemFont, sans-serif" font-size="20" font-weight="800" letter-spacing="-0.02em">
      <tspan fill="#FFFFFF">CORE </tspan>
      <tspan fill="url(#hdrTextGrad)">RESOLUTION</tspan>
    </text>
  </g>

  <!-- Subtitle Tagline -->
  <g transform="translate(75, 45)">
    <text font-family="'Manrope', -apple-system, BlinkMacSystemFont, sans-serif" font-size="9" font-weight="700" letter-spacing="0.28em" fill="rgba(255, 255, 255, 0.55)">
      GROUP INC.
    </text>
  </g>
</svg>`;

// ── 4. Favicon SVG (favicon.svg - high-contrast for tabs) ───────────
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" fill="none">
  <defs>
    <linearGradient id="favBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0E234B"/>
      <stop offset="100%" stop-color="#050C1A"/>
    </linearGradient>
    <linearGradient id="favR1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#2563EB"/>
    </linearGradient>
    <linearGradient id="favR2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#60A5FA"/>
      <stop offset="100%" stop-color="#1D4ED8"/>
    </linearGradient>
    <linearGradient id="favR3" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#93C5FD"/>
      <stop offset="100%" stop-color="#2563EB"/>
    </linearGradient>
  </defs>

  <!-- Background Squircle with subtle border -->
  <rect width="64" height="64" rx="16" fill="url(#favBg)"/>
  <rect x="0.5" y="0.5" width="63" height="63" rx="15.5" stroke="#38BDF8" stroke-opacity="0.4" stroke-width="1"/>

  <!-- Scaled Resolution Nexus Mark -->
  <g transform="translate(8, 8) scale(0.48)">
    <path d="M 50 12 C 30 12, 15 28, 15 50 C 15 70, 29 85, 47 87 C 39 79, 33 67, 33 53 C 33 34, 42 22, 50 12 Z" fill="url(#favR3)"/>
    <path d="M 50 88 C 69 86, 85 71, 85 50 C 85 41, 81 33, 74 26 C 75 36, 71 48, 63 57 C 57 64, 50 74, 50 88 Z" fill="url(#favR2)"/>
    <path d="M 73 25 C 67 17, 59 12, 50 12 C 53 22, 59 31, 67 37 C 74 43, 80 52, 81 62 C 84 57, 85 52, 85 46 C 85 36, 80 28, 73 25 Z" fill="url(#favR1)"/>
    <!-- Core Flare & Diamond -->
    <path d="M 50 33 L 54.5 45.5 L 67 50 L 54.5 54.5 L 50 67 L 45.5 54.5 L 33 50 L 45.5 45.5 Z" fill="#FFFFFF"/>
    <circle cx="50" cy="50" r="3.5" fill="#38BDF8"/>
  </g>
</svg>`;

// ── 5. PWA Webmanifest ──────────────────────────────────────────────
const webManifest = {
  name: "Core Resolution Group Inc.",
  short_name: "Core Resolution",
  description: "Providing structured, transparent, and responsive solutions for complex business challenges.",
  start_url: "/",
  display: "standalone",
  background_color: "#060F20",
  theme_color: "#08142C",
  icons: [
    {
      src: "/favicon.svg",
      sizes: "any",
      type: "image/svg+xml",
      purpose: "any maskable"
    },
    {
      src: "/assets/brand/android-chrome-192x192.png",
      sizes: "192x192",
      type: "image/png"
    },
    {
      src: "/assets/brand/android-chrome-512x512.png",
      sizes: "512x512",
      type: "image/png"
    },
    {
      src: "/apple-touch-icon.png",
      sizes: "180x180",
      type: "image/png"
    }
  ]
};

// Write SVGs to disk
fs.writeFileSync(path.join(brandDir, 'logo-icon.svg'), logoIconSvg.trim());
fs.writeFileSync(path.join(brandDir, 'logo-mark.svg'), logoMarkSvg.trim());
fs.writeFileSync(path.join(brandDir, 'logo.svg'), fullLogoSvg.trim());
fs.writeFileSync(path.join(__dirname, '..', 'favicon.svg'), faviconSvg.trim());
fs.writeFileSync(path.join(__dirname, '..', 'site.webmanifest'), JSON.stringify(webManifest, null, 2));

console.log('SVG Brand Assets generated successfully!');
