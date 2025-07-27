import React, { useState, useEffect } from 'react';
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
  Snackbar,
  Alert,
  CircularProgress
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
import { CMSService, initializeDefaultContent } from '../../services/cmsService';
import type { SectionData } from '../../services/cmsService';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';

interface CMSDashboardProps {
  onClose: () => void;
}



const CMSDashboard: React.FC<CMSDashboardProps> = ({ onClose }) => {
  const [selectedSection, setSelectedSection] = useState<SectionData | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ja'>('en');
  const [sections, setSections] = useState<SectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Load sections from Firebase
  useEffect(() => {
    const loadSections = async () => {
      try {
        setLoading(true);
        await initializeDefaultContent(); // Initialize if empty
        const sectionsData = await CMSService.getSections();
        setSections(sectionsData);
      } catch (error) {
        console.error('Error loading sections:', error);
        setSnackbar({
          open: true,
          message: 'Error loading content. Please check your Firebase configuration.',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    loadSections();
  }, []);



  const handleEditSection = (section: SectionData) => {
    setSelectedSection(section);
    setEditDialogOpen(true);
  };

  const handleSaveSection = async () => {
    if (selectedSection) {
      try {
        setSaving(true);
        const success = await CMSService.saveSection(selectedSection);
        if (success) {
          setSections(prev => 
            prev.map(section => 
              section.id === selectedSection.id ? selectedSection : section
            )
          );
          setSnackbar({
            open: true,
            message: 'Section saved successfully!',
            severity: 'success'
          });
        } else {
          setSnackbar({
            open: true,
            message: 'Error saving section. Please try again.',
            severity: 'error'
          });
        }
              } catch {
          setSnackbar({
            open: true,
            message: 'Error saving section. Please try again.',
            severity: 'error'
          });
      } finally {
        setSaving(false);
      }
    }
    setEditDialogOpen(false);
    setSelectedSection(null);
  };

  const handleToggleVisibility = async (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (section) {
      try {
        const success = await CMSService.updateSection(sectionId, { visible: !section.visible });
        if (success) {
          setSections(prev =>
            prev.map(section =>
              section.id === sectionId ? { ...section, visible: !section.visible } : section
            )
          );
        }
              } catch {
          setSnackbar({
            open: true,
            message: 'Error updating section visibility.',
            severity: 'error'
          });
      }
    }
  };

  const handlePublish = async () => {
    try {
      setSaving(true);
      const success = await CMSService.publishChanges();
      if (success) {
        setSnackbar({
          open: true,
          message: 'Changes published successfully!',
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Error publishing changes. Please try again.',
          severity: 'error'
        });
      }
    } catch {
      setSnackbar({
        open: true,
        message: 'Error publishing changes. Please try again.',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
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
              disabled={saving}
            >
              {saving ? 'Publishing...' : 'Publish Changes'}
            </Button>
            <Button
              variant="outlined"
              onClick={async () => {
                await signOut(auth);
                onClose();
              }}
            >
              Logout
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
              
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                sections.map(renderSectionCard)
              )}
              
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
              <Tabs value={currentLanguage === 'en' ? 0 : 1} onChange={(_, value) => setCurrentLanguage(value === 0 ? 'en' : 'ja')}>
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

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CMSDashboard; 