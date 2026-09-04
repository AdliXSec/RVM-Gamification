const fs = require('fs');
let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

const replacements = [
  // Reverse the pixel sizes first to avoid overlaps if possible
  [/md:text-\[10px\]/g, 'md:text-xs'],
  [/md:text-\[9px\]/g, 'md:text-[10px]'],
  [/md:text-\[8px\]/g, 'md:text-[9px]'],

  // Reverse the tailwind sizes
  [/md:text-xs/g, 'md:text-sm'],
  [/md:text-sm/g, 'md:text-base'],
  [/md:text-base/g, 'md:text-lg'],
  [/md:text-lg/g, 'md:text-xl'],
  
  [/md:text-2xl/g, 'md:text-3xl'],
  [/md:text-3xl/g, 'md:text-4xl'],
];

for (const [regex, replacement] of replacements) {
    content = content.replace(regex, replacement);
}

// ALSO the user wants the container smaller.
// Let's change max-w-6xl back to max-w-4xl (or maybe max-w-5xl).
// max-w-6xl is 72rem (1152px), max-w-4xl is 56rem (896px), max-w-5xl is 64rem (1024px).
// Let's use max-w-4xl so it doesn't look stretched, but with the larger desktop fonts!
content = content.replace(/max-w-6xl/g, 'max-w-4xl');

fs.writeFileSync('src/components/Dashboard.tsx', content);
