import React, { createContext, useContext, useState } from 'react';
import { toast } from 'sonner';

export type Transaction = { 
  id: string; 
  type: 'earn' | 'redeem'; 
  desc: string; 
  amount: number; 
  date: string; 
  status?: 'pending' | 'completed' | 'cancelled' 
};

export type User = { 
  id: string; 
  name: string;
  nim: string;
  role: 'student' | 'admin'; 
  points: number; 
  character: string;
  history: Transaction[] 
};

export type Ticket = { 
  id: string; 
  capacityAtIssue: number; 
  status: 'Pending' | 'Accepted' | 'Completed'; 
  date: string 
};

export type RewardItem = {
  id: string;
  name: string;
  cost: number;
  desc: string;
  color: string;
};

interface AppState {
  currentUser: User | null;
  users: User[];
  machine: { capacity: number; status: 'Online' | 'Full' | 'Maintenance' };
  tickets: Ticket[];
  stats: { totalBottles: number; totalCO2: number; totalFilament: number };
  rewards: RewardItem[];
  login: (name: string, role: 'student' | 'admin') => void;
  register: (name: string, nim: string, character: string) => void;
  logout: () => void;
  adminAddBottles: (userId: string, bottles: number) => void;
  setMachineCapacity: (capacity: number) => void;
  acceptTicket: (ticketId: string) => void;
  completeTicket: (ticketId: string) => void;
  redeemReward: (cost: number, itemName: string) => void;
  updateRewardStatus: (userId: string, txId: string, status: 'completed' | 'cancelled') => void;
  addReward: (name: string, cost: number, desc: string) => void;
  deleteReward: (id: string) => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([
    { id: 'u1', name: 'Naufal', nim: '120220001', role: 'student', points: 1250, character: 'ninja.png', history: [] },
    { id: 'u2', name: 'Budi', nim: '120220002', role: 'student', points: 300, character: 'knight.png', history: [] },
    { id: 'u3', name: 'Siti', nim: '120220003', role: 'student', points: 800, character: 'girl.png', history: [] },
    { id: 'u4', name: 'Joko', nim: '120220004', role: 'student', points: 1500, character: 'plague.png', history: [] },
  ]);
  const [machine, setMachine] = useState<{ capacity: number; status: 'Online' | 'Full' | 'Maintenance' }>({ capacity: 45, status: 'Online' });
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState({ totalBottles: 15420, totalCO2: 616.8, totalFilament: 3084 });
  const [rewards, setRewards] = useState<RewardItem[]>([
    { id: 'r1', name: 'Voucher Kantin Rp10.000', cost: 1000, desc: 'Berlaku selama semester ganjil 2026.', color: 'bg-orange-100 text-orange-600' },
    { id: 'r2', name: 'Potongan Biaya UKT 50k', cost: 5000, desc: 'Berlaku selama semester ganjil 2026.', color: 'bg-blue-100 text-blue-600' },
    { id: 'r3', name: 'Merchandise Tumbler', cost: 2500, desc: 'Berlaku selama semester ganjil 2026.', color: 'bg-purple-100 text-purple-600' },
  ]);

  const login = (name: string, role: 'student' | 'admin') => {
    if (role === 'admin') {
      setCurrentUser({ id: 'admin', name: 'Admin Logistik', nim: '-', role: 'admin', points: 0, character: '', history: [] });
      toast.success("Login Admin berhasil.");
    } else {
      const user = users.find(u => u.name.toLowerCase() === name.toLowerCase() || u.nim === name);
      if (!user) {
        toast.error("Akun tidak ditemukan. Silakan daftar terlebih dahulu.");
        return;
      }
      setCurrentUser(user);
      toast.success(`Selamat datang kembali, ${user.name}!`);
    }
  };

  const register = (name: string, nim: string, character: string) => {
    if (users.find(u => u.nim === nim || u.name.toLowerCase() === name.toLowerCase())) {
      toast.error("Nama/NIM ini sudah terdaftar!");
      return;
    }
    const newUser: User = { id: Date.now().toString(), name, nim, role: 'student', points: 0, character, history: [] };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    toast.success("Registrasi berhasil! Selamat datang.");
  };

  const logout = () => setCurrentUser(null);

  const setMachineCapacity = (capacity: number) => {
    let status = machine.status;
    if (capacity >= 100) status = 'Full';
    else if (capacity < 100 && machine.status === 'Full') status = 'Online';
    setMachine({ capacity, status });
    toast.success(`Kapasitas diubah ke ${capacity}%`);
  };

