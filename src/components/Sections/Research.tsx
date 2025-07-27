import React from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, CardMedia, Chip, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { Science, Article, TrendingUp } from '@mui/icons-material';

interface ResearchProps {
  language: 'en' | 'ja';
}

const Research: React.FC<ResearchProps> = ({ language }) => {
  const content = {
    en: {
      title: "Research & Publications",
      subtitle: "Current Research Projects and Scientific Contributions",
      currentResearch: "Current Research",
      publicationsTitle: "Recent Publications",
      achievementsTitle: "Key Achievements",
      viewAll: "View All Publications",
      projects: [
        {
          title: "Quantum Materials for Next-Gen Electronics",
          description: "Developing novel quantum materials with unique electronic properties for advanced computing applications.",
          image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400",
          tags: ["Quantum Materials", "Electronics", "Computing"],
          status: "Active"
        },
        {
          title: "Sustainable Energy Storage Solutions",
          description: "Researching advanced battery technologies and energy storage systems for renewable energy integration.",
          image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400",
          tags: ["Energy Storage", "Batteries", "Renewable Energy"],
          status: "Active"
        },
        {
          title: "Nanomaterials for Biomedical Applications",
          description: "Exploring the use of nanomaterials in medical devices and drug delivery systems.",
          image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400",
          tags: ["Nanomaterials", "Biomedical", "Drug Delivery"],
          status: "Active"
        }
      ],
      publications: [
        {
          title: "Advanced Quantum Materials for Electronic Applications",
          journal: "Nature Materials",
          year: "2024",
          authors: "Dr. [Name], et al.",
          doi: "10.1038/s41563-024-00000-0",
          impact: "High Impact"
        },
        {
          title: "Novel Energy Storage Materials: A Comprehensive Review",
          journal: "Advanced Materials",
          year: "2023",
          authors: "Dr. [Name], et al.",
          doi: "10.1002/adma.202300000",
          impact: "High Impact"
        },
        {
          title: "Nanomaterials in Biomedical Engineering",
          journal: "Science Advances",
          year: "2023",
          authors: "Dr. [Name], et al.",
          doi: "10.1126/sciadv.abc0000",
          impact: "High Impact"
        }
      ],
      achievements: [
        {
          title: "Best Paper Award",
          description: "Recognized for outstanding contribution to materials science",
          year: "2024"
        },
        {
          title: "Research Grant",
          description: "Secured $2M funding for quantum materials research",
          year: "2023"
        },
        {
          title: "Patent Awarded",
          description: "Novel energy storage device technology",
          year: "2023"
        }
      ]
    },
    ja: {
      title: "研究・論文",
      subtitle: "現在の研究プロジェクトと科学的貢献",
      currentResearch: "現在の研究",
      publicationsTitle: "最近の論文",
      achievementsTitle: "主要な成果",
      viewAll: "すべての論文を見る",
      projects: [
        {
          title: "次世代エレクトロニクスのための量子材料",
          description: "先進的なコンピューティング応用のための独特な電子特性を持つ新規量子材料の開発。",
          image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400",
          tags: ["量子材料", "エレクトロニクス", "コンピューティング"],
          status: "進行中"
        },
        {
          title: "持続可能なエネルギー貯蔵ソリューション",
          description: "再生可能エネルギー統合のための先進バッテリー技術とエネルギー貯蔵システムの研究。",
          image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400",
          tags: ["エネルギー貯蔵", "バッテリー", "再生可能エネルギー"],
          status: "進行中"
        },
        {
          title: "生体医学応用のためのナノ材料",
          description: "医療機器と薬物送達システムにおけるナノ材料の使用の探求。",
          image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400",
          tags: ["ナノ材料", "生体医学", "薬物送達"],
          status: "進行中"
        }
      ],
      publications: [
        {
          title: "電子応用のための先進量子材料",
          journal: "Nature Materials",
          year: "2024",
          authors: "Dr. [名前], et al.",
          doi: "10.1038/s41563-024-00000-0",
          impact: "高インパクト"
        },
        {
          title: "新規エネルギー貯蔵材料：包括的レビュー",
          journal: "Advanced Materials",
          year: "2023",
          authors: "Dr. [名前], et al.",
          doi: "10.1002/adma.202300000",
          impact: "高インパクト"
        },
        {
          title: "生体医学工学におけるナノ材料",
          journal: "Science Advances",
          year: "2023",
          authors: "Dr. [名前], et al.",
          doi: "10.1126/sciadv.abc0000",
          impact: "高インパクト"
        }
      ],
      achievements: [
        {
          title: "最優秀論文賞",
          description: "材料科学への優れた貢献が認められました",
          year: "2024"
        },
        {
          title: "研究助成金",
          description: "量子材料研究のために200万ドルの資金を確保",
          year: "2023"
        },
        {
          title: "特許取得",
          description: "新規エネルギー貯蔵デバイス技術",
          year: "2023"
        }
      ]
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