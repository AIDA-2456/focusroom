import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function ThemeSwitcher() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('focusroom_theme') || 'light';
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Remove all theme classes first
    document.body.classList.remove('theme-light', 'theme-dyslexia');
    
    // Add the selected theme class if not default dark
    if (theme === 'light') {
      document.body.classList.add('theme-light');
    } else if (theme === 'dyslexia') {
      document.body.classList.add('theme-dyslexia');
    }
    
    // Persist preference
    localStorage.setItem('focusroom_theme', theme);
  }, [theme]);

  const themes = [
    { id: 'dark', icon: '🌌', label: 'Advanced Dark' },
    { id: 'light', icon: '☀️', label: 'Clean (Light)' },
    { id: 'dyslexia', icon: '👁️', label: 'Dyslexia Friendly' }
  ];

  return (
    <div style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 1000 }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            style={{ 
              position: 'absolute', 
              bottom: '60px', 
              left: '0',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--glass-border-highlight)',
              borderRadius: '12px',
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              boxShadow: 'var(--shadow-glass)',
              backdropFilter: 'blur(10px)'
            }}
          >
            {themes.map(t => (
              <button
                key={t.id}
                onClick={() => { setTheme(t.id); setIsOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: theme === t.id ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
                  color: 'var(--text-primary)',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  whiteSpace: 'nowrap',
                  fontWeight: theme === t.id ? 'bold' : 'normal'
                }}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: 'var(--bg-glass)',
          border: '1px solid var(--glass-border-highlight)',
          color: 'var(--text-primary)',
          fontSize: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-glass)',
          backdropFilter: 'blur(10px)'
        }}
        title="Change Theme"
      >
        {themes.find(t => t.id === theme)?.icon || '🌌'}
      </button>
    </div>
  );
}

export default ThemeSwitcher;
