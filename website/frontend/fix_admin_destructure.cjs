const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

code = code.replace(
  'faqs, guides, addFaq, updateFaq, deleteFaq, addGuide, updateGuide, deleteGuide } = useAppStore();',
  'faqs, guides, addFaq, deleteFaq, addGuide, deleteGuide } = useAppStore();'
);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
console.log('Admin destructure fixed!');
