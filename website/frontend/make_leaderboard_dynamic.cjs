const fs = require('fs');
let code = fs.readFileSync('src/components/LandingPage.tsx', 'utf-8');

// 1. Add api import
if (!code.includes("import api from '../lib/api';")) {
  code = code.replace("import { useAppStore } from '../store';", "import { useAppStore } from '../store';\nimport api from '../lib/api';");
}

// 2. Add state inside LandingPage
const stateHook = `
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);

  useEffect(() => {
    api.get('/users/leaderboard')
      .then(res => {
        if (res.data && res.data.leaderboard) {
          setLeaderboard(res.data.leaderboard);
        }
      })
      .catch(err => console.error('Failed to fetch leaderboard', err))
      .finally(() => setLoadingLeaderboard(false));
  }, []);
`;
code = code.replace('  const frameCount = 240;', '  const frameCount = 240;\n' + stateHook);

// 3. Replace the static grid with the dynamic one
const startString = '<div className="grid md:grid-cols-3 gap-8 items-end max-w-5xl mx-auto">';
const endString = '</div>\n        </div>\n      </section>';

const startIndex = code.indexOf(startString);
const endIndex = code.indexOf(endString, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
  const dynamicLeaderboard = `
          {loadingLeaderboard ? (
            <div className="text-center font-pixel text-slate-500 animate-pulse py-10">LOADING DATA SERVER...</div>
          ) : (
          <div className="grid md:grid-cols-3 gap-8 items-end max-w-5xl mx-auto">
            {/* Rank 2 */}
            {leaderboard[1] && (
            <div className="bg-white p-6 pixel-border border-slate-300 shadow-md text-center transform hover:-translate-y-2 transition-transform">
              <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4 border-4 border-slate-300 overflow-hidden">
                {leaderboard[1].character ? (
                  <img src={\`/assets/characters/\${leaderboard[1].character}\`} alt="Avatar" className="w-16 h-16 object-cover pixel-render scale-150 mt-4" />
                ) : (
                  <span className="font-pixel text-slate-500 text-xl">#2</span>
                )}
              </div>
              <h3 className="font-pixel text-slate-800 text-sm md:text-base mb-2 truncate px-2">{leaderboard[1].name}</h3>
              <p className="font-pixel-body text-slate-500 text-lg mb-6 truncate px-2">Level {leaderboard[1].level || Math.floor((leaderboard[1].points || 0)/500) + 1}</p>
              <div className="bg-slate-100 text-slate-700 py-3 pixel-border border-slate-200 font-bold font-pixel-body text-xl md:text-2xl">
                {(leaderboard[1].points || 0).toLocaleString()} XP
              </div>
            </div>
            )}

            {/* Rank 1 */}
            {leaderboard[0] && (
            <div className="bg-white p-8 pixel-border border-yellow-400 shadow-2xl text-center transform hover:-translate-y-2 transition-transform relative md:-mt-12 z-10">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                <Star className="w-12 h-12 text-yellow-400 fill-yellow-400 animate-pulse" />
              </div>
              <div className="w-20 h-20 mx-auto bg-yellow-50 rounded-full flex items-center justify-center mb-4 border-4 border-yellow-400 mt-2 overflow-hidden">
                {leaderboard[0].character ? (
                  <img src={\`/assets/characters/\${leaderboard[0].character}\`} alt="Avatar" className="w-20 h-20 object-cover pixel-render scale-150 mt-4" />
                ) : (
                  <span className="font-pixel text-yellow-600 text-3xl">#1</span>
                )}
              </div>
              <h3 className="font-pixel text-slate-800 text-base md:text-lg mb-2 truncate px-2">{leaderboard[0].name}</h3>
              <p className="font-pixel-body text-slate-500 text-xl mb-6 truncate px-2">Level {leaderboard[0].level || Math.floor((leaderboard[0].points || 0)/500) + 1}</p>
              <div className="bg-yellow-100 text-yellow-700 py-4 pixel-border border-yellow-300 font-bold font-pixel-body text-2xl md:text-3xl">
                {(leaderboard[0].points || 0).toLocaleString()} XP
              </div>
            </div>
            )}

            {/* Rank 3 */}
            {leaderboard[2] && (
            <div className="bg-white p-6 pixel-border border-slate-300 shadow-md text-center transform hover:-translate-y-2 transition-transform">
              <div className="w-16 h-16 mx-auto bg-orange-50 rounded-full flex items-center justify-center mb-4 border-4 border-orange-300 overflow-hidden">
                {leaderboard[2].character ? (
                  <img src={\`/assets/characters/\${leaderboard[2].character}\`} alt="Avatar" className="w-16 h-16 object-cover pixel-render scale-150 mt-4" />
                ) : (
                  <span className="font-pixel text-orange-600 text-xl">#3</span>
                )}
              </div>
              <h3 className="font-pixel text-slate-800 text-sm md:text-base mb-2 truncate px-2">{leaderboard[2].name}</h3>
              <p className="font-pixel-body text-slate-500 text-lg mb-6 truncate px-2">Level {leaderboard[2].level || Math.floor((leaderboard[2].points || 0)/500) + 1}</p>
              <div className="bg-slate-100 text-slate-700 py-3 pixel-border border-slate-200 font-bold font-pixel-body text-xl md:text-2xl">
                {(leaderboard[2].points || 0).toLocaleString()} XP
              </div>
            </div>
            )}
          </div>
          )}
`;
  code = code.substring(0, startIndex) + dynamicLeaderboard + code.substring(endIndex);
  fs.writeFileSync('src/components/LandingPage.tsx', code);
  console.log('Dynamic Leaderboard inserted perfectly.');
} else {
  console.log('Could not find boundaries.');
}

