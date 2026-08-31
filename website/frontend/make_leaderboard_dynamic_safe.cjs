const fs = require('fs');
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf-8');

// 1. Add api import
if (!code.includes("import api from '../lib/api';")) {
  code = code.replace("import { useAppStore } from '../store';", "import { useAppStore } from '../store';\nimport api from '../lib/api';");
}

// 2. Add state inside LandingPage
const stateHook = `
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    api.get('/users/leaderboard')
      .then(res => {
        if (res.data && res.data.leaderboard) {
          setLeaderboard(res.data.leaderboard);
        }
      })
      .catch(err => console.error('Failed to fetch leaderboard', err));
  }, []);
`;
code = code.replace('  const frameCount = 240;', '  const frameCount = 240;\n' + stateHook);

// 3. Replace Static Data with Dynamic Expressions safely
// Rank 2
code = code.replace('>Budi Santoso</h3>', '>{leaderboard[1] ? leaderboard[1].name : "Menunggu..."}</h3>');
code = code.replace('>Fakultas Teknik</p>', '>{leaderboard[1] ? `Level ${leaderboard[1].level || Math.floor((leaderboard[1].points || 0)/500) + 1}` : "..."}</p>');
code = code.replace('>12,450 XP<', '>{leaderboard[1] ? (leaderboard[1].points || 0).toLocaleString() : 0} XP<');

// Rank 1
code = code.replace('>Siti Aminah</h3>', '>{leaderboard[0] ? leaderboard[0].name : "Menunggu..."}</h3>');
code = code.replace('>Fakultas Rekayasa Industri</p>', '>{leaderboard[0] ? `Level ${leaderboard[0].level || Math.floor((leaderboard[0].points || 0)/500) + 1}` : "..."}</p>');
code = code.replace('>15,800 XP<', '>{leaderboard[0] ? (leaderboard[0].points || 0).toLocaleString() : 0} XP<');

// Rank 3
code = code.replace('>Andi Wijaya</h3>', '>{leaderboard[2] ? leaderboard[2].name : "Menunggu..."}</h3>');
code = code.replace('>Fakultas Informatika</p>', '>{leaderboard[2] ? `Level ${leaderboard[2].level || Math.floor((leaderboard[2].points || 0)/500) + 1}` : "..."}</p>');
code = code.replace('>10,200 XP<', '>{leaderboard[2] ? (leaderboard[2].points || 0).toLocaleString() : 0} XP<');

fs.writeFileSync('src/components/LandingPage.tsx', code);
console.log('Safe dynamic replacements complete!');
