import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Box, Typography } from '@mui/material';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import Header from './components/Layout/Header';
import Hero from './components/Sections/Hero';
import About from './components/Sections/About';
import Research from './components/Sections/Research';
import Contact from './components/Sections/Contact';
import CMSDashboard from './components/CMS/CMSDashboard';
import LoginModal from './components/Auth/LoginModal';
import { CMSService } from './services/cmsService';
import type { SectionData } from './services/cmsService';

function App() {
  const [language, setLanguage] = useState<'en' | 'ja'>('en');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [cmsOpen, setCmsOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sections, setSections] = useState<SectionData[]>([]);
  const [loading, setLoading] = useState(true);

  // Check authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  // Load content from Firebase and listen for changes
  useEffect(() => {
    const loadContent = async () => {
      try {
        const sectionsData = await CMSService.getSections();
        setSections(sectionsData);
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();

    // Subscribe to real-time updates
    const unsubscribe = CMSService.subscribeToSections((updatedSections) => {
      setSections(updatedSections);
    });

    return () => unsubscribe();
  }, []);

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

  const handleCMSToggle = useCallback(() => {
    if (isAuthenticated) {
      setCmsOpen(true);
    } else {
      setLoginOpen(true);
    }
  }, [isAuthenticated]);

  const handleLoginSuccess = () => {
    setCmsOpen(true);
  };



  // Add secure keyboard shortcut for CMS access (Ctrl+Shift+Alt+C)
  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + Alt + C to open CMS (more secure)
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.altKey && event.key === 'C') {
        handleCMSToggle();
      }
      // Escape to close CMS
      if (event.key === 'Escape') {
        setCmsOpen(false);
        setLoginOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isAuthenticated, handleCMSToggle]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh' }}>
        <Header
          onLanguageChange={handleLanguageChange}
          currentLanguage={language}
          onThemeToggle={handleThemeToggle}
          isDarkMode={isDarkMode}
          sections={sections}
        />
        
        <Box sx={{ pt: 8 }}> {/* Account for fixed header */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <Typography>Loading...</Typography>
            </Box>
          ) : (
            <>
              <Hero language={language} sections={sections} />
              <About language={language} sections={sections} />
              <Research language={language} sections={sections} />
              <Contact language={language} sections={sections} />
            </>
          )}
        </Box>

        {/* CMS Access - Hidden from public */}
        {/* Only accessible via keyboard shortcut or admin route */}

        {/* Login Modal */}
        <LoginModal
          open={loginOpen}
          onClose={() => setLoginOpen(false)}
          onSuccess={handleLoginSuccess}
        />

        {/* CMS Dashboard */}
        {cmsOpen && (
          <CMSDashboard onClose={() => setCmsOpen(false)} />
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;
