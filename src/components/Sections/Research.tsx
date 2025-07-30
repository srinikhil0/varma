import React from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, CardMedia, Chip, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { Science, Article, TrendingUp } from '@mui/icons-material';
import type { DynamicContentData } from '../../services/cmsService';
import { 
  getResearchProjectsData, 
  getPublicationsData, 
  getAwardsData 
} from '../../utils/contentUtils';

interface ResearchProps {
  language: 'en' | 'ja';
  sections: DynamicContentData[];
}

const Research: React.FC<ResearchProps> = ({ language, sections }) => {

  
  // Get dynamic content using utility functions
  const researchProjects = getResearchProjectsData(sections, language);
  const publications = getPublicationsData(sections, language);
  const awardsData = getAwardsData(sections, language);
  const achievements = awardsData?.awards || [];

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
            {language === 'en' ? 'Research & Publications' : '研究・論文'}
          </Typography>
          
          <Typography
            variant="h5"
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              mb: 6
            }}
          >
            {language === 'en' ? 'Current Research Projects and Scientific Contributions' : '現在の研究プロジェクトと科学的貢献'}
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
            {language === 'en' ? 'Current Research' : '現在の研究'}
          </Typography>

          <Grid container spacing={4} sx={{ mb: 6 }}>
            {researchProjects.map((project, index) => (
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
                {language === 'en' ? 'Recent Publications' : '最近の論文'}
              </Typography>

              {publications.map((pub, index) => (
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
                {language === 'en' ? 'View All Publications' : 'すべての論文を見る'}
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
                {language === 'en' ? 'Key Achievements' : '主要な成果'}
              </Typography>

              {achievements.map((achievement, index) => (
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