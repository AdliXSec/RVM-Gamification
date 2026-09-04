import { useState, useEffect } from 'react';
import { useAppStore } from '../store';
import {
  LogOut, Trash2, AlertTriangle, CheckCircle, Users, Gift, Tag,
  Activity, Clock, Edit, HelpCircle, Plus,
  Monitor, Package, Zap, ArrowUpRight, ArrowDownRight, Cpu, Database
} from 'lucide-react';

// ─── Reusable Card ─────────────────────────────────────────────────────
function Card({ children, accent = 'cyan', className = '' }: { children: React.ReactNode; accent?: string; className?: string }) {
  const borderMap: Record<string, string> = {
    cyan: 'border-t-cyan-500/60',
    green: 'border-t-green-500/60',
    orange: 'border-t-orange-500/60',
    purple: 'border-t-purple-500/60',
    yellow: 'border-t-yellow-500/60',
    indigo: 'border-t-indigo-500/60',
    red: 'border-t-red-500/60',
    blue: 'border-t-blue-500/60',
  };
  return (
    <div className={`pixel-border bg-slate-900/70 backdrop-blur-sm border-t-2 ${borderMap[accent] || borderMap.cyan} p-5 ${className}`}>
      {children}
    </div>
  );
}

function SectionTitle({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <h3 className="font-pixel text-[10px] md:text-xs text-slate-300 flex items-center gap-2 mb-4 pb-3 border-b border-slate-700/60">
      {icon} {children}
    </h3>
  );
}

function StatBadge({ label, value, color = 'text-cyan-400' }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="bg-slate-800/60 px-4 py-3 border border-slate-700/40 text-center">
      <p className="font-pixel text-[7px] text-slate-500 mb-1">{label}</p>
      <p className={`font-pixel text-base md:text-lg ${color}`}>{value}</p>
    </div>
  );
}

function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="text-center py-10 opacity-60">
      <div className="mx-auto w-10 h-10 text-slate-600 mb-3">{icon}</div>
      <span className="font-pixel text-[9px] text-slate-600">{text}</span>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────
