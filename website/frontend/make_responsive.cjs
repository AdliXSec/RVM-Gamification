const fs = require('fs');
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf-8');

// 1. Fix Canvas / Text order on Mobile
// The grid container
code = code.replace(
  '<div className="max-w-[90rem] mx-auto w-full grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">',
  '<div className="max-w-[90rem] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 items-center h-[90vh] lg:h-auto justify-center">'
);

// Text Side
code = code.replace(
  '<div className="lg:col-span-5 space-y-8 md:space-y-12">',
  '<div className="lg:col-span-5 space-y-4 md:space-y-12 order-2 lg:order-1">'
);

// Canvas Side
code = code.replace(
  '<div className="lg:col-span-7 relative mt-8 lg:mt-0">',
  '<div className="lg:col-span-7 relative mt-4 lg:mt-0 order-1 lg:order-2">'
);

// Decrease font sizes for mobile in the interactive text to prevent overflow
code = code.replace(
  'h3 className="font-pixel text-slate-800 dark:text-slate-100 text-lg md:text-xl flex items-center gap-2 border-b-2 border-slate-200 dark:border-slate-700 pb-2 mb-8"',
  'h3 className="font-pixel text-slate-800 dark:text-slate-100 text-sm md:text-xl flex items-center gap-2 border-b-2 border-slate-200 dark:border-slate-700 pb-2 mb-4 lg:mb-8"'
);
code = code.replace(
  'h3 className="font-pixel text-slate-800 dark:text-slate-100 text-lg md:text-xl flex items-center gap-2 border-b-2 border-slate-200 dark:border-slate-700 pb-2 mb-6"',
  'h3 className="font-pixel text-slate-800 dark:text-slate-100 text-sm md:text-xl flex items-center gap-2 border-b-2 border-slate-200 dark:border-slate-700 pb-2 mb-4 lg:mb-6"'
);

// 2. Fix Leaderboard Mobile Order
// Rank 2
code = code.replace(
  '<div className="bg-white dark:bg-slate-900 p-6 pixel-border border-slate-200 dark:border-slate-700 shadow-md text-center transform hover:-translate-y-2 transition-transform">',
  '<div className="bg-white dark:bg-slate-900 p-6 pixel-border border-slate-200 dark:border-slate-700 shadow-md text-center transform hover:-translate-y-2 transition-transform order-2 md:order-1">'
);
// Rank 1
code = code.replace(
  '<div className="bg-white dark:bg-slate-900 p-8 pixel-border border-yellow-400 shadow-2xl text-center transform hover:-translate-y-2 transition-transform relative md:-mt-12 z-10">',
  '<div className="bg-white dark:bg-slate-900 p-8 pixel-border border-yellow-400 shadow-2xl text-center transform hover:-translate-y-2 transition-transform relative md:-mt-12 z-10 order-1 md:order-2">'
);
// Rank 3
code = code.replace(
  '<div className="bg-white dark:bg-slate-900 p-6 pixel-border border-slate-200 dark:border-slate-700 shadow-md text-center transform hover:-translate-y-2 transition-transform">',
  '<div className="bg-white dark:bg-slate-900 p-6 pixel-border border-slate-200 dark:border-slate-700 shadow-md text-center transform hover:-translate-y-2 transition-transform order-3 md:order-3">'
);

fs.writeFileSync('src/components/LandingPage.tsx', code);
console.log('Mobile responsiveness applied!');
