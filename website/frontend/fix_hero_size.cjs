const fs = require('fs');
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf-8');

// 1. Revert pt-8 to pt-20 for natural centering
code = code.replace(
  'className="relative min-h-screen flex items-center pt-8 pb-10 px-4 md:px-12 overflow-hidden scanlines"',
  'className="relative min-h-screen flex items-center pt-16 pb-10 px-4 md:px-12 overflow-hidden scanlines"'
);

// 2. Remove negative margins on the grid to keep it centered
code = code.replace(
  'className="relative z-10 w-full max-w-7xl mx-auto grid md:grid-cols-12 gap-8 items-center -mt-16 md:-mt-24"',
  'className="relative z-10 w-full max-w-7xl mx-auto grid md:grid-cols-12 gap-8 items-center"'
);

// 3. Tone down the massive text size to a middle ground
code = code.replace(
  'className="font-pixel text-slate-100 text-4xl md:text-5xl lg:text-[4.2rem] leading-[1.3] mb-6 drop-shadow-2xl"',
  'className="font-pixel text-slate-100 text-3xl md:text-5xl lg:text-[3.5rem] leading-[1.4] mb-6 drop-shadow-2xl"'
);

// 4. Tone down the subtitle size
code = code.replace(
  'className="font-pixel-body text-slate-300 text-xl md:text-3xl mb-10 max-w-xl leading-relaxed drop-shadow-lg"',
  'className="font-pixel-body text-slate-300 text-lg md:text-2xl mb-10 max-w-xl leading-relaxed drop-shadow-lg"'
);

code = code.replace(
  'className="text-green-400 block mt-3 text-2xl font-bold"',
  'className="text-green-400 block mt-3 text-xl font-bold"'
);

// 5. Tone down the machine image size (from 600px back to 450px)
code = code.replace(
  'className="h-80 md:h-[500px] lg:h-[600px] object-contain relative drop-shadow-[0_15px_35px_rgba(0,0,0,0.6)]"',
  'className="h-72 md:h-[400px] lg:h-[450px] object-contain relative drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]"'
);

code = code.replace(
  'className="relative w-full h-[450px] md:h-[600px] flex justify-center md:justify-end items-center pointer-events-none mt-12 md:mt-0 md:col-span-5"',
  'className="relative w-full h-[400px] md:h-[500px] flex justify-center md:justify-end items-center pointer-events-none mt-12 md:mt-0 md:col-span-5"'
);

fs.writeFileSync('src/components/LandingPage.tsx', code);
console.log("Hero size and position fixed.");
