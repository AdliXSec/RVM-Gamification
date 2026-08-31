const fs = require('fs');
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf-8');

const oldBadge = `<div className="border-4 border-slate-900 dark:border-slate-700 px-4 py-2 bg-green-400 dark:bg-green-900 mb-8 shadow-[4px_4px_0_0_rgba(15,23,42,1)] dark:shadow-[4px_4px_0_0_rgba(51,65,85,1)]">
              <span className="font-pixel text-[10px] md:text-xs text-slate-900 dark:text-green-400 tracking-widest uppercase font-bold">
                TELKOM UNIVERSITY SURABAYA
              </span>
            </div>`;

const newBadge = `<div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-slate-300/50 dark:border-slate-600/50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md mb-8">
              <span className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
              <span className="font-pixel text-[10px] md:text-xs text-slate-800 dark:text-slate-200 tracking-[0.2em] font-bold uppercase">
                TELKOM UNIVERSITY SURABAYA
              </span>
            </div>`;

if (code.includes(oldBadge)) {
  code = code.replace(oldBadge, newBadge);
  fs.writeFileSync('src/components/LandingPage.tsx', code);
  console.log('Badge updated to an elegant frosted pill.');
} else {
  console.log('Could not find the old badge exactly.');
}
