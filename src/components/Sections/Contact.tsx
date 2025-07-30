import React, { useState } from 'react';
import { Box, Typography, Container, Grid, Paper, TextField, Button, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { Email, Phone, LocationOn, LinkedIn, Send } from '@mui/icons-material';
import type { DynamicContentData } from '../../services/cmsService';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { getStaticContent, getContactData, getSkillsData } from '../../utils/contentUtils';

interface ContactProps {
  language: 'en' | 'ja';
  sections: DynamicContentData[];
}

const Contact: React.FC<ContactProps> = ({ language, sections }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // Get static content
  const staticContent = getStaticContent(language);
  
  // Get dynamic content using utility functions
  const contactData = getContactData(sections, language);
  const skillsData = getSkillsData(sections, language);
  const researchInterests = skillsData?.researchAreas || [];

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    setSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      // Save message to Firestore
      await addDoc(collection(db, 'contact-messages'), {
        ...formData,
        timestamp: new Date(),
        status: 'new',
        language: language
      });
      
      // Reset form
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitStatus('success');
      
      // Reset status after a few seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitStatus('error');
      
      // Reset status after a few seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
    } finally {
      setSubmitting(false);
    }
  };

  // Use dynamic content with fallbacks
  const location = contactData?.location || '[Your Location]';
  const phone = contactData?.phone || '[Your Phone Number]';
  const emailAddress = contactData?.email || '[your.email@example.com]';
  const linkedin = contactData?.linkedin || '[Your LinkedIn URL]';

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
            {staticContent.buttons.getInTouch}
          </Typography>
          
          <Typography
            variant="h5"
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              mb: 6
            }}
          >
            {language === 'en' ? "Let's discuss research opportunities and collaborations" : '研究機会とコラボレーションについて話し合いましょう'}
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
                  {staticContent.buttons.sendMessage}
                </Typography>
                
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    mb: 4
                  }}
                >
                  {language === 'en' ? "I'm always interested in new research collaborations, speaking opportunities, and academic partnerships. Feel free to reach out if you'd like to discuss potential projects or have any questions about my work." : '新しい研究コラボレーション、講演機会、学術パートナーシップに常に関心があります。潜在的なプロジェクトについて話し合いたい場合や、私の研究について質問がある場合は、お気軽にお問い合わせください。'}
                </Typography>

                <form onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label={staticContent.forms.name}
                        value={formData.name}
                        onChange={handleInputChange('name')}
                        required
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label={staticContent.forms.email}
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange('email')}
                        required
                      />
                    </Grid>
                    <Grid size={12}>
                      <TextField
                        fullWidth
                        label={staticContent.forms.subject}
                        value={formData.subject}
                        onChange={handleInputChange('subject')}
                        required
                      />
                    </Grid>
                    <Grid size={12}>
                      <TextField
                        fullWidth
                        label={staticContent.forms.message}
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
                        disabled={submitting}
                        sx={{
                          px: 4,
                          py: 1.5
                        }}
                      >
                        {submitting ? staticContent.status.sending : staticContent.buttons.sendMessage}
                      </Button>
                      
                      {submitStatus === 'success' && (
                        <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                          {staticContent.status.messageSent}
                        </Typography>
                      )}
                      
                      {submitStatus === 'error' && (
                        <Typography variant="body2" color="error.main" sx={{ mt: 1 }}>
                          {staticContent.status.messageError}
                        </Typography>
                      )}
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
                  {language === 'en' ? 'Contact Information' : '連絡先情報'}
                </Typography>

                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOn color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {location}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Phone color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {phone}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Email color="primary" sx={{ mr: 2 }} />
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {emailAddress}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    {language === 'en' ? 'Research Interests' : '研究関心'}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {researchInterests.length > 0 ? (
                      researchInterests.map((interest: string, index: number) => (
                        <Button
                          key={index}
                          variant="outlined"
                          size="small"
                          sx={{ mb: 1 }}
                        >
                          {interest}
                        </Button>
                      ))
                    ) : (
                      ['[Research Area 1]', '[Research Area 2]', '[Research Area 3]'].map((interest, index) => (
                        <Button
                          key={index}
                          variant="outlined"
                          size="small"
                          sx={{ mb: 1 }}
                        >
                          {interest}
                        </Button>
                      ))
                    )}
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
                      onClick={() => linkedin && linkedin !== '[Your LinkedIn URL]' && window.open(linkedin, '_blank')}
                      disabled={!linkedin || linkedin === '[Your LinkedIn URL]'}
                    >
                      <LinkedIn />
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