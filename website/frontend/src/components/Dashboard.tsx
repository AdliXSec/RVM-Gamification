import { useState, useMemo, useRef, useEffect } from 'react';
import {
  LogOut, Star, Trophy, Droplets, Leaf, Activity, AlertCircle,
  ShoppingBag, Clock, BookOpen, Gift, Crown, Medal, Flame,
  Swords, Bell, Home, Zap, Lock, Check, Target, Volume2,
  Music, SkipBack, SkipForward, Play, Pause
} from 'lucide-react';
import { useAppStore } from '../store';

// ─── Tier System ───────────────────────────────────────────────────────
function getRewardTier(cost: number) {
  if (cost >= 5000) return { name: 'LEGENDARY', color: 'yellow', border: 'border-yellow-500', glow: 'shadow-[0_0_20px_rgba(234,179,8,0.3)]', text: 'text-yellow-400', bg: 'bg-yellow-950/20', badge: 'bg-yellow-500/20 text-yellow-400' };
  if (cost >= 3000) return { name: 'EPIC', color: 'purple', border: 'border-purple-500', glow: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]', text: 'text-purple-400', bg: 'bg-purple-950/20', badge: 'bg-purple-500/20 text-purple-400' };
  if (cost >= 1000) return { name: 'RARE', color: 'blue', border: 'border-blue-500', glow: 'shadow-[0_0_20px_rgba(59,130,246,0.25)]', text: 'text-blue-400', bg: 'bg-blue-950/20', badge: 'bg-blue-500/20 text-blue-400' };
  return { name: 'COMMON', color: 'slate', border: 'border-slate-600', glow: '', text: 'text-slate-400', bg: 'bg-slate-800/40', badge: 'bg-slate-700/40 text-slate-400' };
}

