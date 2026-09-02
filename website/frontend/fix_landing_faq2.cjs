const fs = require('fs');
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf-8');

const oldMap = `{[
              { q: 'Apakah botol harus dicuci dulu sebelum dimasukkan?', a: 'Tidak wajib dicuci, namun pastikan botol dalam keadaan kosong (tidak ada sisa air/minuman manis) agar mesin tidak lengket dan mengundang semut.' },
              { q: 'Botol jenis apa saja yang diterima oleh mesin?', a: 'Saat ini mesin hanya menerima botol plastik jenis PET (Polyethylene Terephthalate) transparan berukuran 330ml hingga 600ml. Kemasan gelas plastik atau kaleng akan ditolak otomatis oleh sensor.' },
              { q: 'Berapa lama XP masuk ke akun setelah botol masuk?', a: 'Sistem RVM kami terhubung secara real-time via IoT. XP akan langsung ditambahkan ke akun Anda (kurang dari 3 detik) setelah botol selesai divalidasi dan dicacah.' },
              { q: 'Bagaimana jika mesin menunjukkan status PENUH?', a: 'Jika indikator aplikasi menunjukkan warna merah (Penuh), mesin akan mengunci pintu masuk secara otomatis. Harap mencari lokasi mesin RVM lain yang masih berstatus Online di halaman status ini.' }
            ].map((faq, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 pixel-border border-slate-300 dark:border-slate-600 shadow-sm overflow-hidden transition-all">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-6 flex justify-between items-center hover:bg-slate-50 dark:bg-slate-900 transition-colors focus:outline-none"
                >
                  <span className="font-pixel text-slate-800 dark:text-slate-100 text-sm md:text-base leading-relaxed pr-8">{faq.q}</span>
                  <ChevronDown className={\`w-6 h-6 shrink-0 text-green-600 transition-transform duration-300 \${openFaq === idx ? 'rotate-180' : ''}\`} />
                </button>
                <div className={\`px-6 overflow-hidden transition-all duration-300 \${openFaq === idx ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}\`}>
                  <p className="font-pixel-body text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}`;

const newMap = `{faqs?.length > 0 ? faqs.sort((a,b)=>a.order_num - b.order_num).map((faq, idx) => (
              <div key={faq.id} className="bg-white dark:bg-slate-900 pixel-border border-slate-300 dark:border-slate-600 shadow-sm overflow-hidden transition-all">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-6 flex justify-between items-center hover:bg-slate-50 dark:bg-slate-900 transition-colors focus:outline-none"
                >
                  <span className="font-pixel text-slate-800 dark:text-slate-100 text-sm md:text-base leading-relaxed pr-8">{faq.question}</span>
                  <ChevronDown className={\`w-6 h-6 shrink-0 text-green-600 transition-transform duration-300 \${openFaq === idx ? 'rotate-180' : ''}\`} />
                </button>
                <div className={\`px-6 overflow-hidden transition-all duration-300 \${openFaq === idx ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}\`}>
                  <p className="font-pixel-body text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">
                    {faq.answer}
                  </p>
                </div>
              </div>
            )) : <p className="text-slate-500 text-center font-pixel-body">FAQ belum tersedia.</p>}`;

if(code.includes("Apakah botol harus dicuci dulu sebelum dimasukkan?")) {
    code = code.replace(oldMap, newMap);
    fs.writeFileSync('src/components/LandingPage.tsx', code);
    console.log('FAQ in LandingPage replaced!');
}
