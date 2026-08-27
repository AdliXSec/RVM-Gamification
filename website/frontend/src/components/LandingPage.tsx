import { ArrowRight, Zap, Trophy, Shield, Cpu, Activity, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { useAppStore } from '../store';

export default function LandingPage() {
  const { settings } = useAppStore();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[hsl(220,15%,7%)] scanlines overflow-x-hidden">
      <nav className="border-b-4 border-[hsl(220,12%,16%)] bg-[hsl(220,14%,9%)]/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-4">
          <div className="font-pixel text-slate-300 text-sm flex items-center gap-3">
            <div className="relative">
              <img src="/recycle.png" alt="RVM Logo" className="w-6 h-6 animate-spin-slow object-contain" />
              <div className="absolute inset-0 bg-green-500 blur-md opacity-30 animate-pulse" />
            </div>
            RVM<span className="text-green-500">QUEST</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="font-pixel text-[10px] text-slate-400 hover:text-green-400 transition-colors">
              [ LOGIN ]
            </Link>
            <Link to="/register" className="font-pixel text-[10px] hidden md:block bg-green-900/30 text-green-400 border-2 border-green-800 px-3 py-1.5 hover:bg-green-800/50 hover:border-green-600 transition-all">
              DAFTAR
            </Link>
          </div>
        </div>
      </nav>

      <section className="w-full h-[calc(100vh-4rem)] min-h-[600px] flex flex-col items-center justify-center text-center px-4 pb-24 md:pb-16 pt-4 relative z-10 overflow-hidden">
        
        {/* Background Image Layer (Scoped to Hero) */}
        <div 
          className="absolute inset-0 w-full h-full bg-slate-900/80 bg-[url('/bg.jpeg')] bg-cover md:bg-[length:100%_100%] bg-center bg-blend-multiply pointer-events-none"
        />

        {/* Background Animated Stars */}
        {Array.from({length: 40}).map((_, i) => (
          <div key={i} className="star absolute" style={{
            top: `${Math.random() * 80}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
          }} />
        ))}

        {/* Moon */}
        <img 
          src="/moon.png" 
          alt="Moon" 
          className="absolute w-32 md:w-48 opacity-80 animate-pulse pointer-events-none"
          style={{ 
            top: '2%', 
            right: '15%',
            transform: `translateY(${scrollY * 0.15}px)`
          }} 
        />

        {/* Trees Background Layer */}
        <div 
          className="absolute -bottom-4 md:-bottom-8 w-full flex justify-between items-end opacity-40 pointer-events-none"
          style={{ transform: `translateY(${scrollY * 0.05}px)` }}
        >
          <img src="/tree2.png" alt="Tree Background" className="h-56 md:h-80 object-contain ml-4 md:ml-12" />
          <img src="/tree2.png" alt="Tree Background" className="h-48 md:h-72 object-contain mr-8 md:mr-24" />
        </div>

        {/* Trees Foreground Layer */}
        <div className="absolute -bottom-4 md:-bottom-8 w-full flex justify-around items-end opacity-90 pointer-events-none -z-10">
          <img src="/tree.png" alt="Tree Foreground" className="h-64 md:h-96 object-contain -ml-16 md:ml-0" />
          <img src="/tree.png" alt="Tree Foreground" className="h-72 md:h-[30rem] object-contain -mr-16 md:mr-0 hidden md:block" />
        </div>

        {/* Display Characters */}
        <div className="absolute -bottom-4 md:-bottom-8 w-full max-w-5xl flex justify-between items-end px-4 md:px-12 pointer-events-none z-10 overflow-visible">
          <div className="patrol-right">
            <img src="/character/ninja.png" alt="Ninja" className="h-32 md:h-48 object-contain drop-shadow-2xl opacity-90" />
          </div>
          <div className="patrol-left hidden md:block" style={{ animationDelay: '-3s' }}>
            <img src="/character/knight.png" alt="Knight" className="h-36 md:h-52 object-contain drop-shadow-2xl opacity-90" />
          </div>
          <div className="patrol-left" style={{ animationDelay: '-7s' }}>
            <img src="/character/girl.png" alt="Girl" className="h-32 md:h-48 object-contain drop-shadow-2xl opacity-90" />
          </div>
        </div>

        <div className="pixel-float mb-4 relative group z-10">
          <div className="absolute inset-0 bg-green-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
          <img src="/recycle.png" alt="RVM Logo" className="w-20 h-20 md:w-28 md:h-28 object-contain relative z-10" />
        </div>

        <div className="pixel-border-green px-6 py-2 bg-green-950/40 mb-4 inline-block animate-pulse z-10">
          <span className="font-pixel text-[10px] text-green-400 tracking-[0.2em] flex items-center gap-2">
            <Star className="w-3 h-3" /> SMART CAMPUS QUEST 2026 <Star className="w-3 h-3" />
          </span>
        </div>

        <h1 className="font-pixel text-slate-100 text-xl md:text-3xl lg:text-4xl leading-[1.8] mb-4 max-w-4xl drop-shadow-lg z-10">
          TUKAR BOTOL PLASTIK<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 animate-gradient">
            JADI POIN BERHARGA
          </span>
        </h1>

        <p className="font-pixel-body text-slate-400 text-xl md:text-2xl mb-6 max-w-2xl leading-relaxed z-10">
          Mesin RVM pintar kampus mengubah limbah botolmu menjadi reward eksklusif. 
          <span className="text-green-400 block mt-2">1 Botol = +{settings?.xp_per_bottle || '100'} XP</span>
        </p>

        <Link
          to="/register"
          className="pixel-btn bg-green-600 hover:bg-green-500 text-green-50 px-10 py-5 flex items-center gap-4 text-[12px] group relative overflow-hidden z-10"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          MULAI QUEST SEKARANG <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </section>

      {/* Marquee Banner */}
      <div className="w-full bg-[hsl(220,12%,12%)] border-y-4 border-[hsl(220,12%,18%)] py-3 overflow-hidden flex relative z-10">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array.from({length: 4}).map((_, i) => (
            <div key={i} className="flex items-center gap-8 mx-8">
              <span className="font-pixel text-[10px] text-green-500">+++ NEW REWARDS ADDED +++</span>
              <span className="font-pixel text-[10px] text-slate-500">VOUCHER KANTIN</span>
              <span className="font-pixel text-[10px] text-slate-500">MERCHANDISE EKSKLUSIF</span>
              <span className="font-pixel text-[10px] text-slate-500">POTONGAN UKT</span>
            </div>
          ))}
        </div>
      </div>

      <section className="bg-[hsl(220,14%,9%)] border-b-4 border-[hsl(220,12%,16%)] px-4 py-24 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-pixel text-slate-300 text-sm md:text-base">
              &lt; FITUR UTAMA /&gt;
            </h2>
            <p className="font-pixel-body text-slate-500 text-xl">Sistem cerdas untuk lingkungan kampus yang lebih baik</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Cpu className="w-8 h-8 text-green-500" />, title: 'EKONOMI SIRKULAR', desc: 'Botol PET dicacah dan diolah menjadi material filamen 3D printer untuk riset.' },
              { icon: <Trophy className="w-8 h-8 text-yellow-500" />, title: 'SISTEM GAMIFIKASI', desc: 'Kumpulkan XP, naik level, panjat leaderboard, dan tukar dengan voucher.' },
              { icon: <Activity className="w-8 h-8 text-blue-400" />, title: 'MONITORING LIVE', desc: 'Pantau kapasitas mesin secara real-time dari dashboard sebelum menyetor.' },
            ].map((f, i) => (
              <div key={i} className="pixel-border bg-[hsl(220,12%,11%)] p-8 pixel-card group hover:bg-[hsl(220,12%,13%)] transition-colors">
                <div className="mb-6 p-4 bg-[hsl(220,10%,8%)] inline-block pixel-border border-b-4 group-hover:-translate-y-2 transition-transform duration-300">
                  {f.icon}
                </div>
                <h3 className="font-pixel text-slate-200 text-[11px] mb-4">{f.title}</h3>
                <p className="font-pixel-body text-slate-400 text-xl leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[hsl(220,15%,7%)] px-4 py-24 relative z-10">
        <div className="max-w-4xl mx-auto pixel-border bg-[hsl(220,12%,10%)] p-8 md:p-12 text-center">
          <h2 className="font-pixel text-green-400 text-sm mb-8">GLOBAL STATS SERVER</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
            {[
              { val: '15,420', label: 'BOTOL DISELAMATKAN', icon: <img src="/recycle.png" alt="Bottle" className="w-6 h-6 mx-auto mb-3 object-contain opacity-70" /> },
              { val: '616 kg', label: 'CO2 DIHINDARI', icon: <Shield className="w-5 h-5 mx-auto mb-3 text-slate-600" /> },
              { val: '3,084 m', label: 'FILAMEN 3D PRINTER', icon: <Cpu className="w-5 h-5 mx-auto mb-3 text-slate-600" /> },
            ].map((s, i) => (
              <div key={i} className="p-4">
                {s.icon}
                <div className="font-pixel text-slate-200 text-lg md:text-xl mb-3">{s.val}</div>
                <div className="font-pixel text-[8px] text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[hsl(220,16%,5%)] px-4 py-8 text-center border-t-2 border-[hsl(220,12%,12%)] relative z-10">
        <p className="font-pixel text-[8px] text-slate-600 flex items-center justify-center gap-2">
          <Zap className="w-3 h-3 text-yellow-600" /> 2026 RVM QUEST - TELKOM UNIVERSITY SURABAYA
        </p>
      </footer>
    </div>
  );
}
