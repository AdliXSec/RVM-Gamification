const fs = require('fs');
let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

// 1. Container width
content = content.replace(/max-w-6xl/g, 'max-w-4xl');

// 2. Desktop text enlargements & Mobile text bumps using a SINGLE PASS regex to avoid cascading
// This regex looks for text-[6px], text-xs, etc., and also their md: variants if we want to add them.
// But it's easier to just do targeted structural replacements per component like before, but correctly.

// Let's do the structural replacements for Desktop sizes FIRST.
// Home Stat Row
content = content.replace(
  /<div className="grid grid-cols-4 gap-2">([\s\S]*?)<\/div>\s*<\/div>\s*\{\/\* Daily Quest \*\/\}/m,
  (match) => {
    return match
      .replace(/gap-2/g, 'gap-2 md:gap-4')
      .replace(/w-4 h-4/g, 'w-4 h-4 md:w-6 md:h-6')
      .replace(/p-3/g, 'p-3 md:p-5')
      .replace(/mb-1\.5/g, 'mb-1.5 md:mb-3')
      .replace(/text-xs/g, 'text-xs md:text-lg')
      .replace(/text-\[6px\]/g, 'text-[6px] md:text-[9px]')
      .replace(/mt-0\.5/g, 'mt-0.5 md:mt-2');
  }
);

