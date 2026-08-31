const fs = require('fs');
let code = fs.readFileSync('src/store.tsx', 'utf-8');

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
  "const [settings, setSettings] = useState<Record<string, string>>({ 'xp_per_bottle': '100' });",
  "const [settings, setSettings] = useState<Record<string, string>>({ 'xp_per_bottle': '100' });\n" + themeState
);

fs.writeFileSync('src/store.tsx', code);
console.log('Fixed theme state injection.');
