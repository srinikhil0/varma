import React from 'react';
import { Box, Typography, Container, Grid, Paper, Chip, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { School, Work, Science, Psychology } from '@mui/icons-material';
import type { SectionData } from '../../services/cmsService';

interface EducationEntry {
  degree: string;
  institution: string;
  year: string;
  description: string;
}

interface ExperienceEntry {
  position: string;
  institution: string;
  year: string;
  description: string;
}

interface AboutProps {
  language: 'en' | 'ja';
  sections: SectionData[];
}

const About: React.FC<AboutProps> = ({ language, sections }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  // Get sections from Firestore
  const aboutSection = sections.find(section => section.id === 'about');
  const educationSection = sections.find(section => section.id === 'education');
  const experienceSection = sections.find(section => section.id === 'experience');
  const researchSection = sections.find(section => section.id === 'research');
  const skillsSection = sections.find(section => section.id === 'skills');

  // Parse structured data
  const parseEducationData = (content: string): EducationEntry[] => {
    try {
      return JSON.parse(content);
    } catch {
      return [];
    }
  };

  const parseExperienceData = (content: string): ExperienceEntry[] => {
    try {
      return JSON.parse(content);
    } catch {
      return [];
    }
  };

  const parseArrayData = (content: string): string[] => {
    try {
      return JSON.parse(content);
    } catch {
      return [];
    }
  };

  const educationDetails = educationSection ? parseEducationData(educationSection.content[language]) : [];
  const experienceDetails = experienceSection ? parseExperienceData(experienceSection.content[language]) : [];
  const researchAreas = researchSection ? parseArrayData(researchSection.content[language]) : [];
  const technicalSkills = skillsSection ? parseArrayData(skillsSection.content[language]) : [];
  
  const content = {
    en: {
      title: "About Me",
      subtitle: "Materials & Electronics Research Specialist",
      description: "I am a dedicated researcher with over 8 years of experience in materials science and electronics engineering. My work focuses on developing innovative solutions for next-generation electronic devices and sustainable energy technologies.",
      longDescription: "My research encompasses the development of novel materials for semiconductor applications, energy storage systems, and electronic devices. I specialize in nanotechnology, quantum materials, and the integration of advanced materials into practical electronic systems. My work has been published in leading scientific journals and has contributed to several breakthrough technologies in the field.",
      education: "Education",
      experience: "Experience",
      research: "Research Areas",
      skills: "Technical Skills",
      educationDetails: educationDetails,
      experienceDetails: experienceDetails,
      researchAreas: researchAreas,
      technicalSkills: technicalSkills
    },
    ja: {
      title: "私について",
      subtitle: "材料・電子工学研究専門家",
      description: "材料科学と電子工学の分野で8年以上の経験を持つ専念した研究者です。次世代電子デバイスと持続可能なエネルギー技術の革新的なソリューション開発に焦点を当てています。",
      longDescription: "私の研究は、半導体応用、エネルギー貯蔵システム、電子デバイスのための新素材開発を包括しています。ナノテクノロジー、量子材料、先進材料の実用的な電子システムへの統合を専門としています。私の研究は主要な科学雑誌に掲載され、この分野のいくつかの画期的な技術に貢献しています。",
      education: "学歴",
      experience: "経験",
      research: "研究分野",
      skills: "技術スキル",
      educationDetails: educationDetails,
      experienceDetails: experienceDetails,
      researchAreas: researchAreas,
      technicalSkills: technicalSkills
    }
  };

  const currentContent = content[language];

  return (
    <Box
      id="about"
      sx={{
        py: 8,
        backgroundColor: 'background.default',
        background: isDarkMode 
          ? 'linear-gradient(180deg, #0A0A0A 0%, #1A1A1A 100%)'
          : 'linear-gradient(180deg, #F8FAFC 0%, #E2E8F0 100%)'
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h2"
            sx={{
              textAlign: 'center',
              fontWeight: 700,
              mb: 2,
              background: isDarkMode 
                ? 'linear-gradient(45deg, #64B5F6 30%, #90CAF9 90%)'
                : 'linear-gradient(45deg, #1976D2 30%, #42A5F5 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            {currentContent.title}
          </Typography>
          
          <Typography
            variant="h5"
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              mb: 6
            }}
          >
            {currentContent.subtitle}
          </Typography>
        </motion.div>

        <Grid container spacing={6}>
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontSize: '1.1rem',
                  lineHeight: 1.8,
                  mb: 4,
                  color: 'text.primary'
                }}
              >
                {currentContent.description}
              </Typography>
              
              <Typography
                variant="body1"
                sx={{
                  fontSize: '1.1rem',
                  lineHeight: 1.8,
                  color: 'text.secondary'
                }}
              >
                {currentContent.longDescription}
              </Typography>
            </motion.div>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  backgroundColor: 'background.paper'
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <School color="primary" />
                  {currentContent.education}
                </Typography>
                
                {currentContent.educationDetails.map((edu, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {edu.degree}
                    </Typography>
                    <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
                      {edu.institution} • {edu.year}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                      {edu.description}
                    </Typography>
                  </Box>
                ))}
              </Paper>
            </motion.div>
          </Grid>
        </Grid>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  backgroundColor: 'background.paper'
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Work color="primary" />
                  {currentContent.experience}
                </Typography>
                
                {currentContent.experienceDetails.map((exp, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {exp.position}
                    </Typography>
                    <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
                      {exp.institution} • {exp.year}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                      {exp.description}
                    </Typography>
                  </Box>
                ))}
              </Paper>
            </motion.div>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              viewport={{ once: true }}
            >
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  backgroundColor: 'background.paper'
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Science color="primary" />
                  {currentContent.research}
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
                  {currentContent.researchAreas.map((area, index) => (
                    <Chip
                      key={index}
                      label={area}
                      variant="outlined"
                      color="primary"
                      sx={{ mb: 1 }}
                    />
                  ))}
                </Box>

                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Psychology color="primary" />
                  {currentContent.skills}
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {currentContent.technicalSkills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      variant="filled"
                      color="secondary"
                      sx={{ mb: 1 }}
                    />
                  ))}
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default About; 