import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import api from './lib/api';

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
  role: 'student' | 'admin' | 'officer'; 
  points: number; 
  character: string;
  history: Transaction[] 
};

export type Ticket = { 
  machineName: string;
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
  machine: { id: string; maxCapacity: number; currentBottles: number; status: 'Online' | 'Full' | 'Maintenance', name?: string, location?: string };
  machines: any[];
  setActiveMachine: (id: string) => void;
  tickets: Ticket[];
  stats: { totalBottles: number; totalCO2: number; totalFilament: number };
  rewards: RewardItem[];
  redemptions: any[]; // for admin to see pending redemptions
  allLogs: any[];
  notifications: any[];
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  settings: Record<string, string>;
  updateSetting: (key: string, value: string) => Promise<void>;
  students: { id: string; name: string; nim: string }[];
  
  // Actions
  login: (email: string, pass: string) => Promise<boolean>;
  register: (name: string, nim: string, email: string, pass: string, character: string) => Promise<boolean>;
  logout: () => void;
  adminAddBottles: (userId: string, machineId: string, bottles: number) => Promise<void>;
  setMachineMaxCapacity: (max: number) => Promise<void>;
  addMachine: (name: string, location: string, maxCapacity: number) => Promise<void>;
  deleteMachine: (id: string) => Promise<void>;
  acceptTicket: (ticketId: string) => Promise<void>;
  completeTicket: (ticketId: string) => Promise<void>;
  redeemReward: (cost: number, rewardId: string) => Promise<void>;
  updateRewardStatus: (redemptionId: string, status: 'completed' | 'cancelled') => Promise<void>;
  addReward: (name: string, cost: number, desc: string) => Promise<void>;
  deleteReward: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]); // leaderboard
  const [students, setStudents] = useState<AppState['students']>([]);
  const [machine, setMachine] = useState<AppState['machine']>({ id: '1', maxCapacity: 250, currentBottles: 0, status: 'Online' });
  const [machines, setMachines] = useState<any[]>([]);
  const setActiveMachine = (id: string) => {
    const m = machines.find((m: any) => m.id == id);
    if (m) setMachine({ id: m.id.toString(), maxCapacity: m.max_capacity, currentBottles: m.current_bottles, status: m.status === 'online' ? 'Online' : (m.status === 'full' ? 'Full' : 'Maintenance'), name: m.name, location: m.location });
  };
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState({ totalBottles: 0, totalCO2: 0, totalFilament: 0 });
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [redemptions, setRedemptions] = useState<any[]>([]);
  const [allLogs, setAllLogs] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({ 'xp_per_bottle': '100' });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme_preference');
    if (saved) return saved as 'light' | 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme_preference')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // We do NOT save to localStorage here automatically, 
    // so it continues to follow system preference until manually toggled.
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      const nextTheme = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme_preference', nextTheme); // User explicitly sets preference
      return nextTheme;
    });
  };


  const colors = ['bg-green-100 text-green-600', 'bg-rose-100 text-rose-600', 'bg-amber-100 text-amber-600', 'bg-cyan-100 text-cyan-600', 'bg-indigo-100 text-indigo-600'];

  const refreshData = async () => {
    try {
      const notifRes = await api.get('/notifications').catch(()=>null);
      if (notifRes?.data?.notifications) setNotifications(notifRes.data.notifications);
      
      const setRes = await api.get('/settings').catch(()=>null);
      if(setRes?.data?.settings) setSettings(setRes.data.settings);
    } catch(e) { console.error('Settings err:', e); }

    try {
      const ldRes = await api.get('/users/leaderboard');
      if (ldRes.data?.leaderboard) setUsers(ldRes.data.leaderboard.map((u: any) => ({ ...u, history: [] })));
    } catch(e) { console.error('Leaderboard err:', e); }

    try {
      const statRes = await api.get('/users/campus-stats');
      const st = statRes.data?.stats;
      if (st) setStats({ totalBottles: st.total_bottles, totalCO2: st.total_co2_saved, totalFilament: st.total_filament });
    } catch(e) { console.error('Stats err:', e); }

    try {
      const mRes = await api.get('/machines');
      if (mRes.data?.machines?.length > 0) {
        setMachines(mRes.data.machines);
        setMachine(prev => {
          const match = mRes.data.machines.find((x: any) => x.id == prev.id) || mRes.data.machines[0];
          if(!match) return prev;
          return { id: match.id.toString(), maxCapacity: match.max_capacity, currentBottles: match.current_bottles, status: match.status === 'online' ? 'Online' : (match.status === 'full' ? 'Full' : 'Maintenance'), name: match.name, location: match.location };
        });
      }
    } catch(e) { console.error('Machines err:', e); }

    try {
      const rRes = await api.get('/rewards');
      if (rRes.data?.rewards) setRewards(rRes.data.rewards.map((r: any, i: number) => ({
        id: r.id, name: r.name, cost: r.cost, desc: r.description || '', color: colors[i % colors.length]
      })));
    } catch(e) { console.error('Rewards err:', e); }

    try {
      const token = localStorage.getItem('token');
      if (token && currentUser) {
         if (currentUser.role === 'admin' || currentUser.role === 'officer') {
            const tRes = await api.get('/tickets');
            if (tRes.data?.tickets) setTickets(tRes.data.tickets.map((t: any) => ({
              id: t.id, machineName: t.machine?.name || 'RVM', capacityAtIssue: t.capacity_at_issue, status: t.status === 'pending' ? 'Pending' : (t.status === 'accepted' ? 'Accepted' : 'Completed'), date: t.created_at
            })));

            if (currentUser.role === 'admin') {
              const pendRes = await api.get('/rewards/redemptions/pending');
              if (pendRes.data?.redemptions) setRedemptions(pendRes.data.redemptions);
              const studRes = await api.get('/users/students');
              if (studRes.data?.students) setStudents(studRes.data.students);

              const logsRes = await api.get('/users/history/all');
              const logsData = logsRes.data?.data || logsRes.data || [];
              if (Array.isArray(logsData)) setAllLogs(logsData.map((tx: any) => ({ id: tx.id, date: tx.created_at, type: tx.type, amount: tx.amount, desc: tx.description, status: tx.status, user: tx.user })));
            }
         }
         
         const hRes = await api.get('/users/history');
         const historyData = hRes.data?.data || hRes.data || [];
         const history = Array.isArray(historyData) ? historyData.map((tx: any) => ({
             id: tx.id, date: tx.created_at, type: tx.type, amount: tx.amount, desc: tx.description, status: tx.status
         })) : [];
         
         const me = await api.get('/auth/me');
         if (me.data?.user) setCurrentUser({ ...me.data.user, history });
      }
    } catch (err) {
      console.error("Auth data err:", err);
    }
  };

  useEffect(() => {
    // Initial Auth Check
    const init = async () => {
      const setRes = await api.get('/settings').catch(()=>null);
      if(setRes?.data?.settings) setSettings(setRes.data.settings);
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setCurrentUser({ ...res.data.user, history: [] });
        } catch {
          localStorage.removeItem('token');
        }
      }
      refreshData();
    };
    init();
    
    // Poll data every 10s
    const interval = setInterval(refreshData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Make sure refreshData runs when currentUser changes (e.g. after login)
  useEffect(() => {
    if (currentUser) {
      refreshData();
    }
  }, [currentUser?.id]);


  const login = async (email: string, pass: string) => {
    try {
      const res = await api.post('/auth/login', { email, password: pass });
      localStorage.setItem('token', res.data.token.access_token);
      setCurrentUser({ ...res.data.user, history: [] });
      toast.success("Login berhasil.");
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login gagal");
      return false;
    }
  };

  const register = async (name: string, nim: string, email: string, pass: string, character: string) => {
    try {
      const res = await api.post('/auth/register', { name, nim, email, password: pass, password_confirmation: pass, character });
      localStorage.setItem('token', res.data.token.access_token);
      const u = res.data.user;
      setCurrentUser({ ...u, points: u.points ?? 0, history: [] });
      toast.success("Registrasi berhasil!");
      return true;
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registrasi gagal");
      return false;
    }
  };

  const logout = async () => {
    try {
       await api.post('/auth/logout');
    } catch {}
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  
  const updateSetting = async (key: string, value: string) => {
    try {
      await api.post('/settings', { key, value });
      toast.success('Pengaturan disimpan');
      refreshData();
    } catch(e) { console.error(e); }
  };

  const setMachineMaxCapacity = async (max: number) => {
    try {
      await api.patch(`/machines/${machine.id}/capacity`, { max_capacity: max });
      toast.success(`Max kapasitas alat diubah.`);
      refreshData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal mengubah kapasitas.");
    }
  };

  const adminAddBottles = async (userId: string, machineId: string, bottles: number) => {
    try {
      await api.post(`/machines/${machineId}/deposit`, { user_id: userId, bottles });
      toast.success(`Berhasil menambahkan ${bottles} botol.`);
      refreshData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal menambah botol.");
    }
  };

  const acceptTicket = async (ticketId: string) => {
    try {
      await api.patch(`/tickets/${ticketId}/accept`);
      toast.info("Tugas dikunci. Silakan menuju lokasi.");
      refreshData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal menerima tiket");
    }
  };

  const completeTicket = async (ticketId: string) => {
    try {
      await api.patch(`/tickets/${ticketId}/complete`);
      toast.success("Evakuasi Selesai.");
      refreshData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal menyelesaikan");
    }
  };

  const redeemReward = async (_cost: number, rewardId: string) => {
    try {
      await api.post(`/rewards/${rewardId}/redeem`);
      toast.info(`Permintaan penukaran berhasil dikirim.`);
      refreshData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal menukar reward.");
    }
  };

  const updateRewardStatus = async (redemptionId: string, status: 'completed' | 'cancelled') => {
    try {
      await api.patch(`/rewards/redemptions/${redemptionId}`, { status });
      toast.success(`Status reward diperbarui.`);
      refreshData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal memperbarui status.");
    }
  };

  const addReward = async (name: string, cost: number, desc: string) => {
    try {
      await api.post('/rewards', { name, cost, description: desc, is_active: true });
      toast.success(`Reward "${name}" berhasil ditambahkan!`);
      refreshData();
    } catch (err: any) {
      toast.error("Gagal menambah reward");
    }
  };


  const addMachine = async (name: string, location: string, maxCapacity: number) => {
    try {
      await api.post('/machines', { name, location, max_capacity: maxCapacity });
      refreshData();
    } catch(e) { console.error(e); }
  };

  const deleteMachine = async (id: string) => {
    try {
      if (!window.confirm('Yakin ingin menghapus mesin ini? Semua data terkait (termasuk tiket) bisa terhapus.')) return;
      await api.delete(`/machines/${id}`);
      refreshData();
    } catch(e) { console.error(e); }
  };

  const deleteReward = async (id: string) => {
    try {
      await api.delete(`/rewards/${id}`);
      toast.success("Reward dihapus.");
      refreshData();
    } catch (err: any) {
      toast.error("Gagal menghapus reward");
    }
  };

  return (
    <AppContext.Provider value={{ 
      currentUser, users, students, machine, tickets, stats, rewards, redemptions, allLogs, notifications, machines,
      login, register, logout, adminAddBottles, setMachineMaxCapacity, 
      acceptTicket, completeTicket, redeemReward, updateRewardStatus, addReward, deleteReward, refreshData, setActiveMachine, addMachine, deleteMachine, settings, updateSetting, theme, toggleTheme 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("Must use AppProvider");
  return context;
};
