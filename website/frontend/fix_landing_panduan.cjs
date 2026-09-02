const fs = require('fs');
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf-8');

// 1. Remove the const PANDUAN_STEPS = [...] block
code = code.replace(
  /const PANDUAN_STEPS = \[\s*\{\s*num: '1'[\s\S]*?\];/m,
  ''
);

// 2. Add displayGuides inside the component
code = code.replace(
  'const frameCount = 240;',
  `const frameCount = 240;
  
  const fallbackGuides = [
    { step_number: 1, title: 'LOGIN', description: 'Gunakan panel layar sentuh di mesin untuk login ke akun RVM Quest.' },
    { step_number: 2, title: 'MASUKKAN BOTOL', description: 'Masukkan botol PET kosong. Sensor akan menimbang dan memvalidasi material secara presisi.' },
    { step_number: 3, title: 'PROSES CACAH', description: 'Botol akan dihancurkan menjadi flake plastik di dalam mesin.' },
    { step_number: 4, title: 'KLAIM REWARD', description: 'XP otomatis masuk ke dashboard. Tukarkan dengan voucher menarik!' }
  ];
  const displayGuides = guides?.length > 0 ? [...guides].sort((a,b)=>a.step_number - b.step_number) : fallbackGuides;`
);

// 3. Replace all PANDUAN_STEPS references with displayGuides
code = code.replaceAll('PANDUAN_STEPS', 'displayGuides');

// 4. Update the properties used in the map
const oldMap = `displayGuides.map((s, index) => (
                    <div 
                      key={index} 
                      className={\`p-4 pixel-border gap-4 items-start transition-all duration-500 \${
                        activeStep === index 
                          ? 'flex bg-green-50 dark:bg-green-900/40 border-green-500 scale-105 shadow-[0_4px_15px_rgba(34,197,94,0.15)]' 
                          : 'hidden md:flex bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 opacity-50 scale-95'
                      }\`}
                    >
                      <span className={\`font-pixel text-3xl md:text-4xl \${activeStep === index ? 'text-green-600' : 'text-slate-400'}\`}>{s.num}</span>
                      <div>
                        <h4 className="font-pixel text-slate-800 dark:text-slate-100 text-sm md:text-base mb-2">{s.title}</h4>
                        <p className="font-pixel-body text-slate-600 dark:text-slate-300 text-sm md:text-base">{s.desc}</p>
                      </div>
                    </div>
                  ))`;
                  
const newMap = `displayGuides.map((s:any, index:number) => (
                    <div 
                      key={index} 
                      className={\`p-4 pixel-border gap-4 items-start transition-all duration-500 \${
                        activeStep === index 
                          ? 'flex bg-green-50 dark:bg-green-900/40 border-green-500 scale-105 shadow-[0_4px_15px_rgba(34,197,94,0.15)]' 
                          : 'hidden md:flex bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 opacity-50 scale-95'
                      }\`}
                    >
                      <span className={\`font-pixel text-3xl md:text-4xl \${activeStep === index ? 'text-green-600' : 'text-slate-400'}\`}>{s.step_number}</span>
                      <div>
                        <h4 className="font-pixel text-slate-800 dark:text-slate-100 text-sm md:text-base mb-2">{s.title}</h4>
                        <p className="font-pixel-body text-slate-600 dark:text-slate-300 text-sm md:text-base">{s.description}</p>
                      </div>
                    </div>
                  ))`;

code = code.replace(oldMap, newMap);

fs.writeFileSync('src/components/LandingPage.tsx', code);
console.log('Landing page panduan made dynamic!');
