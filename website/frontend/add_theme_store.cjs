const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf-8');

// 1. Add theme type to AppContextType
code = code.replace(
  'allLogs: any[];',
  "allLogs: any[];\n  theme: 'light' | 'dark';\n  toggleTheme: () => void;"
);

// 2. Add theme state to AppProvider
const themeState = `
  const [theme, setTheme] = useState<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
  );

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };
`;
code = code.replace(
  '  const [settings, setSettings] = useState<any>({});',
  '  const [settings, setSettings] = useState<any>({});\n' + themeState
);

// 3. Add to provider value
code = code.replace(
  'updateSetting \n    }}>',
  'updateSetting, theme, toggleTheme \n    }}>'
);

fs.writeFileSync('src/store.tsx', code);
console.log('Theme state added to global store.');
