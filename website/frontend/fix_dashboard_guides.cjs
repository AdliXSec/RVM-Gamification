const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');

const regex = /\{\[\s*\{\s*step:\s*1[\s\S]*?\]\.map\(g => \([\s\S]*?\}\)\)/;

const newMapping = `{guides?.length > 0 ? guides.sort((a,b)=>a.step_number - b.step_number).map(g => (
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

if (code.match(regex)) {
  code = code.replace(regex, newMapping);
  fs.writeFileSync('src/components/Dashboard.tsx', code);
  console.log('Dashboard guides replaced with dynamic data!');
} else {
  console.log('Regex failed in Dashboard.');
}
