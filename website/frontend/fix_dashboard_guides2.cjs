const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

const oldMap = `{[
                { step: 1, icon: <Droplets className="w-5 h-5 text-blue-400" />, title: 'SIAPKAN BOTOL', desc: 'Kosongkan sisa cairan dari botol plastik PET bening.' },
                { step: 2, icon: <Activity className="w-5 h-5 text-green-500" />, title: 'CEK STATUS', desc: 'Buka dashboard. Pastikan status mesin "TERSEDIA".' },
                { step: 3, icon: <Box className="w-5 h-5 text-slate-400" />, title: 'SCAN & MASUKKAN', desc: 'Scan QR di layar mesin. Masukkan botol satu per satu.' },
                { step: 4, icon: <Star className="w-5 h-5 text-yellow-500" />, title: 'COLLECT XP', desc: 'Poin otomatis masuk. Kumpulkan dan tukarkan reward!' },
              ].map(g => (
                <div key={g.step} className="pixel-border bg-slate-900/70 backdrop-blur-sm border-t-2 border-t-green-500/20 p-5 flex gap-4 items-start pixel-card">
                  <div className="pixel-border-green bg-green-950/20 w-10 h-10 flex items-center justify-center shrink-0">
                    <span className="font-pixel text-green-400 text-xs">{g.step}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {g.icon}
                      <h3 className="font-pixel text-[9px] text-slate-300">{g.title}</h3>
                    </div>
                    <p className="font-pixel-body text-slate-500 text-lg">{g.desc}</p>
                  </div>
                </div>
              ))}`;

const newMap = `{guides?.length > 0 ? guides.sort((a,b)=>a.step_number - b.step_number).map(g => (
                <div key={g.id} className="pixel-border bg-slate-900/70 backdrop-blur-sm border-t-2 border-t-green-500/20 p-5 flex gap-4 items-start pixel-card">
                  <div className="pixel-border-green bg-green-950/20 w-10 h-10 flex items-center justify-center shrink-0">
                    <span className="font-pixel text-green-400 text-xs">{g.step_number}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <h3 className="font-pixel text-[9px] text-slate-300">{g.title}</h3>
                    </div>
                    <p className="font-pixel-body text-slate-500 text-lg">{g.description}</p>
                  </div>
                </div>
              )) : <p className="text-slate-500 text-center font-pixel-body">Panduan sedang dimuat...</p>}`;

if(code.includes('Kosongkan sisa cairan dari botol plastik PET bening')) {
    code = code.replace(oldMap, newMap);
    fs.writeFileSync('src/components/Dashboard.tsx', code);
    console.log('Dashboard guides replaced with dynamic data!');
}
