const fs = require('fs');
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf-8');

// Increase video opacity significantly
code = code.replace(
  'className="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover opacity-60"',
  'className="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover opacity-90"'
);

// Weaken the middle overlay so the video shines through clearly
code = code.replace(
  '<div className="absolute inset-0 bg-gradient-to-b from-slate-100/95 via-slate-100/50 to-slate-100/95" />',
  '<div className="absolute inset-0 bg-gradient-to-b from-slate-100/95 via-slate-100/30 to-slate-100/95" />'
);

// Add a white glow to the main text to ensure it remains readable against the clear video
code = code.replace(
  'className="font-pixel text-slate-900 text-3xl md:text-5xl lg:text-[3.5rem] leading-[1.4] mb-6"',
  'className="font-pixel text-slate-900 text-3xl md:text-5xl lg:text-[3.5rem] leading-[1.4] mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]"'
);

code = code.replace(
  'className="font-pixel-body text-slate-600 text-lg md:text-2xl mb-10 max-w-xl leading-relaxed"',
  'className="font-pixel-body text-slate-800 text-lg md:text-2xl mb-10 max-w-xl leading-relaxed drop-shadow-[0_0_8px_rgba(255,255,255,0.9)] font-medium"'
);

fs.writeFileSync('src/components/LandingPage.tsx', code);
console.log('Video made clearly visible and text readability improved.');
