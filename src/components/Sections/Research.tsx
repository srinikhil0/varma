import React from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, CardMedia, Chip, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { Science, Article, TrendingUp } from '@mui/icons-material';

import type { SectionData } from '../../services/cmsService';

interface ResearchProject {
  title: string;
  description: string;
  image: string;
  tags: string[];
  status: string;
}

interface Publication {
  title: string;
  journal: string;
  year: string;
  authors: string;
  doi: string;
  impact: string;
}

interface Achievement {
  title: string;
  description: string;
  year: string;
}

interface ResearchProps {
  language: 'en' | 'ja';
  sections: SectionData[];
}

const Research: React.FC<ResearchProps> = ({ language, sections }) => {
  // Get sections from Firestore
  const researchProjectsSection = sections.find(section => section.id === 'research-projects');
  const publicationsSection = sections.find(section => section.id === 'publications');
  const achievementsSection = sections.find(section => section.id === 'achievements');

  // Parse structured data
  const parseResearchProjects = (content: string): ResearchProject[] => {
    try {
      return JSON.parse(content);
    } catch {
      return [];
    }
  };

  const parsePublications = (content: string): Publication[] => {
    try {
      return JSON.parse(content);
    } catch {
      return [];
    }
  };

  const parseAchievements = (content: string): Achievement[] => {
    try {
      return JSON.parse(content);
    } catch {
      return [];
    }
  };

  const researchProjects = researchProjectsSection ? parseResearchProjects(researchProjectsSection.content[language]) : [];
  const publications = publicationsSection ? parsePublications(publicationsSection.content[language]) : [];
  const achievements = achievementsSection ? parseAchievements(achievementsSection.content[language]) : [];

  const content = {
    en: {
      title: "Research & Publications",
      subtitle: "Current Research Projects and Scientific Contributions",
      currentResearch: "Current Research",
      publicationsTitle: "Recent Publications",
      achievementsTitle: "Key Achievements",
      viewAll: "View All Publications",
      projects: researchProjects,
      publications: publications,
      achievements: achievements
    },
    ja: {
      title: "研究・論文",
      subtitle: "現在の研究プロジェクトと科学的貢献",
      currentResearch: "現在の研究",
      publicationsTitle: "最近の論文",
      achievementsTitle: "主要な成果",
      viewAll: "すべての論文を見る",
      projects: researchProjects,
      publications: publications,
      achievements: achievements
    }
  };

  const currentContent = content[language];

  return (
    <Box
      id="research"
      sx={{
        py: 8,
        backgroundColor: 'background.paper'
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
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
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

        {/* Current Research Projects */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              mb: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Science color="primary" />
            {currentContent.currentResearch}
          </Typography>

          <Grid container spacing={4} sx={{ mb: 6 }}>
            {currentContent.projects.map((project, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)'
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={project.image}
                    alt={project.title}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Chip
                        label={project.status}
                        color="success"
                        size="small"
                      />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      {project.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                      {project.description}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {project.tags.map((tag, tagIndex) => (
                        <Chip
                          key={tagIndex}
                          label={tag}
                          size="small"
                          variant="outlined"
                          color="primary"
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        <Grid container spacing={6}>
          {/* Publications */}
          <Grid size={{ xs: 12, md: 8 }}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  mb: 4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Article color="primary" />
                {currentContent.publicationsTitle}
              </Typography>

              {content[language].publications.map((pub, index) => (
                <Card key={index} sx={{ mb: 3 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                        {pub.title}
                      </Typography>
                      <Chip
                        label={pub.impact}
                        color="primary"
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="primary" sx={{ fontWeight: 500, mb: 1 }}>
                      {pub.journal} • {pub.year}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                      {pub.authors}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: 'monospace' }}>
                      DOI: {pub.doi}
                    </Typography>
                  </CardContent>
                </Card>
              ))}

              <Button
                variant="outlined"
                color="primary"
                size="large"
                sx={{ mt: 2 }}
              >
                {currentContent.viewAll}
              </Button>
            </motion.div>
          </Grid>

          {/* Achievements */}
          <Grid size={{ xs: 12, md: 4 }}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  mb: 4,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <TrendingUp color="primary" />
                {currentContent.achievementsTitle}
              </Typography>

              {content[language].achievements.map((achievement, index) => (
                <Card key={index} sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {achievement.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                      {achievement.description}
                    </Typography>
                    <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
                      {achievement.year}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Research; 