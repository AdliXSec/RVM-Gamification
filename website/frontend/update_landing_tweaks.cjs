const fs = require('fs');

const code = `import { ArrowRight, Star, Cpu, Trophy, Activity, Zap, Shield, CheckCircle2, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useAppStore } from '../store';

// ==========================================
// KONFIGURASI DINAMIS UNTUK PANDUAN & MANFAAT
// Anda dapat mengubah teks di bawah ini kapan saja!
// ==========================================
const PANDUAN_STEPS = [
  { num: '1', title: 'LOGIN', desc: 'Gunakan panel layar sentuh di mesin untuk login ke akun RVM Quest.' },
  { num: '2', title: 'MASUKKAN BOTOL', desc: 'Masukkan botol PET kosong. AI akan menimbang dan memvalidasi material secara presisi.' },
  { num: '3', title: 'PROSES CACAH', desc: 'Botol akan dihancurkan menjadi flake plastik di dalam mesin.' },
  { num: '4', title: 'KLAIM REWARD', desc: 'XP otomatis masuk ke dashboard. Tukarkan dengan voucher menarik!' }
];

const MANFAAT_SYSTEM = [
  { 
    title: 'UNTUK KAMU', 
    desc: 'Dapatkan XP dari setiap botol, tingkatkan level, panjat leaderboard kampus, dan nikmati reward berupa potongan UKT hingga voucher kantin eksklusif.',
    colorText: 'text-green-400',
    iconColor: 'text-yellow-500',
    Icon: Trophy,
    animClass: 'animate-bounce'
  },
  { 
    title: 'UNTUK LINGKUNGAN & RISET', 
    desc: 'Limbah plastimu langsung diolah menjadi filamen 3D printer untuk mendukung penelitian mahasiswa teknik dan menciptakan ekonomi sirkular sejati di kampus.',
    colorText: 'text-emerald-400',
    iconColor: 'text-emerald-500',
    Icon: Leaf,
    animClass: 'animate-pulse'
  }
];
// ==========================================

export default function LandingPage() {
  const { settings } = useAppStore();
  const videoSectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeStep, setActiveStep] = useState(-1);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameCount = 240;

  useEffect(() => {
    // 1. Preload Images
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      const num = i.toString().padStart(3, '0');
      img.src = \`/animation_vending_machine_frames/frame_\${num}.jpg\`;
      imagesRef.current.push(img);
    }
    
    // Draw initial frame once loaded
    imagesRef.current[0].onload = () => {
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          canvasRef.current.width = 1920;
          canvasRef.current.height = 1080;
          ctx.drawImage(imagesRef.current[0], 0, 0, 1920, 1080);
        }
      }
    };

    let ticking = false;
    let lastProgress = 0;

    const updateCanvasAndText = () => {
      if (videoSectionRef.current && canvasRef.current) {
        const rect = videoSectionRef.current.getBoundingClientRect();
        const scrollRange = rect.height - window.innerHeight;
        
        let progress = -rect.top / scrollRange;
        progress = Math.max(0, Math.min(1, progress));
        
        if (Math.abs(progress - lastProgress) > 0.001) {
          lastProgress = progress;
          
          // --- 1. Update Canvas Frame ---
          const frameIndex = Math.min(
            frameCount - 1,
            Math.floor(progress * frameCount)
          );
          
          const img = imagesRef.current[frameIndex];
          if (img && img.complete) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, 1920, 1080);
            }
          }

          // --- 2. Update Active Step (Text) ---
          let step = -1;
          if (progress > 0.1 && progress <= 0.3) step = 0;
          else if (progress > 0.3 && progress <= 0.5) step = 1;
          else if (progress > 0.5 && progress <= 0.7) step = 2;
          else if (progress > 0.7 && progress <= 0.85) step = 3;
          else if (progress > 0.85) step = 4;

          setActiveStep((prev) => {
             if (prev !== step) return step;
             return prev;
          });
        }
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateCanvasAndText);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[hsl(220,15%,7%)] text-slate-200 selection:bg-green-500/30 font-pixel-body">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full p-4 md:px-8 flex justify-between items-center z-50 bg-[hsl(220,15%,7%)]/90 backdrop-blur-md border-b border-slate-800/50">
        <div className="flex items-center gap-3">
          <img src="/recycle.png" alt="Logo" className="w-8 h-8 pixel-render" />
          <span className="font-pixel text-slate-200 text-xs tracking-wider">RVM<span className="text-green-500">QUEST</span></span>
        </div>
        <Link to="/login" className="font-pixel text-[8px] text-slate-300 hover:text-green-400 pixel-border px-4 py-2 bg-slate-900/50 hover:bg-slate-800 transition-colors">
          LOGIN SERVER
        </Link>
      </nav>

      {/* Hero Section with Cinematic Video Background */}
      <section className="relative min-h-screen flex items-center pt-8 pb-10 px-4 md:px-12 overflow-hidden scanlines">
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover opacity-30"
          >
            <source src="/assets/cinematic_bg.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,15%,7%)]/90 via-[hsl(220,15%,7%)]/50 to-[hsl(220,15%,7%)] mix-blend-multiply" />
          <div className="absolute inset-0 bg-[hsl(220,15%,7%)]/20" />
        </div>

        {/* HERO CONTENT: Adjusted margin-top to shift everything UP and made it larger */}
        <div className="relative z-10 w-full max-w-7xl mx-auto grid md:grid-cols-12 gap-8 items-center -mt-16 md:-mt-24">
          
          <div className="flex flex-col items-start text-left md:col-span-7 z-20">
            <div className="pixel-border px-6 py-2 bg-slate-900/60 mb-6 inline-block animate-pulse backdrop-blur-sm">
              <span className="font-pixel text-[10px] md:text-xs text-slate-300 tracking-[0.2em] flex items-center gap-2">
                <Star className="w-3 h-3 text-yellow-500" /> SMART CAMPUS QUEST 2026 <Star className="w-3 h-3 text-yellow-500" />
              </span>
            </div>

            <h1 className="font-pixel text-slate-100 text-4xl md:text-5xl lg:text-[4.2rem] leading-[1.3] mb-6 drop-shadow-2xl">
              TUKAR BOTOL PLASTIK<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 animate-gradient">
                JADI POIN BERHARGA
              </span>
            </h1>

            <p className="font-pixel-body text-slate-300 text-xl md:text-3xl mb-10 max-w-xl leading-relaxed drop-shadow-lg">
              Mesin RVM pintar kampus mengubah limbah botolmu menjadi reward eksklusif. 
              <span className="text-green-400 block mt-3 text-2xl font-bold">1 Botol = +{settings?.xp_per_bottle || '10'} XP</span>
            </p>

            <Link
              to="/register"
              className="pixel-btn bg-green-600 hover:bg-green-500 text-white px-10 py-5 flex items-center gap-4 text-[12px] md:text-sm group relative overflow-hidden transition-all duration-300 shadow-[0_0_15px_rgba(34,197,94,0.2)] hover:shadow-[0_0_25px_rgba(34,197,94,0.4)]"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              MULAI QUEST SEKARANG <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="relative w-full h-[450px] md:h-[600px] flex justify-center md:justify-end items-center pointer-events-none mt-12 md:mt-0 md:col-span-5">
            <div className="relative w-full max-w-[500px] h-full flex justify-center items-center">
              <div className="relative z-20 pixel-float">
                <div className="absolute inset-0 bg-green-500 blur-[80px] opacity-15 rounded-full" />
                {/* Image made significantly larger */}
                <img src="/assets/vending_machine.png" alt="Vending Machine" className="h-80 md:h-[500px] lg:h-[600px] object-contain relative drop-shadow-[0_15px_35px_rgba(0,0,0,0.6)]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Banner */}
      <div className="w-full bg-[hsl(220,15%,9%)] border-y-4 border-[hsl(220,15%,12%)] py-3 overflow-hidden flex relative z-10">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array.from({length: 5}).map((_, i) => (
            <div key={i} className="flex items-center gap-8 mx-8">
              <span className="font-pixel text-[10px] text-green-500">+++ NEW REWARDS +++</span>
              <span className="font-pixel text-[10px] text-slate-400">VOUCHER KANTIN</span>
              <span className="font-pixel text-[10px] text-slate-400">MERCHANDISE EKSKLUSIF</span>
              <span className="font-pixel text-[10px] text-slate-400">POTONGAN UKT</span>
            </div>
          ))}
        </div>
      </div>

      {/* Image Sequence Showcase Section - Scroll Tied */}
      <section ref={videoSectionRef} className="bg-[hsl(220,18%,10%)] relative z-10 border-b-4 border-[hsl(220,15%,14%)] h-[400vh]">
        {/* Sticky Container */}
        <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden px-4 py-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-500/5 blur-[120px] rounded-full pointer-events-none" />

          {/* Increased max-width to allow a larger animation canvas */}
          <div className="max-w-[90rem] mx-auto w-full grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            
            {/* Left Side: Animated Dynamic Guide (Now slightly narrower 5 cols) */}
            <div className="lg:col-span-5 space-y-8 md:space-y-12">
              <div className={\`transition-opacity duration-500 \${activeStep === -1 ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}\`}>
                <h2 className="font-pixel text-slate-200 text-2xl md:text-3xl drop-shadow-md mb-6">
                  BAGAIMANA CARA KERJANYA?
                </h2>
                <p className="font-pixel-body text-slate-400 text-lg leading-relaxed">
                  Mesin Reverse Vending Machine (RVM) kami terintegrasi dengan sensor AI cerdas. Mengubah botol bekas menjadi material riset kini semudah bermain game. 
                  <span className="block mt-4 text-green-500 animate-pulse">SCROLL KE BAWAH UNTUK MELIHAT SIMULASI &gt;&gt;</span>
                </p>
              </div>

              {/* Dynamic Steps based on PANDUAN_STEPS */}
              <div className={\`transition-all duration-700 \${activeStep >= 0 && activeStep <= 3 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 absolute pointer-events-none'}\`}>
                <h3 className="font-pixel text-slate-200 text-sm flex items-center gap-2 border-b-2 border-slate-800 pb-2 mb-8">
                  <Activity className="w-4 h-4 text-green-500" /> PANDUAN PENGGUNAAN
                </h3>
                <div className="space-y-6">
                  {PANDUAN_STEPS.map((s, index) => (
                    <div 
                      key={index} 
                      className={\`p-4 pixel-border flex gap-4 items-start transition-all duration-500 \${
                        activeStep === index 
                          ? 'bg-slate-800/80 border-green-500 scale-105 shadow-[0_0_15px_rgba(34,197,94,0.2)]' 
                          : 'bg-slate-900/30 border-slate-800 opacity-40 scale-95'
                      }\`}
                    >
                      <span className={\`font-pixel text-xl \${activeStep === index ? 'text-green-400' : 'text-slate-600'}\`}>{s.num}</span>
                      <div>
                        <h4 className="font-pixel text-slate-200 text-[10px] mb-2">{s.title}</h4>
                        <p className="font-pixel-body text-slate-400 text-sm">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Benefits based on MANFAAT_SYSTEM */}
              <div className={\`transition-all duration-700 \${activeStep === 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 absolute pointer-events-none'}\`}>
                <h3 className="font-pixel text-slate-200 text-sm flex items-center gap-2 border-b-2 border-slate-800 pb-2 mb-8">
                  <Star className="w-4 h-4 text-yellow-500" /> MANFAAT SYSTEM
                </h3>
                <ul className="space-y-6 font-pixel-body text-slate-300">
                  {MANFAAT_SYSTEM.map((m, idx) => (
                    <li key={idx} className="flex items-start gap-4 bg-[hsl(220,15%,12%)] p-6 pixel-border border-slate-700 shadow-xl">
                      <m.Icon className={\`w-8 h-8 shrink-0 mt-0.5 \${m.iconColor} \${m.animClass}\`} />
                      <div>
                        <strong className={\`block font-pixel text-[12px] mb-2 \${m.colorText}\`}>{m.title}</strong>
                        <p className="text-slate-400 text-base leading-relaxed">
                          {m.desc}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Side: Canvas Sequence (Now larger 7 cols) */}
            <div className="lg:col-span-7 relative mt-8 lg:mt-0">
              <div className="relative pixel-border bg-[hsl(220,15%,12%)] p-2 md:p-3 shadow-2xl border-slate-700">
                <canvas 
                  ref={canvasRef}
                  className="w-full h-auto aspect-video rounded pixel-render shadow-inner bg-black"
                />
                
                <div className="absolute -top-4 -right-4 bg-slate-800 text-slate-300 font-pixel text-[8px] px-3 py-2 rounded shadow-lg flex items-center gap-2 pixel-border">
                  <Activity className="w-3 h-3 text-green-500 animate-pulse" /> SCANNING
                </div>
                
                <div className="absolute -bottom-6 -left-6 bg-[hsl(220,15%,10%)] text-green-400 pixel-border border-slate-800 font-pixel text-[8px] px-4 py-3 shadow-2xl flex flex-col gap-1">
                  <span className="text-slate-500">STATUS:</span>
                  <span className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3" /> LIVE FEED</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-[hsl(220,14%,9%)] border-b-4 border-[hsl(220,12%,14%)] px-4 py-24 relative z-10"
               style={{ backgroundImage: 'url(/assets/bg_dark.jpeg)', backgroundBlendMode: 'overlay', backgroundSize: 'cover', backgroundAttachment: 'fixed' }}>
        <div className="absolute inset-0 bg-[hsl(220,15%,7%)]/95"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-pixel text-slate-400 text-sm md:text-base drop-shadow-md">
              &lt; FITUR UTAMA /&gt;
            </h2>
            <p className="font-pixel-body text-slate-300 text-xl">Sistem cerdas untuk lingkungan kampus yang lebih baik</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Cpu className="w-8 h-8 text-green-500" />, title: 'EKONOMI SIRKULAR', desc: 'Botol PET dicacah dan diolah menjadi material filamen 3D printer untuk riset.' },
              { icon: <Trophy className="w-8 h-8 text-yellow-500" />, title: 'SISTEM GAMIFIKASI', desc: 'Kumpulkan XP, naik level, panjat leaderboard, dan tukar dengan voucher.' },
              { icon: <Activity className="w-8 h-8 text-emerald-500" />, title: 'MONITORING LIVE', desc: 'Pantau kapasitas mesin secara real-time dari dashboard sebelum menyetor.' },
            ].map((f, i) => (
              <div key={i} className="pixel-border bg-[hsl(220,15%,10%)]/90 backdrop-blur-sm p-8 pixel-card group hover:bg-[hsl(220,20%,12%)] transition-colors border-2 border-[hsl(220,20%,16%)] hover:border-slate-700/50">
                <div className="mb-6 p-4 bg-[hsl(220,15%,7%)] inline-block pixel-border border-b-4 border-slate-800 group-hover:-translate-y-2 transition-transform duration-300 shadow-inner">
                  {f.icon}
                </div>
                <h3 className="font-pixel text-slate-200 text-[11px] mb-4 group-hover:text-white transition-colors">{f.title}</h3>
                <p className="font-pixel-body text-slate-400 text-xl leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Stats Section */}
      <section className="bg-[hsl(220,15%,7%)] px-4 py-24 relative z-10">
        <div className="max-w-4xl mx-auto pixel-border bg-gradient-to-b from-[hsl(220,20%,10%)] to-[hsl(220,15%,7%)] p-8 md:p-12 text-center border-slate-800 shadow-xl">
          <h2 className="font-pixel text-slate-400 text-sm mb-8">GLOBAL STATS SERVER</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
            {[
              { val: '15,420', label: 'BOTOL DISELAMATKAN', icon: <img src="/recycle.png" alt="Bottle" className="w-6 h-6 mx-auto mb-3 object-contain opacity-70 filter grayscale group-hover:grayscale-0 transition-all" /> },
              { val: '616 kg', label: 'CO2 DIHINDARI', icon: <Shield className="w-5 h-5 mx-auto mb-3 text-slate-500" /> },
              { val: '3,084 m', label: 'FILAMEN 3D PRINTER', icon: <Cpu className="w-5 h-5 mx-auto mb-3 text-slate-500" /> },
            ].map((s, i) => (
              <div key={i} className="p-4 group transform hover:scale-105 transition-transform duration-300">
                {s.icon}
                <div className="font-pixel text-slate-200 text-lg md:text-2xl mb-3 drop-shadow-md">{s.val}</div>
                <div className="font-pixel text-[8px] text-slate-500 tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[hsl(220,18%,5%)] px-4 py-8 text-center border-t-2 border-[hsl(220,15%,10%)] relative z-10">
        <p className="font-pixel text-[8px] text-slate-600 flex items-center justify-center gap-2">
          <Zap className="w-3 h-3 text-slate-500" /> 2026 RVM QUEST - TELKOM UNIVERSITY SURABAYA
        </p>
      </footer>
    </div>
  );
}
`;

fs.writeFileSync('src/components/LandingPage.tsx', code);
