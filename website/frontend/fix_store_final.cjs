const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf-8');

// 1. Erase the broken block between mediaQuery.addEventListener and return ()
const badBlock = /mediaQuery\.addEventListener\('change', handleChange\);[\s\S]*?return \(\) => mediaQuery\.removeEventListener\('change', handleChange\);/;
const goodBlock = `mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);`;
code = code.replace(badBlock, goodBlock);

// 2. Inject the methods right before the final return (
const finalReturn = '  return (\n    <AppContext.Provider';
const correctMethods = `
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

  return (
    <AppContext.Provider`;

code = code.replace(finalReturn, correctMethods);

fs.writeFileSync('src/store.tsx', code);
console.log('Store fixed for good!');