  const adminAddBottles = (userId: string, bottles: number) => {
    const newCapacity = Math.min(machine.capacity + bottles, 100);
    const addedCapacity = newCapacity - machine.capacity;
    if (addedCapacity <= 0) {
      toast.error("Mesin sudah penuh! Selesaikan pick-up ticket dulu.");
      return;
    }

    const earnedPoints = addedCapacity * 100;
    setStats(prev => ({
      totalBottles: prev.totalBottles + addedCapacity,
      totalCO2: prev.totalCO2 + (addedCapacity * 0.04),
      totalFilament: prev.totalFilament + (addedCapacity * 0.2)
    }));

    setMachine({
      capacity: newCapacity,
      status: newCapacity === 100 ? 'Full' : 'Online'
    });

    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const tx: Transaction = {
          id: Date.now().toString(),
          type: 'earn',
          desc: `Setor ${addedCapacity} Botol (Admin Input)`,
          amount: earnedPoints,
          date: new Date().toLocaleString(),
          status: 'completed'
        };
        if (currentUser?.id === u.id) {
          setCurrentUser({ ...u, points: u.points + earnedPoints, history: [tx, ...u.history] });
        }
        return { ...u, points: u.points + earnedPoints, history: [tx, ...u.history] };
      }
      return u;
    }));

    toast.success(`Berhasil menambahkan ${addedCapacity} botol untuk user.`);

    if (newCapacity >= 80) {
      if (!tickets.find(t => t.status !== 'Completed')) {
        const newTicket: Ticket = {
          id: `TCK-${Math.floor(Math.random() * 1000)}`,
          capacityAtIssue: newCapacity,
          status: 'Pending',
          date: new Date().toLocaleString()
        };
        setTickets([newTicket, ...tickets]);
        toast.warning("ALARM SOP: Mesin mencapai >= 80%. Pick-up Ticket otomatis dibuat!");
      }
    }
  };

  const acceptTicket = (ticketId: string) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'Accepted' } : t));
    setMachine(prev => ({ ...prev, status: 'Maintenance' }));
    toast.info("Tugas dikunci. Silakan menuju lokasi untuk evakuasi botol.");
  };

  const completeTicket = (ticketId: string) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'Completed' } : t));
    setMachine({ capacity: 0, status: 'Online' });
    toast.success("Evakuasi Selesai. Kapasitas kembali 0% dan mesin Online.");
  };

  const redeemReward = (cost: number, itemName: string) => {
    if (!currentUser || currentUser.points < cost) {
      toast.error("Poin tidak cukup!");
      return;
    }
    const tx: Transaction = {
      id: Date.now().toString(),
      type: 'redeem',
      desc: `Tukar Reward: ${itemName}`,
      amount: cost,
      date: new Date().toLocaleString(),
      status: 'pending'
    };
    const updatedUser = { 
      ...currentUser, 
      points: currentUser.points - cost, 
      history: [tx, ...currentUser.history] 
    };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    toast.info(`Permintaan penukaran ${itemName} telah dikirim ke Admin.`);
  };

  const updateRewardStatus = (userId: string, txId: string, status: 'completed' | 'cancelled') => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const txIndex = u.history.findIndex(t => t.id === txId);
        if (txIndex > -1) {
          const newHistory = [...u.history];
          const tx = { ...newHistory[txIndex], status };
          newHistory[txIndex] = tx;
          
          let newPoints = u.points;
          if (status === 'cancelled') {
            newPoints += tx.amount;
          }

          const updatedUser = { ...u, points: newPoints, history: newHistory };
          if (currentUser?.id === u.id) {
            setCurrentUser(updatedUser);
          }
          return updatedUser;
        }
      }
      return u;
    }));
    toast.success(`Status reward diperbarui menjadi ${status.toUpperCase()}.`);
  };

  const addReward = (name: string, cost: number, desc: string) => {
    const colors = ['bg-green-100 text-green-600', 'bg-rose-100 text-rose-600', 'bg-amber-100 text-amber-600', 'bg-cyan-100 text-cyan-600', 'bg-indigo-100 text-indigo-600'];
    const color = colors[rewards.length % colors.length];
    setRewards([...rewards, { id: Date.now().toString(), name, cost, desc, color }]);
    toast.success(`Reward "${name}" berhasil ditambahkan!`);
  };

  const deleteReward = (id: string) => {
    setRewards(rewards.filter(r => r.id !== id));
    toast.success("Reward dihapus dari katalog.");
  };

  return (
    <AppContext.Provider value={{ currentUser, users, machine, tickets, stats, rewards, login, register, logout, adminAddBottles, setMachineCapacity, acceptTicket, completeTicket, redeemReward, updateRewardStatus, addReward, deleteReward }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("Must use AppProvider");
  return context;
};
