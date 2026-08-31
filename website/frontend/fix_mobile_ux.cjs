const fs = require('fs');
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf-8');

// --- ISSUE 1: Hero Vending Machine Centering ---
code = code.replace(
  'flex justify-end items-center pointer-events-none mt-12 md:mt-0 md:w-[45%]',
  'flex justify-center md:justify-end items-center pointer-events-none mt-12 md:mt-0 md:w-[45%]'
);
code = code.replace(
  'object-contain object-right drop-shadow-2xl',
  'object-contain object-center md:object-right drop-shadow-2xl'
);

// --- ISSUE 2: Panduan Cut-off (Hide inactive steps on mobile) ---
code = code.replace(
  /className=\{`p-4 pixel-border flex gap-4 items-start transition-all duration-500 \$\{/g,
  'className={`p-4 pixel-border gap-4 items-start transition-all duration-500 ${'
);
code = code.replace(
  /'bg-green-50 dark:bg-green-900\/40 border-green-500/g,
  "'flex bg-green-50 dark:bg-green-900/40 border-green-500"
);
code = code.replace(
  /'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 opacity-50 scale-95'/g,
  "'hidden md:flex bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 opacity-50 scale-95'"
);

// --- ISSUE 3: Leaderboard Order ---
// We split by Rank markers
const rank1Marker = '{/* Rank 1 */}';
const rank2Marker = '{/* Rank 2 */}';
const rank3Marker = '{/* Rank 3 */}';

let parts2 = code.split(rank2Marker);
if (parts2.length === 2) {
  parts2[1] = parts2[1].replace('transition-transform"', 'transition-transform order-2 md:order-1"');
  code = parts2.join(rank2Marker);
}

let parts1 = code.split(rank1Marker);
if (parts1.length === 2) {
  parts1[1] = parts1[1].replace('transition-transform relative md:-mt-12 z-10"', 'transition-transform relative md:-mt-12 z-10 order-1 md:order-2"');
  code = parts1.join(rank1Marker);
}

let parts3 = code.split(rank3Marker);
if (parts3.length === 2) {
  parts3[1] = parts3[1].replace('transition-transform"', 'transition-transform order-3 md:order-3"');
  code = parts3.join(rank3Marker);
}

fs.writeFileSync('src/components/LandingPage.tsx', code);
console.log('Mobile UX issues fixed!');
