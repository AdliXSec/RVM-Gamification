const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf-8');

code = code.replace(
  "{ key: 'logs', label: 'GLOBAL_LOGS', icon: <Clock className=\"w-3 h-3\" /> },",
  "{ key: 'logs', label: 'GLOBAL_LOGS', icon: <Clock className=\"w-3 h-3\" /> },\n            { key: 'content', label: 'CONTENT', icon: <HelpCircle className=\"w-3 h-3\" /> },"
);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
console.log('Admin menu array updated!');
