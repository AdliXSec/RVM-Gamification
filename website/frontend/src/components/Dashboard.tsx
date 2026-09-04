import { useAppStore } from '../store';
import { useState, useMemo } from 'react';
import {
  LogOut, Star, Trophy, Droplets, Leaf, Activity, AlertCircle,
  ShoppingBag, Clock, BookOpen, Gift, Crown, Medal, Flame,
  Swords, Bell, Home, Zap, Lock, Check, Target
} from 'lucide-react';

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

      {/* ═══ HUD Header ═══ */}
      <header className="bg-slate-900/80 border-b-2 border-green-900/40 fixed top-0 left-0 right-0 z-30 backdrop-blur-lg">
        <div className="max-w-4xl mx-auto px-3 py-2 flex items-center gap-3">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-10 h-10 bg-slate-800 border-2 border-green-700/60 flex items-center justify-center overflow-hidden">
              <img src={`/character/${currentUser.character || 'ninja.png'}`} alt="avatar" className="w-8 h-8 object-contain" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-yellow-600 text-[6px] font-pixel text-yellow-100 px-1 leading-relaxed">
              {level}
            </div>
          </div>

          {/* Name + XP Bar */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <span className="font-pixel text-[9px] text-green-400 truncate">{currentUser.name}</span>
              <span className="font-pixel text-[8px] text-yellow-500 flex items-center gap-1 shrink-0 ml-2">
                <Star className="w-3 h-3" /> {points.toLocaleString()}
              </span>
            </div>
            <div className="h-2 bg-slate-800 border border-slate-700/50 overflow-hidden">
              <div
                style={{ width: `${xpPercent}%` }}
                className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-700 relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-[shimmer_2s_infinite]" />
              </div>
            </div>
            <div className="flex justify-between mt-0.5">
              <span className="font-pixel text-[6px] text-slate-600">LVL {level}</span>
              <span className="font-pixel text-[6px] text-slate-600">{xpInLevel}/500</span>
            </div>
          </div>

          {/* Logout */}
          <button onClick={logout} className="text-slate-600 hover:text-red-400 transition-colors p-1 shrink-0">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ═══ Main Content ═══ */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-3 md:px-6 pt-20 pb-24 relative z-10">

        {/* ═══ TAB: HOME / BASE CAMP ═══ */}
        {tab === 'home' && (
          <div className="space-y-4">
            {/* Character Card */}
            <div className="relative pixel-border bg-slate-900/70 backdrop-blur-sm border-t-2 border-t-green-500/30 p-5 overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 pointer-events-none"
                style={{ backgroundImage: `url('/tree2.png')`, backgroundSize: 'contain', backgroundPosition: 'right bottom', backgroundRepeat: 'no-repeat' }} />

              <div className="flex items-center gap-5 relative z-10">
                {/* Character */}
                <div className="relative shrink-0">
                  <div className="absolute inset-0 bg-green-500 blur-2xl opacity-20 animate-pulse rounded-full" />
                  <img
                    src={`/character/${currentUser.character || 'ninja.png'}`}
                    alt="avatar"
                    className="w-28 h-28 md:w-36 md:h-36 object-contain relative z-10 drop-shadow-[0_0_15px_rgba(34,197,94,0.4)] pixel-float"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="inline-flex items-center gap-1.5 bg-yellow-950/40 border border-yellow-800/40 px-2 py-1 mb-2">
                    <Trophy className="w-3 h-3 text-yellow-500" />
                    <span className="font-pixel text-[8px] text-yellow-400">LEVEL {level}</span>
                  </div>
                  <h1 className="font-pixel text-green-400 text-lg md:text-2xl truncate">{currentUser.name}</h1>
                  <p className="font-pixel-body text-slate-500 text-sm">#{currentUser.nim}</p>
                  {streakDays > 0 && (
                    <div className="flex items-center gap-1 mt-2">
                      <Flame className="w-3.5 h-3.5 text-orange-500" />
                      <span className="font-pixel text-[8px] text-orange-400">{streakDays} HARI STREAK!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Stat Row */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { icon: <Star className="w-4 h-4 text-yellow-500" />, val: points.toLocaleString(), label: 'XP' },
                { icon: <Trophy className="w-4 h-4 text-yellow-500" />, val: `${level}`, label: 'LEVEL' },
                { icon: <Droplets className="w-4 h-4 text-blue-400" />, val: `${totalBottles}`, label: 'BOTOL' },
                { icon: <Leaf className="w-4 h-4 text-green-500" />, val: `${(totalBottles * 0.04).toFixed(1)}`, label: 'KG CO2' },
              ].map((s, i) => (
                <div key={i} className="bg-slate-900/70 border border-slate-800/60 p-3 text-center backdrop-blur-sm">
                  <div className="flex justify-center mb-1.5">{s.icon}</div>
                  <div className="font-pixel text-slate-200 text-xs">{s.val}</div>
                  <div className="font-pixel text-[6px] text-slate-600 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Daily Quest */}
            <div className="pixel-border bg-slate-900/70 backdrop-blur-sm border-t-2 border-t-yellow-500/30 p-4">
              <h3 className="font-pixel text-[10px] text-yellow-400 flex items-center gap-2 mb-3">
                <Target className="w-4 h-4" /> DAILY QUEST
              </h3>
              <div className="space-y-2">
                <div className={`flex items-center gap-3 p-3 border-l-2 ${todayBottles >= dailyTarget ? 'border-green-500 bg-green-950/20' : 'border-yellow-600/50 bg-slate-800/40'}`}>
                  <div className={`w-6 h-6 flex items-center justify-center shrink-0 ${todayBottles >= dailyTarget ? 'bg-green-600 text-green-100' : 'bg-slate-700 text-slate-400'}`}>
                    {todayBottles >= dailyTarget ? <Check className="w-3.5 h-3.5" /> : <Droplets className="w-3.5 h-3.5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-pixel text-[8px] text-slate-300">Setor {dailyTarget} botol hari ini</p>
                    <div className="h-1.5 bg-slate-700 mt-1.5 overflow-hidden">
                      <div className={`h-full transition-all ${todayBottles >= dailyTarget ? 'bg-green-500' : 'bg-yellow-500'}`}
                        style={{ width: `${Math.min(100, (todayBottles / dailyTarget) * 100)}%` }} />
                    </div>
                  </div>
                  <span className="font-pixel text-[8px] text-slate-500 shrink-0">{todayBottles}/{dailyTarget}</span>
                </div>

                <div className={`flex items-center gap-3 p-3 border-l-2 ${streakDays >= 3 ? 'border-green-500 bg-green-950/20' : 'border-yellow-600/50 bg-slate-800/40'}`}>
                  <div className={`w-6 h-6 flex items-center justify-center shrink-0 ${streakDays >= 3 ? 'bg-green-600 text-green-100' : 'bg-slate-700 text-slate-400'}`}>
                    {streakDays >= 3 ? <Check className="w-3.5 h-3.5" /> : <Flame className="w-3.5 h-3.5" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-pixel text-[8px] text-slate-300">Login 3 hari berturut-turut</p>
                    <p className="font-pixel text-[6px] text-slate-600 mt-0.5">Streak saat ini: {streakDays} hari</p>
                  </div>
                  <span className="font-pixel text-[8px] text-slate-500 shrink-0">{Math.min(streakDays, 3)}/3</span>
                </div>
              </div>
            </div>

            {/* Machine Status */}
            <div className="pixel-border bg-slate-900/70 backdrop-blur-sm border-t-2 border-t-cyan-500/30 p-4">
              <h3 className="font-pixel text-[10px] text-slate-400 flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-green-500" /> STATUS MESIN RVM
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {machines?.map((m: any) => {
                  const pct = Math.round((m.current_bottles / m.max_capacity) * 100);
                  const isAvail = m.status === 'online' && m.current_bottles < m.max_capacity;
                  return (
                    <div key={m.id} className={`p-3 border-l-2 ${isAvail ? 'border-green-500 bg-green-950/10' : 'border-red-500 bg-red-950/10'} flex items-center gap-3`}>
                      <div className={`w-2 h-2 rounded-full shrink-0 ${isAvail ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-pixel text-[8px] text-slate-300 truncate">{m.name}</p>
                        <p className="font-pixel text-[6px] text-slate-600">{m.location}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`font-pixel text-[8px] ${pct >= 80 ? 'text-red-400' : 'text-green-400'}`}>{pct}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Campus Stats */}
            <div className="pixel-border bg-slate-900/70 backdrop-blur-sm border-t-2 border-t-green-500/20 p-4">
              <h3 className="font-pixel text-[10px] text-slate-400 flex items-center gap-2 mb-3">
                <Leaf className="w-4 h-4 text-green-500" /> STATISTIK KAMPUS
              </h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { val: stats.totalBottles.toLocaleString(), label: 'BOTOL', icon: <Droplets className="w-3 h-3 text-blue-400" /> },
                  { val: stats.totalCO2.toLocaleString(), label: 'KG CO2', icon: <Leaf className="w-3 h-3 text-green-400" /> },
                  { val: stats.totalFilament.toLocaleString(), label: 'M FILAMEN', icon: <Zap className="w-3 h-3 text-yellow-400" /> },
                ].map((s, i) => (
                  <div key={i} className="bg-slate-800/40 p-3 border border-slate-700/30">
                    <div className="flex justify-center mb-1">{s.icon}</div>
                    <div className="font-pixel text-green-400 text-xs">{s.val}</div>
                    <div className="font-pixel text-[6px] text-slate-600 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ TAB: SHOP ═══ */}
        {tab === 'shop' && (
          <div className="space-y-4">
            {/* Shop Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-green-500" />
                <div>
                  <h2 className="font-pixel text-slate-200 text-sm">REWARD SHOP</h2>
                  <p className="font-pixel text-[7px] text-slate-600">Tukarkan XP dengan hadiah eksklusif</p>
                </div>
              </div>
              <div className="bg-slate-800/60 border border-slate-700/40 px-3 py-1.5 flex items-center gap-1.5">
                <Star className="w-3 h-3 text-yellow-500" />
                <span className="font-pixel text-[9px] text-yellow-400">{points.toLocaleString()}</span>
              </div>
            </div>

            {/* Items */}
            {rewards.length === 0 ? (
              <div className="pixel-border bg-slate-900/70 p-12 text-center">
                <ShoppingBag className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                <span className="font-pixel text-[9px] text-slate-600">SHOP KOSONG</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {rewards.map(item => {
                  const tier = getRewardTier(item.cost);
                  const canAfford = points >= item.cost;
                  return (
                    <div key={item.id}
                      className={`relative pixel-border bg-slate-900/70 backdrop-blur-sm border-t-2 ${tier.border} ${tier.glow} p-4 flex flex-col justify-between transition-all hover:scale-[1.02] ${!canAfford ? 'opacity-60' : ''}`}>
                      {/* Tier Badge */}
                      <div className={`absolute top-2 right-2 font-pixel text-[6px] px-1.5 py-0.5 ${tier.badge}`}>
                        {tier.name}
                      </div>

                      <div>
                        <div className={`w-10 h-10 ${tier.bg} flex items-center justify-center mb-3 border ${tier.border}/30`}>
                          <Gift className={`w-5 h-5 ${tier.text}`} />
                        </div>
                        <h3 className="font-pixel text-[9px] text-slate-200 mb-1 pr-12">{item.name}</h3>
                        <p className="font-pixel-body text-slate-600 text-xs mb-3 line-clamp-2">{item.desc}</p>
                      </div>

                      <div>
                        <div className={`font-pixel text-sm mb-2 flex items-center gap-1 ${tier.text}`}>
                          <Star className="w-3 h-3" /> {item.cost.toLocaleString()} XP
                        </div>
                        <button
                          className={`w-full py-2.5 font-pixel text-[8px] transition-all ${
                            canAfford
                              ? `pixel-btn bg-green-700 hover:bg-green-600 text-green-100`
                              : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'
                          }`}
                          disabled={!canAfford}
                          onClick={() => redeemReward(item.cost, item.id)}
                        >
                          {canAfford ? (
                            <span className="flex items-center justify-center gap-1"><ShoppingBag className="w-3 h-3" /> TUKAR</span>
                          ) : (
                            <span className="flex items-center justify-center gap-1"><Lock className="w-3 h-3" /> LOCKED</span>
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
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-slate-400" />
                <div>
                  <h2 className="font-pixel text-slate-200 text-sm">QUEST LOG</h2>
                  <p className="font-pixel text-[7px] text-slate-600">Riwayat aktivitasmu</p>
                </div>
              </div>
              {streakDays > 0 && (
                <div className="flex items-center gap-1.5 bg-orange-950/30 border border-orange-800/30 px-3 py-1.5">
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  <span className="font-pixel text-[8px] text-orange-400">{streakDays} DAY STREAK</span>
                </div>
              )}
            </div>

            <div className="pixel-border bg-slate-900/70 backdrop-blur-sm border-t-2 border-t-green-500/20 p-4">
              {currentUser.history.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                  <span className="font-pixel text-[9px] text-slate-600">BELUM ADA LOG</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {currentUser.history.map((tx: any) => {
                    const isEarn = tx.type === 'earn';
                    return (
                      <div key={tx.id}
                        className={`flex items-center gap-3 p-3 border-l-2 transition-colors hover:bg-slate-800/40 ${
                          isEarn ? 'border-green-500' :
                          tx.status === 'cancelled' ? 'border-red-500' :
                          tx.status === 'completed' ? 'border-blue-500' : 'border-yellow-500'
                        }`}>
                        <div className={`w-8 h-8 flex items-center justify-center shrink-0 ${isEarn ? 'bg-green-950/40' : 'bg-purple-950/40'}`}>
                          {isEarn ? <Zap className="w-4 h-4 text-green-400" /> : <Gift className="w-4 h-4 text-purple-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-pixel-body text-slate-300 text-sm truncate">{tx.desc}</p>
                          <p className="font-pixel text-[6px] text-slate-600">{tx.date}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className={`font-pixel text-[10px] ${isEarn ? 'text-green-400' : 'text-purple-400'}`}>
                            {isEarn ? '+' : '-'}{tx.amount} XP
                          </span>
                          {tx.type === 'redeem' && tx.status && (
                            <span className={`font-pixel text-[6px] block mt-0.5 ${
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

        {/* ═══ TAB: QUEST (Tutorial) ═══ */}
        {tab === 'quest' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-blue-400" />
              <div>
                <h2 className="font-pixel text-slate-200 text-sm">QUEST GUIDE</h2>
                <p className="font-pixel text-[7px] text-slate-600">Panduan misi untuk Eco Warrior</p>
              </div>
            </div>

            <div className="space-y-1">
              {guides?.length > 0 ? guides.sort((a: any, b: any) => a.step_number - b.step_number).map((g: any, idx: number) => {
                // Simple completion logic: step 1 always done if user exists, step 2 if user has any earn, etc.
                const isComplete = g.step_number <= Math.min(totalBottles > 0 ? 4 : 1, g.step_number);
                const isCurrent = !isComplete && (idx === 0 || (guides[idx - 1] && guides[idx - 1].step_number <= (totalBottles > 0 ? 4 : 1)));
                const isLocked = !isComplete && !isCurrent;

                return (
                  <div key={g.id} className="relative">
                    {/* Connector line */}
                    {idx < guides.length - 1 && (
                      <div className={`absolute left-[19px] top-[48px] w-0.5 h-4 z-0 ${isComplete ? 'bg-green-600' : 'bg-slate-700'}`} />
                    )}

                    <div className={`relative z-10 flex items-start gap-4 p-4 transition-all ${
                      isComplete ? 'pixel-border bg-green-950/15 border-green-800/30' :
                      isCurrent ? 'pixel-border bg-yellow-950/10 border-yellow-700/30 animate-pulse' :
                      'pixel-border bg-slate-900/50 border-slate-700/30 opacity-50'
                    }`}>
                      {/* Step indicator */}
                      <div className={`w-10 h-10 flex items-center justify-center shrink-0 border-2 ${
                        isComplete ? 'bg-green-700 border-green-500 text-green-100' :
                        isCurrent ? 'bg-yellow-800/50 border-yellow-600 text-yellow-400' :
                        'bg-slate-800 border-slate-600 text-slate-500'
                      }`}>
                        {isComplete ? <Check className="w-5 h-5" /> :
                         isLocked ? <Lock className="w-4 h-4" /> :
                         <span className="font-pixel text-xs">{g.step_number}</span>}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-pixel text-[9px] ${isComplete ? 'text-green-400' : isCurrent ? 'text-yellow-400' : 'text-slate-500'}`}>
                            {g.title}
                          </h3>
                          {isComplete && <span className="font-pixel text-[6px] bg-green-500/20 text-green-400 px-1.5 py-0.5">DONE</span>}
                          {isCurrent && <span className="font-pixel text-[6px] bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5">ACTIVE</span>}
                        </div>
                        <p className={`font-pixel-body text-sm ${isLocked ? 'text-slate-600' : 'text-slate-400'}`}>{g.description}</p>
                      </div>
                    </div>
                  </div>
                );
              }) : <p className="text-slate-500 text-center font-pixel-body">Panduan sedang dimuat...</p>}
            </div>
          </div>
        )}

        {/* ═══ TAB: NOTIFICATIONS ═══ */}
        {tab === 'info' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-amber-500" />
                <div>
                  <h2 className="font-pixel text-slate-200 text-sm">NOTIFIKASI</h2>
                  <p className="font-pixel text-[7px] text-slate-600">Info 12 jam terakhir</p>
                </div>
              </div>
            </div>

            {notifications && notifications.length > 0 ? (
              <div className="space-y-2">
                {notifications.map((n: any) => (
                  <div key={n.id} className="pixel-border bg-slate-900/70 backdrop-blur-sm p-4 border-l-2 border-amber-600/50 flex items-start gap-3 hover:bg-slate-800/50 transition-colors">
                    <div className="mt-0.5 shrink-0">
                      {n.type === 'reward' ? <Gift className="w-4 h-4 text-green-400" /> : <Droplets className="w-4 h-4 text-blue-400" />}
                    </div>
                    <div className="min-w-0">
                      <p className="font-pixel-body text-slate-200 text-sm">{n.message}</p>
                      <p className="font-pixel text-[7px] text-slate-600 mt-1">{new Date(n.timestamp).toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 pixel-border bg-slate-900/70">
                <AlertCircle className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                <p className="font-pixel text-[9px] text-slate-600">Tidak ada notifikasi baru.</p>
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
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Crown className="w-5 h-5 text-yellow-500" />
                <div>
                  <h2 className="font-pixel text-slate-200 text-sm">LEADERBOARD</h2>
                  <p className="font-pixel text-[7px] text-slate-600">Peringkat Eco Warrior kampus</p>
                </div>
              </div>

              {/* Your Rank */}
              <div className="pixel-border bg-green-950/20 border-green-800/30 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-800 border border-green-700/40 flex items-center justify-center">
                    <span className="font-pixel text-green-400 text-xs">#{myRank}</span>
                  </div>
                  <div>
                    <p className="font-pixel text-[8px] text-slate-400">PERINGKATMU</p>
                    <p className="font-pixel text-[9px] text-green-400 mt-0.5">{getRankTitle(myRank)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-pixel text-yellow-500 text-xs flex items-center gap-1 justify-end"><Star className="w-3 h-3" /> {points.toLocaleString()}</p>
                  <p className="font-pixel text-[6px] text-slate-600 mt-0.5">LVL {level}</p>
                </div>
              </div>

              {/* Top 3 Podium */}
              {ranked.length >= 3 && (
                <div className="grid grid-cols-3 gap-2 items-end mt-20">
                  {/* 2nd */}
                  <div className="pixel-border bg-slate-900/70 p-3 text-center relative mt-24">
                    <div className="absolute -top-28 left-0 right-0 flex justify-center pointer-events-none">
                      <img src={`/character/${ranked[1]?.character || 'ninja.png'}`} alt="2nd" className="w-32 h-32 object-contain drop-shadow-md pixel-float" style={{ animationDelay: '1s' }} />
                    </div>
                    <div className="h-12 flex items-end justify-center mb-2">
                      <div className="w-full bg-slate-800 border-t-3 border-slate-500" style={{ height: '40px' }}>
                        <span className="font-pixel text-slate-400 text-base block pt-2">#2</span>
                      </div>
                    </div>
                    <Medal className="w-4 h-4 text-slate-400 mx-auto mb-1" />
                    <p className="font-pixel text-[7px] text-slate-300 truncate">{ranked[1]?.name}</p>
                    <p className="font-pixel text-[6px] text-slate-500 mt-0.5">{ranked[1]?.points?.toLocaleString()} XP</p>
                  </div>

                  {/* 1st */}
                  <div className="pixel-border bg-slate-900/70 p-3 text-center relative mt-24" style={{ boxShadow: '0 0 20px rgba(234,179,8,0.15)' }}>
                    <div className="absolute -top-36 left-0 right-0 flex justify-center pointer-events-none">
                      <img src={`/character/${ranked[0]?.character || 'ninja.png'}`} alt="1st" className="w-40 h-40 object-contain drop-shadow-xl pixel-float" />
                    </div>
                    <div className="h-16 flex items-end justify-center mb-2">
                      <div className="w-full bg-yellow-950/40 border-t-3 border-yellow-500" style={{ height: '56px' }}>
                        <Crown className="w-5 h-5 text-yellow-500 mx-auto mt-1.5" />
                        <span className="font-pixel text-yellow-400 text-base block">#1</span>
                      </div>
                    </div>
                    <p className="font-pixel text-[8px] text-yellow-400 truncate">{ranked[0]?.name}</p>
                    <p className="font-pixel text-[7px] text-yellow-500 mt-0.5">{ranked[0]?.points?.toLocaleString()} XP</p>
                  </div>

                  {/* 3rd */}
                  <div className="pixel-border bg-slate-900/70 p-3 text-center relative mt-24">
                    <div className="absolute -top-20 left-0 right-0 flex justify-center pointer-events-none">
                      <img src={`/character/${ranked[2]?.character || 'ninja.png'}`} alt="3rd" className="w-24 h-24 object-contain drop-shadow-md pixel-float" style={{ animationDelay: '2s' }} />
                    </div>
                    <div className="h-10 flex items-end justify-center mb-2">
                      <div className="w-full bg-amber-950/30 border-t-3 border-amber-700" style={{ height: '32px' }}>
                        <span className="font-pixel text-amber-600 text-base block pt-1">#3</span>
                      </div>
                    </div>
                    <Medal className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                    <p className="font-pixel text-[7px] text-amber-500 truncate">{ranked[2]?.name}</p>
                    <p className="font-pixel text-[6px] text-slate-500 mt-0.5">{ranked[2]?.points?.toLocaleString()} XP</p>
                  </div>
                </div>
              )}

              {/* Full Rankings */}
              <div className="pixel-border bg-slate-900/70 backdrop-blur-sm border-t-2 border-t-green-500/20 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-pixel text-[9px] text-slate-400 flex items-center gap-2"><Swords className="w-4 h-4 text-slate-500" /> ALL RECYCLERS</h3>
                  <span className="font-pixel text-[7px] text-slate-600">{ranked.length} PLAYERS</span>
                </div>

                <div className="space-y-1">
                  {ranked.map((user, i) => {
                    const rank = i + 1;
                    const isMe = user.id === currentUser.id;
                    const userLevel = Math.floor(user.points / 500) + 1;
                    return (
                      <div key={user.id}
                        className={`flex items-center gap-3 px-3 py-2.5 transition-colors ${
                          isMe ? 'bg-green-950/20 border-l-2 border-green-500' :
                          rank <= 3 ? 'bg-slate-800/30 border-l-2 border-slate-700' :
                          'border-l-2 border-transparent hover:bg-slate-800/20'
                        }`}>
                        <div className="w-6 flex items-center justify-center shrink-0">
                          {rank === 1 && <Crown className="w-3.5 h-3.5 text-yellow-500" />}
                          {rank === 2 && <Medal className="w-3.5 h-3.5 text-slate-400" />}
                          {rank === 3 && <Medal className="w-3.5 h-3.5 text-amber-600" />}
                          {rank > 3 && <span className="font-pixel text-[8px] text-slate-600">#{rank}</span>}
                        </div>

                        <div className="w-7 h-7 flex items-center justify-center shrink-0 bg-slate-800 border border-slate-700/50">
                          <img src={`/character/${user.character || 'ninja.png'}`} alt="avatar" className="w-5 h-5 object-contain" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className={`font-pixel text-[8px] truncate ${isMe ? 'text-green-400' : 'text-slate-300'}`}>
                            {user.name} {isMe && '(YOU)'}
                          </p>
                          <p className="font-pixel text-[6px] text-slate-600">{getRankTitle(rank)} • LVL {userLevel}</p>
                        </div>

                        <span className={`font-pixel text-[8px] flex items-center gap-1 shrink-0 ${getRankColor(rank)}`}>
                          <Flame className="w-3 h-3" /> {user.points.toLocaleString()}
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
                className={`flex-1 flex flex-col items-center justify-center py-2.5 transition-all relative ${
                  isActive ? 'text-green-400' : 'text-slate-600 hover:text-slate-400'
                }`}>
                {isActive && <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-green-500" />}
                <div className={`transition-transform ${isActive ? 'scale-110 -translate-y-0.5' : ''}`}>
                  {n.icon}
                </div>
                <span className={`font-pixel text-[7px] mt-1 ${isActive ? 'text-green-400' : 'text-slate-600'}`}>
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
