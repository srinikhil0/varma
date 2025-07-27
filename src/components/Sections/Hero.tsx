import React from 'react';
import { Box, Typography, Button, Container, Grid, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { Download, Email } from '@mui/icons-material';
import type { SectionData } from '../../services/cmsService';

interface HeroProps {
  language: 'en' | 'ja';
  sections: SectionData[];
}

const Hero: React.FC<HeroProps> = ({ language, sections }) => {
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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Animated background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          animation: 'float 20s ease-in-out infinite'
        }}
      />

      <Container maxWidth="lg">
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
                  color: 'white',
                  mb: 2,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  lineHeight: 1.2
                }}
              >
                {currentContent.title}
              </Typography>
              
              <Typography
                variant="h4"
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
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
                  color: 'rgba(255, 255, 255, 0.8)',
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
                    backgroundColor: 'white',
                    color: '#667eea',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)'
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
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
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
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                    maxWidth: 400,
                    width: '100%'
                  }}
                >
                  <Grid container spacing={3}>
                    <Grid size={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h3" sx={{ fontWeight: 700, color: '#667eea' }}>
                          8+
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {currentContent.experience}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h3" sx={{ fontWeight: 700, color: '#667eea' }}>
                          25+
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {currentContent.publications}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid size={4}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h3" sx={{ fontWeight: 700, color: '#667eea' }}>
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