import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box, Fab } from '@mui/material';
import { Settings as SettingsIcon } from '@mui/icons-material';
import Header from './components/Layout/Header';
import Hero from './components/Sections/Hero';
import About from './components/Sections/About';
import Research from './components/Sections/Research';
import Contact from './components/Sections/Contact';
import CMSDashboard from './components/CMS/CMSDashboard';

function App() {
  const [language, setLanguage] = useState<'en' | 'ja'>('en');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [cmsOpen, setCmsOpen] = useState(false);

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: '#2196F3',
      },
      secondary: {
        main: '#21CBF3',
      },
      background: {
        default: isDarkMode ? '#121212' : '#fafafa',
        paper: isDarkMode ? '#1e1e1e' : '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 600,
      },
      h3: {
        fontWeight: 600,
      },
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
    },
  });

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLanguageChange = (newLanguage: 'en' | 'ja') => {
    setLanguage(newLanguage);
  };

  const handleCMSToggle = () => {
    setCmsOpen(!cmsOpen);
  };

  // Add keyboard shortcut for CMS access
  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + C to open CMS
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'C') {
        setCmsOpen(true);
      }
      // Escape to close CMS
      if (event.key === 'Escape') {
        setCmsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh' }}>
        <Header
          onLanguageChange={handleLanguageChange}
          currentLanguage={language}
          onThemeToggle={handleThemeToggle}
          isDarkMode={isDarkMode}
        />
        
        <Box sx={{ pt: 8 }}> {/* Account for fixed header */}
          <Hero language={language} />
          <About language={language} />
          <Research language={language} />
          <Contact language={language} />
        </Box>

        {/* CMS Access Button - Only visible in development */}
        {process.env.NODE_ENV === 'development' && (
          <Fab
            color="primary"
            aria-label="CMS"
            onClick={handleCMSToggle}
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              zIndex: 1000,
            }}
          >
            <SettingsIcon />
          </Fab>
        )}

        {/* CMS Dashboard */}
        {cmsOpen && (
          <CMSDashboard onClose={() => setCmsOpen(false)} />
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;
