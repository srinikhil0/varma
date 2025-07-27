import React from 'react';
import { Box, Typography, Button, Container, Grid, Paper, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { Download, Email } from '@mui/icons-material';
import type { SectionData } from '../../services/cmsService';
import AnimatedBackground from '../3D/AnimatedBackground';

interface HeroProps {
  language: 'en' | 'ja';
  sections: SectionData[];
}

const Hero: React.FC<HeroProps> = ({ language, sections }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  // Get hero section data from Firestore
  const heroSection = sections.find(section => section.id === 'hero');
  
  // Use dynamic content from Firestore or fallback to static content
  const content = {
    en: {
      title: heroSection?.title?.en || "Dr. [Your Name]",
      subtitle: heroSection?.content?.en || "Materials & Electronics Engineer",
      description: "Pioneering research in advanced materials and electronic devices. Specializing in nanotechnology, semiconductor physics, and sustainable energy solutions.",
      cta: "Download CV",
      contact: "Get in Touch",
      experience: "Years of Research",
      publications: "Publications",
      projects: "Projects Completed"
    },
    ja: {
      title: heroSection?.title?.ja || "Dr. [お名前]",
      subtitle: heroSection?.content?.ja || "材料・電子工学エンジニア",
      description: "先進材料と電子デバイスの先駆的研究を行っています。ナノテクノロジー、半導体物理学、持続可能なエネルギーソリューションを専門としています。",
      cta: "履歴書をダウンロード",
      contact: "お問い合わせ",
      experience: "研究年数",
      publications: "論文数",
      projects: "完了プロジェクト数"
    }
  };

  const currentContent = content[language];

  return (
    <Box
      id="home"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: isDarkMode 
          ? 'linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 50%, #2D3748 100%)'
          : 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 50%, #CBD5E0 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* 3D Animated Background */}
      <AnimatedBackground isDarkMode={isDarkMode} />

      {/* Text overlay for better readability */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: '50%',
        bottom: 0,
        background: isDarkMode 
          ? 'linear-gradient(90deg, rgba(10, 10, 10, 0.3) 0%, rgba(10, 10, 10, 0.1) 70%, transparent 100%)'
          : 'linear-gradient(90deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.2) 70%, transparent 100%)',
        zIndex: 2,
        pointerEvents: 'none'
      }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 3 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 700,
                  color: isDarkMode ? 'white' : 'text.primary',
                  mb: 2,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  lineHeight: 1.2,
                  textShadow: isDarkMode 
                    ? '0 4px 20px rgba(100, 181, 246, 0.5)' 
                    : '0 4px 20px rgba(25, 118, 210, 0.3)'
                }}
              >
                {currentContent.title}
              </Typography>
              
              <Typography
                variant="h4"
                sx={{
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'text.secondary',
                  mb: 3,
                  fontWeight: 300,
                  fontSize: { xs: '1.5rem', md: '2rem' }
                }}
              >
                {currentContent.subtitle}
              </Typography>
              
              <Typography
                variant="body1"
                sx={{
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'text.secondary',
                  mb: 4,
                  fontSize: '1.1rem',
                  lineHeight: 1.6,
                  maxWidth: 500
                }}
              >
                {currentContent.description}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Download />}
                  sx={{
                    backgroundColor: isDarkMode ? 'primary.main' : 'white',
                    color: isDarkMode ? 'white' : 'primary.main',
                    '&:hover': {
                      backgroundColor: isDarkMode ? 'primary.dark' : 'rgba(255, 255, 255, 0.9)'
                    }
                  }}
                >
                  {currentContent.cta}
                </Button>
                
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<Email />}
                  sx={{
                    borderColor: isDarkMode ? 'white' : 'primary.main',
                    color: isDarkMode ? 'white' : 'primary.main',
                    '&:hover': {
                      borderColor: isDarkMode ? 'white' : 'primary.dark',
                      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(25, 118, 210, 0.1)'
                    }
                  }}
                >
                  {currentContent.contact}
                </Button>
              </Box>
            </motion.div>
          </Grid>
          
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Paper
                  elevation={8}
                  sx={{
                    p: 4,
                    backgroundColor: isDarkMode ? 'rgba(26, 26, 26, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: 3,
                    maxWidth: 400,
                    width: '100%',
                    border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.8)'
                  }}
                >
                  <Grid container spacing={3}>
                    <Grid size={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h3" sx={{ fontWeight: 700, color: isDarkMode ? 'primary.light' : 'primary.main' }}>
                          8+
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {currentContent.experience}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h3" sx={{ fontWeight: 700, color: isDarkMode ? 'primary.light' : 'primary.main' }}>
                          25+
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {currentContent.publications}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h3" sx={{ fontWeight: 700, color: isDarkMode ? 'primary.light' : 'primary.main' }}>
                          15+
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {currentContent.projects}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero; 