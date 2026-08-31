const fs = require('fs');
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf-8');

// --- MARQUEE ---
code = code.replace(/text-\[10px\] text-green-100/g, 'text-xs md:text-sm text-green-100');
code = code.replace(/text-\[10px\] text-white/g, 'text-xs md:text-sm text-white');

// --- PANDUAN PENGGUNAAN ---
code = code.replace('text-2xl md:text-3xl drop-shadow-sm mb-6', 'text-3xl md:text-4xl drop-shadow-sm mb-6'); // Section Title
code = code.replace('text-lg leading-relaxed', 'text-xl md:text-2xl leading-relaxed'); // Section Desc
code = code.replace('text-sm flex items-center gap-2 border-b-2', 'text-lg md:text-xl flex items-center gap-2 border-b-2'); // Subtitle Panduan
code = code.replace('text-xl ${activeStep', 'text-3xl md:text-4xl ${activeStep'); // Step Number
code = code.replace('text-[10px] mb-2">{s.title}', 'text-sm md:text-base mb-2">{s.title}'); // Step Title
code = code.replace('text-sm">{s.desc}', 'text-base md:text-lg">{s.desc}'); // Step Desc

// --- MANFAAT SYSTEM ---
code = code.replace('text-sm flex items-center gap-2 border-b-2 border-slate-200 pb-2 mb-8', 'text-lg md:text-xl flex items-center gap-2 border-b-2 border-slate-200 pb-2 mb-8'); // Subtitle Manfaat
code = code.replace('text-[12px] mb-2 ${m.colorText}', 'text-sm md:text-base mb-2 ${m.colorText}'); // Benefit Title
code = code.replace('text-base leading-relaxed', 'text-lg md:text-xl leading-relaxed'); // Benefit Desc

// --- CANVAS LABELS ---
code = code.replace('text-[8px] px-3 py-2', 'text-[10px] md:text-xs px-3 py-2'); // Scanning
code = code.replace('text-[8px] px-4 py-3', 'text-[10px] md:text-xs px-4 py-3'); // Live feed

// --- FITUR UTAMA ---
code = code.replace('text-sm md:text-base drop-shadow-sm', 'text-xl md:text-2xl drop-shadow-sm'); // Section Title
code = code.replace('text-xl">Sistem cerdas', 'text-2xl md:text-3xl">Sistem cerdas'); // Section Desc
code = code.replace('text-[11px] mb-4', 'text-sm md:text-base mb-4'); // Card Title
code = code.replace('text-xl leading-relaxed">{f.desc}', 'text-xl md:text-2xl leading-relaxed">{f.desc}'); // Card Desc (already big, make it slightly bigger)

// --- GLOBAL STATS ---
code = code.replace('text-sm mb-8">GLOBAL STATS', 'text-xl md:text-2xl mb-8">GLOBAL STATS'); // Title
code = code.replace('text-lg md:text-2xl mb-3', 'text-3xl md:text-4xl mb-3'); // Numbers
code = code.replace('text-[8px] text-green-100', 'text-xs md:text-sm text-green-100'); // Labels

// --- FOOTER ---
code = code.replace('text-[8px] text-slate-500', 'text-xs md:text-sm text-slate-500'); // Footer

fs.writeFileSync('src/components/LandingPage.tsx', code);
console.log('Text sizes successfully increased across the board!');
