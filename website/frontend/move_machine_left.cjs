const fs = require('fs');
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf-8');

code = code.replace(
  'className="relative w-full h-[400px] md:h-[500px] flex justify-center md:justify-end items-center pointer-events-none mt-12 md:mt-0 md:col-span-5"',
  'className="relative w-full h-[400px] md:h-[500px] flex justify-center items-center pointer-events-none mt-12 md:mt-0 md:col-span-5"'
);

fs.writeFileSync('src/components/LandingPage.tsx', code);
console.log("Vending machine shifted left (centered in its column).");
