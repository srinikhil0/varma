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
        main: isDarkMode ? '#64B5F6' : '#1976D2',
        light: isDarkMode ? '#90CAF9' : '#42A5F5',
        dark: isDarkMode ? '#1976D2' : '#0D47A1',
      },
      secondary: {
        main: isDarkMode ? '#81C784' : '#388E3C',
        light: isDarkMode ? '#A5D6A7' : '#66BB6A',
        dark: isDarkMode ? '#388E3C' : '#1B5E20',
      },
      background: {
        default: isDarkMode ? '#0A0A0A' : '#F8FAFC',
        paper: isDarkMode ? '#1A1A1A' : '#FFFFFF',
      },
      text: {
        primary: isDarkMode ? '#FFFFFF' : '#1A202C',
        secondary: isDarkMode ? '#B0BEC5' : '#4A5568',
      },
      divider: isDarkMode ? '#2D3748' : '#E2E8F0',
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
            borderRadius: 12,
            boxShadow: isDarkMode 
              ? '0 4px 20px rgba(100, 181, 246, 0.3)' 
              : '0 4px 20px rgba(25, 118, 210, 0.2)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: isDarkMode 
                ? '0 8px 30px rgba(100, 181, 246, 0.4)' 
                : '0 8px 30px rgba(25, 118, 210, 0.3)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: isDarkMode 
              ? '0 8px 32px rgba(0, 0, 0, 0.4)' 
              : '0 8px 32px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)',
            border: isDarkMode 
              ? '1px solid rgba(255, 255, 255, 0.1)' 
              : '1px solid rgba(255, 255, 255, 0.8)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: isDarkMode 
                ? '0 16px 48px rgba(0, 0, 0, 0.6)' 
                : '0 16px 48px rgba(0, 0, 0, 0.15)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            backdropFilter: 'blur(10px)',
            border: isDarkMode 
              ? '1px solid rgba(255, 255, 255, 0.1)' 
              : '1px solid rgba(255, 255, 255, 0.8)',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backdropFilter: 'blur(20px)',
            borderBottom: isDarkMode 
              ? '1px solid rgba(255, 255, 255, 0.1)' 
              : '1px solid rgba(0, 0, 0, 0.1)',
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
