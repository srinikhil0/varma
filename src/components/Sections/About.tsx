import React from 'react';
import { Box, Typography, Container, Grid, Paper, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { School, Work, Science, Psychology } from '@mui/icons-material';
import type { SectionData } from '../../services/cmsService';

interface AboutProps {
  language: 'en' | 'ja';
  sections: SectionData[];
}

const About: React.FC<AboutProps> = ({ language, sections }) => {
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
      educationDetails: [
        {
          degree: "Ph.D. in Materials Science",
          institution: "University of Technology",
          year: "2020",
          description: "Specialized in advanced semiconductor materials and quantum electronics"
        },
        {
          degree: "M.S. in Electronics Engineering",
          institution: "Institute of Advanced Studies",
          year: "2017",
          description: "Focused on microelectronics and device physics"
        },
        {
          degree: "B.S. in Physics",
          institution: "National University",
          year: "2015",
          description: "Major in solid-state physics and materials science"
        }
      ],
      experienceDetails: [
        {
          position: "Senior Research Scientist",
          institution: "Advanced Materials Institute",
          year: "2020-Present",
          description: "Leading research in quantum materials and electronic devices"
        },
        {
          position: "Research Associate",
          institution: "Electronics Research Lab",
          year: "2017-2020",
          description: "Developed novel semiconductor materials and devices"
        },
        {
          position: "Graduate Researcher",
          institution: "Materials Science Department",
          year: "2015-2017",
          description: "Conducted research on energy storage materials"
        }
      ],
      researchAreas: [
        "Quantum Materials",
        "Semiconductor Physics",
        "Nanotechnology",
        "Energy Storage",
        "Electronic Devices",
        "Materials Characterization"
      ],
      technicalSkills: [
        "Materials Synthesis",
        "Device Fabrication",
        "Characterization Techniques",
        "Data Analysis",
        "Simulation Tools",
        "Laboratory Management"
      ]
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
      educationDetails: [
        {
          degree: "材料科学博士号",
          institution: "工科大学",
          year: "2020",
          description: "先進半導体材料と量子エレクトロニクスを専門"
        },
        {
          degree: "電子工学修士号",
          institution: "高等研究所",
          year: "2017",
          description: "マイクロエレクトロニクスとデバイス物理学に焦点"
        },
        {
          degree: "物理学学士号",
          institution: "国立大学",
          year: "2015",
          description: "固体物理学と材料科学を専攻"
        }
      ],
      experienceDetails: [
        {
          position: "シニア研究員",
          institution: "先進材料研究所",
          year: "2020-現在",
          description: "量子材料と電子デバイスの研究をリード"
        },
        {
          position: "研究員",
          institution: "電子工学研究所",
          year: "2017-2020",
          description: "新規半導体材料とデバイスを開発"
        },
        {
          position: "大学院研究員",
          institution: "材料科学科",
          year: "2015-2017",
          description: "エネルギー貯蔵材料の研究を実施"
        }
      ],
      researchAreas: [
        "量子材料",
        "半導体物理学",
        "ナノテクノロジー",
        "エネルギー貯蔵",
        "電子デバイス",
        "材料特性評価"
      ],
      technicalSkills: [
        "材料合成",
        "デバイス製造",
        "特性評価技術",
        "データ解析",
        "シミュレーションツール",
        "実験室管理"
      ]
    }
  };

  const currentContent = content[language];

  return (
    <Box
      id="about"
      sx={{
        py: 8,
        backgroundColor: 'background.default'
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