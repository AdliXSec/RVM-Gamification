import { useState } from 'react';
import { useAppStore } from '../store';
import { LogOut, Trash2, Settings, AlertTriangle, CheckCircle, Users, Gift, Tag, Activity, Wrench, Clock } from 'lucide-react';

export default function AdminPanel() {
  const { machine, tickets, users, rewards, logout, adminAddBottles, acceptTicket, completeTicket, updateRewardStatus, addReward, deleteReward, setMachineMaxCapacity } = useAppStore();

  const [tab, setTab] = useState<'ops' | 'users' | 'catalog' | 'logs'>('ops');
  const [selectedUser, setSelectedUser] = useState('');
  const [bottleAmount, setBottleAmount] = useState('10');
  const [newName, setNewName] = useState('');
  const [newCost, setNewCost] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [editCapacity, setEditCapacity] = useState(machine.maxCapacity.toString());

  const handleAddBottles = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !bottleAmount) return;
    adminAddBottles(selectedUser, parseInt(bottleAmount));
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

  const pendingRewards = users.flatMap(u =>
    u.history.filter(tx => tx.type === 'redeem' && tx.status === 'pending').map(tx => ({ user: u, tx }))
  );
  const studentUsers = users.filter(u => u.role === 'student');
  const allLogs = users.flatMap(u => u.history.map(tx => ({ user: u, tx }))).sort((a, b) => new Date(b.tx.date).getTime() - new Date(a.tx.date).getTime());

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
              <h3 className="font-pixel text-[9px] text-slate-400 flex items-center gap-2"><Activity className="w-4 h-4 text-green-500" /> STATUS MESIN GEDUNG A</h3>
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
                      <span className="font-pixel text-[9px] text-orange-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> {ticket.id}</span>
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
                  <label className="font-pixel text-[7px] text-slate-500">PILIH MAHASISWA</label>
                  <select className="pixel-input w-full px-3 py-2" value={selectedUser} onChange={e => setSelectedUser(e.target.value)} required>
                    <option value="">-- Pilih --</option>
                    {studentUsers.map(u => (<option key={u.id} value={u.id}>{u.name} ({u.points} xp)</option>))}
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
              {pendingRewards.length === 0 ? (
                <div className="text-center py-8">
                  <Gift className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                  <span className="font-pixel text-[8px] text-slate-600">TIDAK ADA PERMINTAAN</span>
                </div>
              ) : (
                pendingRewards.map((req, i) => (
                  <div key={i} className="bg-[hsl(270,8%,9%)] border-l-4 border-purple-600 p-4 space-y-3">
                    <div>
                      <span className="font-pixel text-[9px] text-purple-300">{req.user.name}</span>
                      <p className="font-pixel-body text-slate-500 text-base">{req.tx.desc}</p>
                      <p className="font-pixel text-[7px] text-slate-600">{req.tx.date}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => updateRewardStatus(req.user.id, req.tx.id, 'completed')}
                        className="pixel-btn flex-1 bg-green-700 hover:bg-green-600 text-green-100 py-2.5">
                        SETUJUI
                      </button>
                      <button onClick={() => updateRewardStatus(req.user.id, req.tx.id, 'cancelled')}
                        className="pixel-btn flex-1 bg-red-800 hover:bg-red-700 text-red-100 py-2.5"
                        style={{boxShadow: '4px 4px 0 0 rgba(0,0,0,0.4), 4px 0 0 0 hsl(0,40%,25%), -4px 0 0 0 hsl(0,40%,25%), 0 4px 0 0 hsl(0,40%,25%), 0 -4px 0 0 hsl(0,40%,25%)'}}>
                        TOLAK
                      </button>
                    </div>
                  </div>
                ))
              )}
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
                {allLogs.map((log, i) => (
                  <div key={i} className={`flex justify-between items-center p-3 bg-slate-800/50 border-l-4 ${log.tx.type === 'earn' ? 'border-green-500' : 'border-purple-500'}`}>
                    <div>
                      <div className="font-pixel text-[9px] text-slate-300 flex items-center gap-2">
                        <span>{log.user.name}</span>
                        <span className="text-slate-500">#{log.user.nim}</span>
                      </div>
                      <p className="font-pixel-body text-slate-400 text-sm">{log.tx.desc}</p>
                      <span className="font-pixel text-[7px] text-slate-600">{log.tx.date}</span>
                    </div>
                    <div className={`font-pixel text-[9px] ${log.tx.type === 'earn' ? 'text-green-400' : 'text-purple-400'}`}>
                      {log.tx.type === 'earn' ? '+' : '-'}{log.tx.amount} XP
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
