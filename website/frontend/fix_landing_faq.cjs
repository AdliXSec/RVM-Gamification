const fs = require('fs');
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf-8');

const regex = /\{\[\s*\{\s*q:\s*'Apakah botol harus dicuci dulu[\s\S]*?\]\.map\(\(faq, i\) => \([\s\S]*?\}\)\)/;

const newFaqMapping = `{faqs?.length > 0 ? faqs.sort((a,b)=>a.order_num - b.order_num).map((faq, i) => (
              <div key={faq.id} className="pixel-border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 transition-all cursor-pointer hover:border-green-400" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div className="p-6 flex justify-between items-center">
                  <h3 className="font-pixel text-slate-800 dark:text-slate-100 text-sm md:text-base leading-relaxed pr-4">{faq.question}</h3>
                  <ChevronDown className={\`w-6 h-6 text-slate-400 transition-transform duration-300 \${openFaq === i ? 'rotate-180' : ''}\`} />
                </div>
                {openFaq === i && (
                  <div className="p-6 pt-0 border-t-2 border-slate-100 dark:border-slate-800 font-pixel-body text-slate-600 dark:text-slate-400 text-base md:text-lg animate-fade-in mt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            )) : <p className="text-slate-500 text-center font-pixel-body">FAQ belum tersedia.</p>}`;

if (code.match(regex)) {
  code = code.replace(regex, newFaqMapping);
  fs.writeFileSync('src/components/LandingPage.tsx', code);
  console.log('Landing page FAQ replaced with dynamic data!');
} else {
  console.log('Regex failed in LandingPage FAQ.');
}
