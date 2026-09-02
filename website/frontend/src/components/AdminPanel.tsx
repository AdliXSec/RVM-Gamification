import { useState, useEffect } from 'react';
import { useAppStore } from '../store';
import { LogOut, Trash2, Settings, AlertTriangle, CheckCircle, Users, Gift, Tag, Activity, Wrench, Clock, Star, Edit, HelpCircle } from 'lucide-react';

export default function AdminPanel() {
  const { machine, machines, setActiveMachine, tickets, students, rewards, allLogs, logout, adminAddBottles, acceptTicket, completeTicket, updateRewardStatus, addReward, deleteReward, setMachineMaxCapacity, addMachine, deleteMachine, settings, updateSetting, faqs, guides, addFaq, deleteFaq, addGuide, deleteGuide } = useAppStore();

  const [tab, setTab] = useState<'ops' | 'users' | 'catalog' | 'logs' | 'content'>('ops');
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


  // Content State
  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');
  const [newFaqOrder, setNewFaqOrder] = useState('0');
  
  const [newGuideStep, setNewGuideStep] = useState('1');
  const [newGuideTitle, setNewGuideTitle] = useState('');
  const [newGuideDesc, setNewGuideDesc] = useState('');
  const [newGuideIcon, setNewGuideIcon] = useState('check');
  
  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if(!newFaqQ || !newFaqA) return;
    addFaq({ question: newFaqQ, answer: newFaqA, order_num: parseInt(newFaqOrder), is_active: true });
    setNewFaqQ(''); setNewFaqA(''); setNewFaqOrder('0');
  };
  
  const handleAddGuide = (e: React.FormEvent) => {
    e.preventDefault();
    if(!newGuideTitle || !newGuideDesc) return;
    addGuide({ step_number: parseInt(newGuideStep), title: newGuideTitle, description: newGuideDesc, icon: newGuideIcon, is_active: true });
    setNewGuideTitle(''); setNewGuideDesc(''); setNewGuideStep((parseInt(newGuideStep)+1).toString());
  };

  const handleAddBottles = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !bottleAmount) return;
    const finalMachId = machines.find((m:any) => m.id.toString() === depositMachineId) ? depositMachineId : (machines[0]?.id.toString() || '1');
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
    if (!isNaN(cap) && cap >= 10) {
      setMachineMaxCapacity(cap);
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-[hsl(220,15%,7%)] scanlines overflow-x-hidden relative">
      {/* Game Console Background Layer */}
      <div 
        className="fixed inset-0 w-full h-full bg-slate-900/80 bg-[url('/bg.jpeg')] bg-cover md:bg-[length:100%_100%] bg-center bg-blend-multiply pointer-events-none z-0 grayscale opacity-40"
      />

      <header className="bg-slate-900/60 border-b-4 border-slate-800 sticky top-0 z-20 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="font-pixel text-slate-300 text-[10px] flex items-center gap-2">
            <Wrench className="w-4 h-4 text-cyan-500" /> SYSTEM<span className="text-cyan-500">CONFIG</span>
          </div>
          <button onClick={logout} className="font-pixel text-[8px] text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors">
            <LogOut className="w-3 h-3" /> EXIT
          </button>
        </div>
      </header>

      <div className="bg-slate-900/40 border-b-2 border-slate-800 px-4 relative z-10 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex gap-1">
          {[
            { key: 'ops', label: 'SYS_STATUS', icon: <Settings className="w-3 h-3" /> },
            { key: 'users', label: 'PLAYER_DATA', icon: <Users className="w-3 h-3" /> },
            { key: 'catalog', label: 'LOOT_TABLE', icon: <Tag className="w-3 h-3" /> },
            { key: 'logs', label: 'GLOBAL_LOGS', icon: <Clock className="w-3 h-3" /> },
            { key: 'content', label: 'CONTENT', icon: <HelpCircle className="w-3 h-3" /> },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key as typeof tab)}
              className={`font-pixel text-[8px] md:text-[10px] px-4 py-4 border-b-4 transition-colors whitespace-nowrap flex items-center gap-2 ${
                tab === t.key ? 'border-cyan-500 text-cyan-400 bg-slate-800/80' : 'border-transparent text-slate-500 hover:text-slate-400 hover:bg-slate-800/30'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8 relative z-10">

        {tab === 'ops' && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="pixel-border bg-slate-900/70 backdrop-blur-sm border-t-2 border-t-cyan-500/30 p-5 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-pixel text-[9px] text-slate-400 flex items-center gap-2"><Activity className="w-4 h-4 text-green-500" /> STATUS MESIN</h3>
                <select className="pixel-input px-2 py-1 text-[8px]" value={machine.id} onChange={e => setActiveMachine(e.target.value)}>
                  {machines.map((m: any) => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-pixel text-[9px] text-slate-500">KAPASITAS ({machine.currentBottles}/{machine.maxCapacity}):</span>
                <span className={`font-pixel text-lg ${Math.round((machine.currentBottles/machine.maxCapacity)*100) >= 80 ? 'text-red-400' : 'text-slate-200'}`}>
                  {Math.round((machine.currentBottles / machine.maxCapacity) * 100)}%
                </span>
              </div>
              <div className="pixel-progress h-5">
                <div style={{ width: `${Math.min(100, (machine.currentBottles / machine.maxCapacity) * 100)}%` }} className="h-full transition-all" />
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-700/50">
                <span className="font-pixel text-[8px] text-slate-600">STATUS:</span>
                <span className={`font-pixel text-[9px] px-2 py-1 ${
                  machine.status === 'Online' ? 'bg-green-950/30 text-green-400' :
                  machine.status === 'Full' ? 'bg-red-950/30 text-red-400' :
                  'bg-yellow-950/30 text-yellow-400'
                }`}>{machine.status.toUpperCase()}</span>
              </div>
              <div className="pt-4 border-t border-slate-700/50 flex gap-2 items-center">
                <span className="font-pixel text-[8px] text-slate-500">MAX BTL:</span>
                <input type="number" className="pixel-input w-24 px-2 py-1.5 text-[10px]" value={editCapacity} onChange={e => setEditCapacity(e.target.value)} min="10" />
                <button onClick={handleUpdateCapacity} className="pixel-btn bg-cyan-700 hover:bg-cyan-600 text-cyan-100 flex-1 py-1.5 text-[8px]">
                  OVERRIDE
                </button>
              </div>
            </div>

            <div className="pixel-border-orange bg-slate-900/70 backdrop-blur-sm border-t-2 border-t-orange-500/30 p-5 space-y-4">
              <h3 className="font-pixel text-[9px] text-slate-400 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-orange-400" /> PICK-UP TICKETS</h3>
              {tickets.filter(t => t.status !== 'Completed').length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                  <span className="font-pixel text-[8px] text-slate-600">MESIN AMAN</span>
                </div>
              ) : (
                tickets.filter(t => t.status !== 'Completed').map(ticket => (
                  <div key={ticket.id} className="bg-[hsl(30,8%,9%)] border-l-4 border-orange-600 p-4 space-y-3">
                    <div>
                      <span className="font-pixel text-[9px] text-orange-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {ticket.machineName}</span>
                      <p className="font-pixel-body text-slate-500 text-base">Kapasitas: {ticket.capacityAtIssue}% | {ticket.date}</p>
                    </div>
                    {ticket.status === 'Pending' ? (
                      <button onClick={() => acceptTicket(ticket.id)}
                        className="pixel-btn bg-orange-700 hover:bg-orange-600 text-orange-100 w-full py-3"
                        style={{boxShadow: '4px 4px 0 0 rgba(0,0,0,0.4), 4px 0 0 0 hsl(30,50%,25%), -4px 0 0 0 hsl(30,50%,25%), 0 4px 0 0 hsl(30,50%,25%), 0 -4px 0 0 hsl(30,50%,25%)'}}>
                        ACCEPT TASK
                      </button>
                    ) : (
                      <button onClick={() => completeTicket(ticket.id)}
                        className="pixel-btn bg-green-700 hover:bg-green-600 text-green-100 w-full py-3">
                        TASK COMPLETE
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {tab === 'users' && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="pixel-border bg-slate-900/70 backdrop-blur-sm border-t-2 border-t-cyan-500/30 p-5 space-y-4">
              <h3 className="font-pixel text-[9px] text-slate-400 flex items-center gap-2"><Users className="w-4 h-4 text-blue-400" /> INPUT PENYETORAN</h3>
              <p className="font-pixel-body text-slate-600 text-base">Simulasi IoT: Input manual jika mesin offline.</p>
              <form onSubmit={handleAddBottles} className="space-y-4">
                <div className="space-y-2">
                  <label className="font-pixel text-[7px] text-slate-500">LOKASI MESIN</label>
                  <select className="pixel-input w-full px-3 py-2" value={depositMachineId} onChange={e => setDepositMachineId(e.target.value)} required>
                    {machines.map((m: any) => (<option key={m.id} value={m.id}>{m.name} ({m.location})</option>))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="font-pixel text-[7px] text-slate-500">PILIH MAHASISWA</label>
                  <select className="pixel-input w-full px-3 py-2" value={selectedUser} onChange={e => setSelectedUser(e.target.value)} required>
                    <option value="">-- Pilih --</option>
                    {students.map(u => (<option key={u.id} value={u.id}>{u.name} (NIM: {u.nim})</option>))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="font-pixel text-[7px] text-slate-500">JUMLAH BOTOL</label>
                  <input type="number" className="pixel-input w-full px-3 py-2" min="1" max="100" value={bottleAmount} onChange={e => setBottleAmount(e.target.value)} required />
                </div>
                <button type="submit" className="pixel-btn bg-blue-700 hover:bg-blue-600 text-blue-100 w-full py-3"
                  style={{boxShadow: '4px 4px 0 0 rgba(0,0,0,0.4), 4px 0 0 0 hsl(220,50%,25%), -4px 0 0 0 hsl(220,50%,25%), 0 4px 0 0 hsl(220,50%,25%), 0 -4px 0 0 hsl(220,50%,25%)'}}
                  disabled={machine.currentBottles >= machine.maxCapacity || machine.status === 'Maintenance'}>
                  PROSES SETOR
                </button>
              </form>
            </div>

            <div className="pixel-border bg-slate-900/70 backdrop-blur-sm border-t-2 border-t-cyan-500/30 p-5 space-y-4">
              <h3 className="font-pixel text-[9px] text-slate-400 flex items-center gap-2"><Gift className="w-4 h-4 text-purple-400" /> PERMINTAAN TUKAR POIN</h3>
              {(!useAppStore().redemptions || useAppStore().redemptions.length === 0) ? (
                <div className="text-center py-8">
                  <Gift className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                  <span className="font-pixel text-[8px] text-slate-600">TIDAK ADA PERMINTAAN</span>
                </div>
              ) : (
                useAppStore().redemptions.map((req, i) => (
                  <div key={i} className="bg-[hsl(270,8%,9%)] border-l-4 border-purple-600 p-4 space-y-3">
                    <div>
                      <span className="font-pixel text-[9px] text-purple-300">{req.user?.name} (NIM: {req.user?.nim}) - {req.reward?.name}</span>
                      <p className="font-pixel-body text-slate-500 text-base">Cost: {req.cost_at_redemption} XP</p>
                      <p className="font-pixel text-[7px] text-slate-600">{req.created_at}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => updateRewardStatus(req.id, 'completed')}
                        className="pixel-btn flex-1 bg-green-700 hover:bg-green-600 text-green-100 py-2.5">
                        SETUJUI
                      </button>
                      <button onClick={() => updateRewardStatus(req.id, 'cancelled')}
                        className="pixel-btn flex-1 bg-red-800 hover:bg-red-700 text-red-100 py-2.5"
                        style={{boxShadow: '4px 4px 0 0 rgba(0,0,0,0.4), 4px 0 0 0 hsl(0,40%,25%), -4px 0 0 0 hsl(0,40%,25%), 0 4px 0 0 hsl(0,40%,25%), 0 -4px 0 0 hsl(0,40%,25%)'}}>
                        TOLAK
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          
            
            {/* PENGATURAN GLOBAL */}
            <div className="pixel-border bg-slate-900/70 backdrop-blur-sm border-t-2 border-t-cyan-500/30 p-5 space-y-4 md:col-span-2">
              <h3 className="font-pixel text-[9px] text-slate-400 flex items-center gap-2"><Star className="w-4 h-4 text-yellow-500" /> PENGATURAN GLOBAL</h3>
              <div className="bg-slate-800/40 p-4 border border-slate-700/50">
                <form onSubmit={e => { e.preventDefault(); updateSetting('xp_per_bottle', editXpConfig); }} className="flex items-end gap-4">
                  <div className="flex-1 space-y-2">
                    <label className="font-pixel text-[7px] text-slate-500">XP PER BOTOL PLASTIK</label>
                    <input type="number" className="pixel-input w-full px-3 py-2 text-[9px]" placeholder="100" value={editXpConfig} onChange={e => setEditXpConfig(e.target.value)} required />
                  </div>
                  <button type="submit" className="pixel-btn bg-yellow-700 hover:bg-yellow-600 text-yellow-100 py-2 px-6">SIMPAN</button>
                </form>
              </div>
            </div>

            {/* MACHINE MANAGEMENT */}
            <div className="pixel-border bg-slate-900/70 backdrop-blur-sm border-t-2 border-t-cyan-500/30 p-5 space-y-4 md:col-span-2">
              <h3 className="font-pixel text-[9px] text-slate-400 flex items-center gap-2"><Activity className="w-4 h-4 text-green-500" /> KELOLA MESIN RVM</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <form onSubmit={e => { e.preventDefault(); addMachine(newMachName, newMachLoc, parseInt(newMachCap)); setNewMachName(''); setNewMachLoc(''); setNewMachCap('250'); }} className="space-y-3 bg-slate-800/40 p-4 border border-slate-700/50">
                    <h4 className="font-pixel text-[8px] text-cyan-400 mb-2">TAMBAH MESIN BARU</h4>
                    <input className="pixel-input w-full px-3 py-2 text-[9px]" placeholder="Nama (e.g. RVM-03)" value={newMachName} onChange={e => setNewMachName(e.target.value)} required />
                    <input className="pixel-input w-full px-3 py-2 text-[9px]" placeholder="Lokasi (e.g. Gedung C)" value={newMachLoc} onChange={e => setNewMachLoc(e.target.value)} required />
                    <input type="number" className="pixel-input w-full px-3 py-2 text-[9px]" placeholder="Kapasitas Max" value={newMachCap} onChange={e => setNewMachCap(e.target.value)} required />
                    <button type="submit" className="pixel-btn bg-cyan-700 hover:bg-cyan-600 text-cyan-100 w-full py-2">TAMBAH MESIN</button>
                  </form>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-pixel text-[8px] text-cyan-400 mb-2">DAFTAR MESIN</h4>
                  {machines.map((m: any) => (
                    <div key={m.id} className="flex justify-between items-center bg-slate-800/50 p-2 border-l-2 border-cyan-500">
                      <div>
                        <span className="font-pixel text-[8px] text-slate-200 block">{m.name}</span>
                        <span className="font-pixel-body text-[10px] text-slate-500">{m.location}</span>
                      </div>
                      <button onClick={() => deleteMachine(m.id)} className="bg-red-900/50 hover:bg-red-800 text-red-300 font-pixel text-[7px] px-2 py-1">HAPUS</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'catalog' && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="pixel-border bg-slate-900/70 backdrop-blur-sm border-t-2 border-t-cyan-500/30 p-5 space-y-4">
              <h3 className="font-pixel text-[9px] text-slate-400 flex items-center gap-2"><Tag className="w-4 h-4 text-indigo-400" /> TAMBAH REWARD</h3>
              <form onSubmit={handleAddReward} className="space-y-4">
                <div className="space-y-2">
                  <label className="font-pixel text-[7px] text-slate-500">NAMA ITEM</label>
                  <input className="pixel-input w-full px-3 py-2" placeholder="Misal: Tumbler" value={newName} onChange={e => setNewName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <label className="font-pixel text-[7px] text-slate-500">HARGA (XP)</label>
                  <input type="number" className="pixel-input w-full px-3 py-2" placeholder="3000" min="1" value={newCost} onChange={e => setNewCost(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <label className="font-pixel text-[7px] text-slate-500">DESKRIPSI</label>
                  <input className="pixel-input w-full px-3 py-2" placeholder="Info item..." value={newDesc} onChange={e => setNewDesc(e.target.value)} />
                </div>
                <button type="submit" className="pixel-btn bg-indigo-700 hover:bg-indigo-600 text-indigo-100 w-full py-3"
                  style={{boxShadow: '4px 4px 0 0 rgba(0,0,0,0.4), 4px 0 0 0 hsl(240,40%,25%), -4px 0 0 0 hsl(240,40%,25%), 0 4px 0 0 hsl(240,40%,25%), 0 -4px 0 0 hsl(240,40%,25%)'}}>
                  TAMBAHKAN
                </button>
              </form>
            </div>
            <div className="pixel-border bg-slate-900/70 backdrop-blur-sm border-t-2 border-t-cyan-500/30 p-5 space-y-4">
              <h3 className="font-pixel text-[9px] text-slate-400 flex items-center gap-2"><Tag className="w-4 h-4 text-green-500" /> KATALOG AKTIF</h3>
              {rewards.length === 0 ? (
                <div className="text-center py-8">
                  <Tag className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                  <span className="font-pixel text-[8px] text-slate-600">KATALOG KOSONG</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {rewards.map(r => (
                    <div key={r.id} className="flex justify-between items-center p-3 bg-[hsl(220,10%,9%)] border-l-4 border-green-700">
                      <div>
                        <span className="font-pixel text-[8px] text-slate-300">{r.name}</span>
                        <p className="font-pixel text-[8px] text-yellow-500">{r.cost} XP</p>
                      </div>
                      <button onClick={() => deleteReward(r.id)} className="text-red-600 hover:text-red-400 p-2">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        
        {tab === 'content' && (
          <div className="space-y-8 animate-fade-in">
            {/* FAQ Management */}
            <div className="bg-slate-800 p-6 pixel-border border-slate-600">
              <h2 className="font-pixel text-white text-lg mb-6 border-b-2 border-slate-700 pb-2 flex items-center gap-2"><HelpCircle className="w-5 h-5"/> KELOLA FAQ</h2>
              
              <form onSubmit={handleAddFaq} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 bg-slate-900/50 p-4 border border-slate-700">
                <div className="md:col-span-1">
                  <label className="block font-pixel text-[10px] text-slate-400 mb-1">URUTAN</label>
                  <input type="number" className="w-full bg-slate-800 text-white px-3 py-2 border border-slate-600 font-pixel-body" value={newFaqOrder} onChange={e=>setNewFaqOrder(e.target.value)} required/>
                </div>
                <div className="md:col-span-3">
                  <label className="block font-pixel text-[10px] text-slate-400 mb-1">PERTANYAAN</label>
                  <input type="text" className="w-full bg-slate-800 text-white px-3 py-2 border border-slate-600 font-pixel-body" value={newFaqQ} onChange={e=>setNewFaqQ(e.target.value)} required placeholder="Contoh: Apa itu RVM?"/>
                </div>
                <div className="md:col-span-4">
                  <label className="block font-pixel text-[10px] text-slate-400 mb-1">JAWABAN</label>
                  <textarea className="w-full bg-slate-800 text-white px-3 py-2 border border-slate-600 font-pixel-body h-20" value={newFaqA} onChange={e=>setNewFaqA(e.target.value)} required placeholder="Jawaban detail..."></textarea>
                </div>
                <div className="md:col-span-4">
                  <button type="submit" className="pixel-btn bg-blue-600 hover:bg-blue-500 text-white px-6 py-2">TAMBAH FAQ</button>
                </div>
              </form>

              <div className="space-y-3">
                {faqs?.map((f: any) => (
                  <div key={f.id} className="bg-slate-700 p-4 border border-slate-600 flex justify-between items-start gap-4">
                    <div>
                      <span className="bg-slate-800 text-slate-300 font-pixel text-[10px] px-2 py-1 rounded mr-2">#{f.order_num}</span>
                      <strong className="text-white font-pixel-body">{f.question}</strong>
                      <p className="text-slate-400 font-pixel-body text-sm mt-1">{f.answer}</p>
                    </div>
                    <button onClick={() => deleteFaq(f.id)} className="p-2 bg-red-900/30 text-red-400 hover:bg-red-500 hover:text-white border border-red-800 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Guide Management */}
            <div className="bg-slate-800 p-6 pixel-border border-slate-600">
              <h2 className="font-pixel text-white text-lg mb-6 border-b-2 border-slate-700 pb-2 flex items-center gap-2"><Edit className="w-5 h-5"/> KELOLA PANDUAN (GUIDE)</h2>
              
              <form onSubmit={handleAddGuide} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 bg-slate-900/50 p-4 border border-slate-700">
                <div className="md:col-span-1">
                  <label className="block font-pixel text-[10px] text-slate-400 mb-1">STEP KE-</label>
                  <input type="number" className="w-full bg-slate-800 text-white px-3 py-2 border border-slate-600 font-pixel-body" value={newGuideStep} onChange={e=>setNewGuideStep(e.target.value)} required/>
                </div>
                <div className="md:col-span-2">
                  <label className="block font-pixel text-[10px] text-slate-400 mb-1">JUDUL STEP</label>
                  <input type="text" className="w-full bg-slate-800 text-white px-3 py-2 border border-slate-600 font-pixel-body" value={newGuideTitle} onChange={e=>setNewGuideTitle(e.target.value)} required placeholder="Contoh: MASUKKAN BOTOL"/>
                </div>
                <div className="md:col-span-1">
                  <label className="block font-pixel text-[10px] text-slate-400 mb-1">NAMA IKON</label>
                  <input type="text" className="w-full bg-slate-800 text-white px-3 py-2 border border-slate-600 font-pixel-body" value={newGuideIcon} onChange={e=>setNewGuideIcon(e.target.value)} placeholder="Contoh: check"/>
                </div>
                <div className="md:col-span-4">
                  <label className="block font-pixel text-[10px] text-slate-400 mb-1">DESKRIPSI PANDUAN</label>
                  <textarea className="w-full bg-slate-800 text-white px-3 py-2 border border-slate-600 font-pixel-body h-20" value={newGuideDesc} onChange={e=>setNewGuideDesc(e.target.value)} required placeholder="Deskripsi..."></textarea>
                </div>
                <div className="md:col-span-4">
                  <button type="submit" className="pixel-btn bg-green-600 hover:bg-green-500 text-white px-6 py-2">TAMBAH GUIDE</button>
                </div>
              </form>

              <div className="space-y-3">
                {guides?.map((g: any) => (
                  <div key={g.id} className="bg-slate-700 p-4 border border-slate-600 flex justify-between items-start gap-4">
                    <div>
                      <span className="bg-slate-800 text-slate-300 font-pixel text-[10px] px-2 py-1 rounded mr-2">STEP {g.step_number}</span>
                      <strong className="text-white font-pixel-body">{g.title}</strong>
                      <p className="text-slate-400 font-pixel-body text-sm mt-1">{g.description}</p>
                    </div>
                    <button onClick={() => deleteGuide(g.id)} className="p-2 bg-red-900/30 text-red-400 hover:bg-red-500 hover:text-white border border-red-800 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'logs' && (
          <div className="pixel-border bg-slate-900/70 backdrop-blur-sm border-t-2 border-t-cyan-500/30 p-5 space-y-4">
            <h3 className="font-pixel text-[9px] text-slate-400 flex items-center gap-2"><Clock className="w-4 h-4 text-cyan-400" /> GLOBAL TRANSACTION LOGS</h3>
            {allLogs.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                <span className="font-pixel text-[8px] text-slate-600">BELUM ADA LOG TRANSAKSI</span>
              </div>
            ) : (
              <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                {allLogs.map((log: any, i: number) => (
                  <div key={i} className={`flex justify-between items-center p-3 bg-slate-800/50 border-l-4 ${log.type === 'earn' ? 'border-green-500' : 'border-purple-500'}`}>
                    <div>
                      <div className="font-pixel text-[9px] text-slate-300 flex items-center gap-2">
                        <span>{log.user.name}</span>
                        <span className="text-slate-500">#{log.user.nim}</span>
                      </div>
                      <p className="font-pixel-body text-slate-400 text-sm">{log.desc}</p>
                      <span className="font-pixel text-[7px] text-slate-600">{log.date}</span>
                    </div>
                    <div className={`font-pixel text-[9px] ${log.type === 'earn' ? 'text-green-400' : 'text-purple-400'}`}>
                      {log.type === 'earn' ? '+' : '-'}{log.amount} XP
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="border-t-2 border-slate-800 bg-slate-900/40 px-4 py-3 text-center relative z-10 backdrop-blur-sm">
        <p className="font-pixel text-[7px] text-slate-500">SYSTEM_VERSION: 1.0.42_STABLE // RVM_CORE_ONLINE</p>
      </footer>
    </div>
  );
}
