import { useAppStore } from '../store';
import { useState } from 'react';
import { LogOut, Star, Trophy, Droplets, Leaf, Activity, Box, AlertCircle, ShoppingBag, Clock, BookOpen, Award, Gift, Crown, Medal, Flame, Swords } from 'lucide-react';

export default function Dashboard() {
  const { currentUser, users, machine, stats, rewards, logout, redeemReward } = useAppStore();
  const [tab, setTab] = useState<'home' | 'redeem' | 'history' | 'guide' | 'leaderboard'>('home');

  if (!currentUser) return null;

  const level = Math.floor(currentUser.points / 500) + 1;
  const xpInLevel = currentUser.points % 500;
  const xpPercent = (xpInLevel / 500) * 100;

  return (
    <div className="flex flex-col min-h-screen bg-[hsl(220,15%,7%)] scanlines overflow-x-hidden relative">
      {/* Background Layer */}
      <div 
        className="fixed inset-0 w-full h-full bg-slate-950/80 bg-[url('/bg.jpeg')] bg-cover md:bg-[length:100%_100%] bg-center bg-blend-multiply pointer-events-none z-0 opacity-40"
      />

      <header className="bg-slate-900/60 border-b-4 border-slate-800 sticky top-0 z-20 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="font-pixel text-slate-300 text-[10px] flex items-center gap-2">
            <img src="/recycle.png" alt="Logo" className="w-5 h-5 object-contain drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" /> RVM<span className="text-green-500">QUEST</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="pixel-border-green bg-slate-800/80 backdrop-blur flex items-center pr-3">
              <div className="w-8 h-8 bg-slate-900/80 flex items-center justify-center mr-2 border-r-2 border-slate-700/50">
                <img src={`/character/${currentUser.character || 'ninja.png'}`} alt="avatar" className="w-6 h-6 object-contain" />
              </div>
              <Star className="w-3 h-3 text-yellow-500 mr-1" />
              <span className="font-pixel text-[9px] text-slate-300">{currentUser.points} XP</span>
            </div>
            <button onClick={logout} className="text-slate-500 hover:text-slate-300 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="bg-slate-900/40 border-b-2 border-slate-800 px-4 relative z-10 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex gap-1 overflow-x-auto">
          {[
            { key: 'home', label: 'HOME', icon: <Activity className="w-3 h-3" /> },
            { key: 'leaderboard', label: 'RANK', icon: <Crown className="w-3 h-3" /> },
            { key: 'redeem', label: 'TUKAR', icon: <ShoppingBag className="w-3 h-3" /> },
            { key: 'history', label: 'LOG', icon: <Clock className="w-3 h-3" /> },
            { key: 'guide', label: 'GUIDE', icon: <BookOpen className="w-3 h-3" /> },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key as typeof tab)}
              className={`font-pixel text-[8px] md:text-[9px] px-4 py-4 border-b-4 transition-colors whitespace-nowrap flex items-center gap-2 ${
                tab === t.key ? 'border-green-500 text-green-400 bg-slate-800/80' : 'border-transparent text-slate-500 hover:text-slate-400 hover:bg-slate-800/30'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8 relative z-10">

        {tab === 'home' && (
          <div className="space-y-6">
            {/* Gamified Character Status Card */}
            <div className="relative pixel-border bg-slate-900/70 backdrop-blur-sm border-t-2 border-t-green-500/20 p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 overflow-hidden">
              {/* Background scenery decoration */}
              <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 opacity-10 pointer-events-none" 
                   style={{ backgroundImage: `url('/tree2.png')`, backgroundSize: 'contain', backgroundPosition: 'right bottom', backgroundRepeat: 'no-repeat' }} />
              
              {/* Large Character Avatar */}
              <div className="relative shrink-0">
                <div className="absolute inset-0 bg-green-500 blur-2xl opacity-20 animate-pulse rounded-full" />
                <img 
                  src={`/character/${currentUser.character || 'ninja.png'}`} 
                  alt="avatar" 
                  className="w-32 h-32 md:w-48 md:h-48 object-contain relative z-10 drop-shadow-[0_0_15px_rgba(34,197,94,0.4)] pixel-float" 
                />
              </div>

              {/* Status & Stats */}
              <div className="flex-1 w-full text-center md:text-left z-10">
                <div className="inline-block bg-[hsl(220,12%,16%)] px-3 py-1.5 mb-3 pixel-border border-b-4 border-slate-700">
                  <span className="font-pixel text-[10px] text-yellow-500 flex items-center gap-2">
                    <Trophy className="w-4 h-4" /> LEVEL {level}
                  </span>
                </div>
                <h1 className="font-pixel text-green-400 text-2xl md:text-3xl mb-1 drop-shadow-md">
                  {currentUser.name}
                </h1>
                <p className="font-pixel-body text-slate-300 text-xl md:text-2xl mb-1 tracking-wider">#{currentUser.nim}</p>
                <p className="font-pixel-body text-slate-500 text-lg md:text-xl mb-6">Eco Warrior / Smart Campus Recycler</p>

                {/* XP Bar */}
                <div className="space-y-2 bg-[hsl(220,14%,8%)] p-4 pixel-border">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-pixel text-[8px] text-slate-400 flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500" /> NEXT LEVEL PROGRESS
                    </span>
                    <span className="font-pixel text-[8px] text-green-400">{xpInLevel} / 500 XP</span>
                  </div>
                  <div className="pixel-progress h-6 w-full">
                    <div style={{ width: `${xpPercent}%` }} className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-1000 relative overflow-hidden">
                      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: <Star className="w-5 h-5 text-yellow-500" />, val: currentUser.points.toString(), label: 'TOTAL XP' },
                { icon: <Trophy className="w-5 h-5 text-yellow-500" />, val: `LVL ${level}`, label: 'LEVEL' },
                { icon: <Droplets className="w-5 h-5 text-blue-400" />, val: (currentUser.points / 100).toFixed(0), label: 'BOTOL' },
                { icon: <Leaf className="w-5 h-5 text-green-500" />, val: `${((currentUser.points / 100) * 0.04).toFixed(1)}`, label: 'KG CO2' },
              ].map((s, i) => (
                <div key={i} className="pixel-border bg-slate-900/70 backdrop-blur-sm border-t-2 border-t-green-500/20 p-4 text-center pixel-card">
                  <div className="flex justify-center mb-2">{s.icon}</div>
                  <div className="font-pixel text-slate-200 text-sm">{s.val}</div>
                  <div className="font-pixel text-[7px] text-slate-600 mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="pixel-border bg-slate-900/70 backdrop-blur-sm border-t-2 border-t-green-500/20 p-5">
              <h3 className="font-pixel text-[9px] text-slate-400 mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-green-500" /> STATUS MESIN RVM</h3>
              {machine.status === 'Online' && machine.capacity < 100 ? (
                <div className="pixel-border-green bg-green-950/15 p-4 flex items-center gap-3">
                  <Box className="w-5 h-5 text-green-500" />
                  <div>
                    <span className="font-pixel text-[9px] text-green-400">MESIN TERSEDIA</span>
                    <p className="font-pixel-body text-slate-500 text-lg">Gedung A, Lantai 1 — Kapasitas {machine.capacity}%</p>
                  </div>
                </div>
              ) : (
                <div className="pixel-border-red bg-red-950/15 p-4 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <div>
                    <span className="font-pixel text-[9px] text-red-400">SEDANG DIKOSONGKAN</span>
                    <p className="font-pixel-body text-slate-500 text-lg">Petugas sedang menuju lokasi. Mohon tunggu.</p>
                  </div>
                </div>
              )}
              <div className="mt-4">
                <div className="flex justify-between mb-1">
                  <span className="font-pixel text-[7px] text-slate-600">KAPASITAS</span>
                  <span className="font-pixel text-[7px] text-slate-500">{machine.capacity}%</span>
                </div>
                <div className="pixel-progress h-3">
                  <div style={{ width: `${machine.capacity}%` }} className="h-full transition-all" />
                </div>
              </div>
            </div>

            <div className="pixel-border bg-slate-900/70 backdrop-blur-sm border-t-2 border-t-green-500/20 p-5">
              <h3 className="font-pixel text-[9px] text-slate-400 mb-4 flex items-center gap-2"><Leaf className="w-4 h-4 text-green-500" /> STATISTIK KAMPUS</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                {[
                  { val: stats.totalBottles.toLocaleString(), label: 'BOTOL' },
                  { val: stats.totalCO2.toLocaleString(), label: 'KG CO2' },
                  { val: stats.totalFilament.toLocaleString(), label: 'M FILAMEN' },
                ].map((s, i) => (
                  <div key={i} className="bg-[hsl(220,10%,9%)] p-3">
                    <div className="font-pixel text-green-400 text-xs">{s.val}</div>
                    <div className="font-pixel text-[6px] text-slate-600 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
              <p className="font-pixel-body text-slate-600 text-base mt-3">Botol didaur ulang menjadi filamen 3D Printer di Lab Teknik Industri.</p>
            </div>
          </div>
        )}

        {tab === 'redeem' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-green-500" />
              <div>
                <h2 className="font-pixel text-slate-200 text-sm">REWARD SHOP</h2>
                <p className="font-pixel-body text-slate-500 text-lg">Tukarkan XP-mu dengan hadiah</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {rewards.length === 0 ? (
                <div className="col-span-3 pixel-border bg-slate-900/70 backdrop-blur-sm border-t-2 border-t-green-500/20 p-12 text-center">
                  <ShoppingBag className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                  <span className="font-pixel text-[9px] text-slate-600">SHOP KOSONG</span>
                </div>
              ) : (
                rewards.map(item => (
                  <div key={item.id} className="pixel-border bg-slate-900/70 backdrop-blur-sm border-t-2 border-t-green-500/20 p-5 pixel-card flex flex-col justify-between">
                    <div>
                      <ShoppingBag className="w-6 h-6 text-slate-500 mb-3" />
                      <h3 className="font-pixel text-[9px] text-slate-300 mb-2">{item.name}</h3>
                      <p className="font-pixel-body text-slate-600 text-base mb-4">{item.desc}</p>
                    </div>
                    <div>
                      <div className="font-pixel text-yellow-500 text-sm mb-3 flex items-center gap-1"><Star className="w-3 h-3" /> {item.cost} XP</div>
                      <button
                        className="pixel-btn bg-green-700 hover:bg-green-600 text-green-100 w-full py-3"
                        disabled={currentUser.points < item.cost}
                        onClick={() => redeemReward(item.cost, item.name)}
                        style={currentUser.points < item.cost ? { opacity: 0.3, pointerEvents: 'none' } : {}}
                      >
                        TUKAR
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {tab === 'history' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-slate-400" />
              <div>
                <h2 className="font-pixel text-slate-200 text-sm">ACTIVITY LOG</h2>
                <p className="font-pixel-body text-slate-500 text-lg">Riwayat transaksi dan status penukaran</p>
              </div>
            </div>
            <div className="pixel-border bg-slate-900/70 backdrop-blur-sm border-t-2 border-t-green-500/20 p-5">
              {currentUser.history.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                  <span className="font-pixel text-[9px] text-slate-600">BELUM ADA LOG</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentUser.history.map(tx => (
                    <div key={tx.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-[hsl(220,10%,9%)] border-l-4"
                      style={{ borderColor: tx.type === 'earn' ? 'hsl(142,50%,40%)' : tx.status === 'cancelled' ? 'hsl(0,50%,45%)' : tx.status === 'completed' ? 'hsl(200,60%,45%)' : 'hsl(40,70%,45%)' }}
                    >
                      <div className="flex items-center gap-3">
                        {tx.type === 'earn' ? <Award className="w-4 h-4 text-green-500" /> : <Gift className="w-4 h-4 text-slate-400" />}
                        <div>
                          <p className="font-pixel-body text-slate-300 text-lg">{tx.desc}</p>
                          <p className="font-pixel text-[7px] text-slate-600">{tx.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        {tx.type === 'redeem' && tx.status && (
                          <span className={`font-pixel text-[7px] px-2 py-1 ${
                            tx.status === 'pending' ? 'bg-yellow-950/40 text-yellow-500' :
                            tx.status === 'completed' ? 'bg-green-950/40 text-green-400' :
                            'bg-red-950/40 text-red-400'
                          }`}>
                            {tx.status === 'pending' ? 'PENDING' : tx.status === 'completed' ? 'DONE' : 'DITOLAK'}
                          </span>
                        )}
                        <span className={`font-pixel text-[10px] ${tx.type === 'earn' ? 'text-green-400' : 'text-slate-500'}`}>
                          {tx.type === 'earn' ? '+' : '-'}{tx.amount}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'guide' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-blue-400" />
              <div>
                <h2 className="font-pixel text-slate-200 text-sm">QUEST GUIDE</h2>
                <p className="font-pixel-body text-slate-500 text-lg">Cara menggunakan mesin RVM</p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { step: 1, icon: <Droplets className="w-5 h-5 text-blue-400" />, title: 'SIAPKAN BOTOL', desc: 'Kosongkan sisa cairan dari botol plastik PET bening.' },
                { step: 2, icon: <Activity className="w-5 h-5 text-green-500" />, title: 'CEK STATUS', desc: 'Buka dashboard. Pastikan status mesin "TERSEDIA".' },
                { step: 3, icon: <Box className="w-5 h-5 text-slate-400" />, title: 'SCAN & MASUKKAN', desc: 'Scan QR di layar mesin. Masukkan botol satu per satu.' },
                { step: 4, icon: <Star className="w-5 h-5 text-yellow-500" />, title: 'COLLECT XP', desc: 'Poin otomatis masuk. Kumpulkan dan tukarkan reward!' },
              ].map(g => (
                <div key={g.step} className="pixel-border bg-slate-900/70 backdrop-blur-sm border-t-2 border-t-green-500/20 p-5 flex gap-4 items-start pixel-card">
                  <div className="pixel-border-green bg-green-950/20 w-10 h-10 flex items-center justify-center shrink-0">
                    <span className="font-pixel text-green-400 text-xs">{g.step}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {g.icon}
                      <h3 className="font-pixel text-[9px] text-slate-300">{g.title}</h3>
                    </div>
                    <p className="font-pixel-body text-slate-500 text-lg">{g.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ====== LEADERBOARD ====== */}
        {tab === 'leaderboard' && (() => {
          const ranked = [...users]
            .filter(u => u.role === 'student')
            .sort((a, b) => b.points - a.points);
          const myRank = ranked.findIndex(u => u.id === currentUser.id) + 1;
          const getRankTitle = (r: number) => r === 1 ? 'CHAMPION' : r === 2 ? 'ELITE' : r === 3 ? 'VETERAN' : r <= 5 ? 'WARRIOR' : 'ROOKIE';
          const getRankColor = (r: number) => r === 1 ? 'text-yellow-400' : r === 2 ? 'text-slate-300' : r === 3 ? 'text-amber-600' : 'text-slate-500';

          return (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center gap-3">
                <Crown className="w-6 h-6 text-yellow-500" />
                <div>
                  <h2 className="font-pixel text-slate-200 text-sm">LEADERBOARD</h2>
                  <p className="font-pixel-body text-slate-500 text-lg">Peringkat recycler kampus berdasarkan XP</p>
                </div>
              </div>

              {/* Your Rank Card */}
              <div className="pixel-border-green bg-green-950/15 p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="pixel-border bg-[hsl(220,12%,14%)] w-12 h-12 flex items-center justify-center">
                    <span className="font-pixel text-green-400 text-sm">#{myRank}</span>
                  </div>
                  <div>
                    <p className="font-pixel text-[9px] text-slate-400">PERINGKATMU</p>
                    <p className="font-pixel text-[10px] text-green-400 mt-1">{getRankTitle(myRank)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-pixel text-yellow-500 text-sm flex items-center gap-1 justify-end"><Star className="w-3 h-3" /> {currentUser.points}</p>
                  <p className="font-pixel text-[7px] text-slate-600 mt-1">LVL {Math.floor(currentUser.points / 500) + 1}</p>
                </div>
              </div>

              {/* Top 3 Podium */}
              {ranked.length >= 3 && (
                <div className="grid grid-cols-3 gap-3 items-end mt-24">
                  {/* 2nd Place */}
                  <div className="pixel-border bg-slate-900/70 backdrop-blur-sm border-t-2 border-t-green-500/20 p-4 text-center pixel-card relative mt-28">
                    <div className="absolute -top-32 left-0 right-0 flex justify-center pointer-events-none">
                      <img src={`/character/${ranked[1]?.character || 'ninja.png'}`} alt="2nd" className="w-40 h-40 object-contain drop-shadow-md pixel-float" style={{ animationDelay: '1s' }} />
                    </div>
                    <div className="h-16 flex items-end justify-center mb-3">
                      <div className="w-full bg-slate-800 border-t-4 border-slate-500" style={{ height: '48px' }}>
                        <span className="font-pixel text-slate-400 text-lg block pt-2">#2</span>
                      </div>
                    </div>
                    <Medal className="w-5 h-5 text-slate-400 mx-auto mb-2" />
                    <p className="font-pixel text-[8px] text-slate-300 truncate">{ranked[1]?.name}</p>
                    <p className="font-pixel text-[7px] text-slate-500 mt-1">{ranked[1]?.points} XP</p>
                    <p className="font-pixel text-[6px] text-slate-600 mt-1">ELITE</p>
                  </div>

                  {/* 1st Place */}
                  <div className="pixel-border bg-slate-900/70 backdrop-blur-sm border-t-2 border-t-green-500/20 p-4 text-center pixel-card relative mt-28" style={{ boxShadow: '4px 0 0 0 hsl(45,70%,35%), -4px 0 0 0 hsl(45,70%,35%), 0 4px 0 0 hsl(45,70%,35%), 0 -4px 0 0 hsl(45,70%,35%)' }}>
                    <div className="absolute -top-40 left-0 right-0 flex justify-center pointer-events-none">
                      <img src={`/character/${ranked[0]?.character || 'ninja.png'}`} alt="1st" className="w-48 h-48 object-contain drop-shadow-xl pixel-float" />
                    </div>
                    <div className="h-24 flex items-end justify-center mb-3">
                      <div className="w-full bg-yellow-950/40 border-t-4 border-yellow-500" style={{ height: '72px' }}>
                        <Crown className="w-6 h-6 text-yellow-500 mx-auto mt-2" />
                        <span className="font-pixel text-yellow-400 text-lg block">#1</span>
                      </div>
                    </div>
                    <p className="font-pixel text-[9px] text-yellow-400 truncate">{ranked[0]?.name}</p>
                    <p className="font-pixel text-[8px] text-yellow-500 mt-1">{ranked[0]?.points} XP</p>
                    <p className="font-pixel text-[6px] text-yellow-600 mt-1">CHAMPION</p>
                  </div>

                  {/* 3rd Place */}
                  <div className="pixel-border bg-slate-900/70 backdrop-blur-sm border-t-2 border-t-green-500/20 p-4 text-center pixel-card relative mt-28">
                    <div className="absolute -top-24 left-0 right-0 flex justify-center pointer-events-none">
                      <img src={`/character/${ranked[2]?.character || 'ninja.png'}`} alt="3rd" className="w-32 h-32 object-contain drop-shadow-md pixel-float" style={{ animationDelay: '2s' }} />
                    </div>
                    <div className="h-12 flex items-end justify-center mb-3">
                      <div className="w-full bg-amber-950/30 border-t-4 border-amber-700" style={{ height: '36px' }}>
                        <span className="font-pixel text-amber-600 text-lg block pt-1">#3</span>
                      </div>
                    </div>
                    <Medal className="w-5 h-5 text-amber-600 mx-auto mb-2" />
                    <p className="font-pixel text-[8px] text-amber-500 truncate">{ranked[2]?.name}</p>
                    <p className="font-pixel text-[7px] text-slate-500 mt-1">{ranked[2]?.points} XP</p>
                    <p className="font-pixel text-[6px] text-slate-600 mt-1">VETERAN</p>
                  </div>
                </div>
              )}

              {/* Full Ranking List */}
              <div className="pixel-border bg-slate-900/70 backdrop-blur-sm border-t-2 border-t-green-500/20 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-pixel text-[9px] text-slate-400 flex items-center gap-2"><Swords className="w-4 h-4 text-slate-500" /> ALL RECYCLERS</h3>
                  <span className="font-pixel text-[7px] text-slate-600">{ranked.length} PLAYERS</span>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-12 gap-2 px-3 py-2 border-b-2 border-[hsl(220,10%,16%)] mb-2">
                  <span className="font-pixel text-[7px] text-slate-600 col-span-2">RANK</span>
                  <span className="font-pixel text-[7px] text-slate-600 col-span-5">PLAYER</span>
                  <span className="font-pixel text-[7px] text-slate-600 col-span-2 text-right">LVL</span>
                  <span className="font-pixel text-[7px] text-slate-600 col-span-3 text-right">XP</span>
                </div>

                <div className="space-y-1">
                  {ranked.map((user, i) => {
                    const rank = i + 1;
                    const isMe = user.id === currentUser.id;
                    const userLevel = Math.floor(user.points / 500) + 1;

                    return (
                      <div key={user.id}
                        className={`grid grid-cols-12 gap-2 items-center px-3 py-3 transition-colors ${
                          isMe
                            ? 'bg-green-950/20 border-l-4 border-green-500'
                            : rank <= 3
                              ? 'bg-[hsl(220,10%,9%)] border-l-4 border-[hsl(220,10%,16%)]'
                              : 'border-l-4 border-transparent hover:bg-[hsl(220,10%,9%)]'
                        }`}
                      >
                        {/* Rank */}
                        <div className="col-span-2 flex items-center gap-1">
                          {rank === 1 && <Crown className="w-3 h-3 text-yellow-500" />}
                          {rank === 2 && <Medal className="w-3 h-3 text-slate-400" />}
                          {rank === 3 && <Medal className="w-3 h-3 text-amber-600" />}
                          {rank > 3 && <span className="w-3" />}
                          <span className={`font-pixel text-[9px] ${getRankColor(rank)}`}>#{rank}</span>
                        </div>

                        {/* Name */}
                        <div className="col-span-5 flex items-center gap-2 overflow-hidden">
                          <div className={`w-8 h-8 flex items-center justify-center shrink-0 border border-[hsl(220,10%,20%)] ${
                            rank === 1 ? 'bg-yellow-950/40' : rank === 2 ? 'bg-slate-800' : rank === 3 ? 'bg-amber-950/30' : 'bg-[hsl(220,10%,14%)]'
                          }`}>
                            <img src={`/character/${user.character || 'ninja.png'}`} alt="avatar" className="w-6 h-6 object-contain" />
                          </div>
                          <div className="overflow-hidden">
                            <p className={`font-pixel text-[8px] truncate ${isMe ? 'text-green-400' : 'text-slate-300'}`}>
                              {user.name} {isMe && '(YOU)'}
                            </p>
                            <p className="font-pixel text-[6px] text-slate-600">{getRankTitle(rank)}</p>
                          </div>
                        </div>

                        {/* Level */}
                        <div className="col-span-2 text-right">
                          <span className="font-pixel text-[8px] text-slate-400">{userLevel}</span>
                        </div>

                        {/* XP with mini bar */}
                        <div className="col-span-3 text-right">
                          <span className={`font-pixel text-[9px] flex items-center gap-1 justify-end ${rank <= 3 ? getRankColor(rank) : 'text-slate-400'}`}>
                            <Flame className="w-3 h-3" /> {user.points.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}
      </main>

      <footer className="border-t-2 border-slate-800 bg-slate-900/40 px-4 py-3 text-center relative z-10 backdrop-blur-sm">
        <p className="font-pixel text-[7px] text-slate-500">RVM QUEST v1.0 - TELKOM UNIVERSITY SURABAYA</p>
      </footer>
    </div>
  );
}
