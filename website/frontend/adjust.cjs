const fs = require('fs');
let content = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');

// 1. Desktop Bottom Nav: make slightly smaller
content = content.replace(/md:py-4/g, 'md:py-3');
content = content.replace(/\[&>svg\]:md:w-7/g, '[&>svg]:md:w-6');
content = content.replace(/\[&>svg\]:md:h-7/g, '[&>svg]:md:h-6');
content = content.replace(/-translate-y-1/g, '-translate-y-0.5'); // keep hover smaller
content = content.replace(/md:text-\[8px\] mt-1 md:mt-2/g, 'md:text-[8px] mt-1 md:mt-1.5'); 

// 2. Mobile text: slightly larger
// We need to carefully replace only the base classes, not the md: classes.
// Using regex to match spaces or quotes before the class name.
const sizeMap = {
  'text-\\[6px\\]': 'text-[7px]',
  'text-\\[7px\\]': 'text-[8px]',
  'text-\\[8px\\]': 'text-[9px]',
  'text-\\[9px\\]': 'text-[10px]',
  'text-\\[10px\\]': 'text-xs',
  'text-xs': 'text-sm',
  'text-sm': 'text-base'
};

for (const [oldClass, newClass] of Object.entries(sizeMap)) {
  // Regex: match old class preceded by space or quote/backtick, 
  // but NOT preceded by "md:"
  const regex = new RegExp(`(?<!md:)(['"\\s])${oldClass}(?=[\\s'"])`, 'g');
  content = content.replace(regex, `$1${newClass}`);
}

// Ensure the bottom nav text gets bumped properly if it was text-[7px]
// Actually the regex will catch it. 

fs.writeFileSync('src/components/Dashboard.tsx', content);
