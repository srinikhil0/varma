import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tabs,
  Tab,
  Paper,
  Switch,
  FormControlLabel,
  Chip,
} from '@mui/material';
import {
  Edit,
  Preview,
  Publish,
  Image,
  TextFields,
  Settings,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';

interface CMSDashboardProps {
  onClose: () => void;
}

interface SectionData {
  id: string;
  type: 'hero' | 'about' | 'research' | 'publications' | 'contact';
  title: { en: string; ja: string };
  content: { en: string; ja: string };
  visible: boolean;
  order: number;
}

const CMSDashboard: React.FC<CMSDashboardProps> = ({ onClose }) => {
  const [selectedSection, setSelectedSection] = useState<SectionData | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ja'>('en');

  // Mock data - in real app this would come from Firebase
  const [sections, setSections] = useState<SectionData[]>([
    {
      id: 'hero',
      type: 'hero',
      title: { en: 'Dr. [Your Name]', ja: 'Dr. [お名前]' },
      content: { 
        en: 'Materials & Electronics Engineer specializing in nanotechnology and sustainable energy solutions.',
        ja: 'ナノテクノロジーと持続可能なエネルギーソリューションを専門とする材料・電子工学エンジニア。'
      },
      visible: true,
      order: 1
    },
    {
      id: 'about',
      type: 'about',
      title: { en: 'About Me', ja: '私について' },
      content: { 
        en: 'Dedicated researcher with over 8 years of experience in materials science and electronics engineering.',
        ja: '材料科学と電子工学の分野で8年以上の経験を持つ専念した研究者です。'
      },
      visible: true,
      order: 2
    },
    {
      id: 'research',
      type: 'research',
      title: { en: 'Research', ja: '研究' },
      content: { 
        en: 'Current research focuses on quantum materials and advanced electronic devices.',
        ja: '現在の研究は量子材料と先進電子デバイスに焦点を当てています。'
      },
      visible: true,
      order: 3
    }
  ]);



  const handleEditSection = (section: SectionData) => {
    setSelectedSection(section);
    setEditDialogOpen(true);
  };

  const handleSaveSection = () => {
    if (selectedSection) {
      setSections(prev => 
        prev.map(section => 
          section.id === selectedSection.id ? selectedSection : section
        )
      );
    }
    setEditDialogOpen(false);
    setSelectedSection(null);
  };

  const handleToggleVisibility = (sectionId: string) => {
    setSections(prev =>
      prev.map(section =>
        section.id === sectionId ? { ...section, visible: !section.visible } : section
      )
    );
  };

  const handlePublish = () => {
    // In real app, this would save to Firebase and trigger deployment
    console.log('Publishing changes...');
    alert('Changes published successfully!');
  };

  const renderSectionCard = (section: SectionData) => (
    <Card key={section.id} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {section.title[currentLanguage]}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip
              label={section.visible ? 'Visible' : 'Hidden'}
              color={section.visible ? 'success' : 'default'}
              size="small"
            />
            <IconButton
              size="small"
              onClick={() => handleToggleVisibility(section.id)}
            >
              {section.visible ? <Visibility /> : <VisibilityOff />}
            </IconButton>
            <IconButton
              size="small"
              onClick={() => handleEditSection(section)}
            >
              <Edit />
            </IconButton>
          </Box>
        </Box>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
          {section.content[currentLanguage]}
        </Typography>
        <Chip label={section.type} variant="outlined" size="small" />
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      backgroundColor: 'background.default',
      zIndex: 1300,
      overflow: 'auto'
    }}>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Content Management System
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Preview />}
              onClick={() => setPreviewMode(!previewMode)}
            >
              {previewMode ? 'Edit Mode' : 'Preview Mode'}
            </Button>
            <Button
              variant="contained"
              startIcon={<Publish />}
              onClick={handlePublish}
              color="success"
            >
              Publish Changes
            </Button>
            <Button
              variant="outlined"
              onClick={onClose}
            >
              Close CMS
            </Button>
          </Box>
        </Box>

        {/* Language Toggle */}
        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={currentLanguage === 'ja'}
                onChange={(e) => setCurrentLanguage(e.target.checked ? 'ja' : 'en')}
              />
            }
            label={`Language: ${currentLanguage === 'en' ? 'English' : '日本語'}`}
          />
        </Box>

        <Grid container spacing={3}>
          {/* Left Panel - Content Sections */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                Website Sections
              </Typography>
              
              {sections.map(renderSectionCard)}
              
              <Button
                variant="outlined"
                fullWidth
                sx={{ mt: 2 }}
              >
                Add New Section
              </Button>
            </Paper>
          </Grid>

          {/* Right Panel - Quick Actions */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Quick Actions
              </Typography>
              
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Image />}
                sx={{ mb: 2 }}
              >
                Manage Images
              </Button>
              
              <Button
                variant="outlined"
                fullWidth
                startIcon={<TextFields />}
                sx={{ mb: 2 }}
              >
                Edit Text Content
              </Button>
              
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Settings />}
              >
                Site Settings
              </Button>
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Site Statistics
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Total Sections
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {sections.length}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Visible Sections
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {sections.filter(s => s.visible).length}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Last Published
                </Typography>
                <Typography variant="body1">
                  {new Date().toLocaleDateString()}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Edit Section: {selectedSection?.title[currentLanguage]}
        </DialogTitle>
        <DialogContent>
          {selectedSection && (
            <Box sx={{ pt: 2 }}>
              <Tabs value={currentLanguage === 'en' ? 0 : 1} onChange={(e, value) => setCurrentLanguage(value === 0 ? 'en' : 'ja')}>
                <Tab label="English" />
                <Tab label="日本語" />
              </Tabs>
              
              <Box sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  label="Title"
                  value={selectedSection.title[currentLanguage]}
                  onChange={(e) => setSelectedSection({
                    ...selectedSection,
                    title: { ...selectedSection.title, [currentLanguage]: e.target.value }
                  })}
                  sx={{ mb: 3 }}
                />
                
                <TextField
                  fullWidth
                  label="Content"
                  multiline
                  rows={4}
                  value={selectedSection.content[currentLanguage]}
                  onChange={(e) => setSelectedSection({
                    ...selectedSection,
                    content: { ...selectedSection.content, [currentLanguage]: e.target.value }
                  })}
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveSection} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CMSDashboard; 