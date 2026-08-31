const fs = require('fs');
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf-8');

// 1. Fix the updateCanvasAndText logic
const oldLogic = `          let step = -1;
          if (progress > 0.1 && progress <= 0.3) step = 0;
          else if (progress > 0.3 && progress <= 0.5) step = 1;
          else if (progress > 0.5 && progress <= 0.7) step = 2;
          else if (progress > 0.7 && progress <= 0.85) step = 3;
          else if (progress > 0.85) step = 4;`;

const newLogic = `          let step = -1;
          if (progress > 0.1) {
            const totalSteps = PANDUAN_STEPS.length + 1; 
            const progressPerStep = 0.9 / totalSteps;
            step = Math.floor((progress - 0.1) / progressPerStep);
            if (step >= totalSteps) step = totalSteps - 1;
          }`;

if (code.includes(oldLogic)) {
    code = code.replace(oldLogic, newLogic);
} else {
    console.log("Could not find old logic to replace");
}

// 2. Fix the hardcoded activeStep === 4
code = code.replace(
  "activeStep === 4 ? 'opacity-100 translate-y-0'",
  "activeStep === PANDUAN_STEPS.length ? 'opacity-100 translate-y-0'"
);

fs.writeFileSync('src/components/LandingPage.tsx', code);
console.log('Dynamic steps applied!');
