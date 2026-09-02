const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf-8');

const wrongScope = `
  const addFaq = async (data: any) => {
    try { await api.post('/faqs', data); toast.success('FAQ ditambahkan'); refreshData(); } 
    catch { toast.error('Gagal menambahkan FAQ'); }
  };
  const updateFaq = async (id: string, data: any) => {
    try { await api.put(\`/faqs/\${id}\`, data); toast.success('FAQ diperbarui'); refreshData(); } 
    catch { toast.error('Gagal memperbarui FAQ'); }
  };
  const deleteFaq = async (id: string) => {
    try { await api.delete(\`/faqs/\${id}\`); toast.success('FAQ dihapus'); refreshData(); } 
    catch { toast.error('Gagal menghapus FAQ'); }
  };
  const addGuide = async (data: any) => {
    try { await api.post('/guides', data); toast.success('Guide ditambahkan'); refreshData(); } 
    catch { toast.error('Gagal menambahkan Guide'); }
  };
  const updateGuide = async (id: string, data: any) => {
    try { await api.put(\`/guides/\${id}\`, data); toast.success('Guide diperbarui'); refreshData(); } 
    catch { toast.error('Gagal memperbarui Guide'); }
  };
  const deleteGuide = async (id: string) => {
    try { await api.delete(\`/guides/\${id}\`); toast.success('Guide dihapus'); refreshData(); } 
    catch { toast.error('Gagal menghapus Guide'); }
  };`;

// Remove the wrong scope block
code = code.replace(wrongScope, '');

// Change to patch and add before `return (`
const fixedActions = `
  const addFaq = async (data: any) => {
    try { await api.post('/faqs', data); toast.success('FAQ ditambahkan'); refreshData(); } 
    catch { toast.error('Gagal menambahkan FAQ'); }
  };
  const updateFaq = async (id: string, data: any) => {
    try { await api.patch(\`/faqs/\${id}\`, data); toast.success('FAQ diperbarui'); refreshData(); } 
    catch { toast.error('Gagal memperbarui FAQ'); }
  };
  const deleteFaq = async (id: string) => {
    try { await api.delete(\`/faqs/\${id}\`); toast.success('FAQ dihapus'); refreshData(); } 
    catch { toast.error('Gagal menghapus FAQ'); }
  };
  const addGuide = async (data: any) => {
    try { await api.post('/guides', data); toast.success('Guide ditambahkan'); refreshData(); } 
    catch { toast.error('Gagal menambahkan Guide'); }
  };
  const updateGuide = async (id: string, data: any) => {
    try { await api.patch(\`/guides/\${id}\`, data); toast.success('Guide diperbarui'); refreshData(); } 
    catch { toast.error('Gagal memperbarui Guide'); }
  };
  const deleteGuide = async (id: string) => {
    try { await api.delete(\`/guides/\${id}\`); toast.success('Guide dihapus'); refreshData(); } 
    catch { toast.error('Gagal menghapus Guide'); }
  };

  return (`;

code = code.replace('  return (', fixedActions);

fs.writeFileSync('src/store.tsx', code);
console.log('Store scope and methods fixed!');
