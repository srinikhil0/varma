import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, Grid, Paper, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { Download, Email } from '@mui/icons-material';
import type { DynamicContentData } from '../../services/cmsService';
import AnimatedBackground from '../3D/AnimatedBackground';
import { db } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { getStaticContent, getHeroData } from '../../utils/contentUtils';

interface HeroProps {
  language: 'en' | 'ja';
  sections: DynamicContentData[];
}

const Hero: React.FC<HeroProps> = ({ language, sections }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [cvFile, setCvFile] = useState<{ url: string; name: string } | null>(null);
  
  // Get static content
  const staticContent = getStaticContent(language);
  
  // Get dynamic content using utility functions
  const heroData = getHeroData(sections, language);
  
  // Load CV file information
  useEffect(() => {
    const loadCVFile = async () => {
      try {
        const cvDoc = await getDoc(doc(db, 'website-settings', 'cv-settings'));
        if (cvDoc.exists() && cvDoc.data().cvFileId) {
          // Get the CV file URL from Firebase Storage
          const cvFileId = cvDoc.data().cvFileId;
          // For now, we'll construct the URL - in a real app, you'd fetch this from storage
          const cvUrl = `https://firebasestorage.googleapis.com/v0/b/venkata-sai-varma.firebasestorage.app/o/uploads%2Fdocument%2F${cvFileId}?alt=media`;
          setCvFile({ url: cvUrl, name: 'CV.pdf' });
        }
      } catch (error) {
        console.error('Error loading CV file:', error);
      }
    };

    loadCVFile();
  }, []);

  const handleDownloadCV = () => {
    if (cvFile) {
      const link = document.createElement('a');
      link.href = cvFile.url;
      link.download = cvFile.name;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  // Use dynamic content with fallbacks
  const name = heroData?.name || '[Your Name]';
  const title = heroData?.title || '[Your Professional Title]';
  const description = heroData?.description || '[Your professional description and expertise areas]';
  const statistics = heroData?.statistics || {
    yearsOfExperience: '[X]+',
    publicationsCount: '[X]+',
    projectsCount: '[X]+'
  };

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
                {name}
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
                {title}
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
                {description}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Download />}
                  onClick={handleDownloadCV}
                  disabled={!cvFile}
                  sx={{
                    backgroundColor: isDarkMode ? 'primary.main' : 'white',
                    color: isDarkMode ? 'white' : 'primary.main',
                    '&:hover': {
                      backgroundColor: isDarkMode ? 'primary.dark' : 'rgba(255, 255, 255, 0.9)'
                    }
                  }}
                >
                  {cvFile ? staticContent.buttons.downloadCV : 'CV Not Available'}
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
                  {staticContent.buttons.getInTouch}
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
                          {statistics.yearsOfExperience}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {language === 'en' ? 'Years of Research' : '研究年数'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h3" sx={{ fontWeight: 700, color: isDarkMode ? 'primary.light' : 'primary.main' }}>
                          {statistics.publicationsCount}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {language === 'en' ? 'Publications' : '論文数'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h3" sx={{ fontWeight: 700, color: isDarkMode ? 'primary.light' : 'primary.main' }}>
                          {statistics.projectsCount}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {language === 'en' ? 'Projects Completed' : '完了プロジェクト数'}
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