const fs = require('fs');
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf-8');

// 1. Add new imports (MapPin, ChevronDown)
code = code.replace(/import { (.*) } from 'lucide-react';/, "import { $1, MapPin, ChevronDown } from 'lucide-react';");

// 2. Add state inside LandingPage
const stateToAdd = `
  const [machines, setMachines] = useState<any[]>([]);
  const [loadingMachines, setLoadingMachines] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
`;
code = code.replace('  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);', '  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);' + stateToAdd);

// 3. Add api call to useEffect
const apiCallToAdd = `
    api.get('/machines')
      .then(res => {
        if (res.data) setMachines(res.data);
      })
      .catch(err => console.error('Failed to fetch machines', err))
      .finally(() => setLoadingMachines(false));
`;
code = code.replace('  }, []);', apiCallToAdd + '  }, []);');

// 4. Inject the JSX before Production Info section
const newSections = `      {/* Live Machine Status */}
      <section className="bg-white border-b-4 border-slate-200 px-4 py-24 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-pixel text-slate-800 text-2xl md:text-3xl mb-4 flex justify-center items-center gap-4">
              <MapPin className="w-8 h-8 text-green-600" /> STATUS LOKASI RVM <MapPin className="w-8 h-8 text-green-600" />
            </h2>
            <p className="font-pixel-body text-slate-600 text-xl md:text-2xl">
              Pantau ketersediaan kapasitas mesin secara real-time dari seluruh area kampus.
            </p>
          </div>
          
          {loadingMachines ? (
            <div className="text-center font-pixel text-slate-500 animate-pulse py-10">MEMUAT SENSOR IoT...</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {machines.map((machine: any) => (
                <div key={machine.id} className="p-6 pixel-border border-slate-200 bg-slate-50 hover:border-green-400 hover:shadow-lg transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="font-pixel text-slate-800 text-[10px] md:text-xs max-w-[65%] leading-relaxed">{machine.name}</h3>
                    {machine.status === 'online' && machine.current_bottles < machine.max_capacity ? (
                      <span className="flex items-center gap-2 text-[10px] font-pixel text-green-600 bg-green-100 px-2 py-1 rounded">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> ONLINE
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-[10px] font-pixel text-red-600 bg-red-100 px-2 py-1 rounded">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span> PENUH
                      </span>
                    )}
                  </div>
                  <p className="font-pixel-body text-slate-500 text-xl mb-4 line-clamp-1">{machine.location || 'Lokasi Belum Diatur'}</p>
                  <div className="w-full bg-slate-200 h-6 pixel-border border-slate-300 relative overflow-hidden mb-2">
                    <div 
                      className={\`h-full transition-all duration-1000 \${(machine.current_bottles / machine.max_capacity) > 0.9 ? 'bg-red-500' : 'bg-green-500'}\`} 
                      style={{ width: \`\${Math.min(100, (machine.current_bottles / machine.max_capacity) * 100)}%\` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 font-pixel-body text-slate-700 font-bold text-xl">
                    <span>Terisi: {machine.current_bottles} / {machine.max_capacity}</span>
                    <span>{Math.round((machine.current_bottles / machine.max_capacity) * 100)}%</span>
                  </div>
                </div>
              ))}
              {(!machines || machines.length === 0) && (
                <div className="col-span-full text-center font-pixel-body text-slate-500 text-xl py-10 border-2 border-dashed border-slate-300">
                  Belum ada mesin RVM yang didaftarkan ke server produksi.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-slate-50 border-b-4 border-slate-200 px-4 py-24 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-pixel text-slate-800 text-2xl md:text-3xl mb-4">PERTANYAAN UMUM (FAQ)</h2>
            <p className="font-pixel-body text-slate-600 text-xl md:text-2xl">
              Panduan teknis dan informasi penting seputar sistem RVM Quest.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { q: 'Apakah botol harus dicuci dulu sebelum dimasukkan?', a: 'Tidak wajib dicuci, namun pastikan botol dalam keadaan kosong (tidak ada sisa air/minuman manis) agar mesin tidak lengket dan mengundang semut.' },
              { q: 'Botol jenis apa saja yang diterima oleh mesin?', a: 'Saat ini mesin hanya menerima botol plastik jenis PET (Polyethylene Terephthalate) transparan berukuran 330ml hingga 600ml. Kemasan gelas plastik atau kaleng akan ditolak otomatis oleh sensor.' },
              { q: 'Berapa lama XP masuk ke akun setelah botol masuk?', a: 'Sistem RVM kami terhubung secara real-time via IoT. XP akan langsung ditambahkan ke akun Anda (kurang dari 3 detik) setelah botol selesai divalidasi dan dicacah.' },
              { q: 'Bagaimana jika mesin menunjukkan status PENUH?', a: 'Jika indikator aplikasi menunjukkan warna merah (Penuh), mesin akan mengunci pintu masuk secara otomatis. Harap mencari lokasi mesin RVM lain yang masih berstatus Online di halaman status ini.' }
            ].map((faq, idx) => (
              <div key={idx} className="bg-white pixel-border border-slate-300 shadow-sm overflow-hidden transition-all">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-6 flex justify-between items-center hover:bg-slate-50 transition-colors focus:outline-none"
                >
                  <span className="font-pixel text-slate-800 text-[10px] md:text-sm leading-relaxed pr-8">{faq.q}</span>
                  <ChevronDown className={\`w-6 h-6 shrink-0 text-green-600 transition-transform duration-300 \${openFaq === idx ? 'rotate-180' : ''}\`} />
                </button>
                <div className={\`px-6 overflow-hidden transition-all duration-300 \${openFaq === idx ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}\`}>
                  <p className="font-pixel-body text-slate-600 text-xl leading-relaxed border-t border-slate-100 pt-4">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

`;

const targetInsert = '{/* Production Info Section */}';
if (code.includes(targetInsert)) {
  code = code.replace(targetInsert, newSections + targetInsert);
  fs.writeFileSync('src/components/LandingPage.tsx', code);
  console.log('IoT Status and FAQ successfully injected!');
} else {
  console.log('Target insertion point not found.');
}
