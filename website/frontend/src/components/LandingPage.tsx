import { ArrowRight, Star,Trophy, Activity,Leaf, ChevronDown, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useAppStore } from '../store';
import api from '../lib/api';

// ==========================================
// KONFIGURASI DINAMIS UNTUK PANDUAN & MANFAAT
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
    colorText: 'text-green-700',
    iconColor: 'text-amber-500',
    Icon: Trophy,
    animClass: 'animate-bounce'
  },
  { 
    title: 'UNTUK LINGKUNGAN & RISET', 
    desc: 'Limbah plastimu langsung diolah menjadi filamen 3D printer untuk mendukung penelitian mahasiswa teknik dan menciptakan ekonomi sirkular sejati di kampus.',
    colorText: 'text-emerald-700',
    iconColor: 'text-emerald-500',
    Icon: Leaf,
    animClass: 'animate-pulse'
  }
];
// ==========================================

export default function LandingPage() {
  const { settings, theme, toggleTheme } = useAppStore();
  const videoSectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeStep, setActiveStep] = useState(-1);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameCount = 240;

  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [machines, setMachines] = useState<any[]>([]);
  const [loadingMachines, setLoadingMachines] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    api.get('/users/leaderboard')
      .then(res => {
        if (res.data && res.data.leaderboard) {
          setLeaderboard(res.data.leaderboard);
        }
      })
      .catch(err => console.error('Failed to fetch leaderboard', err));

    api.get('/machines')
      .then(res => {
        if (res.data) setMachines(res.data);
      })
      .catch(err => console.error('Failed to fetch machines', err))
      .finally(() => setLoadingMachines(false));
  }, []);


  useEffect(() => {
    // 1. Preload Images
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      const num = i.toString().padStart(3, '0');
      img.src = `/animation_vending_machine_frames/frame_${num}.jpg`;
      imagesRef.current.push(img);
    }
    
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

          let step = -1;
          if (progress > 0.1) {
            const totalSteps = PANDUAN_STEPS.length + 1; 
            const progressPerStep = 0.9 / totalSteps;
            step = Math.floor((progress - 0.1) / progressPerStep);
            if (step >= totalSteps) step = totalSteps - 1;
          }

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
    <div className="min-h-screen bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 selection:bg-green-500/30 font-pixel-body">
      
      {/* Navbar - Light Theme */}
      <nav className="fixed top-0 w-full p-4 md:px-8 flex justify-between items-center z-50 bg-slate-100 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3">
          <img src="/recycle.png" alt="Logo" className="w-8 h-8 pixel-render drop-shadow-sm" />
          <span className="font-pixel text-slate-800 dark:text-slate-100 text-xs tracking-wider">RVM<span className="text-green-600">QUEST</span></span>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme} 
            className="p-2 pixel-border bg-slate-100 dark:bg-slate-800 dark:bg-slate-800 text-slate-600 dark:text-slate-300 dark:text-slate-300 hover:text-green-600 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <Link to="/login" className="font-pixel text-[8px] text-slate-600 dark:text-slate-300 dark:text-slate-300 hover:text-green-700 dark:hover:text-green-400 pixel-border px-4 py-2 bg-slate-100 dark:bg-slate-800 dark:bg-slate-800 hover:bg-green-50 dark:hover:bg-slate-700 transition-colors">
            LOGIN SERVER
          </Link>
        </div>
  
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-24 pb-12 px-4 md:px-12 overflow-hidden">
        {/* Background Video (Cleaned up gradients) */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-slate-100 dark:bg-[#0b1120]">
          <video autoPlay loop muted playsInline className="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover opacity-80 mix-blend-luminosity dark:mix-blend-normal">
            <source src="/assets/cinematic_bg.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-white/80 dark:bg-[#0b1120]/80 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 w-full max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          
          {/* Left Text Block */}
          <div className="flex flex-col items-start text-left md:w-[55%] z-20">
            {/* Neo-brutalist / Fun indie game badge (no pulsing/blur) */}
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-slate-300/50 dark:border-slate-600/50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md mb-8">
              <span className="font-pixel text-[10px] md:text-xs text-slate-800 dark:text-slate-200 tracking-[0.2em] font-bold uppercase">
                Reverse Vending Machine TUS-SBY
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
          <div className="relative w-full h-[400px] md:h-[550px] flex justify-center md:justify-end items-center pointer-events-none mt-16 md:mt-0 md:w-[45%]">
            <div className="relative z-20">
              <img src="/assets/vending_machine.png" alt="Vending Machine" className="h-72 md:h-[450px] lg:h-[550px] object-contain object-center md:object-right drop-shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Banner - Bold Green */}
      <div className="w-full bg-emerald-700 border-y-4 border-emerald-800 py-3 overflow-hidden flex relative z-10 shadow-inner">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array.from({length: 5}).map((_, i) => (
            <div key={i} className="flex items-center gap-8 mx-8">
              <span className="font-pixel text-xs md:text-sm text-green-100">+++ NEW REWARDS +++</span>
              <span className="font-pixel text-xs md:text-sm text-white">VOUCHER KANTIN</span>
              <span className="font-pixel text-xs md:text-sm text-white">MERCHANDISE EKSKLUSIF</span>
              <span className="font-pixel text-xs md:text-sm text-white">POTONGAN UKT</span>
            </div>
          ))}
        </div>
      </div>

      {/* Image Sequence Showcase Section */}
      <section ref={videoSectionRef} className="bg-slate-100 dark:bg-slate-800 relative z-10 border-b-4 border-slate-300 dark:border-slate-600 h-[400vh]">
        <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden px-4 py-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-400/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-[90rem] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 items-center h-[90vh] lg:h-auto justify-center">
            
            {/* Left Side: Animated Dynamic Guide - Light Theme */}
            <div className="lg:col-span-5 space-y-4 md:space-y-12 order-2 lg:order-1">
              <div className={`transition-opacity duration-500 ${activeStep === -1 ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                <h2 className="font-pixel text-slate-800 dark:text-slate-100 text-3xl md:text-4xl drop-shadow-sm mb-6">
                  BAGAIMANA CARA KERJANYA?
                </h2>
                <p className="font-pixel-body text-slate-600 dark:text-slate-300 text-lg md:text-xl leading-relaxed">
                  Mesin Reverse Vending Machine (RVM) kami terintegrasi dengan sensor AI cerdas. Mengubah botol bekas menjadi material riset kini semudah bermain game. 
                  <span className="block mt-4 text-green-600 animate-pulse font-bold">SCROLL KE BAWAH UNTUK MELIHAT SIMULASI &gt;&gt;</span>
                </p>
              </div>

              <div className={`transition-all duration-700 ${activeStep >= 0 && activeStep < PANDUAN_STEPS.length ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 absolute pointer-events-none'}`}>
                <h3 className="font-pixel text-slate-800 dark:text-slate-100 text-sm md:text-xl flex items-center gap-2 border-b-2 border-slate-200 dark:border-slate-700 pb-2 mb-4 lg:mb-8">
                  <Activity className="w-4 h-4 text-green-600" /> PANDUAN PENGGUNAAN
                </h3>
                <div className="space-y-6">
                  {PANDUAN_STEPS.map((s, index) => (
                    <div 
                      key={index} 
                      className={`p-4 pixel-border gap-4 items-start transition-all duration-500 ${
                        activeStep === index 
                          ? 'flex bg-green-50 dark:bg-green-900/40 border-green-500 scale-105 shadow-[0_4px_15px_rgba(34,197,94,0.15)]' 
                          : 'hidden md:flex bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 opacity-50 scale-95'
                      }`}
                    >
                      <span className={`font-pixel text-3xl md:text-4xl ${activeStep === index ? 'text-green-600' : 'text-slate-400'}`}>{s.num}</span>
                      <div>
                        <h4 className="font-pixel text-slate-800 dark:text-slate-100 text-sm md:text-base mb-2">{s.title}</h4>
                        <p className="font-pixel-body text-slate-600 dark:text-slate-300 text-sm md:text-base">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`transition-all duration-700 ${activeStep === PANDUAN_STEPS.length ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 absolute pointer-events-none'}`}>
                <h3 className="font-pixel text-slate-800 dark:text-slate-100 text-lg md:text-xl flex items-center gap-2 border-b-2 border-slate-200 dark:border-slate-700 pb-2 mb-8">
                  <Star className="w-4 h-4 text-amber-500" /> MANFAAT SYSTEM
                </h3>
                <ul className="space-y-6 font-pixel-body text-slate-700 dark:text-slate-200">
                  {MANFAAT_SYSTEM.map((m, idx) => (
                    <li key={idx} className="flex items-start gap-4 bg-slate-50 dark:bg-[#0b1120] p-6 pixel-border border-slate-300 dark:border-slate-600 shadow-lg">
                      <m.Icon className={`w-8 h-8 shrink-0 mt-0.5 ${m.iconColor} ${m.animClass}`} />
                      <div>
                        <strong className={`block font-pixel text-sm md:text-base mb-2 ${m.colorText}`}>{m.title}</strong>
                        <p className="font-pixel-body text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed">
                          {m.desc}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Side: Canvas */}
            <div className="lg:col-span-7 relative mt-4 lg:mt-0 order-1 lg:order-2">
              <div className="relative pixel-border bg-slate-50 dark:bg-[#0b1120] p-2 md:p-3 shadow-xl border-slate-300 dark:border-slate-600">
                <canvas 
                  ref={canvasRef}
                  className="w-full h-auto aspect-video rounded pixel-render bg-slate-900 border border-slate-200 dark:border-slate-700"
                />
                
                <div className="absolute -top-4 -right-4 bg-slate-50 dark:bg-[#0b1120] text-slate-700 dark:text-slate-200 font-pixel text-[10px] md:text-xs px-3 py-2 rounded shadow-lg flex items-center gap-2 pixel-border border-slate-200 dark:border-slate-700">
                  SCANNING
                </div>
                
                <div className="absolute -bottom-6 -left-6 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 pixel-border border-green-200 dark:border-green-800 font-pixel text-[10px] md:text-xs px-4 py-3 shadow-lg flex flex-col gap-1">
                  <span className="text-green-600/70">STATUS:</span>
                  <span className="flex items-center gap-2">LIVE FEED</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

                  {/* Production Info Section */}
      <section className="bg-white dark:bg-slate-900 border-b-4 border-slate-200 dark:border-slate-700 px-4 pt-32 md:pt-24 pb-20 relative z-10 mt-16 md:mt-0">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-pixel text-green-700 dark:text-green-500 text-3xl md:text-4xl mb-6">INTEGRASI IoT & AI</h2>
            <p className="font-pixel-body text-slate-600 dark:text-slate-300 text-lg md:text-xl leading-relaxed mb-6">
              RVM Quest bukan sekadar tempat sampah pintar. Ini adalah ekosistem 
              <span className="text-green-600 font-bold"> Internet of Things (IoT) </span> 
              yang terkoneksi secara real-time dengan server pusat kampus.
            </p>
            <p className="font-pixel-body text-slate-600 dark:text-slate-300 text-lg md:text-xl leading-relaxed">
              Setiap botol yang Anda masukkan divalidasi menggunakan sensor cerdas, 
              dicacah secara mekanis, dan data transaksinya diamankan di dalam database 
              untuk transparansi program keberlanjutan (Sustainability Program).
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-[#0b1120] p-8 pixel-border border-slate-300 dark:border-slate-600 shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="font-pixel text-slate-800 dark:text-slate-100 text-base md:text-lg mb-6 border-b-2 border-slate-200 dark:border-slate-700 pb-4">
              SPESIFIKASI SISTEM
            </h3>
            <ul className="space-y-4 font-pixel-body text-slate-600 dark:text-slate-300 text-sm md:text-base">
              <li className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                <span>Versi Perangkat Lunak</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">v2.4.0 (Production)</span>
              </li>
              <li className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                <span>Kapasitas Mesin Maksimal</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">250 Botol PET</span>
              </li>
              <li className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                <span>Waktu Pemrosesan AI</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">&lt; 2.5 Detik / Botol</span>
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

            {/* Top 3 Leaderboard Section */}
      <section className="bg-slate-50 dark:bg-[#0b1120] border-b-4 border-slate-200 dark:border-slate-700 px-4 py-24 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-pixel text-green-700 dark:text-green-500 text-3xl md:text-4xl mb-6 text-center">
              TOP 3 MANUSIA TERBERSIH
            </h2>
            <p className="font-pixel-body text-slate-600 dark:text-slate-300 text-lg md:text-xl leading-relaxed">
              Pahlawan lingkungan kampus dengan kontribusi daur ulang botol tertinggi bulan ini.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-end max-w-5xl mx-auto">
            {/* Rank 2 */}
            <div className="bg-white dark:bg-slate-900 p-6 pixel-border border-slate-300 dark:border-slate-600 shadow-md text-center transform hover:-translate-y-2 transition-transform order-2 md:order-1">
              <div className="w-16 h-16 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 border-4 border-slate-300 dark:border-slate-600">
                <span className="font-pixel text-slate-500 dark:text-slate-400 text-xl">#2</span>
              </div>
              <h3 className="font-pixel text-slate-800 dark:text-slate-100 text-sm md:text-base mb-2">{leaderboard[1] ? leaderboard[1].name : "Menunggu..."}</h3>
              <p className="font-pixel-body text-slate-500 dark:text-slate-400 text-lg mb-6">{leaderboard[1] ? `Level ${leaderboard[1].level || Math.floor((leaderboard[1].points || 0)/500) + 1}` : "..."}</p>
              <div className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 py-3 pixel-border border-slate-200 dark:border-slate-700 font-bold font-pixel-body text-xl md:text-2xl">
                12,450 XP
              </div>
            </div>

            {/* Rank 1 */}
            <div className="bg-white dark:bg-slate-900 p-8 pixel-border border-yellow-400 shadow-2xl text-center transform hover:-translate-y-2 transition-transform relative md:-mt-12 z-10 order-1 md:order-2">
              
              <div className="w-20 h-20 mx-auto bg-yellow-50 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mb-4 border-4 border-yellow-400 mt-2">
                <span className="font-pixel text-yellow-600 text-3xl">#1</span>
              </div>
              <h3 className="font-pixel text-slate-800 dark:text-slate-100 text-base md:text-lg mb-2">{leaderboard[0] ? leaderboard[0].name : "Menunggu..."}</h3>
              <p className="font-pixel-body text-slate-500 dark:text-slate-400 text-xl mb-6">{leaderboard[0] ? `Level ${leaderboard[0].level || Math.floor((leaderboard[0].points || 0)/500) + 1}` : "..."}</p>
              <div className="bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 py-4 pixel-border border-yellow-300 dark:border-yellow-700 font-bold font-pixel-body text-2xl md:text-3xl">
                15,800 XP
              </div>
            </div>

            {/* Rank 3 */}
            <div className="bg-white dark:bg-slate-900 p-6 pixel-border border-slate-300 dark:border-slate-600 shadow-md text-center transform hover:-translate-y-2 transition-transform order-3 md:order-3">
              <div className="w-16 h-16 mx-auto bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-4 border-4 border-orange-300 dark:border-orange-700">
                <span className="font-pixel text-orange-600 text-xl">#3</span>
              </div>
              <h3 className="font-pixel text-slate-800 dark:text-slate-100 text-sm md:text-base mb-2">{leaderboard[2] ? leaderboard[2].name : "Menunggu..."}</h3>
              <p className="font-pixel-body text-slate-500 dark:text-slate-400 text-lg mb-6">{leaderboard[2] ? `Level ${leaderboard[2].level || Math.floor((leaderboard[2].points || 0)/500) + 1}` : "..."}</p>
              <div className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 py-3 pixel-border border-slate-200 dark:border-slate-700 font-bold font-pixel-body text-xl md:text-2xl">
                10,200 XP
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Machine Status */}
      <section className="bg-white dark:bg-slate-900 border-b-4 border-slate-200 dark:border-slate-700 px-4 py-24 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-pixel text-slate-800 dark:text-slate-100 text-3xl md:text-4xl mb-6 text-center">
             STATUS LOKASI RVM
            </h2>
            <p className="font-pixel-body text-slate-600 dark:text-slate-300 text-lg md:text-xl leading-relaxed">
              Pantau ketersediaan kapasitas mesin secara real-time dari seluruh area kampus.
            </p>
          </div>
          
          {loadingMachines ? (
            <div className="text-center font-pixel text-slate-500 dark:text-slate-400 animate-pulse py-10">MEMUAT SENSOR IoT...</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {machines.map((machine: any) => (
                <div key={machine.id} className="p-6 pixel-border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0b1120] hover:border-green-400 hover:shadow-lg transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="font-pixel text-slate-800 dark:text-slate-100 text-[10px] md:text-xs max-w-[65%] leading-relaxed">{machine.name}</h3>
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
                  <p className="font-pixel-body text-slate-500 dark:text-slate-400 text-sm md:text-base mb-4 line-clamp-1">{machine.location || 'Lokasi Belum Diatur'}</p>
                  <div className="w-full bg-slate-200 h-6 pixel-border border-slate-300 dark:border-slate-600 relative overflow-hidden mb-2">
                    <div 
                      className={`h-full transition-all duration-1000 ${(machine.current_bottles / machine.max_capacity) > 0.9 ? 'bg-red-500' : 'bg-green-500'}`} 
                      style={{ width: `${Math.min(100, (machine.current_bottles / machine.max_capacity) * 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-2 font-pixel-body text-slate-700 dark:text-slate-200 font-bold text-sm md:text-base">
                    <span>Terisi: {machine.current_bottles} / {machine.max_capacity}</span>
                    <span>{Math.round((machine.current_bottles / machine.max_capacity) * 100)}%</span>
                  </div>
                </div>
              ))}
              {(!machines || machines.length === 0) && (
                <div className="col-span-full text-center font-pixel-body text-slate-500 dark:text-slate-400 text-sm md:text-base py-10 border-2 border-dashed border-slate-300 dark:border-slate-600">
                  Belum ada mesin RVM yang didaftarkan ke server produksi.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-slate-50 dark:bg-[#0b1120] border-b-4 border-slate-200 dark:border-slate-700 px-4 py-24 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-pixel text-slate-800 dark:text-slate-100 text-3xl md:text-4xl mb-6 text-center">PERTANYAAN UMUM (FAQ)</h2>
            <p className="font-pixel-body text-slate-600 dark:text-slate-300 text-lg md:text-xl leading-relaxed">
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
              <div key={idx} className="bg-white dark:bg-slate-900 pixel-border border-slate-300 dark:border-slate-600 shadow-sm overflow-hidden transition-all">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-6 flex justify-between items-center hover:bg-slate-50 dark:bg-[#0b1120] transition-colors focus:outline-none"
                >
                  <span className="font-pixel text-slate-800 dark:text-slate-100 text-sm md:text-base leading-relaxed pr-8">{faq.q}</span>
                  <ChevronDown className={`w-6 h-6 shrink-0 text-green-600 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                <div className={`px-6 overflow-hidden transition-all duration-300 ${openFaq === idx ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="font-pixel-body text-slate-600 dark:text-slate-300 text-sm md:text-base leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="bg-slate-900 dark:bg-slate-950 px-4 py-24 relative z-10 border-t-4 border-slate-800 dark:border-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-pixel text-white text-3xl md:text-5xl leading-tight mb-6">
            Siap Menjadi Pahlawan Lingkungan?
          </h2>
          <p className="font-pixel-body text-slate-300 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            Mulai kumpulkan botol pertama Anda hari ini. Bersama, kita wujudkan kampus bersih, inovatif, dan dapatkan berbagai reward eksklusif!
          </p>
          <Link
            to="/register"
            className="inline-flex font-pixel border-4 border-white bg-green-500 text-slate-900 px-10 py-4 items-center gap-4 text-base md:text-lg transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgba(255,255,255,1)] active:translate-y-0 active:shadow-none"
          >
            DAFTAR SEKARANG <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="bg-slate-900 text-slate-400 px-4 pt-16 pb-6 relative z-10 border-t-4 border-green-600">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img src="/recycle.png" alt="Logo" className="w-8 h-8 pixel-render drop-shadow-sm grayscale opacity-70" />
              <span className="font-pixel text-white text-sm tracking-wider">RVM<span className="text-green-500">QUEST</span></span>
            </div>
            <p className="font-pixel-body text-sm md:text-base leading-relaxed">
              Solusi gamifikasi pengelolaan limbah botol plastik berbasis IoT untuk lingkungan kampus yang lebih cerdas dan hijau.
            </p>
          </div>
          <div>
            <h4 className="font-pixel text-white text-xs md:text-sm mb-6">TAUTAN RESMI</h4>
            <ul className="space-y-4 font-pixel-body text-sm md:text-base">
              <li><Link to="/login" className="hover:text-green-400 transition-colors flex items-center gap-2">Portal Login Mahasiswa</Link></li>
              <li><Link to="/register" className="hover:text-green-400 transition-colors flex items-center gap-2">Registrasi Akun Baru</Link></li>
              <li><a href="#" className="hover:text-green-400 transition-colors flex items-center gap-2">Dokumentasi API Server</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-pixel text-white text-xs md:text-sm mb-6">HUBUNGI KAMI</h4>
            <ul className="space-y-4 font-pixel-body text-sm md:text-base">
              <li className="flex items-start gap-3">
                <Star className="w-5 h-5 mt-1 text-slate-500 dark:text-slate-400" />
                <span>Telkom University Surabaya<br/>Laboratorium IoT & Sistem Tertanam</span>
              </li>
              <li className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                <span>support.rvmsys@telkomuniversity.ac.id</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="text-center pt-8 border-t border-slate-800 font-pixel text-[10px] md:text-xs text-slate-500 dark:text-slate-400 tracking-wider">
          &copy; 2026 RVM QUEST PRODUCTION TEAM. ALL RIGHTS RESERVED.
        </div>
      </footer>
    </div>
  );
}
