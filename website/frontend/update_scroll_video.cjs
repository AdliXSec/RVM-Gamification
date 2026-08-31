const fs = require('fs');

let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf-8');

// 1. Add videoRef inside component
code = code.replace(
  "const videoSectionRef = useRef<HTMLDivElement>(null);",
  "const videoSectionRef = useRef<HTMLElement>(null);\n  const videoRef = useRef<HTMLVideoElement>(null);"
);

// 2. Modify useEffect to handle video scrubbing
code = code.replace(
  `  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);`,
  `  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Video Frame-by-Frame Scrubbing Logic
      if (videoSectionRef.current && videoRef.current) {
        const rect = videoSectionRef.current.getBoundingClientRect();
        const scrollRange = rect.height - window.innerHeight;
        
        // Progress goes from 0 to 1 as the sticky section is scrolled
        let progress = -rect.top / scrollRange;
        if (progress < 0) progress = 0;
        if (progress > 1) progress = 1;
        
        if (videoRef.current.duration) {
          // Smoothly update the current time of the video based on scroll progress
          videoRef.current.currentTime = videoRef.current.duration * progress;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);`
);

// 3. Replace the section with a sticky scroll-bound section
const oldSectionStart = "{/* Animation Video Showcase Section */}";
const oldSectionEnd = "</section>";

const newSection = `{/* Animation Video Showcase Section - Scroll Tied */}
      <section ref={videoSectionRef} className="bg-[hsl(220,18%,10%)] relative z-10 border-b-4 border-[hsl(220,15%,14%)] h-[300vh]">
        {/* Sticky Container - stays on screen while scrolling through the 300vh height */}
        <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden px-4 py-8">
          {/* Subtle decorative background lights */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-500/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Side: Comprehensive Guide and Benefits */}
            <div className="lg:col-span-7 space-y-8 md:space-y-12">
              <div>
                <h2 className="font-pixel text-slate-200 text-2xl md:text-3xl drop-shadow-md mb-6">
                  BAGAIMANA CARA KERJANYA?
                </h2>
                <p className="font-pixel-body text-slate-400 text-lg leading-relaxed">
                  Mesin Reverse Vending Machine (RVM) kami terintegrasi dengan sensor AI cerdas. Mengubah botol bekas menjadi material riset kini semudah bermain game. Scroll perlahan untuk melihat simulasi.
                </p>
              </div>

              {/* Cara Penggunaan Steps */}
              <div className="space-y-4 md:space-y-6">
                <h3 className="font-pixel text-slate-200 text-sm flex items-center gap-2 border-b-2 border-slate-800 pb-2">
                  <Activity className="w-4 h-4 text-green-500" /> PANDUAN PENGGUNAAN
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { step: '1', title: 'LOGIN', desc: 'Gunakan panel layar sentuh di mesin untuk login ke akun RVM Quest.' },
                    { step: '2', title: 'MASUKKAN BOTOL', desc: 'Masukkan botol PET kosong. AI akan menimbang dan memvalidasi material.' },
                    { step: '3', title: 'PROSES CACAH', desc: 'Botol akan dihancurkan menjadi flake plastik di dalam mesin.' },
                    { step: '4', title: 'KLAIM REWARD', desc: 'XP otomatis masuk ke dashboard. Tukarkan dengan voucher menarik!' }
                  ].map((s) => (
                    <div key={s.step} className="bg-slate-900/50 p-4 pixel-border border-slate-800 flex gap-4 items-start">
                      <span className="font-pixel text-green-500 text-xl">{s.step}</span>
                      <div>
                        <h4 className="font-pixel text-slate-200 text-[10px] mb-2">{s.title}</h4>
                        <p className="font-pixel-body text-slate-400 text-sm">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-4">
                <h3 className="font-pixel text-slate-200 text-sm flex items-center gap-2 border-b-2 border-slate-800 pb-2">
                  <Star className="w-4 h-4 text-yellow-500" /> MANFAAT SYSTEM
                </h3>
                <ul className="space-y-3 font-pixel-body text-slate-300">
                  <li className="flex items-start gap-3 bg-[hsl(220,15%,12%)] p-3 pixel-border border-slate-700">
                    <Trophy className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-green-400 font-pixel text-[10px] mb-1">UNTUK KAMU</strong>
                      Dapatkan XP dari setiap botol, tingkatkan level, panjat leaderboard kampus, dan nikmati reward berupa potongan UKT hingga voucher kantin.
                    </div>
                  </li>
                  <li className="flex items-start gap-3 bg-[hsl(220,15%,12%)] p-3 pixel-border border-slate-700">
                    <Leaf className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-emerald-400 font-pixel text-[10px] mb-1">UNTUK LINGKUNGAN & RISET</strong>
                      Limbah plastimu langsung diolah menjadi filamen 3D printer untuk mendukung penelitian mahasiswa teknik di kampus.
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Side: Scroll-tied Animated Video */}
            <div className="lg:col-span-5 relative mt-8 lg:mt-0">
              <div className="relative pixel-border bg-[hsl(220,15%,12%)] p-3 shadow-2xl border-slate-700">
                
                {/* The video element bound to scroll */}
                <video 
                  ref={videoRef}
                  muted 
                  playsInline
                  className="w-full rounded pixel-render shadow-inner"
                  preload="metadata"
                >
                  <source src="/assets/animation_vending_machine.mp4" type="video/mp4" />
                </video>
                
                <div className="absolute -top-4 -right-4 bg-slate-800 text-slate-300 font-pixel text-[8px] px-3 py-2 rounded animate-pulse shadow-lg flex items-center gap-2 pixel-border">
                  <Activity className="w-3 h-3 text-green-500" /> SCROLL PROGRESS
                </div>
                
                <div className="absolute -bottom-6 -left-6 bg-[hsl(220,15%,10%)] text-green-400 pixel-border border-slate-800 font-pixel text-[8px] px-4 py-3 shadow-2xl flex flex-col gap-1">
                  <span className="text-slate-500">STATUS:</span>
                  <span className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3" /> ONLINE</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>`;

const startIndex = code.indexOf(oldSectionStart);
const endIndex = code.indexOf(oldSectionEnd, startIndex) + oldSectionEnd.length;

if (startIndex !== -1 && endIndex !== -1) {
  const newCode = code.substring(0, startIndex) + newSection + code.substring(endIndex);
  fs.writeFileSync('src/components/LandingPage.tsx', newCode);
  console.log("Updated successfully");
} else {
  console.log("Could not find section");
}