export default function Dashboard() {
  const { currentUser, users, stats, machines, rewards, logout, redeemReward, settings, notifications, guides } = useAppStore();
  const [tab, setTab] = useState<'home' | 'rank' | 'shop' | 'log' | 'quest' | 'info'>('home');
  
  // Background Music State
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.2);
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Level Up State
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpData, setLevelUpData] = useState({ old: 1, new: 1 });
  
  const tracks = [
    { name: 'BGM 1', url: '/sound/bgm.mp3' },
    { name: 'BGM 2', url: '/sound/bgm2.mp3' }
  ];

  const playBuySound = () => {
    const audio = new Audio('/sound/buy.mp3');
    audio.volume = 0.8; // Fixed volume for SFX, independent of BGM
    audio.play().catch((e) => console.log('SFX play failed:', e));
  };

  const handleRedeemClick = (cost: number, id: string) => {
    playBuySound();
    redeemReward(cost, id);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (!isMuted) {
        audioRef.current.play().catch(() => setIsMuted(true));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isMuted, currentTrack, volume]);

  // Track Level Changes
  useEffect(() => {
    if (!currentUser) return;
    const currentLvl = Math.floor((currentUser.points || 0) / 500) + 1;
    const storageKey = `rvm_last_level_${currentUser.id}`;
    const savedLvl = localStorage.getItem(storageKey);
    
    if (savedLvl) {
      const parsedLvl = parseInt(savedLvl, 10);
      if (currentLvl > parsedLvl) {
        // Level Up Trigger!
        setLevelUpData({ old: parsedLvl, new: currentLvl });
        setShowLevelUp(true);
        localStorage.setItem(storageKey, currentLvl.toString());
      } else if (currentLvl < parsedLvl) {
        // Edge case sync (e.g. points spent/reset)
        localStorage.setItem(storageKey, currentLvl.toString());
      }
    } else {
      // First time init
      localStorage.setItem(storageKey, currentLvl.toString());
    }
  }, [currentUser?.points, currentUser?.id]);

  // Play Level Up SFX
  useEffect(() => {
    if (showLevelUp && !isMuted) {
      const sfx = new Audio('/sound/levelup.mp3');
      sfx.volume = 0.9;
      sfx.play().catch(e => console.log('SFX error:', e));
    }
  }, [showLevelUp, isMuted]);

  if (!currentUser) return null;

  const points = currentUser.points ?? 0;
  const level = Math.floor(points / 500) + 1;
  const xpInLevel = points % 500;
  const xpPercent = (xpInLevel / 500) * 100;
  const xpPerBottle = Number(settings?.xp_per_bottle || 100);
  const totalBottles = Math.floor(points / xpPerBottle);

  // Daily quest data (static display based on existing data)
  const todayStr = new Date().toLocaleDateString('id-ID');
  const todayBottles = currentUser.history?.filter((h: any) => h.type === 'earn' && h.date?.includes(todayStr)).length || 0;
  const dailyTarget = 5;

  // Streak (simplified: count consecutive days with activity)
  const streakDays = useMemo(() => {
    if (!currentUser.history || currentUser.history.length === 0) return 0;
    const earnDates = [...new Set(currentUser.history.filter((h: any) => h.type === 'earn').map((h: any) => h.date?.split(' ')[0]))];
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const ds = d.toLocaleDateString('id-ID').split(' ')[0];
      if (earnDates.some((ed: any) => ed?.includes(ds))) streak++;
      else if (i > 0) break;
    }
    return streak;
  }, [currentUser.history]);

  const navItems = [
    { key: 'home', label: 'BASE', icon: <Home className="w-5 h-5" /> },
    { key: 'rank', label: 'RANK', icon: <Crown className="w-5 h-5" /> },
    { key: 'shop', label: 'SHOP', icon: <ShoppingBag className="w-5 h-5" /> },
    { key: 'log', label: 'LOG', icon: <Clock className="w-5 h-5" /> },
    { key: 'quest', label: 'QUEST', icon: <BookOpen className="w-5 h-5" /> },
    { key: 'info', label: 'INFO', icon: <Bell className="w-5 h-5" /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[hsl(220,15%,7%)] scanlines overflow-x-hidden relative">
      {/* Background */}
      <div className="fixed inset-0 w-full h-full bg-slate-950/80 bg-[url('/bg.jpeg')] bg-cover md:bg-[length:100%_100%] bg-center bg-blend-multiply pointer-events-none z-0 opacity-40" />

      {/* ═══ Level Up Overlay ═══ */}
      {showLevelUp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 backdrop-blur-md">
          <div className="relative text-center p-8 border-4 border-yellow-500 bg-slate-900 shadow-[0_0_50px_rgba(234,179,8,0.4)] animate-[scale-in_0.5s_ease-out] mx-4 max-w-sm w-full">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2">
              <Star className="w-12 h-12 text-yellow-400 fill-yellow-400 animate-[spin_3s_linear_infinite]" />
            </div>
            <h2 className="font-pixel text-4xl md:text-5xl text-yellow-400 mb-2 drop-shadow-md mt-4 animate-pulse">LEVEL UP!</h2>
            <p className="font-pixel text-slate-300 text-sm md:text-base mb-6">
              LVL {levelUpData.old} <span className="text-yellow-500 mx-2">→</span> <span className="text-green-400 text-xl md:text-3xl">LVL {levelUpData.new}</span>
            </p>
            <img src={`/character/${currentUser.character || 'ninja.png'}`} alt="avatar" className="w-24 h-24 md:w-32 md:h-32 mx-auto object-contain drop-shadow-xl animate-bounce mb-8" />
            <button 
              onClick={() => setShowLevelUp(false)}
              className="pixel-btn bg-yellow-600 hover:bg-yellow-500 text-yellow-100 px-8 py-3 font-pixel text-sm md:text-base w-full transition-all"
            >
              LANJUTKAN
            </button>
          </div>
        </div>
      )}

      {/* ═══ HUD Header ═══ */}
      <header className="bg-slate-900/80 border-b-2 border-green-900/40 fixed top-0 left-0 right-0 z-30 backdrop-blur-lg">
        <div className="max-w-4xl mx-auto px-3 md:px-6 py-2 md:py-3 flex items-center gap-3 md:gap-4">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-800 border-2 border-green-700/60 flex items-center justify-center overflow-hidden">
              <img src={`/character/${currentUser.character || 'ninja.png'}`} alt="avatar" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-yellow-600 text-[6px] md:text-[8px] font-pixel text-yellow-100 px-1 md:px-1.5 md:py-0.5 leading-relaxed">
              {level}
            </div>
          </div>

          {/* Name + XP Bar */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <span className="font-pixel text-[9px] md:text-xs text-green-400 truncate">{currentUser.name}</span>
              <span className="font-pixel text-[8px] md:text-[10px] text-yellow-500 flex items-center gap-1 shrink-0 ml-2">
                <Star className="w-3 h-3 md:w-4 md:h-4" /> {points.toLocaleString()}
              </span>
            </div>
            <div className="h-2 md:h-3 bg-slate-800 border border-slate-700/50 overflow-hidden">
              <div
                style={{ width: `${xpPercent}%` }}
                className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-700 relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-[shimmer_2s_infinite]" />
              </div>
            </div>
            <div className="flex justify-between mt-0.5 md:mt-1">
              <span className="font-pixel text-[6px] md:text-[8px] text-slate-600">LVL {level}</span>
              <span className="font-pixel text-[6px] md:text-[8px] text-slate-600">{xpInLevel}/500</span>
            </div>
          </div>

          {/* Music Control */}
          <div className="relative">
            <button onClick={() => setShowMusicPlayer(!showMusicPlayer)} className={`transition-colors p-1 shrink-0 ${isMuted ? 'text-slate-600 hover:text-slate-400' : 'text-blue-400 hover:text-blue-300'}`}>
              <Music className="w-4 h-4 md:w-5 md:h-5" />
            </button>

            {showMusicPlayer && (
              <div className="absolute top-full right-0 mt-3 w-48 md:w-56 pixel-border bg-slate-900/95 border-blue-900/50 p-3 shadow-xl z-50 backdrop-blur-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-pixel text-[8px] md:text-[10px] text-blue-400">MUSIC PLAYER</span>
                  <button onClick={() => setIsMuted(!isMuted)} className="text-slate-400 hover:text-white transition-colors">
                    {isMuted ? <Play className="w-3 h-3 md:w-4 md:h-4" /> : <Pause className="w-3 h-3 md:w-4 md:h-4" />}
                  </button>
                </div>
                
                <div className="flex items-center justify-between mb-3 bg-slate-950/50 p-2 border border-slate-800">
                  <button onClick={() => setCurrentTrack((p) => (p === 0 ? tracks.length - 1 : p - 1))} className="text-slate-400 hover:text-blue-400 transition-colors">
                    <SkipBack className="w-3 h-3 md:w-4 md:h-4" />
                  </button>
                  <span className="font-pixel text-[7px] md:text-[9px] text-slate-300 truncate px-2">{tracks[currentTrack].name}</span>
                  <button onClick={() => setCurrentTrack((p) => (p + 1) % tracks.length)} className="text-slate-400 hover:text-blue-400 transition-colors">
                    <SkipForward className="w-3 h-3 md:w-4 md:h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <Volume2 className="w-3 h-3 md:w-4 md:h-4 text-slate-500 shrink-0" />
                  <input 
                    type="range" 
                    min="0" max="1" step="0.05" 
                    value={volume} 
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-none appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
          
          {/* Logout */}
          <button onClick={logout} className="text-slate-600 hover:text-red-400 transition-colors p-1 shrink-0">
            <LogOut className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          
          {/* Background Audio */}
          <audio 
            ref={audioRef} 
            src={tracks[currentTrack].url} 
            onEnded={() => setCurrentTrack((prev) => (prev + 1) % tracks.length)} 
            autoPlay={!isMuted}
            loop={false}
          />
        </div>
      </header>
      <main className="flex-1 w-full max-w-4xl mx-auto px-3 md:px-6 pt-28 md:pt-32 pb-24 relative z-10">

        {/* ═══ TAB: HOME / BASE CAMP ═══ */}
        {tab === 'home' && (
          <div className="space-y-4">
            {/* Character Card */}
            <div className="relative pixel-border bg-slate-900/70 backdrop-blur-sm border-t-2 border-t-green-500/30 p-5 overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 pointer-events-none"
                style={{ backgroundImage: `url('/tree2.png')`, backgroundSize: 'contain', backgroundPosition: 'right bottom', backgroundRepeat: 'no-repeat' }} />

              <div className="flex items-center gap-5 md:gap-8 relative z-10">
                {/* Character */}
                <div className="relative shrink-0">
                  <div className="absolute inset-0 bg-green-500 blur-2xl opacity-20 animate-pulse rounded-full" />
                  <img
                    src={`/character/${currentUser.character || 'ninja.png'}`}
                    alt="avatar"
                    className="w-28 h-28 md:w-48 md:h-48 object-contain relative z-10 drop-shadow-[0_0_15px_rgba(34,197,94,0.4)] pixel-float"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="inline-flex items-center gap-1.5 bg-yellow-950/40 border border-yellow-800/40 px-2 py-1 md:px-3 md:py-1.5 mb-2 md:mb-4">
                    <Trophy className="w-3 h-3 md:w-4 md:h-4 text-yellow-500" />
                    <span className="font-pixel text-[8px] md:text-[10px] text-yellow-400">LEVEL {level}</span>
                  </div>
                  <h1 className="font-pixel text-green-400 text-xl md:text-3xl lg:text-4xl truncate mb-1 md:mb-2">{currentUser.name}</h1>
                  <p className="font-pixel-body text-slate-500 text-base md:text-lg lg:text-xl">#{currentUser.nim}</p>
                  {streakDays > 0 && (
                    <div className="flex items-center gap-1 mt-2 md:mt-4">
                      <Flame className="w-3.5 h-3.5 md:w-5 md:h-5 text-orange-500" />
                      <span className="font-pixel text-[8px] md:text-xs text-orange-400">{streakDays} HARI STREAK!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stat Row */}
            <div className="grid grid-cols-4 gap-2 md:gap-4">
              {[
                { icon: <Star className="w-4 h-4 md:w-6 md:h-6 text-yellow-500" />, val: points.toLocaleString(), label: 'XP' },
                { icon: <Trophy className="w-4 h-4 md:w-6 md:h-6 text-yellow-500" />, val: `${level}`, label: 'LEVEL' },
                { icon: <Droplets className="w-4 h-4 md:w-6 md:h-6 text-blue-400" />, val: `${totalBottles}`, label: 'BOTOL' },
                { icon: <Leaf className="w-4 h-4 md:w-6 md:h-6 text-green-500" />, val: `${(totalBottles * 0.04).toFixed(1)}`, label: 'KG CO2' },
              ].map((s, i) => (
                <div key={i} className="bg-slate-900/70 border border-slate-800/60 p-3 md:p-5 text-center backdrop-blur-sm">
                  <div className="flex justify-center mb-1.5 md:mb-3">{s.icon}</div>
                  <div className="font-pixel text-slate-200 text-sm md:text-lg">{s.val}</div>
                  <div className="font-pixel text-[6px] md:text-[9px] text-slate-600 mt-0.5 md:mt-2">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Daily Quest */}
            <div className="pixel-border bg-slate-900/70 backdrop-blur-sm border-t-2 border-t-yellow-500/30 p-4 md:p-6">
              <h3 className="font-pixel text-[10px] md:text-sm text-yellow-400 flex items-center gap-2 mb-3 md:mb-5">
                <Target className="w-4 h-4 md:w-5 md:h-5" /> DAILY QUEST
              </h3>
              <div className="space-y-2 md:space-y-4">
                <div className={`flex items-center gap-3 md:p-4 md:gap-5 p-3 md:p-4 border-l-2 ${todayBottles >= dailyTarget ? 'border-green-500 bg-green-950/20' : 'border-yellow-600/50 bg-slate-800/40'}`}>
                  <div className={`w-6 h-6 md:w-10 md:h-10 flex items-center justify-center shrink-0 ${todayBottles >= dailyTarget ? 'bg-green-600 text-green-100' : 'bg-slate-700 text-slate-400'}`}>
                    {todayBottles >= dailyTarget ? <Check className="w-3.5 h-3.5 md:w-5 md:h-5" /> : <Droplets className="w-3.5 h-3.5 md:w-5 md:h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-pixel text-[8px] md:text-sm text-slate-300">Setor {dailyTarget} botol hari ini</p>
                    <div className="h-1.5 md:h-2 bg-slate-700 mt-1.5 md:mt-2 overflow-hidden">
                      <div className={`h-full transition-all ${todayBottles >= dailyTarget ? 'bg-green-500' : 'bg-yellow-500'}`}
                        style={{ width: `${Math.min(100, (todayBottles / dailyTarget) * 100)}%` }} />
                    </div>
                  </div>
                  <span className="font-pixel text-[8px] md:text-sm text-slate-500 shrink-0">{todayBottles}/{dailyTarget}</span>
                </div>

                <div className={`flex items-center gap-3 md:p-4 md:gap-5 p-3 md:p-4 border-l-2 ${streakDays >= 3 ? 'border-green-500 bg-green-950/20' : 'border-yellow-600/50 bg-slate-800/40'}`}>
                  <div className={`w-6 h-6 md:w-10 md:h-10 flex items-center justify-center shrink-0 ${streakDays >= 3 ? 'bg-green-600 text-green-100' : 'bg-slate-700 text-slate-400'}`}>
                    {streakDays >= 3 ? <Check className="w-3.5 h-3.5 md:w-5 md:h-5" /> : <Flame className="w-3.5 h-3.5 md:w-5 md:h-5" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-pixel text-[8px] md:text-sm text-slate-300">Login 3 hari berturut-turut</p>
                    <p className="font-pixel text-[6px] md:text-[10px] text-slate-600 mt-0.5 md:mt-2">Streak saat ini: {streakDays} hari</p>
                  </div>
                  <span className="font-pixel text-[8px] md:text-sm text-slate-500 shrink-0">{Math.min(streakDays, 3)}/3</span>
                </div>
              </div>
            </div>

            {/* Machine Status */}
            <div className="pixel-border bg-slate-900/70 backdrop-blur-sm border-t-2 border-t-cyan-500/30 p-4 md:p-6">
              <h3 className="font-pixel text-[10px] md:text-sm text-slate-400 flex items-center gap-2 md:gap-4 mb-3 md:mb-5">
                <Activity className="w-4 h-4 md:w-5 md:h-5 text-green-500" /> STATUS MESIN RVM
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                {machines?.map((m: any) => {
                  const pct = Math.round((m.current_bottles / m.max_capacity) * 100);
                  const isAvail = m.status === 'online' && m.current_bottles < m.max_capacity;
                  return (
                    <div key={m.id} className={`p-3 md:p-4 border-l-2 ${isAvail ? 'border-green-500 bg-green-950/10' : 'border-red-500 bg-red-950/10'} flex items-center gap-3 md:gap-4 md:p-4`}>
                      <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full shrink-0 ${isAvail ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-pixel text-[8px] md:text-sm text-slate-300 truncate">{m.name}</p>
                        <p className="font-pixel text-[6px] md:text-[10px] text-slate-600 md:mt-1">{m.location}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`font-pixel text-[8px] md:text-sm ${pct >= 80 ? 'text-red-400' : 'text-green-400'}`}>{pct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Campus Stats */}
            <div className="pixel-border bg-slate-900/70 backdrop-blur-sm border-t-2 border-t-green-500/20 p-4 md:p-6">
              <h3 className="font-pixel text-[10px] md:text-sm text-slate-400 flex items-center gap-2 md:gap-4 mb-3 md:mb-5">
                <Leaf className="w-4 h-4 md:w-5 md:h-5 text-green-500" /> STATISTIK KAMPUS
              </h3>
              <div className="grid grid-cols-3 gap-2 md:gap-4 text-center">
                {[
                  { val: stats.totalBottles.toLocaleString(), label: 'BOTOL', icon: <Droplets className="w-3 h-3 md:w-5 md:h-5 text-blue-400" /> },
                  { val: stats.totalCO2.toLocaleString(), label: 'KG CO2', icon: <Leaf className="w-3 h-3 md:w-5 md:h-5 text-green-400" /> },
                  { val: stats.totalFilament.toLocaleString(), label: 'M FILAMEN', icon: <Zap className="w-3 h-3 md:w-5 md:h-5 text-yellow-400" /> },
                ].map((s, i) => (
                  <div key={i} className="bg-slate-800/40 p-3 md:p-5 border border-slate-700/30">
                    <div className="flex justify-center mb-1 md:mb-2">{s.icon}</div>
                    <div className="font-pixel text-green-400 text-sm md:text-xl">{s.val}</div>
                    <div className="font-pixel text-[6px] md:text-[10px] text-slate-600 mt-0.5 md:mt-2">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ TAB: SHOP ═══ */}
        {tab === 'shop' && (
          <div className="space-y-4 md:space-y-6">
            {/* Shop Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 md:gap-5">
                <ShoppingBag className="w-5 h-5 md:w-8 md:h-8 text-green-500" />
                <div>
                  <h2 className="font-pixel text-slate-200 text-base md:text-xl">REWARD SHOP</h2>
                  <p className="font-pixel text-[7px] md:text-[10px] text-slate-600 md:mt-1">Tukarkan XP dengan hadiah eksklusif</p>
                </div>
              </div>
              <div className="bg-slate-800/60 border border-slate-700/40 px-3 py-1.5 md:px-4 md:py-2 flex items-center gap-1 md:gap-2.5 md:gap-2">
                <Star className="w-3 h-3 md:w-5 md:h-5 text-yellow-500" />
                <span className="font-pixel text-[9px] md:text-sm text-yellow-400">{points.toLocaleString()}</span>
              </div>
            </div>

            {/* Items */}
            {rewards.length === 0 ? (
              <div className="pixel-border bg-slate-900/70 p-12 md:p-20 text-center">
                <ShoppingBag className="w-10 h-10 md:w-16 md:h-16 text-slate-700 mx-auto mb-3 md:mb-5" />
                <span className="font-pixel text-[9px] md:text-sm text-slate-600">SHOP KOSONG</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 md:gap-5">
                {rewards.map(item => {
                  const tier = getRewardTier(item.cost);
                  const canAfford = points >= item.cost;
                  return (
                    <div key={item.id}
                      className={`relative pixel-border bg-slate-900/70 backdrop-blur-sm border-t-2 ${tier.border} ${tier.glow} p-4 md:p-6 flex flex-col justify-between transition-all hover:scale-[1.02] ${!canAfford ? 'opacity-60' : ''}`}>
                      {/* Tier Badge */}
                      <div className={`absolute top-2 md:top-3 right-2 md:right-3 font-pixel text-[6px] md:text-[8px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 ${tier.badge}`}>
                        {tier.name}
                      </div>

                      <div>
                        <div className={`w-10 h-10 md:w-16 md:h-16 ${tier.bg} flex items-center justify-center mb-3 md:mb-5 border ${tier.border}/30`}>
                          <Gift className={`w-5 h-5 md:w-8 md:h-8 ${tier.text}`} />
                        </div>
                        <h3 className="font-pixel text-[9px] md:text-sm text-slate-200 mb-1 md:mb-2 md:mb-4 pr-12">{item.name}</h3>
                        <p className="font-pixel-body text-slate-600 text-sm md:text-base mb-3 md:mb-5 line-clamp-2">{item.desc}</p>
                      </div>

                      <div>
                        <div className={`font-pixel text-base md:text-xl mb-2 md:mb-4 flex items-center gap-1 md:gap-2 ${tier.text}`}>
                          <Star className="w-3 h-3 md:w-5 md:h-5" /> {item.cost.toLocaleString()} XP
                        </div>
                        <button
                          className={`w-full py-2.5 md:py-4 font-pixel text-[8px] md:text-xs transition-all ${
                            canAfford
                              ? `pixel-btn bg-green-700 hover:bg-green-600 text-green-100`
                              : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'
                          }`}
                          disabled={!canAfford}
                          onClick={() => handleRedeemClick(item.cost, item.id)}
                        >
                          {canAfford ? (
                            <span className="flex items-center justify-center gap-1 md:gap-2"><ShoppingBag className="w-3 h-3 md:w-5 md:h-5" /> TUKAR</span>
                          ) : (
                            <span className="flex items-center justify-center gap-1 md:gap-2"><Lock className="w-3 h-3 md:w-5 md:h-5" /> LOCKED</span>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ═══ TAB: LOG (Quest Log) ═══ */}
        {tab === 'log' && (
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 md:gap-5">
                <Clock className="w-5 h-5 md:w-8 md:h-8 text-slate-400" />
                <div>
                  <h2 className="font-pixel text-slate-200 text-base md:text-lg md:text-xl">QUEST LOG</h2>
                  <p className="font-pixel text-[7px] md:text-[10px] md:text-sm text-slate-600 md:mt-1">Riwayat aktivitasmu</p>
                </div>
              </div>
              {streakDays > 0 && (
                <div className="flex items-center gap-1.5 md:gap-2 bg-orange-950/30 border border-orange-800/30 px-3 py-1.5 md:px-4 md:py-2">
                  <Flame className="w-3.5 h-3.5 md:w-5 md:h-5 text-orange-500" />
                  <span className="font-pixel text-[8px] md:text-sm md:text-lg text-orange-400">{streakDays} DAY STREAK</span>
                </div>
              )}
            </div>

            <div className="pixel-border bg-slate-900/70 backdrop-blur-sm border-t-2 border-t-green-500/20 p-4 md:p-6">
              {currentUser.history.length === 0 ? (
                <div className="text-center py-12 md:py-20">
                  <Clock className="w-10 h-10 md:w-16 md:h-16 text-slate-700 mx-auto mb-3 md:mb-5" />
                  <span className="font-pixel text-[9px] md:text-sm md:text-lg text-slate-600">BELUM ADA LOG</span>
                </div>
              ) : (
                <div className="space-y-2 md:space-y-4">
                  {currentUser.history.map((tx: any) => {
                    const isEarn = tx.type === 'earn';
                    return (
                      <div key={tx.id}
                        className={`flex items-center gap-3 md:gap-5 p-3 md:p-4 border-l-2 md:border-l-4 transition-colors hover:bg-slate-800/40 ${
                          isEarn ? 'border-green-500' :
                          tx.status === 'cancelled' ? 'border-red-500' :
                          tx.status === 'completed' ? 'border-blue-500' : 'border-yellow-500'
                        }`}>
                        <div className={`w-8 h-8 md:w-12 md:h-12 flex items-center justify-center shrink-0 ${isEarn ? 'bg-green-950/40' : 'bg-purple-950/40'}`}>
                          {isEarn ? <Zap className="w-4 h-4 md:w-6 md:h-6 text-green-400" /> : <Gift className="w-4 h-4 md:w-6 md:h-6 text-purple-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-pixel-body text-slate-300 text-base md:text-lg md:text-xl truncate">{tx.desc}</p>
                          <p className="font-pixel text-[6px] md:text-[9px] text-slate-600 md:mt-1">{tx.date}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className={`font-pixel text-[10px] md:text-sm ${isEarn ? 'text-green-400' : 'text-purple-400'}`}>
                            {isEarn ? '+' : '-'}{tx.amount} XP
                          </span>
                          {tx.type === 'redeem' && tx.status && (
                            <span className={`font-pixel text-[6px] md:text-[9px] block mt-0.5 md:mt-1 ${
                              tx.status === 'pending' ? 'text-yellow-500' :
                              tx.status === 'completed' ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {tx.status === 'pending' ? 'PENDING' : tx.status === 'completed' ? 'DONE' : 'DITOLAK'}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══ TAB: GUIDE ═══ */}
        {tab === 'quest' && (
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center gap-3 md:gap-5">
              <BookOpen className="w-5 h-5 md:w-8 md:h-8 text-blue-400" />
              <div>
                <h2 className="font-pixel text-base md:text-xl">PANDUAN</h2>
                <p className="font-pixel text-[8px] md:text-[10px] text-slate-600 md:mt-1">Cara menggunakan mesin RVM</p>
              </div>
            </div>

            <div className="space-y-2">
              {guides?.length > 0 ? guides.sort((a: any, b: any) => a.step_number - b.step_number).map((g: any) => {
                return (
                  <div key={g.id} className="relative z-10 flex items-start gap-4 md:gap-6 p-4 md:p-6 pixel-border bg-slate-900/70 border-t-2 border-t-blue-500/30 backdrop-blur-sm">
                    {/* Step indicator */}
                    <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center shrink-0 border-2 bg-slate-800 border-blue-600 text-blue-400">
                      <span className="font-pixel text-sm md:text-base">{g.step_number}</span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 md:mb-2">
                        <h3 className="font-pixel text-[10px] md:text-sm text-blue-300">
                          {g.title}
                        </h3>
                      </div>
                      <p className="font-pixel-body text-base md:text-base text-slate-400">{g.description}</p>
                    </div>
                  </div>
                );
              }) : <p className="text-slate-500 text-center font-pixel-body md:text-lg py-8">Panduan sedang dimuat...</p>}
            </div>
          </div>
        )}

        {/* ═══ TAB: NOTIFICATIONS ═══ */}
        {tab === 'info' && (
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 md:gap-5">
                <Bell className="w-5 h-5 md:w-8 md:h-8 text-amber-500" />
                <div>
                  <h2 className="font-pixel text-slate-200 text-base md:text-lg md:text-xl">NOTIFIKASI</h2>
                  <p className="font-pixel text-[7px] md:text-[10px] text-slate-600 md:mt-1 md:mt-2">Info 12 jam terakhir</p>
                </div>
              </div>
            </div>

            {notifications && notifications.length > 0 ? (
              <div className="space-y-2 md:space-y-4">
                {notifications.map((n: any) => (
                  <div key={n.id} className="pixel-border bg-slate-900/70 backdrop-blur-sm p-4 md:p-6 border-l-2 md:border-l-4 border-amber-600/50 flex items-start gap-3 md:gap-5 hover:bg-slate-800/50 transition-colors">
                    <div className="mt-0.5 md:mt-1 shrink-0">
                      {n.type === 'reward' ? <Gift className="w-4 h-4 md:w-6 md:h-6 text-green-400" /> : <Droplets className="w-4 h-4 md:w-6 md:h-6 text-blue-400" />}
                    </div>
                    <div className="min-w-0">
                      <p className="font-pixel-body text-slate-200 text-base md:text-lg md:text-xl">{n.message}</p>
                      <p className="font-pixel text-[7px] md:text-[10px] text-slate-600 mt-1 md:mt-2">{new Date(n.timestamp).toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 md:py-20 pixel-border bg-slate-900/70">
                <AlertCircle className="w-8 h-8 md:w-16 md:h-16 text-slate-600 mx-auto mb-3 md:mb-5" />
                <p className="font-pixel text-[9px] md:text-sm text-slate-600">Tidak ada notifikasi baru.</p>
              </div>
            )}
          </div>
        )}

        {/* ═══ TAB: LEADERBOARD ═══ */}
        {tab === 'rank' && (() => {
          const ranked = [...users].filter(u => u.role === 'student').sort((a, b) => b.points - a.points);
          const myRank = ranked.findIndex(u => u.id === currentUser.id) + 1;
          const getRankTitle = (r: number) => r === 1 ? 'CHAMPION' : r === 2 ? 'ELITE' : r === 3 ? 'VETERAN' : r <= 5 ? 'WARRIOR' : 'ROOKIE';
          const getRankColor = (r: number) => r === 1 ? 'text-yellow-400' : r === 2 ? 'text-slate-300' : r === 3 ? 'text-amber-600' : 'text-slate-500';

          return (
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center gap-3 md:gap-5">
                <Crown className="w-5 h-5 md:w-8 md:h-8 text-yellow-500" />
                <div>
                  <h2 className="font-pixel text-slate-200 text-sm md:text-xl">LEADERBOARD</h2>
                  <p className="font-pixel text-[7px] md:text-[10px] text-slate-600 md:mt-1">Peringkat Eco Warrior kampus</p>
                </div>
              </div>

              {/* Your Rank */}
              <div className="pixel-border bg-green-950/20 border-green-800/30 p-4 md:p-6 flex items-center justify-between">
                <div className="flex items-center gap-3 md:gap-5">
                  <div className="w-10 h-10 md:w-16 md:h-16 bg-slate-800 border border-green-700/40 flex items-center justify-center">
                    <span className="font-pixel text-green-400 text-xs md:text-xl">#{myRank}</span>
                  </div>
                  <div>
                    <p className="font-pixel text-[8px] md:text-xs text-slate-400">PERINGKATMU</p>
                    <p className="font-pixel text-[9px] md:text-sm text-green-400 mt-0.5 md:mt-1">{getRankTitle(myRank)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-pixel text-yellow-500 text-xs md:text-lg flex items-center gap-1 md:gap-2 justify-end"><Star className="w-3 h-3 md:w-5 md:h-5" /> {points.toLocaleString()}</p>
                  <p className="font-pixel text-[6px] md:text-[9px] text-slate-600 mt-0.5 md:mt-2">LVL {level}</p>
                </div>
              </div>

              {/* Spacer to fix space-y override */}
              <div className="h-40 md:h-40 w-full"></div>

              {/* Top 3 Podium */}
              {ranked.length >= 3 && (
                <div className="flex items-end justify-center gap-1 md:gap-3 mb-8 md:mb-12 px-1 md:px-8">
                  {/* 2nd Place */}
                  <div className="flex flex-col items-center flex-1 relative min-w-0">
                    <div className="absolute bottom-full mb-1 md:mb-2 w-full flex justify-center pointer-events-none">
                      <img src={`/character/${ranked[1]?.character || 'ninja.png'}`} alt="2nd" className="w-20 h-20 md:w-36 md:h-36 object-contain drop-shadow-md pixel-float" style={{ animationDelay: '1s' }} />
                    </div>
                    {/* Podium block */}
                    <div className="w-full bg-slate-800 border-t-4 border-slate-500 h-[80px] md:h-[120px] flex flex-col items-center justify-start pt-2 md:pt-4 rounded-t-sm relative shadow-[0_0_15px_rgba(100,116,139,0.2)]">
                      <span className="font-pixel text-slate-400 text-lg md:text-2xl">2nd</span>
                      <Medal className="w-4 h-4 md:w-6 md:h-6 text-slate-400 mt-1 md:mt-2" />
                    </div>
                    {/* User Info below podium */}
                    <div className="text-center mt-2 md:mt-4 w-full">
                      <p className="font-pixel text-[8px] md:text-xs text-slate-300 truncate px-1">{ranked[1]?.name}</p>
                      <p className="font-pixel text-[7px] md:text-[10px] text-slate-500 mt-1">{ranked[1]?.points?.toLocaleString()} XP</p>
                    </div>
                  </div>

                  {/* 1st Place */}
                  <div className="flex flex-col items-center flex-[1.2] relative z-10 min-w-0">
                    <div className="absolute bottom-full mb-1 md:mb-2 w-full flex justify-center pointer-events-none">
                      <img src={`/character/${ranked[0]?.character || 'ninja.png'}`} alt="1st" className="w-28 h-28 md:w-48 md:h-48 object-contain drop-shadow-xl pixel-float" />
                    </div>
                    {/* Podium block */}
                    <div className="w-full bg-yellow-900 border-t-4 border-yellow-500 h-[110px] md:h-[160px] flex flex-col items-center justify-start pt-2 md:pt-4 rounded-t-sm relative shadow-[0_0_20px_rgba(234,179,8,0.3)]">
                      <Crown className="w-5 h-5 md:w-8 md:h-8 text-yellow-500 mb-1" />
                      <span className="font-pixel text-yellow-400 text-xl md:text-3xl">1st</span>
                    </div>
                    {/* User Info below podium */}
                    <div className="text-center mt-2 md:mt-4 w-full">
                      <p className="font-pixel text-[9px] md:text-sm text-yellow-400 truncate px-1">{ranked[0]?.name}</p>
                      <p className="font-pixel text-[8px] md:text-[11px] text-yellow-500 mt-1">{ranked[0]?.points?.toLocaleString()} XP</p>
                    </div>
                  </div>

                  {/* 3rd Place */}
                  <div className="flex flex-col items-center flex-1 relative min-w-0">
                    <div className="absolute bottom-full mb-1 md:mb-2 w-full flex justify-center pointer-events-none">
                      <img src={`/character/${ranked[2]?.character || 'ninja.png'}`} alt="3rd" className="w-16 h-16 md:w-28 md:h-28 object-contain drop-shadow-md pixel-float" style={{ animationDelay: '2s' }} />
                    </div>
                    {/* Podium block */}
                    <div className="w-full bg-amber-950 border-t-4 border-amber-700 h-[60px] md:h-[90px] flex flex-col items-center justify-start pt-2 md:pt-4 rounded-t-sm relative shadow-[0_0_15px_rgba(180,83,9,0.2)]">
                      <span className="font-pixel text-amber-600 text-lg md:text-xl">3rd</span>
                      <Medal className="w-4 h-4 md:w-6 md:h-6 text-amber-600 mt-1 md:mt-2" />
                    </div>
                    {/* User Info below podium */}
                    <div className="text-center mt-2 md:mt-4 w-full">
                      <p className="font-pixel text-[8px] md:text-xs text-amber-500 truncate px-1">{ranked[2]?.name}</p>
                      <p className="font-pixel text-[7px] md:text-[10px] text-slate-500 mt-1">{ranked[2]?.points?.toLocaleString()} XP</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Full Rankings */}
              <div className="pixel-border bg-slate-900/70 backdrop-blur-sm border-t-2 border-t-green-500/20 p-4 md:p-6">
                <div className="flex items-center justify-between mb-3 md:mb-5">
                  <h3 className="font-pixel text-[9px] md:text-sm text-slate-400 flex items-center gap-2"><Swords className="w-4 h-4 text-slate-500" /> ALL RECYCLERS</h3>
                  <span className="font-pixel text-[7px] md:text-[10px] text-slate-600">{ranked.length} PLAYERS</span>
                </div>

                <div className="space-y-1 md:space-y-2">
                  {ranked.map((user, i) => {
                    const rank = i + 1;
                    const isMe = user.id === currentUser.id;
                    const userLevel = Math.floor(user.points / 500) + 1;
                    return (
                      <div key={user.id}
                        className={`flex items-center gap-3 md:gap-5 px-3 md:px-5 py-2.5 md:py-4 transition-colors ${
                          isMe ? 'bg-green-950/20 border-l-2 md:border-l-4 border-green-500' :
                          rank <= 3 ? 'bg-slate-800/30 border-l-2 md:border-l-4 border-slate-700' :
                          'border-l-2 md:border-l-4 border-transparent hover:bg-slate-800/20'
                        }`}>
                        <div className="w-6 md:w-10 flex items-center justify-center shrink-0">
                          {rank === 1 && <Crown className="w-3.5 h-3.5 md:w-6 md:h-6 text-yellow-500" />}
                          {rank === 2 && <Medal className="w-3.5 h-3.5 md:w-6 md:h-6 text-slate-400" />}
                          {rank === 3 && <Medal className="w-3.5 h-3.5 md:w-6 md:h-6 text-amber-600" />}
                          {rank > 3 && <span className="font-pixel text-[8px] md:text-xs text-slate-600">#{rank}</span>}
                        </div>

                        <div className="w-7 h-7 md:w-10 md:h-10 flex items-center justify-center shrink-0 bg-slate-800 border border-slate-700/50">
                          <img src={`/character/${user.character || 'ninja.png'}`} alt="avatar" className="w-5 h-5 md:w-7 md:h-7 md:w-8 md:h-8 object-contain" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className={`font-pixel text-[8px] md:text-xs truncate ${isMe ? 'text-green-400' : 'text-slate-300'}`}>
                            {user.name} {isMe && '(YOU)'}
                          </p>
                          <p className="font-pixel text-[6px] md:text-[9px] text-slate-600 md:mt-1">{getRankTitle(rank)} • LVL {userLevel}</p>
                        </div>

                        <span className={`font-pixel text-[8px] md:text-xs flex items-center gap-1 md:gap-2 shrink-0 ${getRankColor(rank)}`}>
                          <Flame className="w-3 h-3 md:w-5 md:h-5" /> {user.points.toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}

      </main>

      {/* ═══ Bottom Navigation Bar ═══ */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-slate-900/95 border-t-2 border-green-900/40 backdrop-blur-lg">
        <div className="max-w-4xl mx-auto flex">
          {navItems.map(n => {
            const isActive = tab === n.key;
            return (
               <button key={n.key} onClick={() => setTab(n.key as typeof tab)}
                className={`flex-1 flex flex-col items-center justify-center py-2.5 md:py-3 transition-all relative ${
                  isActive ? 'text-green-400' : 'text-slate-600 hover:text-slate-400'
                }`}>
                {isActive && <div className="absolute top-0 left-1/4 right-1/4 h-0.5 md:h-1 bg-green-500" />}
                <div className={`transition-transform [&>svg]:md:w-6 [&>svg]:md:h-6 ${isActive ? 'scale-110 -translate-y-0.5 md:-translate-y-1' : ''}`}>
                  {n.icon}
                </div>
                <span className={`font-pixel text-[8px] md:text-[9px] mt-1 md:mt-2 ${isActive ? 'text-green-400' : 'text-slate-600'}`}>
                  {n.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
