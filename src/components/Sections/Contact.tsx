import React, { useState } from 'react';
import { Box, Typography, Container, Grid, Paper, TextField, Button, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { Email, Phone, LocationOn, LinkedIn, GitHub, Send } from '@mui/icons-material';

interface ContactProps {
  language: 'en' | 'ja';
}

const Contact: React.FC<ContactProps> = ({ language }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const content = {
    en: {
      title: "Get In Touch",
      subtitle: "Let's discuss research opportunities and collaborations",
      description: "I'm always interested in new research collaborations, speaking opportunities, and academic partnerships. Feel free to reach out if you'd like to discuss potential projects or have any questions about my work.",
      contactInfo: "Contact Information",
      sendMessage: "Send Message",
      name: "Name",
      email: "Email",
      subject: "Subject",
      message: "Message",
      location: "Tokyo, Japan",
      phone: "+81-XX-XXXX-XXXX",
      emailAddress: "dr.name@university.ac.jp",
      linkedin: "LinkedIn Profile",
      github: "GitHub Profile",
      researchInterests: "Research Interests",
      collaboration: "Collaboration Opportunities",
      speaking: "Speaking Engagements"
    },
    ja: {
      title: "お問い合わせ",
      subtitle: "研究機会とコラボレーションについて話し合いましょう",
      description: "新しい研究コラボレーション、講演機会、学術パートナーシップに常に関心があります。潜在的なプロジェクトについて話し合いたい場合や、私の研究について質問がある場合は、お気軽にお問い合わせください。",
      contactInfo: "連絡先情報",
      sendMessage: "メッセージを送信",
      name: "お名前",
      email: "メールアドレス",
      subject: "件名",
      message: "メッセージ",
      location: "東京都",
      phone: "+81-XX-XXXX-XXXX",
      emailAddress: "dr.name@university.ac.jp",
      linkedin: "LinkedInプロフィール",
      github: "GitHubプロフィール",
      researchInterests: "研究関心",
      collaboration: "コラボレーション機会",
      speaking: "講演依頼"
    }
  };

  const currentContent = content[language];

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // In real app, this would send to Firebase or email service
    console.log('Form submitted:', formData);
    alert('Message sent successfully!');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <Box
      id="contact"
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
          {/* Contact Form */}
          <Grid size={{ xs: 12, md: 7 }}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
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
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    mb: 3
                  }}
                >
                  {currentContent.sendMessage}
                </Typography>
                
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    mb: 4
                  }}
                >
                  {currentContent.description}
                </Typography>

                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label={currentContent.name}
                        value={formData.name}
                        onChange={handleInputChange('name')}
                        required
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label={currentContent.email}
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange('email')}
                        required
                                              />
                      </Grid>
                      <Grid size={12}>
                        <TextField
                          fullWidth
                          label={currentContent.subject}
                          value={formData.subject}
                          onChange={handleInputChange('subject')}
                          required
                        />
                      </Grid>
                      <Grid size={12}>
                      <TextField
                        fullWidth
                        label={currentContent.message}
                        multiline
                        rows={4}
                        value={formData.message}
                        onChange={handleInputChange('message')}
                        required
                                              />
                      </Grid>
                      <Grid size={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        startIcon={<Send />}
                        sx={{
                          px: 4,
                          py: 1.5
                        }}
                      >
                        {currentContent.sendMessage}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
            </motion.div>
          </Grid>

          {/* Contact Information */}
          <Grid size={{ xs: 12, md: 5 }}>
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
                  backgroundColor: 'background.paper',
                  height: 'fit-content'
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    mb: 3
                  }}
                >
                  {currentContent.contactInfo}
                </Typography>

                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOn color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {currentContent.location}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Phone color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {currentContent.phone}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Email color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {currentContent.emailAddress}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    {currentContent.researchInterests}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {['Quantum Materials', 'Semiconductor Physics', 'Nanotechnology', 'Energy Storage'].map((interest, index) => (
                      <Button
                        key={index}
                        variant="outlined"
                        size="small"
                        sx={{ mb: 1 }}
                      >
                        {interest}
                      </Button>
                    ))}
                  </Box>
                </Box>

                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Connect
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      color="primary"
                      sx={{
                        border: '1px solid',
                        borderColor: 'primary.main'
                      }}
                    >
                      <LinkedIn />
                    </IconButton>
                    <IconButton
                      color="primary"
                      sx={{
                        border: '1px solid',
                        borderColor: 'primary.main'
                      }}
                    >
                      <GitHub />
                    </IconButton>
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Contact; 