export default function AdminPanel() {
  const {
    machine, machines, setActiveMachine, tickets, students, rewards, allLogs, logout,
    adminAddBottles, acceptTicket, completeTicket, updateRewardStatus, addReward, deleteReward,
    setMachineMaxCapacity, addMachine, deleteMachine, settings, updateSetting,
    faqs, guides, addFaq, deleteFaq, addGuide, deleteGuide
  } = useAppStore();
  const redemptions = useAppStore().redemptions || [];

  const [tab, setTab] = useState<'overview' | 'machines' | 'users' | 'rewards' | 'content' | 'logs'>('overview');

  // Form states
  const [selectedUser, setSelectedUser] = useState('');
  const [bottleAmount, setBottleAmount] = useState('10');
  const [depositMachineId, setDepositMachineId] = useState(machines[0]?.id?.toString() || '1');
  const [newMachName, setNewMachName] = useState('');
  const [newMachLoc, setNewMachLoc] = useState('');
  const [newMachCap, setNewMachCap] = useState('250');
  const [editXpConfig, setEditXpConfig] = useState('');
  useEffect(() => { if (settings?.xp_per_bottle) setEditXpConfig(settings.xp_per_bottle); }, [settings]);
  const [newName, setNewName] = useState('');
  const [newCost, setNewCost] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [editCapacity, setEditCapacity] = useState(machine.maxCapacity.toString());
  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');
  const [newFaqOrder, setNewFaqOrder] = useState('0');
  const [newGuideStep, setNewGuideStep] = useState('1');
  const [newGuideTitle, setNewGuideTitle] = useState('');
  const [newGuideDesc, setNewGuideDesc] = useState('');
  const [newGuideIcon, setNewGuideIcon] = useState('check');

  // Handlers
  const handleAddBottles = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !bottleAmount) return;
    const finalMachId = machines.find((m: any) => m.id.toString() === depositMachineId) ? depositMachineId : (machines[0]?.id.toString() || '1');
    adminAddBottles(selectedUser, finalMachId, parseInt(bottleAmount));
    setBottleAmount('');
  };
  const handleAddReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newCost) return;
    addReward(newName, parseInt(newCost), newDesc || 'Berlaku selama masa promosi.');
    setNewName(''); setNewCost(''); setNewDesc('');
  };
  const handleUpdateCapacity = () => {
    const cap = parseInt(editCapacity);
    if (!isNaN(cap) && cap >= 10) setMachineMaxCapacity(cap);
  };
  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaqQ || !newFaqA) return;
    addFaq({ question: newFaqQ, answer: newFaqA, order_num: parseInt(newFaqOrder), is_active: true });
    setNewFaqQ(''); setNewFaqA(''); setNewFaqOrder('0');
  };
  const handleAddGuide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuideTitle || !newGuideDesc) return;
    addGuide({ step_number: parseInt(newGuideStep), title: newGuideTitle, description: newGuideDesc, icon: newGuideIcon, is_active: true });
    setNewGuideTitle(''); setNewGuideDesc(''); setNewGuideStep((parseInt(newGuideStep) + 1).toString());
  };

  // Computed
  const totalBottlesAll = machines.reduce((s: number, m: any) => s + (m.current_bottles || 0), 0);
  const pendingTickets = tickets.filter(t => t.status !== 'Completed').length;
  const pendingRedemptions = redemptions.filter((r: any) => r.status === 'pending').length;

  const navItems = [
    { key: 'overview', label: 'Dashboard', icon: <Cpu className="w-4 h-4" /> },
    { key: 'machines', label: 'Mesin', icon: <Monitor className="w-4 h-4" /> },
    { key: 'users', label: 'Operasi', icon: <Users className="w-4 h-4" /> },
    { key: 'rewards', label: 'Rewards', icon: <Gift className="w-4 h-4" /> },
    { key: 'content', label: 'Konten', icon: <Edit className="w-4 h-4" /> },
    { key: 'logs', label: 'Logs', icon: <Database className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[hsl(220,15%,7%)] scanlines overflow-x-hidden relative">
      <div className="fixed inset-0 w-full h-full bg-slate-900/80 bg-[url('/bg.jpeg')] bg-cover md:bg-[length:100%_100%] bg-center bg-blend-multiply pointer-events-none z-0 grayscale opacity-30" />

      {/* ═══ Header ═══ */}
      <header className="bg-slate-900/80 border-b-2 border-cyan-900/40 fixed top-0 left-0 right-0 z-30 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="font-pixel text-xs flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
            <span className="text-slate-400">RVM</span>
            <span className="text-cyan-400">ADMIN</span>
            <span className="text-slate-600 font-pixel-body text-sm ml-2 hidden md:inline">v2.4 // ONLINE</span>
          </div>
          <button onClick={logout} className="font-pixel text-[9px] text-slate-500 hover:text-red-400 flex items-center gap-2 px-3 py-2 hover:bg-slate-800/60 transition-all">
            <LogOut className="w-3.5 h-3.5" /> LOGOUT
          </button>
        </div>
      </header>

      <div className="flex flex-1 relative z-10 pt-14">
        {/* ═══ Sidebar (Desktop) ═══ */}
        <aside className="hidden md:flex flex-col w-56 bg-slate-900/60 border-r border-slate-800/60 backdrop-blur-sm fixed top-14 left-0 bottom-0 z-20">
          <nav className="flex-1 py-4 px-3 space-y-1">
            {navItems.map(n => (
              <button key={n.key} onClick={() => setTab(n.key as typeof tab)}
                className={`w-full text-left font-pixel text-[10px] px-4 py-3 flex items-center gap-3 transition-all ${
                  tab === n.key
                    ? 'bg-cyan-950/50 text-cyan-400 border-l-2 border-cyan-400'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/40 border-l-2 border-transparent'
                }`}>
                {n.icon} {n.label.toUpperCase()}
                {n.key === 'users' && pendingTickets > 0 && (
                  <span className="ml-auto bg-orange-600 text-orange-100 text-[7px] font-pixel px-1.5 py-0.5 rounded-sm animate-pulse">{pendingTickets}</span>
                )}
                {n.key === 'rewards' && pendingRedemptions > 0 && (
                  <span className="ml-auto bg-purple-600 text-purple-100 text-[7px] font-pixel px-1.5 py-0.5 rounded-sm animate-pulse">{pendingRedemptions}</span>
                )}
              </button>
            ))}
          </nav>
          <div className="px-3 py-4 border-t border-slate-800/60">
            <div className="bg-slate-800/40 px-3 py-2 border border-slate-700/30">
              <p className="font-pixel text-[7px] text-slate-600">TOTAL BOTOL HARI INI</p>
              <p className="font-pixel text-cyan-400 text-base">{totalBottlesAll}</p>
            </div>
          </div>
        </aside>

        {/* ═══ Mobile Nav ═══ */}
        <div className="md:hidden bg-slate-900/60 border-b border-slate-800/60 px-2 py-2 flex gap-1 overflow-x-auto fixed top-14 left-0 right-0 z-20 backdrop-blur-sm">
          {navItems.map(n => (
            <button key={n.key} onClick={() => setTab(n.key as typeof tab)}
              className={`font-pixel text-[8px] px-3 py-2.5 flex items-center gap-1.5 whitespace-nowrap transition-all ${
                tab === n.key ? 'bg-cyan-950/50 text-cyan-400 border-b-2 border-cyan-400' : 'text-slate-500'
              }`}>
              {n.icon} {n.label.toUpperCase()}
            </button>
          ))}
        </div>

        {/* ═══ Main Content ═══ */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto md:ml-56 pt-12 md:pt-0">
          <div className="max-w-5xl mx-auto space-y-6">

            {/* ═══ TAB: OVERVIEW ═══ */}
            {tab === 'overview' && (<>
              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatBadge label="MESIN TERDAFTAR" value={machines.length} color="text-cyan-400" />
                <StatBadge label="TOTAL BOTOL" value={totalBottlesAll} color="text-green-400" />
                <StatBadge label="TIKET AKTIF" value={pendingTickets} color={pendingTickets > 0 ? 'text-orange-400' : 'text-slate-500'} />
                <StatBadge label="TUKAR REWARD" value={pendingRedemptions} color={pendingRedemptions > 0 ? 'text-purple-400' : 'text-slate-500'} />
              </div>

              {/* Quick Machine Overview */}
              <Card accent="cyan">
                <SectionTitle icon={<Activity className="w-4 h-4 text-green-500" />}>STATUS SEMUA MESIN</SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {machines.map((m: any) => {
                    const pct = Math.round((m.current_bottles / m.max_capacity) * 100);
                    const statusColor = m.status === 'online' ? 'text-green-400' : m.status === 'full' ? 'text-red-400' : 'text-yellow-400';
                    const barColor = pct >= 80 ? 'bg-red-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-green-500';
                    return (
                      <div key={m.id} className="bg-slate-800/50 border border-slate-700/40 p-4 hover:border-cyan-700/50 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-pixel text-[10px] text-slate-200">{m.name}</p>
                            <p className="font-pixel-body text-xs text-slate-500">{m.location}</p>
                          </div>
                          <span className={`font-pixel text-[8px] px-2 py-0.5 ${statusColor} bg-slate-900/60`}>
                            {m.status?.toUpperCase()}
                          </span>
                        </div>
                        <div className="h-2 bg-slate-700/50 overflow-hidden mb-1">
                          <div className={`h-full ${barColor} transition-all`} style={{ width: `${Math.min(100, pct)}%` }} />
                        </div>
                        <p className="font-pixel text-[8px] text-slate-500 text-right">{m.current_bottles}/{m.max_capacity} ({pct}%)</p>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Global Settings */}
              <Card accent="yellow">
                <SectionTitle icon={<Zap className="w-4 h-4 text-yellow-500" />}>KONFIGURASI GLOBAL</SectionTitle>
                <form onSubmit={e => { e.preventDefault(); updateSetting('xp_per_bottle', editXpConfig); }}
                  className="flex flex-col md:flex-row items-stretch md:items-end gap-3 bg-slate-800/40 p-4 border border-slate-700/30">
                  <div className="flex-1">
                    <label className="font-pixel text-[8px] text-slate-500 block mb-1.5">XP PER BOTOL PLASTIK</label>
                    <input type="number" className="pixel-input w-full px-3 py-2.5 text-sm" placeholder="100"
                      value={editXpConfig} onChange={e => setEditXpConfig(e.target.value)} required />
                  </div>
                  <button type="submit" className="pixel-btn bg-yellow-700 hover:bg-yellow-600 text-yellow-100 py-2.5 px-8 font-pixel text-[9px]">
                    SIMPAN
                  </button>
                </form>
              </Card>
            </>)}

            {/* ═══ TAB: MACHINES ═══ */}
            {tab === 'machines' && (<>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Active machine detail */}
                <Card accent="cyan">
                  <SectionTitle icon={<Monitor className="w-4 h-4 text-cyan-400" />}>STATUS MESIN AKTIF</SectionTitle>
                  <select className="pixel-input w-full px-3 py-2 mb-4 text-sm"
                    value={machine.id} onChange={e => setActiveMachine(e.target.value)}>
                    {machines.map((m: any) => <option key={m.id} value={m.id}>{m.name} — {m.location}</option>)}
                  </select>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-pixel text-[9px] text-slate-500">KAPASITAS</span>
                      <span className={`font-pixel text-lg ${Math.round((machine.currentBottles / machine.maxCapacity) * 100) >= 80 ? 'text-red-400' : 'text-slate-200'}`}>
                        {machine.currentBottles}/{machine.maxCapacity}
                      </span>
                    </div>
                    <div className="pixel-progress h-4">
                      <div style={{ width: `${Math.min(100, (machine.currentBottles / machine.maxCapacity) * 100)}%` }} className="h-full transition-all" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-pixel text-[8px] text-slate-600">STATUS</span>
                      <span className={`font-pixel text-[9px] px-2 py-1 ${
                        machine.status === 'Online' ? 'bg-green-950/40 text-green-400' :
                        machine.status === 'Full' ? 'bg-red-950/40 text-red-400' :
                        'bg-yellow-950/40 text-yellow-400'
                      }`}>{machine.status.toUpperCase()}</span>
                    </div>

                    <div className="pt-3 border-t border-slate-700/50 flex gap-2 items-end">
                      <div className="flex-1">
                        <label className="font-pixel text-[7px] text-slate-500 block mb-1">MAX BOTOL</label>
                        <input type="number" className="pixel-input w-full px-2 py-2 text-sm" value={editCapacity}
                          onChange={e => setEditCapacity(e.target.value)} min="10" />
                      </div>
                      <button onClick={handleUpdateCapacity}
                        className="pixel-btn bg-cyan-700 hover:bg-cyan-600 text-cyan-100 py-2 px-5 font-pixel text-[8px]">
                        UPDATE
                      </button>
                    </div>
                  </div>
                </Card>

                {/* Add new machine */}
                <Card accent="green">
                  <SectionTitle icon={<Plus className="w-4 h-4 text-green-500" />}>TAMBAH MESIN BARU</SectionTitle>
                  <form onSubmit={e => {
                    e.preventDefault();
                    addMachine(newMachName, newMachLoc, parseInt(newMachCap));
                    setNewMachName(''); setNewMachLoc(''); setNewMachCap('250');
                  }} className="space-y-3">
                    <div>
                      <label className="font-pixel text-[8px] text-slate-500 block mb-1">NAMA MESIN</label>
                      <input className="pixel-input w-full px-3 py-2.5 text-sm" placeholder="Contoh: RVM-03"
                        value={newMachName} onChange={e => setNewMachName(e.target.value)} required />
                    </div>
                    <div>
                      <label className="font-pixel text-[8px] text-slate-500 block mb-1">LOKASI</label>
                      <input className="pixel-input w-full px-3 py-2.5 text-sm" placeholder="Contoh: Gedung C Lt. 1"
                        value={newMachLoc} onChange={e => setNewMachLoc(e.target.value)} required />
                    </div>
                    <div>
                      <label className="font-pixel text-[8px] text-slate-500 block mb-1">KAPASITAS MAX</label>
                      <input type="number" className="pixel-input w-full px-3 py-2.5 text-sm" placeholder="250"
                        value={newMachCap} onChange={e => setNewMachCap(e.target.value)} required />
                    </div>
                    <button type="submit" className="pixel-btn bg-green-700 hover:bg-green-600 text-green-100 w-full py-3 font-pixel text-[9px]">
                      <Plus className="w-3 h-3 inline mr-1" /> TAMBAH MESIN
                    </button>
                  </form>
                </Card>
              </div>

              {/* Machine list */}
              <Card accent="cyan">
                <SectionTitle icon={<Package className="w-4 h-4 text-cyan-400" />}>DAFTAR SEMUA MESIN</SectionTitle>
                <div className="space-y-2">
                  {machines.map((m: any) => {
                    const pct = Math.round((m.current_bottles / m.max_capacity) * 100);
                    return (
                      <div key={m.id} className="flex justify-between items-center bg-slate-800/50 p-3 border-l-2 border-cyan-600/60 hover:bg-slate-800/80 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`w-2 h-2 rounded-full ${m.status === 'online' ? 'bg-green-500' : m.status === 'full' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                          <div>
                            <span className="font-pixel text-[9px] text-slate-200 block">{m.name}</span>
                            <span className="font-pixel-body text-xs text-slate-500">{m.location} • {pct}% terisi</span>
                          </div>
                        </div>
                        <button onClick={() => deleteMachine(m.id)}
                          className="text-slate-600 hover:text-red-400 p-2 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </>)}

            {/* ═══ TAB: USERS (Operations) ═══ */}
            {tab === 'users' && (<>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Deposit form */}
                <Card accent="blue">
                  <SectionTitle icon={<Users className="w-4 h-4 text-blue-400" />}>INPUT PENYETORAN BOTOL</SectionTitle>
                  <p className="font-pixel-body text-slate-600 text-sm mb-4">Simulasi IoT: Input manual jika mesin offline.</p>
                  <form onSubmit={handleAddBottles} className="space-y-3">
                    <div>
                      <label className="font-pixel text-[8px] text-slate-500 block mb-1">LOKASI MESIN</label>
                      <select className="pixel-input w-full px-3 py-2.5 text-sm" value={depositMachineId}
                        onChange={e => setDepositMachineId(e.target.value)} required>
                        {machines.map((m: any) => <option key={m.id} value={m.id}>{m.name} ({m.location})</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="font-pixel text-[8px] text-slate-500 block mb-1">PILIH MAHASISWA</label>
                      <select className="pixel-input w-full px-3 py-2.5 text-sm" value={selectedUser}
                        onChange={e => setSelectedUser(e.target.value)} required>
                        <option value="">— Pilih Mahasiswa —</option>
                        {students.map(u => <option key={u.id} value={u.id}>{u.name} (NIM: {u.nim})</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="font-pixel text-[8px] text-slate-500 block mb-1">JUMLAH BOTOL</label>
                      <input type="number" className="pixel-input w-full px-3 py-2.5 text-sm" min="1" max="100"
                        value={bottleAmount} onChange={e => setBottleAmount(e.target.value)} required />
                    </div>
                    <button type="submit" className="pixel-btn bg-blue-700 hover:bg-blue-600 text-blue-100 w-full py-3 font-pixel text-[9px]"
                      disabled={machine.currentBottles >= machine.maxCapacity || machine.status === 'Maintenance'}>
                      PROSES SETOR
                    </button>
                  </form>
                </Card>

                {/* Tickets */}
                <Card accent="orange">
                  <SectionTitle icon={<AlertTriangle className="w-4 h-4 text-orange-400" />}>
                    PICK-UP TICKETS {pendingTickets > 0 && <span className="text-orange-400 ml-1">({pendingTickets})</span>}
                  </SectionTitle>
                  {tickets.filter(t => t.status !== 'Completed').length === 0 ? (
                    <EmptyState icon={<CheckCircle />} text="SEMUA MESIN AMAN — TIDAK ADA TIKET" />
                  ) : (
                    <div className="space-y-3">
                      {tickets.filter(t => t.status !== 'Completed').map(ticket => (
                        <div key={ticket.id} className="bg-slate-800/50 border-l-2 border-orange-500 p-4 space-y-3">
                          <div>
                            <span className="font-pixel text-[9px] text-orange-400 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> {ticket.machineName}
                            </span>
                            <p className="font-pixel-body text-slate-500 text-sm">Kapasitas: {ticket.capacityAtIssue}% • {ticket.date}</p>
                          </div>
                          {ticket.status === 'Pending' ? (
                            <button onClick={() => acceptTicket(ticket.id)}
                              className="pixel-btn bg-orange-700 hover:bg-orange-600 text-orange-100 w-full py-2.5 font-pixel text-[9px]">
                              ACCEPT TASK
                            </button>
                          ) : (
                            <button onClick={() => completeTicket(ticket.id)}
                              className="pixel-btn bg-green-700 hover:bg-green-600 text-green-100 w-full py-2.5 font-pixel text-[9px]">
                              TASK COMPLETE
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>

            </>)}

            {/* ═══ TAB: REWARDS ═══ */}
            {tab === 'rewards' && (<>
              <div className="grid md:grid-cols-2 gap-6">
                <Card accent="indigo">
                  <SectionTitle icon={<Tag className="w-4 h-4 text-indigo-400" />}>TAMBAH REWARD BARU</SectionTitle>
                  <form onSubmit={handleAddReward} className="space-y-3">
                    <div>
                      <label className="font-pixel text-[8px] text-slate-500 block mb-1">NAMA ITEM</label>
                      <input className="pixel-input w-full px-3 py-2.5 text-sm" placeholder="Contoh: Tumbler Eksklusif"
                        value={newName} onChange={e => setNewName(e.target.value)} required />
                    </div>
                    <div>
                      <label className="font-pixel text-[8px] text-slate-500 block mb-1">HARGA (XP)</label>
                      <input type="number" className="pixel-input w-full px-3 py-2.5 text-sm" placeholder="3000" min="1"
                        value={newCost} onChange={e => setNewCost(e.target.value)} required />
                    </div>
                    <div>
                      <label className="font-pixel text-[8px] text-slate-500 block mb-1">DESKRIPSI</label>
                      <input className="pixel-input w-full px-3 py-2.5 text-sm" placeholder="Info item..."
                        value={newDesc} onChange={e => setNewDesc(e.target.value)} />
                    </div>
                    <button type="submit" className="pixel-btn bg-indigo-700 hover:bg-indigo-600 text-indigo-100 w-full py-3 font-pixel text-[9px]">
                      <Plus className="w-3 h-3 inline mr-1" /> TAMBAHKAN REWARD
                    </button>
                  </form>
                </Card>

                <Card accent="green">
                  <SectionTitle icon={<Tag className="w-4 h-4 text-green-500" />}>KATALOG AKTIF ({rewards.length})</SectionTitle>
                  {rewards.length === 0 ? (
                    <EmptyState icon={<Tag />} text="KATALOG MASIH KOSONG" />
                  ) : (
                    <div className="space-y-2">
                      {rewards.map(r => (
                        <div key={r.id} className="flex justify-between items-center p-3 bg-slate-800/50 border-l-2 border-green-600/60 hover:bg-slate-800/80 transition-colors">
                          <div>
                            <span className="font-pixel text-[9px] text-slate-200 block">{r.name}</span>
                            <span className="font-pixel text-[8px] text-yellow-500">{r.cost} XP</span>
                          </div>
                          <button onClick={() => deleteReward(r.id)} className="text-slate-600 hover:text-red-400 p-2 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>

              {/* Pending redemptions */}
              <div className="mt-6">
                <Card accent="purple">
                  <SectionTitle icon={<Gift className="w-4 h-4 text-purple-400" />}>
                    PERMINTAAN TUKAR REWARD {pendingRedemptions > 0 && <span className="text-purple-400 ml-1">({pendingRedemptions})</span>}
                  </SectionTitle>
                  {redemptions.length === 0 ? (
                    <EmptyState icon={<Gift />} text="TIDAK ADA PERMINTAAN TUKAR" />
                  ) : (
                    <div className="space-y-3">
                      {redemptions.map((req: any, i: number) => (
                        <div key={i} className="bg-slate-800/50 border-l-2 border-purple-500 p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                          <div>
                            <span className="font-pixel text-[9px] text-purple-300">{req.user?.name} (NIM: {req.user?.nim})</span>
                            <p className="font-pixel-body text-slate-500 text-sm">{req.reward?.name} — {req.cost_at_redemption} XP</p>
                            <p className="font-pixel text-[7px] text-slate-600">{req.created_at}</p>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => updateRewardStatus(req.id, 'completed')}
                              className="pixel-btn bg-green-700 hover:bg-green-600 text-green-100 px-4 py-2 font-pixel text-[8px]">
                              SETUJUI
                            </button>
                            <button onClick={() => updateRewardStatus(req.id, 'cancelled')}
                              className="pixel-btn bg-red-800 hover:bg-red-700 text-red-100 px-4 py-2 font-pixel text-[8px]">
                              TOLAK
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            </>)}

            {/* ═══ TAB: CONTENT ═══ */}
            {tab === 'content' && (<>
              {/* FAQ */}
              <Card accent="blue">
                <SectionTitle icon={<HelpCircle className="w-4 h-4 text-blue-400" />}>KELOLA FAQ ({faqs?.length || 0})</SectionTitle>
                <form onSubmit={handleAddFaq} className="bg-slate-800/40 p-4 border border-slate-700/30 mb-5 space-y-3">
                  <div className="grid grid-cols-4 gap-3">
                    <div className="col-span-1">
                      <label className="font-pixel text-[8px] text-slate-500 block mb-1">URUTAN</label>
                      <input type="number" className="pixel-input w-full px-3 py-2.5 text-sm"
                        value={newFaqOrder} onChange={e => setNewFaqOrder(e.target.value)} required />
                    </div>
                    <div className="col-span-3">
                      <label className="font-pixel text-[8px] text-slate-500 block mb-1">PERTANYAAN</label>
                      <input type="text" className="pixel-input w-full px-3 py-2.5 text-sm"
                        value={newFaqQ} onChange={e => setNewFaqQ(e.target.value)} required placeholder="Contoh: Apa itu RVM?" />
                    </div>
                  </div>
                  <div>
                    <label className="font-pixel text-[8px] text-slate-500 block mb-1">JAWABAN</label>
                    <textarea className="pixel-input w-full px-3 py-2.5 text-sm h-20 resize-none"
                      value={newFaqA} onChange={e => setNewFaqA(e.target.value)} required placeholder="Jawaban detail..." />
                  </div>
                  <button type="submit" className="pixel-btn bg-blue-700 hover:bg-blue-600 text-blue-100 px-6 py-2.5 font-pixel text-[9px]">
                    <Plus className="w-3 h-3 inline mr-1" /> TAMBAH FAQ
                  </button>
                </form>
                <div className="space-y-2">
                  {faqs?.map((f: any) => (
                    <div key={f.id} className="flex justify-between items-start gap-3 bg-slate-800/50 p-3 border-l-2 border-blue-600/60 hover:bg-slate-800/80 transition-colors">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-pixel text-[7px] text-slate-500 bg-slate-800 px-1.5 py-0.5 shrink-0">#{f.order_num}</span>
                          <span className="font-pixel text-[9px] text-slate-200 truncate">{f.question}</span>
                        </div>
                        <p className="font-pixel-body text-xs text-slate-500 line-clamp-2">{f.answer}</p>
                      </div>
                      <button onClick={() => deleteFaq(f.id)}
                        className="text-slate-600 hover:text-red-400 p-1.5 shrink-0 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Guides */}
              <Card accent="green">
                <SectionTitle icon={<Edit className="w-4 h-4 text-green-400" />}>KELOLA PANDUAN ({guides?.length || 0})</SectionTitle>
                <form onSubmit={handleAddGuide} className="bg-slate-800/40 p-4 border border-slate-700/30 mb-5 space-y-3">
                  <div className="grid grid-cols-4 gap-3">
                    <div className="col-span-1">
                      <label className="font-pixel text-[8px] text-slate-500 block mb-1">STEP KE-</label>
                      <input type="number" className="pixel-input w-full px-3 py-2.5 text-sm"
                        value={newGuideStep} onChange={e => setNewGuideStep(e.target.value)} required />
                    </div>
                    <div className="col-span-2">
                      <label className="font-pixel text-[8px] text-slate-500 block mb-1">JUDUL</label>
                      <input type="text" className="pixel-input w-full px-3 py-2.5 text-sm"
                        value={newGuideTitle} onChange={e => setNewGuideTitle(e.target.value)} required placeholder="Contoh: MASUKKAN BOTOL" />
                    </div>
                    <div className="col-span-1">
                      <label className="font-pixel text-[8px] text-slate-500 block mb-1">IKON</label>
                      <input type="text" className="pixel-input w-full px-3 py-2.5 text-sm"
                        value={newGuideIcon} onChange={e => setNewGuideIcon(e.target.value)} placeholder="check" />
                    </div>
                  </div>
                  <div>
                    <label className="font-pixel text-[8px] text-slate-500 block mb-1">DESKRIPSI</label>
                    <textarea className="pixel-input w-full px-3 py-2.5 text-sm h-20 resize-none"
                      value={newGuideDesc} onChange={e => setNewGuideDesc(e.target.value)} required placeholder="Deskripsi panduan..." />
                  </div>
                  <button type="submit" className="pixel-btn bg-green-700 hover:bg-green-600 text-green-100 px-6 py-2.5 font-pixel text-[9px]">
                    <Plus className="w-3 h-3 inline mr-1" /> TAMBAH GUIDE
                  </button>
                </form>
                <div className="space-y-2">
                  {guides?.map((g: any) => (
                    <div key={g.id} className="flex justify-between items-start gap-3 bg-slate-800/50 p-3 border-l-2 border-green-600/60 hover:bg-slate-800/80 transition-colors">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-pixel text-[7px] text-green-400 bg-green-950/40 px-1.5 py-0.5 shrink-0">STEP {g.step_number}</span>
                          <span className="font-pixel text-[9px] text-slate-200">{g.title}</span>
                        </div>
                        <p className="font-pixel-body text-xs text-slate-500 line-clamp-2">{g.description}</p>
                      </div>
                      <button onClick={() => deleteGuide(g.id)}
                        className="text-slate-600 hover:text-red-400 p-1.5 shrink-0 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </Card>
            </>)}

            {/* ═══ TAB: LOGS ═══ */}
            {tab === 'logs' && (
              <Card accent="cyan">
                <SectionTitle icon={<Database className="w-4 h-4 text-cyan-400" />}>
                  TRANSACTION LOG ({allLogs.length} record)
                </SectionTitle>
                {allLogs.length === 0 ? (
                  <EmptyState icon={<Clock />} text="BELUM ADA LOG TRANSAKSI" />
                ) : (
                  <div className="space-y-1.5 max-h-[65vh] overflow-y-auto pr-1">
                    {allLogs.map((log: any, i: number) => (
                      <div key={i} className={`flex justify-between items-center p-3 bg-slate-800/50 border-l-2 ${
                        log.type === 'earn' ? 'border-green-500' : 'border-purple-500'
                      } hover:bg-slate-800/80 transition-colors`}>
                        <div className="min-w-0">
                          <div className="font-pixel text-[9px] text-slate-300 flex items-center gap-2">
                            {log.type === 'earn'
                              ? <ArrowUpRight className="w-3 h-3 text-green-400 shrink-0" />
                              : <ArrowDownRight className="w-3 h-3 text-purple-400 shrink-0" />}
                            <span className="truncate">{log.user.name}</span>
                            <span className="text-slate-600">#{log.user.nim}</span>
                          </div>
                          <p className="font-pixel-body text-slate-500 text-xs truncate ml-5">{log.desc}</p>
                          <span className="font-pixel text-[7px] text-slate-600 ml-5">{log.date}</span>
                        </div>
                        <span className={`font-pixel text-[10px] shrink-0 ml-3 ${log.type === 'earn' ? 'text-green-400' : 'text-purple-400'}`}>
                          {log.type === 'earn' ? '+' : '-'}{log.amount} XP
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}
          </div>
          
          {/* ═══ Footer ═══ */}
          <footer className="mt-12 border-t border-slate-800/60 pt-4 pb-2 text-center text-slate-600">
            <p className="font-pixel text-[7px]">RVM_ADMIN_PANEL v2.4 // SYS_ONLINE // {new Date().toLocaleDateString('id-ID')}</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
