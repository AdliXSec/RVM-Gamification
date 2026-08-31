const fs = require('fs');
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf-8');

// Container
code = code.replace(
  '<div className="relative z-10 w-full max-w-7xl mx-auto grid md:grid-cols-12 gap-8 items-center">',
  '<div className="relative z-10 w-full max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-12">'
);

// Text Block
code = code.replace(
  '<div className="flex flex-col items-start text-left md:col-span-7 z-20">',
  '<div className="flex flex-col items-start text-left md:w-[55%] z-20">'
);

// Image Block
code = code.replace(
  '<div className="relative w-full h-[400px] md:h-[500px] flex justify-center items-center pointer-events-none mt-12 md:mt-0 md:col-span-5">',
  '<div className="relative w-full h-[400px] md:h-[550px] flex justify-end items-center pointer-events-none mt-12 md:mt-0 md:w-[45%]">'
);

// Optional: Ensure the image itself scales nicely and aligns right
code = code.replace(
  'className="h-72 md:h-[400px] lg:h-[450px] object-contain drop-shadow-2xl" />',
  'className="h-72 md:h-[450px] lg:h-[550px] object-contain object-right drop-shadow-2xl" />'
);

fs.writeFileSync('src/components/LandingPage.tsx', code);
console.log('Hero layout changed to justify-between (left/right aligned).');
