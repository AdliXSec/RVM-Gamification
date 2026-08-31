const fs = require('fs');

let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf-8');

// 1. Soften Global Backgrounds
code = code.replace('bg-slate-50 text-slate-800', 'bg-slate-100 text-slate-800');
code = code.replace('bg-white/90 backdrop-blur-md border-b border-green-100', 'bg-slate-100/80 backdrop-blur-md border-b border-slate-200');

// 2. Fix Hero Video Visibility (increase video opacity, reduce white mask)
code = code.replace(
  'className="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover opacity-20"',
  'className="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover opacity-60"'
);
code = code.replace(
  '<div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/80 to-white/95" />',
  '<div className="absolute inset-0 bg-gradient-to-b from-slate-100/95 via-slate-100/50 to-slate-100/95" />'
);
code = code.replace(
  '<div className="absolute inset-0 bg-green-50/40" />',
  '<div className="absolute inset-0 bg-emerald-500/10 mix-blend-color" />'
);

// 3. Soften Badges and Cards
code = code.replace('bg-green-100 mb-6', 'bg-green-200/50 mb-6'); // Hero badge
code = code.replace('bg-slate-50 relative z-10 border-b-4 border-slate-200', 'bg-slate-100 relative z-10 border-b-4 border-slate-300'); // Guide section
code = code.replace('bg-white p-6 pixel-border border-slate-200', 'bg-slate-50 p-6 pixel-border border-slate-300'); // Benefits cards
code = code.replace('bg-white p-2 md:p-3 shadow-2xl border-slate-200', 'bg-slate-50 p-2 md:p-3 shadow-xl border-slate-300'); // Canvas container
code = code.replace('bg-white text-slate-700', 'bg-slate-50 text-slate-700'); // Scanning badge

// 4. Soften Features Section
code = code.replace('bg-white border-b-4 border-slate-200 px-4 py-24', 'bg-slate-100 border-b-4 border-slate-300 px-4 py-24'); // Features bg
code = code.replace('bg-slate-50 p-8 pixel-card group hover:bg-green-50', 'bg-slate-200/50 p-8 pixel-card group hover:bg-green-50'); // Features cards
code = code.replace('bg-white inline-block pixel-border border-b-4 border-slate-200', 'bg-slate-50 inline-block pixel-border border-b-4 border-slate-300'); // Features icon box

// 5. Soften Marquee and Global Stats (Darker/Muted green instead of neon green)
code = code.replace('bg-green-600 border-y-4 border-green-700', 'bg-emerald-700 border-y-4 border-emerald-800'); // Marquee
code = code.replace('bg-green-600 px-4 py-24', 'bg-emerald-700 px-4 py-24'); // Global Stats bg
code = code.replace('bg-green-500 p-8 md:p-12 text-center border-green-700', 'bg-emerald-600 p-8 md:p-12 text-center border-emerald-800'); // Stats box

// Write changes
fs.writeFileSync('src/components/LandingPage.tsx', code);
console.log('Theme softened successfully.');
