import { useState } from 'react';
import { useAppStore } from '../store';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Recycle } from 'lucide-react';

const CHARACTERS = [
  'ninja.png', 'knight.png', 'girl.png', 'banana.png', 'plague.png', 'shepherd.png'
];

export default function Auth({ mode }: { mode: 'login' | 'register' }) {
  const { login, register } = useAppStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'student' | 'admin'>(mode === 'login' ? 'student' : 'student');
  const [name, setName] = useState('');
  const [nim, setNim] = useState('');
  const [selectedChar, setSelectedChar] = useState(CHARACTERS[0]);

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    login(name, 'student');
  };
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !nim) return;
    register(name, nim, selectedChar);
  };
  const handleAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    login('admin', 'admin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[hsl(220,15%,7%)] p-4 py-20 scanlines relative">
      {/* Background Image Layer */}
      <div 
        className="fixed inset-0 w-full h-full bg-slate-900/80 bg-[url('/bg.jpeg')] bg-cover md:bg-[length:100%_100%] bg-center bg-blend-multiply pointer-events-none z-0"
      />

      <Link to="/" className="fixed top-6 left-6 font-pixel text-[9px] text-slate-300 hover:text-green-400 flex items-center gap-2 z-10 bg-slate-900/50 p-2 rounded pixel-border">
        <ArrowLeft className="w-4 h-4" /> BACK
      </Link>

      <div className="w-full max-w-sm space-y-6 z-10 my-8">
        <div className="text-center space-y-3">
          <div className="pixel-float inline-block">
            <img src="/recycle.png" alt="Logo" className="w-14 h-14 mx-auto object-contain" />
          </div>
          <h1 className="font-pixel text-slate-100 text-sm drop-shadow-md">RVM QUEST</h1>
          <p className="font-pixel-body text-slate-300 text-lg">
            {mode === 'login' ? 'Masuk ke akunmu' : 'Buat akun baru'}
          </p>
        </div>

        {mode === 'login' ? (
          <>
            <div className="grid grid-cols-2 gap-1 p-1 bg-[hsl(220,10%,10%)] pixel-border">
              <button onClick={() => setTab('student')}
                className={`font-pixel text-[8px] py-2.5 transition-colors ${tab === 'student' ? 'bg-green-800 text-green-100' : 'text-slate-600 hover:text-slate-400'}`}>
                MAHASISWA
              </button>
              <button onClick={() => setTab('admin')}
                className={`font-pixel text-[8px] py-2.5 transition-colors ${tab === 'admin' ? 'bg-slate-700 text-slate-100' : 'text-slate-600 hover:text-slate-400'}`}>
                ADMIN
              </button>
            </div>

            <div className="pixel-border bg-[hsl(220,12%,11%)] p-6">
              {tab === 'student' ? (
                <form onSubmit={handleStudentLogin} className="space-y-5">
                  <div className="space-y-2">
                    <label className="font-pixel text-[8px] text-slate-500">NAMA / NIM</label>
                    <input className="pixel-input w-full px-3 py-2" placeholder="Misal: Naufal" value={name} onChange={e => setName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <label className="font-pixel text-[8px] text-slate-500">PASSWORD</label>
                    <input className="pixel-input w-full px-3 py-2" type="password" placeholder="***" defaultValue="pass" />
                  </div>
                  <button type="submit" className="pixel-btn bg-green-700 hover:bg-green-600 text-green-100 w-full py-3">MASUK</button>
                  <p className="text-center font-pixel-body text-slate-400 text-base">
                    Belum punya akun? <Link to="/register" className="text-green-400 hover:text-green-300 font-pixel text-[8px]">DAFTAR</Link>
                  </p>
                </form>
              ) : (
                <form onSubmit={handleAdmin} className="space-y-5">
                  <div className="space-y-2">
                    <label className="font-pixel text-[8px] text-slate-500">ID PETUGAS</label>
                    <input className="pixel-input w-full px-3 py-2" defaultValue="admin" disabled />
                  </div>
                  <button type="submit" className="pixel-btn bg-slate-700 hover:bg-slate-600 text-slate-200 w-full py-3"
                    style={{boxShadow: '4px 4px 0 0 rgba(0,0,0,0.4), 4px 0 0 0 hsl(220,10%,25%), -4px 0 0 0 hsl(220,10%,25%), 0 4px 0 0 hsl(220,10%,25%), 0 -4px 0 0 hsl(220,10%,25%)'}}>
                    LOGIN ADMIN
                  </button>
                </form>
              )}
            </div>
          </>
        ) : (
          <div className="pixel-border bg-[hsl(220,12%,11%)] p-6">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <label className="font-pixel text-[8px] text-slate-500">NAMA</label>
                <input className="pixel-input w-full px-3 py-2" placeholder="Nama Lengkap" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label className="font-pixel text-[8px] text-slate-500">NIM</label>
                <input className="pixel-input w-full px-3 py-2" placeholder="NIM Mahasiswa" value={nim} onChange={e => setNim(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label className="font-pixel text-[8px] text-slate-500">EMAIL</label>
                <input className="pixel-input w-full px-3 py-2" type="email" placeholder="Email Kampus" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="font-pixel text-[8px] text-slate-500">PASSWORD</label>
                  <input className="pixel-input w-full px-3 py-2" type="password" placeholder="***" required />
                </div>
                <div className="space-y-2">
                  <label className="font-pixel text-[8px] text-slate-500">REPEAT PASS</label>
                  <input className="pixel-input w-full px-3 py-2" type="password" placeholder="***" required />
                </div>
              </div>
              
              <div className="space-y-2 pt-2 border-t-2 border-[hsl(220,12%,16%)]">
                <label className="font-pixel text-[8px] text-slate-500">PILIH AVATAR QUEST</label>
                <div className="grid grid-cols-3 gap-2">
                  {CHARACTERS.map(c => (
                    <button 
                      key={c} type="button" 
                      onClick={() => setSelectedChar(c)}
                      className={`p-2 pixel-border transition-colors ${selectedChar === c ? 'bg-green-900/40 border-green-500' : 'bg-[hsl(220,12%,14%)] hover:bg-[hsl(220,12%,16%)]'}`}
                    >
                      <img src={`/character/${c}`} alt={c} className="h-10 w-10 object-contain mx-auto" />
                    </button>
                  ))}
                </div>
              </div>
              
              <button type="submit" className="pixel-btn bg-blue-700 hover:bg-blue-600 text-blue-100 w-full py-3 mt-4"
                style={{boxShadow: '4px 4px 0 0 rgba(0,0,0,0.4), 4px 0 0 0 hsl(220,50%,25%), -4px 0 0 0 hsl(220,50%,25%), 0 4px 0 0 hsl(220,50%,25%), 0 -4px 0 0 hsl(220,50%,25%)'}}>
                DAFTAR
              </button>
              <p className="text-center font-pixel-body text-slate-400 text-base">
                Sudah punya akun? <Link to="/login" className="text-green-400 hover:text-green-300 font-pixel text-[8px]">MASUK</Link>
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
