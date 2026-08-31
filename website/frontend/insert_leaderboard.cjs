const fs = require('fs');
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf-8');

const target = "{/* Professional Footer */}";
const leaderboard = `      {/* Top 3 Leaderboard Section */}
      <section className="bg-slate-50 border-b-4 border-slate-200 px-4 py-24 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-pixel text-green-700 text-2xl md:text-4xl mb-6 flex justify-center items-center gap-4">
              <Trophy className="w-8 h-8 md:w-12 md:h-12 text-yellow-500" /> TOP 3 MANUSIA TERBERSIH <Trophy className="w-8 h-8 md:w-12 md:h-12 text-yellow-500" />
            </h2>
            <p className="font-pixel-body text-slate-600 text-xl md:text-2xl">
              Pahlawan lingkungan kampus dengan kontribusi daur ulang botol tertinggi bulan ini.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-end max-w-5xl mx-auto">
            {/* Rank 2 */}
            <div className="bg-white p-6 pixel-border border-slate-300 shadow-md text-center transform hover:-translate-y-2 transition-transform">
              <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4 border-4 border-slate-300">
                <span className="font-pixel text-slate-500 text-xl">#2</span>
              </div>
              <h3 className="font-pixel text-slate-800 text-sm md:text-base mb-2">Budi Santoso</h3>
              <p className="font-pixel-body text-slate-500 text-lg mb-6">Fakultas Teknik</p>
              <div className="bg-slate-100 text-slate-700 py-3 pixel-border border-slate-200 font-bold font-pixel-body text-xl md:text-2xl">
                12,450 XP
              </div>
            </div>

            {/* Rank 1 */}
            <div className="bg-white p-8 pixel-border border-yellow-400 shadow-2xl text-center transform hover:-translate-y-2 transition-transform relative md:-mt-12 z-10">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                <Star className="w-12 h-12 text-yellow-400 fill-yellow-400 animate-pulse" />
              </div>
              <div className="w-20 h-20 mx-auto bg-yellow-50 rounded-full flex items-center justify-center mb-4 border-4 border-yellow-400 mt-2">
                <span className="font-pixel text-yellow-600 text-3xl">#1</span>
              </div>
              <h3 className="font-pixel text-slate-800 text-base md:text-lg mb-2">Siti Aminah</h3>
              <p className="font-pixel-body text-slate-500 text-xl mb-6">Fakultas Rekayasa Industri</p>
              <div className="bg-yellow-100 text-yellow-700 py-4 pixel-border border-yellow-300 font-bold font-pixel-body text-2xl md:text-3xl">
                15,800 XP
              </div>
            </div>

            {/* Rank 3 */}
            <div className="bg-white p-6 pixel-border border-slate-300 shadow-md text-center transform hover:-translate-y-2 transition-transform">
              <div className="w-16 h-16 mx-auto bg-orange-50 rounded-full flex items-center justify-center mb-4 border-4 border-orange-300">
                <span className="font-pixel text-orange-600 text-xl">#3</span>
              </div>
              <h3 className="font-pixel text-slate-800 text-sm md:text-base mb-2">Andi Wijaya</h3>
              <p className="font-pixel-body text-slate-500 text-lg mb-6">Fakultas Informatika</p>
              <div className="bg-slate-100 text-slate-700 py-3 pixel-border border-slate-200 font-bold font-pixel-body text-xl md:text-2xl">
                10,200 XP
              </div>
            </div>
          </div>
        </div>
      </section>

      `;

if (code.includes(target)) {
  code = code.replace(target, leaderboard + target);
  fs.writeFileSync('src/components/LandingPage.tsx', code);
  console.log('Leaderboard successfully inserted!');
} else {
  console.log('Failed to find footer target.');
}
