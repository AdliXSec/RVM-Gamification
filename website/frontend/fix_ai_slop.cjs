const fs = require('fs');
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf-8');

const heroStart = '{/* Hero Section */}';
const heroEnd = '{/* Marquee Banner - Bold Green */}';

const startIndex = code.indexOf(heroStart);
const endIndex = code.indexOf(heroEnd);

if (startIndex !== -1 && endIndex !== -1) {
  const cleanHero = `{/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-24 pb-12 px-4 md:px-12 overflow-hidden">
        {/* Background Video (Cleaned up gradients) */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-slate-100 dark:bg-[#0b1120]">
          <video autoPlay loop muted playsInline className="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover opacity-80 mix-blend-luminosity dark:mix-blend-normal">
            <source src="/assets/cinematic_bg.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-white/80 dark:bg-[#0b1120]/80 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto grid md:grid-cols-12 gap-8 items-center">
          
          {/* Left Text Block */}
          <div className="flex flex-col items-start text-left md:col-span-7 z-20">
            {/* Neo-brutalist / Fun indie game badge (no pulsing/blur) */}
            <div className="border-4 border-slate-900 dark:border-slate-700 px-4 py-2 bg-green-400 dark:bg-green-900 mb-8 shadow-[4px_4px_0_0_rgba(15,23,42,1)] dark:shadow-[4px_4px_0_0_rgba(51,65,85,1)]">
              <span className="font-pixel text-[10px] md:text-xs text-slate-900 dark:text-green-400 tracking-widest uppercase font-bold">
                TELKOM UNIVERSITY SURABAYA
              </span>
            </div>

            {/* Solid, confident title (no gradient text) */}
            <h1 className="font-pixel text-slate-900 dark:text-slate-50 text-4xl md:text-5xl lg:text-[4rem] leading-tight mb-6">
              TUKAR BOTOL <br/>
              <span className="text-green-600 dark:text-green-500">JADI REWARD</span>
            </h1>

            {/* Humanized, elegant copy (no robotic AI talk) */}
            <p className="font-pixel-body text-slate-700 dark:text-slate-300 text-lg md:text-2xl mb-8 max-w-xl leading-relaxed">
              Selamatkan bumi satu botol demi satu botol. Masukkan botol plastik kosongmu ke dalam mesin pintar kami, kumpulkan poin XP, dan nikmati berbagai keuntungan eksklusif di kampus.
            </p>

            <div className="flex flex-wrap items-center gap-6 mb-10">
              <div className="border-l-4 border-green-500 pl-4">
                <span className="block font-pixel text-slate-900 dark:text-white text-2xl">+{settings?.xp_per_bottle || '10'} XP</span>
                <span className="font-pixel-body text-slate-500 dark:text-slate-400 text-sm md:text-base uppercase tracking-wider mt-1 block">Per Botol PET</span>
              </div>
            </div>

            {/* Solid chunky button (no shimmer/glowing effects) */}
            <Link
              to="/register"
              className="font-pixel border-4 border-slate-900 dark:border-slate-700 bg-green-500 dark:bg-green-600 text-slate-900 dark:text-white px-8 py-4 flex items-center gap-4 text-sm md:text-base transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgba(15,23,42,1)] dark:hover:shadow-[6px_6px_0_0_rgba(51,65,85,1)] active:translate-y-0 active:shadow-none"
            >
              MULAI SEKARANG <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Right Image Block (No floating/pulsing or glowing blobs) */}
          <div className="relative w-full h-[400px] md:h-[500px] flex justify-center items-center pointer-events-none mt-12 md:mt-0 md:col-span-5">
            <div className="relative z-20">
              <img src="/assets/vending_machine.png" alt="Vending Machine" className="h-72 md:h-[400px] lg:h-[450px] object-contain drop-shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      `;
  
  code = code.substring(0, startIndex) + cleanHero + code.substring(endIndex);
  fs.writeFileSync('src/components/LandingPage.tsx', code);
  console.log('Hero section cleansed of AI slop and made elegant & fun!');
} else {
  console.log('Could not find hero boundaries.');
}
