const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

// 1. Add faqs, guides, and their actions to useAppStore
code = code.replace(
  'settings, updateSetting } = useAppStore();',
  'settings, updateSetting, faqs, guides, addFaq, updateFaq, deleteFaq, addGuide, updateGuide, deleteGuide } = useAppStore();'
);

// 2. Add tabs
code = code.replace(
  "const [tab, setTab] = useState<'ops' | 'users' | 'catalog' | 'logs'>('ops');",
  "const [tab, setTab] = useState<'ops' | 'users' | 'catalog' | 'logs' | 'content'>('ops');"
);

// 3. Add icon imports
code = code.replace(
  'Activity, Wrench, Clock, Star }',
  'Activity, Wrench, Clock, Star, Edit, HelpCircle }'
);

// 4. Add "content" tab button
code = code.replace(
  '<button onClick={() => setTab(\'logs\')}',
  `<button onClick={() => setTab('content')} className={\`font-pixel text-[10px] px-3 md:px-4 py-3 md:py-4 transition-colors \${tab === 'content' ? 'bg-slate-700 text-white border-b-4 border-white' : 'text-slate-400 hover:text-slate-200'}\`}>
              <HelpCircle className="w-4 h-4 mx-auto mb-1" /> KONTEN
            </button>
            <button onClick={() => setTab('logs')}`
);

// 5. Add Content Management UI forms state
const contentState = `
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
`;
code = code.replace('  const handleAddBottles', contentState + '\n  const handleAddBottles');

// 6. Add Content UI inside the render block
const contentUi = `
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
`;

code = code.replace(
  "{tab === 'logs' && (",
  contentUi + "\n        {tab === 'logs' && ("
);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
console.log('AdminPanel updated with Content Tab!');
