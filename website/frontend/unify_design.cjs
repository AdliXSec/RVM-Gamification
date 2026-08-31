const fs = require('fs');
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf-8');

// ==========================================
// 1. REMOVE EXCESSIVE ICONS
// ==========================================
// Hero Badge Stars
code = code.replace(/<Star className="w-3 h-3 text-amber-500" \/> /g, '');
code = code.replace(/ <Star className="w-3 h-3 text-amber-500" \/>/g, '');

// Leaderboard Trophys
code = code.replace(/<Trophy className="w-8 h-8 md:w-12 md:h-12 text-yellow-500" \/> /g, '');
code = code.replace(/ <Trophy className="w-8 h-8 md:w-12 md:h-12 text-yellow-500" \/>/g, '');

// Leaderboard Rank 1 Star
code = code.replace(/<div className="absolute -top-6 left-1\/2 -translate-x-1\/2">\s*<Star className="w-12 h-12 text-yellow-400 fill-yellow-400 animate-pulse" \/>\s*<\/div>/g, '');

// Canvas Badges Icons
code = code.replace(/<Activity className="w-3 h-3 text-green-500 animate-pulse" \/> /g, '');
code = code.replace(/<CheckCircle2 className="w-3 h-3" \/> /g, '');

// IoT System Spec Icon
code = code.replace(/<Zap className="w-6 h-6 text-amber-500" \/> /g, '');

// Machine Status MapPin
code = code.replace(/<MapPin className="w-8 h-8 text-green-600" \/> /g, '');
code = code.replace(/ <MapPin className="w-8 h-8 text-green-600" \/>/g, '');

// Footer Icons
code = code.replace(/<ArrowRight className="w-4 h-4" \/> /g, '');
code = code.replace(/<Star className="w-5 h-5 mt-1 text-slate-500" \/>\s*/g, '');
code = code.replace(/<Activity className="w-5 h-5 text-slate-500" \/>\s*/g, '');


// ==========================================
// 2. STANDARDIZE TYPOGRAPHY
// ==========================================

// --- Section Headings (H2) -> Standardize to text-3xl md:text-4xl ---
// Leaderboard H2
code = code.replace(
  'h2 className="font-pixel text-green-700 text-2xl md:text-4xl mb-6 flex justify-center items-center gap-4"',
  'h2 className="font-pixel text-green-700 dark:text-green-500 text-3xl md:text-4xl mb-6 text-center"'
);
// IoT H2
code = code.replace(
  'h2 className="font-pixel text-green-700 text-xl md:text-2xl mb-6"',
  'h2 className="font-pixel text-green-700 dark:text-green-500 text-3xl md:text-4xl mb-6"'
);
// Machine Status H2
code = code.replace(
  'h2 className="font-pixel text-slate-800 dark:text-slate-100 text-2xl md:text-3xl mb-4 flex justify-center items-center gap-4"',
  'h2 className="font-pixel text-slate-800 dark:text-slate-100 text-3xl md:text-4xl mb-6 text-center"'
);
// FAQ H2
code = code.replace(
  'h2 className="font-pixel text-slate-800 dark:text-slate-100 text-2xl md:text-3xl mb-4"',
  'h2 className="font-pixel text-slate-800 dark:text-slate-100 text-3xl md:text-4xl mb-6 text-center"'
);
// How It Works H2 (already 3xl/4xl, just ensure consistency in mb)
code = code.replace(
  'h2 className="font-pixel text-slate-800 dark:text-slate-100 text-3xl md:text-4xl drop-shadow-sm mb-6"',
  'h2 className="font-pixel text-slate-800 dark:text-slate-100 text-3xl md:text-4xl drop-shadow-sm mb-6"'
);

