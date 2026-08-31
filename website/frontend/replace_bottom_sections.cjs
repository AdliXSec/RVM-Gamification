const fs = require('fs');
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf-8');

const marker = "{/* Features Section";
const parts = code.split(marker);
if (parts.length === 2) {
  const topPart = parts[0];
  const newBottom = `      {/* Production Info Section */}
      <section className="bg-white border-b-4 border-slate-200 px-4 py-20 relative z-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-pixel text-green-700 text-xl md:text-2xl mb-6">INTEGRASI IoT & AI</h2>
            <p className="font-pixel-body text-slate-600 text-xl md:text-2xl leading-relaxed mb-6">
              RVM Quest bukan sekadar tempat sampah pintar. Ini adalah ekosistem 
              <span className="text-green-600 font-bold"> Internet of Things (IoT) </span> 
              yang terkoneksi secara real-time dengan server pusat kampus.
            </p>
            <p className="font-pixel-body text-slate-600 text-xl md:text-2xl leading-relaxed">
              Setiap botol yang Anda masukkan divalidasi menggunakan sensor cerdas, 
              dicacah secara mekanis, dan data transaksinya diamankan di dalam database 
              untuk transparansi program keberlanjutan (Sustainability Program).
            </p>
          </div>
          <div className="bg-slate-50 p-8 pixel-border border-slate-300 shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="font-pixel text-slate-800 text-lg md:text-xl mb-6 border-b-2 border-slate-200 pb-4 flex items-center gap-3">
              <Zap className="w-6 h-6 text-amber-500" /> SPESIFIKASI SISTEM
            </h3>
            <ul className="space-y-4 font-pixel-body text-slate-600 text-lg md:text-xl">
              <li className="flex justify-between border-b border-slate-200 pb-3">
                <span>Versi Perangkat Lunak</span>
                <span className="font-bold text-slate-800">v2.4.0 (Production)</span>
              </li>
              <li className="flex justify-between border-b border-slate-200 pb-3">
                <span>Kapasitas Mesin Maksimal</span>
                <span className="font-bold text-slate-800">250 Botol PET</span>
              </li>
              <li className="flex justify-between border-b border-slate-200 pb-3">
                <span>Waktu Pemrosesan AI</span>
                <span className="font-bold text-slate-800">&lt; 2.5 Detik / Botol</span>
              </li>
              <li className="flex justify-between pb-2">
                <span>Status Server</span>
                <span className="font-bold text-green-600 flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span> ONLINE
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="bg-slate-900 text-slate-400 px-4 py-16 relative z-10 border-t-4 border-green-600">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img src="/recycle.png" alt="Logo" className="w-8 h-8 pixel-render drop-shadow-sm grayscale opacity-70" />
              <span className="font-pixel text-white text-sm tracking-wider">RVM<span className="text-green-500">QUEST</span></span>
            </div>
            <p className="font-pixel-body text-xl leading-relaxed">
              Solusi gamifikasi pengelolaan limbah botol plastik berbasis IoT untuk lingkungan kampus yang lebih cerdas dan hijau.
            </p>
          </div>
          <div>
            <h4 className="font-pixel text-white text-xs md:text-sm mb-6">TAUTAN RESMI</h4>
            <ul className="space-y-4 font-pixel-body text-xl">
              <li><Link to="/login" className="hover:text-green-400 transition-colors flex items-center gap-2"><ArrowRight className="w-4 h-4" /> Portal Login Mahasiswa</Link></li>
              <li><Link to="/register" className="hover:text-green-400 transition-colors flex items-center gap-2"><ArrowRight className="w-4 h-4" /> Registrasi Akun Baru</Link></li>
              <li><a href="#" className="hover:text-green-400 transition-colors flex items-center gap-2"><ArrowRight className="w-4 h-4" /> Dokumentasi API Server</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-pixel text-white text-xs md:text-sm mb-6">HUBUNGI KAMI</h4>
            <ul className="space-y-4 font-pixel-body text-xl">
              <li className="flex items-start gap-3">
                <Star className="w-5 h-5 mt-1 text-slate-500" />
                <span>Telkom University Surabaya<br/>Laboratorium IoT & Sistem Tertanam</span>
              </li>
              <li className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-slate-500" />
                <span>support.rvmsys@telkomuniversity.ac.id</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center pt-8 border-t border-slate-800 font-pixel text-[10px] md:text-xs text-slate-500 tracking-wider">
          &copy; 2026 RVM QUEST PRODUCTION TEAM. ALL RIGHTS RESERVED.
        </div>
      </footer>
    </div>
  );
}
`;
  fs.writeFileSync('src/components/LandingPage.tsx', topPart + newBottom);
  console.log('Successfully replaced Features and Stats with Production Info');
} else {
  console.log('Could not find the marker.');
}