// Daily Quest
content = content.replace(
  /<div className="pixel-border bg-slate-900\/70 backdrop-blur-sm border-t-2 border-t-yellow-500\/30 p-4">([\s\S]*?)<\/div>\s*<\/div>\s*\{\/\* Machine Status \*\/\}/m,
  (match) => {
    return match
      .replace(/p-4"/g, 'p-4 md:p-6"')
      .replace(/text-\[10px\]/g, 'text-[10px] md:text-sm')
      .replace(/mb-3/g, 'mb-3 md:mb-5')
      .replace(/w-4 h-4/g, 'w-4 h-4 md:w-5 md:h-5')
      .replace(/space-y-2/g, 'space-y-2 md:space-y-4')
      .replace(/gap-3/g, 'gap-3 md:gap-5')
      .replace(/p-3/g, 'p-3 md:p-4')
      .replace(/w-6 h-6/g, 'w-6 h-6 md:w-10 md:h-10')
      .replace(/w-3\.5 h-3\.5/g, 'w-3.5 h-3.5 md:w-5 md:h-5')
      .replace(/text-\[8px\]/g, 'text-[8px] md:text-sm')
      .replace(/h-1\.5/g, 'h-1.5 md:h-2')
      .replace(/mt-1\.5/g, 'mt-1.5 md:mt-2')
      .replace(/text-\[6px\]/g, 'text-[6px] md:text-[10px]')
      .replace(/mt-0\.5/g, 'mt-0.5 md:mt-2');
  }
);

// Machine Status
content = content.replace(
  /\{\/\* Machine Status \*\/\}[\s\S]*?\{\/\* Campus Stats \*\/\}/m,
  (match) => {
    return match
      .replace(/p-4"/g, 'p-4 md:p-6"')
      .replace(/text-\[10px\]/g, 'text-[10px] md:text-sm')
      .replace(/mb-3/g, 'mb-3 md:mb-5')
      .replace(/w-4 h-4/g, 'w-4 h-4 md:w-5 md:h-5')
      .replace(/gap-2/g, 'gap-2 md:gap-4')
      .replace(/p-3/g, 'p-3 md:p-4')
      .replace(/gap-3/g, 'gap-3 md:gap-4')
      .replace(/w-2 h-2/g, 'w-2 h-2 md:w-3 md:h-3')
      .replace(/text-\[8px\]/g, 'text-[8px] md:text-sm')
      .replace(/text-\[6px\]/g, 'text-[6px] md:text-[10px]')
      .replace(/\{m\.location\}<\/p>/g, '{m.location}</p>'.replace('text-slate-600', 'text-slate-600 md:mt-1'));
  }
);
content = content.replace(/text-slate-600">\{m\.location\}<\/p>/g, 'text-slate-600 md:mt-1">{m.location}</p>');

// Campus Stats
content = content.replace(
  /\{\/\* Campus Stats \*\/\}[\s\S]*?<\/div>\s*<\/div>\s*\)\}/m,
  (match) => {
    return match
      .replace(/p-4"/g, 'p-4 md:p-6"')
      .replace(/text-\[10px\]/g, 'text-[10px] md:text-sm')
      .replace(/mb-3/g, 'mb-3 md:mb-5')
      .replace(/w-4 h-4/g, 'w-4 h-4 md:w-5 md:h-5')
      .replace(/gap-2/g, 'gap-2 md:gap-4')
      .replace(/w-3 h-3/g, 'w-3 h-3 md:w-5 md:h-5')
      .replace(/p-3/g, 'p-3 md:p-5')
      .replace(/mb-1"/g, 'mb-1 md:mb-2"')
      .replace(/text-xs/g, 'text-xs md:text-xl')
      .replace(/text-\[6px\]/g, 'text-[6px] md:text-[10px]')
      .replace(/mt-0\.5/g, 'mt-0.5 md:mt-2');
  }
);

// Shop
content = content.replace(
  /\{\/\* ═══ TAB: SHOP ═══ \*\/\}[\s\S]*?\{\/\* ═══ TAB: LOG \(Quest Log\) ═══ \*\/\}/m,
  (match) => {
    return match
      .replace(/space-y-4/g, 'space-y-4 md:space-y-6')
      .replace(/gap-3/g, 'gap-3 md:gap-5')
      .replace(/w-5 h-5/g, 'w-5 h-5 md:w-8 md:h-8')
      .replace(/text-sm/g, 'text-sm md:text-xl')
      .replace(/text-\[7px\]/g, 'text-[7px] md:text-[10px]')
      .replace(/text-slate-600">Tukar/g, 'text-slate-600 md:mt-1">Tukar')
      .replace(/px-3 py-1\.5/g, 'px-3 py-1.5 md:px-4 md:py-2')
      .replace(/gap-1\.5/g, 'gap-1.5 md:gap-2')
      .replace(/w-3 h-3/g, 'w-3 h-3 md:w-5 md:h-5')
      .replace(/text-\[9px\]/g, 'text-[9px] md:text-sm')
      .replace(/p-12/g, 'p-12 md:p-20')
      .replace(/w-10 h-10/g, 'w-10 h-10 md:w-16 md:h-16')
      .replace(/mb-3/g, 'mb-3 md:mb-5')
      .replace(/grid-cols-2 md:grid-cols-3 gap-3/g, 'grid-cols-2 md:grid-cols-3 gap-3 md:gap-6')
      .replace(/p-4 flex/g, 'p-4 md:p-6 flex')
      .replace(/top-2 right-2/g, 'top-2 md:top-3 right-2 md:right-3')
      .replace(/text-\[6px\]/g, 'text-[6px] md:text-[8px]')
      .replace(/px-1\.5 py-0\.5/g, 'px-1.5 md:px-2 py-0.5 md:py-1')
      // Skip the second w-10 h-10 to avoid conflicting with the first one. Let's just do it explicitly later.
      .replace(/mb-1/g, 'mb-1 md:mb-2')
      .replace(/text-xs/g, 'text-xs md:text-base')
      .replace(/mb-2/g, 'mb-2 md:mb-4')
      .replace(/gap-1/g, 'gap-1 md:gap-2')
      .replace(/py-2\.5/g, 'py-2.5 md:py-4')
      .replace(/text-\[8px\]/g, 'text-[8px] md:text-xs');
  }
);
// Fix the shop item icon container manually
content = content.replace(/w-10 h-10 \$\{tier\.bg\}/g, 'w-10 h-10 md:w-14 md:h-14 ${tier.bg}');
content = content.replace(/w-5 h-5 \$\{tier\.text\}/g, 'w-5 h-5 md:w-7 md:h-7 ${tier.text}');

// Log
content = content.replace(
  /\{\/\* ═══ TAB: LOG \(Quest Log\) ═══ \*\/\}[\s\S]*?\{\/\* ═══ TAB: QUEST \(Tutorial\) ═══ \*\/\}/m,
  (match) => {
    return match
      .replace(/space-y-4/g, 'space-y-4 md:space-y-6')
      .replace(/gap-3/g, 'gap-3 md:gap-5')
      .replace(/w-5 h-5/g, 'w-5 h-5 md:w-8 md:h-8')
      .replace(/text-sm/g, 'text-sm md:text-xl')
      .replace(/text-\[7px\]/g, 'text-[7px] md:text-[10px]')
      .replace(/text-slate-600">Riwayat/g, 'text-slate-600 md:mt-1">Riwayat')
      .replace(/gap-1\.5/g, 'gap-1.5 md:gap-2')
      .replace(/px-3 py-1\.5/g, 'px-3 py-1.5 md:px-4 md:py-2')
      .replace(/w-3\.5 h-3\.5/g, 'w-3.5 h-3.5 md:w-5 md:h-5')
      .replace(/text-\[8px\]/g, 'text-[8px] md:text-sm')
      .replace(/p-4"/g, 'p-4 md:p-6"')
      .replace(/py-12/g, 'py-12 md:py-20')
      .replace(/w-10 h-10/g, 'w-10 h-10 md:w-16 md:h-16')
      .replace(/mb-3/g, 'mb-3 md:mb-5')
      .replace(/text-\[9px\]/g, 'text-[9px] md:text-sm')
      .replace(/space-y-2/g, 'space-y-2 md:space-y-4')
      .replace(/p-3 border-l-2/g, 'p-3 md:p-4 border-l-2 md:border-l-4')
      .replace(/w-8 h-8/g, 'w-8 h-8 md:w-12 md:h-12')
      .replace(/w-4 h-4/g, 'w-4 h-4 md:w-6 md:h-6')
      .replace(/text-sm/g, 'text-sm md:text-lg')
      .replace(/text-\[6px\]/g, 'text-[6px] md:text-[9px]')
      .replace(/text-slate-600">\{tx\.date\}/g, 'text-slate-600 md:mt-1">{tx.date}')
      .replace(/text-\[10px\]/g, 'text-[10px] md:text-sm')
      .replace(/mt-0\.5/g, 'mt-0.5 md:mt-1');
  }
);

// Guide
content = content.replace(
  /\{\/\* ═══ TAB: QUEST \(Tutorial\) ═══ \*\/\}[\s\S]*?\{\/\* ═══ TAB: NOTIFICATIONS ═══ \*\/\}/m,
  (match) => {
    return match
      .replace(/space-y-4/g, 'space-y-4 md:space-y-6')
      .replace(/gap-3/g, 'gap-3 md:gap-5')
      .replace(/w-5 h-5/g, 'w-5 h-5 md:w-8 md:h-8')
      .replace(/text-sm/g, 'text-sm md:text-xl')
      .replace(/text-\[7px\]/g, 'text-[7px] md:text-[10px]')
      .replace(/text-slate-600">Panduan/g, 'text-slate-600 md:mt-1">Panduan')
      .replace(/left-\[19px\]/g, 'left-[19px] md:left-[23px]')
      .replace(/top-\[48px\]/g, 'top-[48px] md:top-[64px]')
      .replace(/h-4 z-0/g, 'h-4 md:h-6 z-0')
      .replace(/gap-4 p-4/g, 'gap-4 md:gap-6 p-4 md:p-6')
      .replace(/w-10 h-10/g, 'w-10 h-10 md:w-12 md:h-12')
      .replace(/w-4 h-4/g, 'w-4 h-4 md:w-5 md:h-5')
      .replace(/text-xs/g, 'text-xs md:text-sm')
      .replace(/mb-1"/g, 'mb-1 md:mb-2"')
      .replace(/text-\[9px\]/g, 'text-[9px] md:text-sm')
      .replace(/text-\[6px\]/g, 'text-[6px] md:text-[8px]')
      .replace(/px-1\.5 py-0\.5/g, 'px-1.5 md:px-2 py-0.5 md:py-1')
      .replace(/text-sm/g, 'text-sm md:text-base')
      .replace(/font-pixel-body">Panduan/g, 'font-pixel-body md:text-lg">Panduan');
  }
);

// Info
content = content.replace(
  /\{\/\* ═══ TAB: NOTIFICATIONS ═══ \*\/\}[\s\S]*?\{\/\* ═══ TAB: LEADERBOARD ═══ \*\/\}/m,
  (match) => {
    return match
      .replace(/space-y-4/g, 'space-y-4 md:space-y-6')
      .replace(/gap-3/g, 'gap-3 md:gap-5')
      .replace(/w-5 h-5/g, 'w-5 h-5 md:w-8 md:h-8')
      .replace(/text-sm/g, 'text-sm md:text-xl')
      .replace(/text-\[7px\]/g, 'text-[7px] md:text-[10px]')
      .replace(/text-slate-600">Info/g, 'text-slate-600 md:mt-1">Info')
      .replace(/space-y-2/g, 'space-y-2 md:space-y-4')
      .replace(/p-4 border-l-2/g, 'p-4 md:p-6 border-l-2 md:border-l-4')
      .replace(/mt-0\.5/g, 'mt-0.5 md:mt-1')
      .replace(/w-4 h-4/g, 'w-4 h-4 md:w-6 md:h-6')
      .replace(/text-sm/g, 'text-sm md:text-lg')
      .replace(/mt-1"/g, 'mt-1 md:mt-2"')
      .replace(/py-12/g, 'py-12 md:py-20')
      .replace(/w-8 h-8/g, 'w-8 h-8 md:w-16 md:h-16')
      .replace(/mb-3/g, 'mb-3 md:mb-5')
      .replace(/text-\[9px\]/g, 'text-[9px] md:text-sm');
  }
);

// Rank
content = content.replace(
  /\{\/\* ═══ TAB: LEADERBOARD ═══ \*\/\}[\s\S]*/m,
  (match) => {
    return match
      .replace(/space-y-4/g, 'space-y-4 md:space-y-6')
      .replace(/gap-3/g, 'gap-3 md:gap-5')
      .replace(/w-5 h-5/g, 'w-5 h-5 md:w-8 md:h-8')
      .replace(/text-sm/g, 'text-sm md:text-xl')
      .replace(/text-\[7px\]/g, 'text-[7px] md:text-[10px]')
      .replace(/text-slate-600">Peringkat/g, 'text-slate-600 md:mt-1">Peringkat')
      .replace(/p-4 flex/g, 'p-4 md:p-6 flex')
      .replace(/w-10 h-10 bg/g, 'w-10 h-10 md:w-16 md:h-16 bg')
      .replace(/text-xs">#\{myRank\}/g, 'text-xs md:text-xl">#{myRank}')
      .replace(/text-\[8px\]/g, 'text-[8px] md:text-xs')
      .replace(/text-\[9px\]/g, 'text-[9px] md:text-sm')
      .replace(/mt-0\.5/g, 'mt-0.5 md:mt-1')
      .replace(/w-3 h-3/g, 'w-3 h-3 md:w-5 md:h-5')
      .replace(/text-\[6px\]/g, 'text-[6px] md:text-[9px]')
      
      // Podium fixes based on my previous correct fix
      .replace(/gap-2 items-end mt-20/g, 'gap-2 md:gap-4 items-end mt-20 md:mt-32')
      
      // 2nd
      .replace(/p-3 text-center relative mt-24/g, 'p-3 md:p-6 text-center relative mt-24 md:mt-32')
      .replace(/-top-28/g, '-top-28 md:-top-40')
      .replace(/w-32 h-32/g, 'w-32 h-32 md:w-48 md:h-48')
      .replace(/<div className="h-12 flex items-end justify-center mb-2">\s*<div className="w-full bg-slate-800 border-t-3 border-slate-500" style={{ height: '40px' }}>\s*<span className="font-pixel text-slate-400 text-base block pt-2">#2<\/span>\s*<\/div>\s*<\/div>/m, 
      `<div className="h-[40px] md:h-[64px] flex items-end justify-center mb-2 md:mb-4">
                      <div className="w-full bg-slate-800 border-t-3 border-slate-500 h-full">
                        <span className="font-pixel text-slate-400 text-base md:text-xl block pt-2 md:pt-4">#2</span>
                      </div>
                    </div>`)
      .replace(/w-4 h-4 text-slate-400 mx-auto/g, 'w-4 h-4 md:w-6 md:h-6 text-slate-400 mx-auto')
      .replace(/mb-1"/g, 'mb-1 md:mb-2"')
      
      // 1st
      .replace(/-top-36/g, '-top-36 md:-top-56')
      .replace(/w-40 h-40/g, 'w-40 h-40 md:w-64 md:h-64')
      .replace(/<div className="h-16 flex items-end justify-center mb-2">\s*<div className="w-full bg-yellow-950\/40 border-t-3 border-yellow-500" style={{ height: '56px' }}>\s*<Crown className="w-5 h-5 text-yellow-500 mx-auto mt-1\.5" \/>\s*<span className="font-pixel text-yellow-400 text-base block">#1<\/span>\s*<\/div>\s*<\/div>/m,
      `<div className="h-[56px] md:h-[88px] flex items-end justify-center mb-2 md:mb-4">
                      <div className="w-full bg-yellow-950/40 border-t-3 border-yellow-500 h-full flex flex-col items-center justify-center pt-1 md:pt-2">
                        <Crown className="w-5 h-5 md:w-8 md:h-8 text-yellow-500 mx-auto mb-1" />
                        <span className="font-pixel text-yellow-400 text-base md:text-2xl block">#1</span>
                      </div>
                    </div>`)
      
      // 3rd
      .replace(/-top-20/g, '-top-20 md:-top-32')
      .replace(/w-24 h-24/g, 'w-24 h-24 md:w-36 md:h-36')
      .replace(/<div className="h-10 flex items-end justify-center mb-2">\s*<div className="w-full bg-amber-950\/30 border-t-3 border-amber-700" style={{ height: '32px' }}>\s*<span className="font-pixel text-amber-600 text-base block pt-1">#3<\/span>\s*<\/div>\s*<\/div>/m,
      `<div className="h-[32px] md:h-[48px] flex items-end justify-center mb-2 md:mb-4">
                      <div className="w-full bg-amber-950/30 border-t-3 border-amber-700 h-full">
                        <span className="font-pixel text-amber-600 text-base md:text-xl block pt-1 md:pt-2">#3</span>
                      </div>
                    </div>`)
                    
      // Rest of Podium fonts
      .replace(/w-4 h-4 text-amber-600/g, 'w-4 h-4 md:w-6 md:h-6 text-amber-600')
      
      // List
      .replace(/p-4"/g, 'p-4 md:p-6"')
      .replace(/mb-3"/g, 'mb-3 md:mb-5"')
      .replace(/space-y-1"/g, 'space-y-1 md:space-y-2"')
      .replace(/px-3 py-2\.5/g, 'px-3 md:px-5 py-2.5 md:py-4')
      .replace(/border-l-2/g, 'border-l-2 md:border-l-4')
      .replace(/w-6 flex/g, 'w-6 md:w-10 flex')
      .replace(/w-3\.5 h-3\.5/g, 'w-3.5 h-3.5 md:w-6 md:h-6')
      .replace(/w-7 h-7/g, 'w-7 h-7 md:w-10 md:h-10')
      .replace(/w-5 h-5/g, 'w-5 h-5 md:w-7 md:h-7')
      .replace(/gap-1 shrink-0/g, 'gap-1 md:gap-2 shrink-0')
      // Note: text sizes for list items were handled generically above except we want them enlarged for md:
      .replace(/text-xs">#\{rank\}/g, 'text-xs md:text-base">#{rank}')
      .replace(/text-\[8px\] truncate/g, 'text-[8px] md:text-sm truncate')
      .replace(/text-slate-600">\{getRankTitle/g, 'text-slate-600 md:mt-1">{getRankTitle')
      .replace(/text-\[8px\] flex/g, 'text-[8px] md:text-xs flex');
  }
);


// 3. Desktop Bottom Nav: make it smaller than before
content = content.replace(
  /\{\/\* ═══ Bottom Navigation Bar ═══ \*\/\}[\s\S]*/m,
  (match) => {
    return match
      .replace(/py-2\.5/g, 'py-2.5 md:py-3')
      .replace(/\[&>svg\]:md:w-7/g, '[&>svg]:md:w-6')
      .replace(/\[&>svg\]:md:h-7/g, '[&>svg]:md:h-6')
      .replace(/-translate-y-0\.5/g, '-translate-y-0.5 md:-translate-y-0.5')
      .replace(/text-\[7px\]/g, 'text-[7px] md:text-[8px]')
      .replace(/mt-1/g, 'mt-1 md:mt-1.5');
  }
);

// 4. Safely bump all mobile pixel sizes +xs/sm globally by 1 notch using a replacer function
// We match tailwind text utility classes that DON'T have `md:` prefix.
const fontBumps = {
  'text-\\[6px\\]': 'text-[7px]',
  'text-\\[7px\\]': 'text-[8px]',
  'text-\\[8px\\]': 'text-[9px]',
  'text-\\[9px\\]': 'text-[10px]',
  'text-\\[10px\\]': 'text-xs',
  'text-xs': 'text-sm',
  'text-sm': 'text-base',
  'text-base': 'text-lg',
  'text-lg': 'text-xl',
};

// Use lookbehind for space/quote, lookahead for space/quote, ensure no md: before
content = content.replace(/(?<!md:)(?<=\s|['"`])(text-\[6px\]|text-\[7px\]|text-\[8px\]|text-\[9px\]|text-\[10px\]|text-xs|text-sm|text-base|text-lg)(?=\s|['"`])/g, (match) => {
  return fontBumps[match] || match;
});

fs.writeFileSync('src/components/Dashboard.tsx', content);