// --- Section Paragraphs (P) -> Standardize to text-lg md:text-xl ---
// Leaderboard Desc
code = code.replace(
  'p className="font-pixel-body text-slate-600 dark:text-slate-300 text-xl md:text-2xl"',
  'p className="font-pixel-body text-slate-600 dark:text-slate-300 text-lg md:text-xl leading-relaxed"'
);
// Machine Status Desc
code = code.replace(
  'p className="font-pixel-body text-slate-600 dark:text-slate-300 text-xl md:text-2xl"',
  'p className="font-pixel-body text-slate-600 dark:text-slate-300 text-lg md:text-xl leading-relaxed"'
);
// FAQ Desc
code = code.replace(
  'p className="font-pixel-body text-slate-600 dark:text-slate-300 text-xl md:text-2xl"',
  'p className="font-pixel-body text-slate-600 dark:text-slate-300 text-lg md:text-xl leading-relaxed"'
);
// How it works Desc
code = code.replace(
  'p className="font-pixel-body text-slate-600 dark:text-slate-300 text-xl md:text-2xl leading-relaxed"',
  'p className="font-pixel-body text-slate-600 dark:text-slate-300 text-lg md:text-xl leading-relaxed"'
);
// IoT Desc 1 & 2
code = code.replace(
  /p className="font-pixel-body text-slate-600 dark:text-slate-300 text-xl md:text-2xl leading-relaxed mb-6"/g,
  'p className="font-pixel-body text-slate-600 dark:text-slate-300 text-lg md:text-xl leading-relaxed mb-6"'
);
code = code.replace(
  /p className="font-pixel-body text-slate-600 dark:text-slate-300 text-xl md:text-2xl leading-relaxed"/g,
  'p className="font-pixel-body text-slate-600 dark:text-slate-300 text-lg md:text-xl leading-relaxed"'
);

// --- Content / Card Typography Standardization ---
// Panduan Subtitle
code = code.replace(
  'h3 className="font-pixel text-slate-800 dark:text-slate-100 text-lg md:text-xl flex items-center gap-2 border-b-2',
  'h3 className="font-pixel text-slate-800 dark:text-slate-100 text-lg md:text-xl flex items-center gap-2 border-b-2'
);
// Panduan Desc
code = code.replace(
  'p className="font-pixel-body text-slate-600 dark:text-slate-300 text-base md:text-lg"',
  'p className="font-pixel-body text-slate-600 dark:text-slate-300 text-sm md:text-base"'
);
// Manfaat Desc
code = code.replace(
  'p className="text-slate-600 dark:text-slate-300 text-lg md:text-xl leading-relaxed"',
  'p className="font-pixel-body text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed"'
);
// IoT Spec List
code = code.replace(
  'ul className="space-y-4 font-pixel-body text-slate-600 dark:text-slate-300 text-lg md:text-xl"',
  'ul className="space-y-4 font-pixel-body text-slate-600 dark:text-slate-300 text-sm md:text-base"'
);
// IoT Spec Title
code = code.replace(
  'h3 className="font-pixel text-slate-800 dark:text-slate-100 text-lg md:text-xl mb-6 border-b-2 border-slate-200 dark:border-slate-700 pb-4 flex items-center gap-3"',
  'h3 className="font-pixel text-slate-800 dark:text-slate-100 text-base md:text-lg mb-6 border-b-2 border-slate-200 dark:border-slate-700 pb-4"'
);
// Machine Location Text
code = code.replace(
  'p className="font-pixel-body text-slate-500 dark:text-slate-400 text-xl mb-4 line-clamp-1"',
  'p className="font-pixel-body text-slate-500 dark:text-slate-400 text-sm md:text-base mb-4 line-clamp-1"'
);
// Machine Fill Text
code = code.replace(
  'div className="flex justify-between mt-2 font-pixel-body text-slate-700 dark:text-slate-200 font-bold text-xl"',
  'div className="flex justify-between mt-2 font-pixel-body text-slate-700 dark:text-slate-200 font-bold text-sm md:text-base"'
);
// Machine Empty text
code = code.replace(
  'div className="col-span-full text-center font-pixel-body text-slate-500 dark:text-slate-400 text-xl py-10',
  'div className="col-span-full text-center font-pixel-body text-slate-500 dark:text-slate-400 text-sm md:text-base py-10'
);
// FAQ Question Text
code = code.replace(
  /span className="font-pixel text-slate-800 dark:text-slate-100 text-\[10px\] md:text-sm leading-relaxed pr-8"/g,
  'span className="font-pixel text-slate-800 dark:text-slate-100 text-sm md:text-base leading-relaxed pr-8"'
);
// FAQ Answer Text
code = code.replace(
  /p className="font-pixel-body text-slate-600 dark:text-slate-300 text-xl leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4"/g,
  'p className="font-pixel-body text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4"'
);
// Footer Text
code = code.replace(
  /p className="font-pixel-body text-xl leading-relaxed"/g,
  'p className="font-pixel-body text-sm md:text-base leading-relaxed"'
);
code = code.replace(
  /ul className="space-y-4 font-pixel-body text-xl"/g,
  'ul className="space-y-4 font-pixel-body text-sm md:text-base"'
);


fs.writeFileSync('src/components/LandingPage.tsx', code);
console.log('Design standardized and excessive icons removed.');
