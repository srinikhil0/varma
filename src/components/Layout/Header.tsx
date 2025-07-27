import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemText, useTheme, useMediaQuery } from '@mui/material';
import { Menu as MenuIcon, Language, LightMode, DarkMode } from '@mui/icons-material';
import type { SectionData } from '../../services/cmsService';

interface HeaderProps {
  onLanguageChange: (lang: 'en' | 'ja') => void;
  currentLanguage: 'en' | 'ja';
  onThemeToggle: () => void;
  isDarkMode: boolean;
  sections: SectionData[];
}

const Header: React.FC<HeaderProps> = ({ onLanguageChange, currentLanguage, onThemeToggle, isDarkMode, sections }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Get hero section data for the name in header
  const heroSection = sections.find(section => section.id === 'hero');
  const headerName = heroSection?.title?.[currentLanguage] || "Dr. [Name]";

  const navItems = [
    { key: 'home', en: 'Home', ja: 'ホーム' },
    { key: 'about', en: 'About', ja: '私について' },
    { key: 'research', en: 'Research', ja: '研究' },
    { key: 'publications', en: 'Publications', ja: '論文' },
    { key: 'projects', en: 'Projects', ja: 'プロジェクト' },
    { key: 'contact', en: 'Contact', ja: 'お問い合わせ' }
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.key} onClick={() => scrollToSection(item.key)}>
            <ListItemText primary={currentLanguage === 'en' ? item.en : item.ja} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)',
          color: 'text.primary'
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ 
              flexGrow: 1, 
              fontWeight: 700,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            {headerName}
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              {navItems.map((item) => (
                <Button
                  key={item.key}
                  onClick={() => scrollToSection(item.key)}
                  sx={{ 
                    color: 'text.primary',
                    '&:hover': {
                      backgroundColor: 'rgba(33, 150, 243, 0.1)'
                    }
                  }}
                >
                  {currentLanguage === 'en' ? item.en : item.ja}
                </Button>
              ))}
              
              <IconButton onClick={onThemeToggle} color="inherit">
                {isDarkMode ? <LightMode /> : <DarkMode />}
              </IconButton>
              
              <IconButton 
                onClick={() => onLanguageChange(currentLanguage === 'en' ? 'ja' : 'en')}
                color="inherit"
              >
                <Language />
              </IconButton>
            </Box>
          )}

          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 }
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Header; 