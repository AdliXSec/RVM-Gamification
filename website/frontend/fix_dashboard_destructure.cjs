const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf-8');
code = code.replace(
  'const { currentUser, users, stats, machines, rewards, logout, redeemReward, settings, notifications } = useAppStore();',
  'const { currentUser, users, stats, machines, rewards, logout, redeemReward, settings, notifications, guides } = useAppStore();'
);
// Also fix typescript 'any' in Dashboard guides
code = code.replace(
  'guides.sort((a,b)=>a.step_number - b.step_number).map(g => (',
  'guides.sort((a:any, b:any)=>a.step_number - b.step_number).map((g:any) => ('
);
fs.writeFileSync('src/components/Dashboard.tsx', code);
