const fs = require('fs');
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf-8');

// 1. Navbar Toggle Button
if (!code.includes('toggleTheme')) {
  code = code.replace(
    'const { settings } = useAppStore();',
    'const { settings, theme, toggleTheme } = useAppStore();'
  );
  
  // import Sun, Moon
  code = code.replace(/import { (.*) } from 'lucide-react';/, "import { $1, Sun, Moon } from 'lucide-react';");

  // Add Button next to Login Server
  const toggleBtn = `
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme} 
            className="p-2 pixel-border bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-green-600 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <Link to="/login" className="font-pixel text-[8px] text-slate-600 dark:text-slate-300 hover:text-green-700 dark:hover:text-green-400 pixel-border px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-green-50 dark:hover:bg-slate-700 transition-colors">
            LOGIN SERVER
          </Link>
        </div>
  `;
  
  code = code.replace(
    /<Link to="\/login"[^>]*>[\s\S]*?<\/Link>/,
    toggleBtn
  );
}

// 2. Add 'dark:' variants globally
code = code.replace(/bg-slate-50(?!0)/g, 'bg-slate-50 dark:bg-[#0b1120]');
code = code.replace(/bg-white/g, 'bg-white dark:bg-slate-900');
code = code.replace(/bg-slate-100/g, 'bg-slate-100 dark:bg-slate-800');
code = code.replace(/text-slate-800/g, 'text-slate-800 dark:text-slate-100');
code = code.replace(/text-slate-900/g, 'text-slate-900 dark:text-slate-50');
code = code.replace(/text-slate-700/g, 'text-slate-700 dark:text-slate-200');
code = code.replace(/text-slate-600/g, 'text-slate-600 dark:text-slate-300');
code = code.replace(/text-slate-500/g, 'text-slate-500 dark:text-slate-400');
code = code.replace(/border-slate-200/g, 'border-slate-200 dark:border-slate-700');
code = code.replace(/border-slate-300/g, 'border-slate-300 dark:border-slate-600');
code = code.replace(/border-slate-100/g, 'border-slate-100 dark:border-slate-800');
// Special fixes for Video Overlay so dark mode is truly dark cinematic
code = code.replace(/from-slate-100\/95/g, 'from-slate-100/95 dark:from-[#0b1120]/95');
code = code.replace(/via-slate-100\/30/g, 'via-slate-100/30 dark:via-[#0b1120]/60');

fs.writeFileSync('src/components/LandingPage.tsx', code);
console.log('Dark mode classes applied.');
