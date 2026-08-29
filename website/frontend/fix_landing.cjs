const fs = require('fs');

const code = `import { ArrowRight, Star, Cpu, Trophy, Activity, Zap, Shield, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAppStore } from '../store';

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const { settings } = useAppStore();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[hsl(220,15%,7%)] text-slate-200 overflow-x-hidden selection:bg-green-500/30 font-pixel-body">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full p-4 md:px-8 flex justify-between items-center z-50 bg-[hsl(220,15%,7%)]/80 backdrop-blur-md border-b-2 border-green-900/50">
        <div className="flex items-center gap-3">
          <img src="/recycle.png" alt="Logo" className="w-8 h-8 pixel-render" />
          <span className="font-pixel text-slate-200 text-xs tracking-wider">RVM<span className="text-green-400">QUEST</span></span>
        </div>
        <Link to="/login" className="font-pixel text-[8px] text-green-400 hover:text-green-300 pixel-border px-4 py-2 bg-green-950/30 hover:bg-green-900/50 transition-colors">
          LOGIN SERVER
        </Link>
      </nav>

      {/* Hero Section with Cinematic Video Background */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-32 px-4 overflow-hidden scanlines">
        
        {/* Video Background */}
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
          {/* Blue-Green gradient overlay to maintain the theme */}
          <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,15%,7%)]/80 via-[hsl(220,20%,15%)]/60 to-[hsl(220,15%,7%)] mix-blend-multiply" />
          <div className="absolute inset-0 bg-green-900/10" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center text-center mt-12 w-full max-w-5xl">
          
          <div className="pixel-border-green px-6 py-2 bg-green-950/60 mb-8 inline-block animate-pulse backdrop-blur-sm">
            <span className="font-pixel text-[10px] text-green-400 tracking-[0.2em] flex items-center gap-2">
              <Star className="w-3 h-3" /> SMART CAMPUS QUEST 2026 <Star className="w-3 h-3" />
            </span>
          </div>

          <h1 className="font-pixel text-slate-100 text-2xl md:text-4xl lg:text-5xl leading-[1.6] mb-6 drop-shadow-2xl">
            TUKAR BOTOL PLASTIK<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-cyan-400 to-emerald-600 animate-gradient">
              JADI POIN BERHARGA
            </span>
          </h1>

          <p className="font-pixel-body text-slate-300 text-lg md:text-2xl mb-10 max-w-2xl leading-relaxed drop-shadow-lg">
            Mesin RVM pintar kampus mengubah limbah botolmu menjadi reward eksklusif. 
            <span className="text-cyan-400 block mt-2">1 Botol = +{settings?.xp_per_bottle || '100'} XP</span>
          </p>

          <Link
            to="/register"
            className="pixel-btn bg-cyan-700 hover:bg-cyan-600 text-cyan-50 px-10 py-5 flex items-center gap-4 text-[12px] group relative overflow-hidden transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            MULAI QUEST SEKARANG <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Assets & Characters Display */}
        <div className="relative z-10 mt-16 w-full max-w-4xl flex justify-center items-end h-64 pointer-events-none">
          {/* Vending Machine Center */}
          <div className="relative z-20 pixel-float">
            <div className="absolute inset-0 bg-cyan-500 blur-[40px] opacity-30 rounded-full" />
            <img src="/assets/vending_machine.png" alt="Vending Machine" className="h-56 md:h-72 object-contain relative drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
          </div>

          {/* Characters around */}
          <div className="absolute left-[10%] md:left-[20%] bottom-0 z-30 patrol-right">
            <img src="/character/ninja.png" alt="Ninja" className="h-24 md:h-36 object-contain drop-shadow-xl" />
          </div>
          <div className="absolute right-[10%] md:right-[20%] bottom-0 z-30 patrol-left" style={{ animationDelay: '-2s' }}>
            <img src="/character/girl.png" alt="Girl" className="h-24 md:h-36 object-contain drop-shadow-xl" />
          </div>
          <div className="absolute left-[5%] bottom-0 z-10 patrol-left hidden md:block" style={{ animationDelay: '-5s' }}>
            <img src="/character/knight.png" alt="Knight" className="h-28 md:h-40 object-contain drop-shadow-xl opacity-80" />
          </div>
        </div>
      </section>

      {/* Marquee Banner */}
      <div className="w-full bg-cyan-950 border-y-4 border-cyan-900 py-3 overflow-hidden flex relative z-10 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array.from({length: 5}).map((_, i) => (
            <div key={i} className="flex items-center gap-8 mx-8">
              <span className="font-pixel text-[10px] text-green-400">+++ NEW REWARDS +++</span>
              <span className="font-pixel text-[10px] text-cyan-200">VOUCHER KANTIN</span>
              <span className="font-pixel text-[10px] text-cyan-200">MERCHANDISE EKSKLUSIF</span>
              <span className="font-pixel text-[10px] text-cyan-200">POTONGAN UKT</span>
            </div>
          ))}
        </div>
      </div>

      {/* Animation Video Showcase Section */}
      <section className="bg-[hsl(220,18%,10%)] relative z-10 py-20 px-4 border-b-4 border-[hsl(220,15%,15%)]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="font-pixel text-cyan-400 text-xl md:text-2xl drop-shadow-md">
              BAGAIMANA CARA KERJANYA?
            </h2>
            <p className="font-pixel-body text-slate-300 text-lg leading-relaxed">
              Mesin Reverse Vending Machine (RVM) kami dilengkapi dengan sensor cerdas. Cukup masukkan botol plastik bekasmu, dan sistem akan secara otomatis menghitung XP yang langsung masuk ke akunmu!
            </p>
            <ul className="space-y-4 font-pixel-body text-slate-400">
              <li className="flex items-center gap-3"><span className="text-green-500 font-pixel">&gt;</span> Login ke akun RVM Quest</li>
              <li className="flex items-center gap-3"><span className="text-green-500 font-pixel">&gt;</span> Masukkan botol PET kosong</li>
              <li className="flex items-center gap-3"><span className="text-green-500 font-pixel">&gt;</span> XP bertambah & naik level!</li>
            </ul>
          </div>
          <div className="relative pixel-border bg-[hsl(220,15%,8%)] p-2 rounded shadow-[0_0_30px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform duration-500">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full rounded pixel-render"
            >
              <source src="/assets/animation_vending_machine.mp4" type="video/mp4" />
            </video>
            <div className="absolute top-4 right-4 bg-red-500 text-white font-pixel text-[8px] px-2 py-1 rounded animate-pulse flex items-center gap-1">
              <Play className="w-2 h-2 fill-current" /> LIVE
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-[hsl(220,14%,9%)] border-b-4 border-[hsl(220,12%,16%)] px-4 py-24 relative z-10"
               style={{ backgroundImage: 'url(/assets/bg_dark.jpeg)', backgroundBlendMode: 'overlay', backgroundSize: 'cover', backgroundAttachment: 'fixed' }}>
        <div className="absolute inset-0 bg-[hsl(220,15%,7%)]/90"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-pixel text-green-400 text-sm md:text-base drop-shadow-md">
              &lt; FITUR UTAMA /&gt;
            </h2>
            <p className="font-pixel-body text-slate-300 text-xl">Sistem cerdas untuk lingkungan kampus yang lebih baik</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Cpu className="w-8 h-8 text-green-400" />, title: 'EKONOMI SIRKULAR', desc: 'Botol PET dicacah dan diolah menjadi material filamen 3D printer untuk riset.' },
              { icon: <Trophy className="w-8 h-8 text-yellow-400" />, title: 'SISTEM GAMIFIKASI', desc: 'Kumpulkan XP, naik level, panjat leaderboard, dan tukar dengan voucher.' },
              { icon: <Activity className="w-8 h-8 text-cyan-400" />, title: 'MONITORING LIVE', desc: 'Pantau kapasitas mesin secara real-time dari dashboard sebelum menyetor.' },
            ].map((f, i) => (
              <div key={i} className="pixel-border bg-[hsl(220,15%,12%)]/90 backdrop-blur-sm p-8 pixel-card group hover:bg-[hsl(220,20%,15%)] transition-colors border-2 border-[hsl(220,20%,20%)] hover:border-cyan-900/50">
                <div className="mb-6 p-4 bg-[hsl(220,15%,8%)] inline-block pixel-border border-b-4 group-hover:-translate-y-2 transition-transform duration-300 shadow-inner">
                  {f.icon}
                </div>
                <h3 className="font-pixel text-slate-100 text-[11px] mb-4 group-hover:text-cyan-300 transition-colors">{f.title}</h3>
                <p className="font-pixel-body text-slate-400 text-xl leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Stats Section */}
      <section className="bg-[hsl(220,15%,7%)] px-4 py-24 relative z-10">
        <div className="max-w-4xl mx-auto pixel-border bg-gradient-to-b from-[hsl(220,20%,12%)] to-[hsl(220,15%,8%)] p-8 md:p-12 text-center shadow-[0_0_40px_rgba(16,185,129,0.1)]">
          <h2 className="font-pixel text-cyan-400 text-sm mb-8">GLOBAL STATS SERVER</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
            {[
              { val: '15,420', label: 'BOTOL DISELAMATKAN', icon: <img src="/recycle.png" alt="Bottle" className="w-6 h-6 mx-auto mb-3 object-contain opacity-80 filter drop-shadow-[0_0_5px_rgba(74,222,128,0.5)]" /> },
              { val: '616 kg', label: 'CO2 DIHINDARI', icon: <Shield className="w-5 h-5 mx-auto mb-3 text-cyan-500" /> },
              { val: '3,084 m', label: 'FILAMEN 3D PRINTER', icon: <Cpu className="w-5 h-5 mx-auto mb-3 text-green-500" /> },
            ].map((s, i) => (
              <div key={i} className="p-4 transform hover:scale-110 transition-transform duration-300">
                {s.icon}
                <div className="font-pixel text-slate-100 text-lg md:text-2xl mb-3 drop-shadow-md">{s.val}</div>
                <div className="font-pixel text-[8px] text-cyan-600 tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[hsl(220,18%,5%)] px-4 py-8 text-center border-t-2 border-[hsl(220,15%,12%)] relative z-10">
        <p className="font-pixel text-[8px] text-slate-500 flex items-center justify-center gap-2">
          <Zap className="w-3 h-3 text-cyan-600" /> 2026 RVM QUEST - TELKOM UNIVERSITY SURABAYA
        </p>
      </footer>
    </div>
  );
}
`;

fs.writeFileSync('src/components/LandingPage.tsx', code);
