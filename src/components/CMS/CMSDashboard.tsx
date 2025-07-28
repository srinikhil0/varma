import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
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
  Snackbar,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Preview,
  Publish,
  Delete,
  Upload,
  FileUpload,
  Description,
  CloudUpload,
  InsertDriveFile,
  Download
} from '@mui/icons-material';
import { CMSService, initializeDefaultContent } from '../../services/cmsService';
import type { SectionData } from '../../services/cmsService';
import { signOut } from 'firebase/auth';
import { auth, storage, db } from '../../config/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';

interface CMSDashboardProps {
  onClose: () => void;
}

interface FileUpload {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document';
  size: number;
  uploadedAt: Date;
}

const CMSDashboard: React.FC<CMSDashboardProps> = ({ onClose }) => {
  const [previewMode, setPreviewMode] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ja'>('en');
  const [sections, setSections] = useState<SectionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'image' | 'document'>('image');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Profile data state
  const [profileData, setProfileData] = useState({
    name: 'Dr. Venkata Sai Varma',
    title: 'Materials & Electronics Engineer',
    overview: 'Materials & Electronics Engineer specializing in nanotechnology and sustainable energy solutions.',
    about: 'Dedicated researcher with over 8 years of experience in materials science and electronics engineering. Passionate about advancing technology for sustainable development and contributing to breakthrough innovations in nanotechnology.',
    education: 'Ph.D. in Materials Science, University of Technology, 2020, Specialized in advanced semiconductor materials and quantum electronics\nM.S. in Electronics Engineering, Institute of Advanced Studies, 2017, Focused on microelectronics and device physics\nB.S. in Physics, National University, 2015, Major in solid-state physics and materials science',
    experience: 'Senior Research Engineer, Advanced Materials Institute, 2020-Present, Leading research in quantum materials and electronic devices\nResearch Associate, Electronics Research Lab, 2017-2020, Developed novel semiconductor materials and devices\nGraduate Researcher, Materials Science Department, 2015-2017, Conducted research on energy storage materials',
    research: 'Quantum Materials\nSemiconductor Physics\nNanotechnology\nEnergy Storage\nElectronic Devices\nMaterials Characterization',
    skills: 'Materials Synthesis\nDevice Fabrication\nCharacterization Techniques\nData Analysis\nSimulation Tools\nLaboratory Management',
    researchProjects: 'Quantum Materials for Next-Gen Electronics, Developing novel quantum materials with unique electronic properties for advanced computing applications, https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400, Quantum Materials|Electronics|Computing, Active\nSustainable Energy Storage Solutions, Researching advanced battery technologies and energy storage systems for renewable energy integration, https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400, Energy Storage|Batteries|Renewable Energy, Active\nNanomaterials for Biomedical Applications, Exploring the use of nanomaterials in medical devices and drug delivery systems, https://images.unsplash.com/photo-1576086213369-97a306d36557?w=400, Nanomaterials|Biomedical|Drug Delivery, Active',
    publications: 'Advanced Quantum Materials for Electronic Applications, Nature Materials, 2024, Dr. [Name] et al., 10.1038/s41563-024-00000-0, High Impact\nNovel Energy Storage Materials: A Comprehensive Review, Advanced Materials, 2023, Dr. [Name] et al., 10.1002/adma.202300000, High Impact\nNanomaterials in Biomedical Engineering, Science Advances, 2023, Dr. [Name] et al., 10.1126/sciadv.abc0000, High Impact',
    achievements: 'Best Paper Award, Recognized for outstanding contribution to materials science, 2024\nResearch Grant, Secured $2M funding for quantum materials research, 2023\nPatent Awarded, Novel energy storage device technology, 2023',
    email: 'venkatasaivarma28@gmail.com',
    linkedin: 'https://linkedin.com/in/venkatasaivarma',
    location: 'Tokyo, Japan',
    phone: '+81-XX-XXXX-XXXX',
    // Statistics
    yearsExperience: '8',
    publicationsCount: '25',
    projectsCount: '15'
  });

  // Load sections and files from Firebase
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await initializeDefaultContent();
        const sectionsData = await CMSService.getSections();
        setSections(sectionsData);
        await loadFiles();
      } catch (error) {
        console.error('Error loading data:', error);
        setSnackbar({
          open: true,
          message: 'Error loading content. Please check your Firebase configuration.',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const loadFiles = async () => {
    try {
      const storageRef = ref(storage, 'uploads/');
      const result = await listAll(storageRef);
      const filePromises = result.items.map(async (item) => {
        const url = await getDownloadURL(item);
        return {
          id: item.name,
          name: item.name,
          url,
          type: (item.name.includes('.pdf') || item.name.includes('.doc')) ? 'document' as const : 'image' as const,
          size: 0, // We'll get this from the actual file if needed
          uploadedAt: new Date()
        };
      });
      const fileList = await Promise.all(filePromises);
      setFiles(fileList);
    } catch (error) {
      console.error('Error loading files:', error);
      // Show user-friendly error message for CORS issues
      if (error instanceof Error && error.message.includes('CORS')) {
        setSnackbar({
          open: true,
          message: 'Firebase Storage not configured. Please check the setup guide.',
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

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      
      // Parse education data
      const educationEntries = profileData.education
        .split('\n')
        .filter(line => line.trim())
        .map(line => {
          const parts = line.split(',').map(part => part.trim());
          return {
            degree: parts[0] || '',
            institution: parts[1] || '',
            year: parts[2] || '',
            description: parts[3] || ''
          };
        });

      // Parse experience data
      const experienceEntries = profileData.experience
        .split('\n')
        .filter(line => line.trim())
        .map(line => {
          const parts = line.split(',').map(part => part.trim());
          return {
            position: parts[0] || '',
            institution: parts[1] || '',
            year: parts[2] || '',
            description: parts[3] || ''
          };
        });

      // Parse research areas
      const researchAreas = profileData.research
        .split('\n')
        .filter(line => line.trim());

      // Parse skills
      const skills = profileData.skills
        .split('\n')
        .filter(line => line.trim());

      // Parse research projects
      const researchProjects = profileData.researchProjects
        .split('\n')
        .filter(line => line.trim())
        .map(line => {
          const parts = line.split(',').map(part => part.trim());
          return {
            title: parts[0] || '',
            description: parts[1] || '',
            image: parts[2] || '',
            tags: parts[3] ? parts[3].split('|').map(tag => tag.trim()) : [],
            status: parts[4] || 'Active'
          };
        });

      // Parse publications
      const publications = profileData.publications
        .split('\n')
        .filter(line => line.trim())
        .map(line => {
          const parts = line.split(',').map(part => part.trim());
          return {
            title: parts[0] || '',
            journal: parts[1] || '',
            year: parts[2] || '',
            authors: parts[3] || '',
            doi: parts[4] || '',
            impact: parts[5] || 'High Impact'
          };
        });

      // Parse achievements
      const achievements = profileData.achievements
        .split('\n')
        .filter(line => line.trim())
        .map(line => {
          const parts = line.split(',').map(part => part.trim());
          return {
            title: parts[0] || '',
            description: parts[1] || '',
            year: parts[2] || ''
          };
        });
      
      // Update all sections with the new profile data
      const updatedSections = [
        {
          id: 'hero',
          type: 'hero' as const,
          title: { en: profileData.name, ja: profileData.name },
          content: { en: profileData.overview, ja: profileData.overview },
          visible: true,
          order: 1,
          lastModified: new Date()
        },
        {
          id: 'about',
          type: 'about' as const,
          title: { en: 'About Me', ja: '私について' },
          content: { en: profileData.about, ja: profileData.about },
          visible: true,
          order: 2,
          lastModified: new Date()
        },
        {
          id: 'education',
          type: 'education' as const,
          title: { en: 'Education', ja: '学歴' },
          content: { 
            en: JSON.stringify(educationEntries), 
            ja: JSON.stringify(educationEntries) 
          },
          visible: true,
          order: 3,
          lastModified: new Date()
        },
        {
          id: 'experience',
          type: 'experience' as const,
          title: { en: 'Work Experience', ja: '職歴' },
          content: { 
            en: JSON.stringify(experienceEntries), 
            ja: JSON.stringify(experienceEntries) 
          },
          visible: true,
          order: 4,
          lastModified: new Date()
        },
        {
          id: 'research',
          type: 'research' as const,
          title: { en: 'Research Areas', ja: '研究分野' },
          content: { 
            en: JSON.stringify(researchAreas), 
            ja: JSON.stringify(researchAreas) 
          },
          visible: true,
          order: 5,
          lastModified: new Date()
        },
        {
          id: 'skills',
          type: 'skills' as const,
          title: { en: 'Skills & Expertise', ja: 'スキル・専門知識' },
          content: { 
            en: JSON.stringify(skills), 
            ja: JSON.stringify(skills) 
          },
          visible: true,
          order: 6,
          lastModified: new Date()
        },
        {
          id: 'research-projects',
          type: 'research' as const,
          title: { en: 'Research Projects', ja: '研究プロジェクト' },
          content: { 
            en: JSON.stringify(researchProjects), 
            ja: JSON.stringify(researchProjects) 
          },
          visible: true,
          order: 7,
          lastModified: new Date()
        },
        {
          id: 'publications',
          type: 'publications' as const,
          title: { en: 'Publications', ja: '論文・出版物' },
          content: { 
            en: JSON.stringify(publications), 
            ja: JSON.stringify(publications) 
          },
          visible: true,
          order: 8,
          lastModified: new Date()
        },
        {
          id: 'achievements',
          type: 'awards' as const,
          title: { en: 'Key Achievements', ja: '主要な成果' },
          content: { 
            en: JSON.stringify(achievements), 
            ja: JSON.stringify(achievements) 
          },
          visible: true,
          order: 9,
          lastModified: new Date()
        },
        {
          id: 'contact',
          type: 'contact' as const,
          title: { en: 'Contact Information', ja: '連絡先' },
          content: { 
            en: `Email: ${profileData.email}\nLinkedIn: ${profileData.linkedin}\nLocation: ${profileData.location}\nPhone: ${profileData.phone}`, 
            ja: `メール: ${profileData.email}\nLinkedIn: ${profileData.linkedin}\n所在地: ${profileData.location}\n電話: ${profileData.phone}` 
          },
          visible: true,
          order: 10,
          lastModified: new Date()
        },
        {
          id: 'statistics',
          type: 'awards' as const,
          title: { en: 'Statistics', ja: '統計' },
          content: { 
            en: `Years of Experience: ${profileData.yearsExperience}+\nPublications: ${profileData.publicationsCount}+\nProjects Completed: ${profileData.projectsCount}+`, 
            ja: `研究年数: ${profileData.yearsExperience}+\n論文数: ${profileData.publicationsCount}+\n完了プロジェクト数: ${profileData.projectsCount}+` 
          },
          visible: true,
          order: 11,
          lastModified: new Date()
        }
      ];

      // Save all sections
      for (const section of updatedSections) {
        await CMSService.saveSection(section);
      }

      // Update local state
      setSections(updatedSections);
      
      setSnackbar({
        open: true,
        message: 'Profile saved successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      setSnackbar({
        open: true,
        message: 'Error saving profile. Please try again.',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      const timestamp = Date.now();
      const fileName = `${uploadType}/${timestamp}_${selectedFile.name}`;
      const storageRef = ref(storage, `uploads/${fileName}`);
      
      await uploadBytes(storageRef, selectedFile);
      const downloadURL = await getDownloadURL(storageRef);
      
      const newFile: FileUpload = {
        id: fileName,
        name: selectedFile.name,
        url: downloadURL,
        type: uploadType,
        size: selectedFile.size,
        uploadedAt: new Date()
      };
      
      setFiles(prev => [...prev, newFile]);
      setUploadDialogOpen(false);
      setSelectedFile(null);
      setSnackbar({
        open: true,
        message: 'File uploaded successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      let errorMessage = 'Error uploading file. Please try again.';
      
      // Provide specific error messages for common issues
      if (error instanceof Error) {
        if (error.message.includes('CORS')) {
          errorMessage = 'Firebase Storage CORS not configured. Please check the setup guide.';
        } else if (error.message.includes('unauthorized')) {
          errorMessage = 'Authentication required. Please log in again.';
        } else if (error.message.includes('quota')) {
          errorMessage = 'Storage quota exceeded. Please contact administrator.';
        }
      }
      
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      const storageRef = ref(storage, `uploads/${fileId}`);
      await deleteObject(storageRef);
      setFiles(prev => prev.filter(file => file.id !== fileId));
      setSnackbar({
        open: true,
        message: 'File deleted successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      setSnackbar({
        open: true,
        message: 'Error deleting file. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleDownloadFile = async (file: FileUpload) => {
    try {
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setSnackbar({
        open: true,
        message: 'Download started!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      setSnackbar({
        open: true,
        message: 'Error downloading file. Please try again.',
        severity: 'error'
      });
    }
  };

  const handleSetAsCV = async (fileId: string) => {
    try {
      // Save the CV file ID to a special field in the profile data
      const updatedProfileData = { ...profileData, cvFileId: fileId };
      setProfileData(updatedProfileData);
      
      // Save this information to Firebase
      const docRef = doc(db, 'website-settings', 'cv-settings');
      await setDoc(docRef, {
        cvFileId: fileId,
        lastUpdated: new Date()
      });
      
      setSnackbar({
        open: true,
        message: 'CV file set successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error setting CV file:', error);
      setSnackbar({
        open: true,
        message: 'Error setting CV file. Please try again.',
        severity: 'error'
      });
    }
  };



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

        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Left Panel - Content Sections */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value)}>
                  <Tab label="Website Sections" />
                  <Tab label="File Management" />
                </Tabs>
              </Box>

              {activeTab === 0 && (
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                    Profile Editor
                  </Typography>
                  
                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <Box component="form" onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }}>
                      <Grid container spacing={3}>
                        {/* 1. Basic Information */}
                        <Grid size={12}>
                          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                            1. Basic Information
                          </Typography>
                        </Grid>
                        
                        <Grid size={6}>
                          <TextField
                            fullWidth
                            label="Full Name"
                            value={profileData.name}
                            onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                            sx={{ mb: 2 }}
                          />
                        </Grid>
                        
                        <Grid size={6}>
                          <TextField
                            fullWidth
                            label="Professional Title"
                            value={profileData.title}
                            onChange={(e) => setProfileData(prev => ({ ...prev, title: e.target.value }))}
                            sx={{ mb: 2 }}
                          />
                        </Grid>
                        
                        <Grid size={12}>
                          <TextField
                            fullWidth
                            label="Quick Overview"
                            multiline
                            rows={3}
                            value={profileData.overview}
                            onChange={(e) => setProfileData(prev => ({ ...prev, overview: e.target.value }))}
                            sx={{ mb: 2 }}
                            helperText="Brief professional summary (appears in hero section)"
                          />
                        </Grid>

                        {/* 2. Statistics */}
                        <Grid size={12}>
                          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', mt: 2 }}>
                            2. Statistics (Hero Section)
                          </Typography>
                        </Grid>
                        
                        <Grid size={4}>
                          <TextField
                            fullWidth
                            label="Years of Experience"
                            value={profileData.yearsExperience}
                            onChange={(e) => setProfileData(prev => ({ ...prev, yearsExperience: e.target.value }))}
                            sx={{ mb: 2 }}
                            helperText="Number of years (e.g., 8)"
                          />
                        </Grid>
                        
                        <Grid size={4}>
                          <TextField
                            fullWidth
                            label="Publications Count"
                            value={profileData.publicationsCount}
                            onChange={(e) => setProfileData(prev => ({ ...prev, publicationsCount: e.target.value }))}
                            sx={{ mb: 2 }}
                            helperText="Number of publications (e.g., 25)"
                          />
                        </Grid>
                        
                        <Grid size={4}>
                          <TextField
                            fullWidth
                            label="Projects Count"
                            value={profileData.projectsCount}
                            onChange={(e) => setProfileData(prev => ({ ...prev, projectsCount: e.target.value }))}
                            sx={{ mb: 2 }}
                            helperText="Number of projects (e.g., 15)"
                          />
                        </Grid>

                        {/* 3. About Me Section */}
                        <Grid size={12}>
                          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', mt: 2 }}>
                            3. About Me
                          </Typography>
                        </Grid>
                        
                        <Grid size={12}>
                          <TextField
                            fullWidth
                            label="About Me Description"
                            multiline
                            rows={4}
                            value={profileData.about}
                            onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))}
                            sx={{ mb: 2 }}
                            helperText="Detailed description about your background, expertise, and research focus"
                          />
                        </Grid>

                        {/* 4. Education */}
                        <Grid size={12}>
                          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', mt: 2 }}>
                            4. Education
                          </Typography>
                        </Grid>
                        
                        <Grid size={12}>
                          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                            Add your educational background (one entry per line, format: Degree, Institution, Year, Description)
                          </Typography>
                        </Grid>
                        
                        <Grid size={12}>
                          <TextField
                            fullWidth
                            label="Education Details"
                            multiline
                            rows={6}
                            value={profileData.education}
                            onChange={(e) => setProfileData(prev => ({ ...prev, education: e.target.value }))}
                            sx={{ mb: 2 }}
                            helperText="Format: Ph.D. in Materials Science, University of Technology, 2020, Specialized in advanced semiconductor materials"
                          />
                        </Grid>

                        {/* 5. Work Experience */}
                        <Grid size={12}>
                          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', mt: 2 }}>
                            5. Work Experience
                          </Typography>
                        </Grid>
                        
                        <Grid size={12}>
                          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                            Add your work experience (one entry per line, format: Position, Company, Years, Description)
                          </Typography>
                        </Grid>
                        
                        <Grid size={12}>
                          <TextField
                            fullWidth
                            label="Work Experience Details"
                            multiline
                            rows={6}
                            value={profileData.experience}
                            onChange={(e) => setProfileData(prev => ({ ...prev, experience: e.target.value }))}
                            sx={{ mb: 2 }}
                            helperText="Format: Senior Research Engineer, Advanced Materials Institute, 2020-Present, Leading research in quantum materials"
                          />
                        </Grid>

                        {/* 6. Research Areas */}
                        <Grid size={12}>
                          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', mt: 2 }}>
                            6. Research Areas
                          </Typography>
                        </Grid>
                        
                        <Grid size={12}>
                          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                            Add your research areas (one per line, will be displayed as chips)
                          </Typography>
                        </Grid>
                        
                        <Grid size={12}>
                          <TextField
                            fullWidth
                            label="Research Areas & Specializations"
                            multiline
                            rows={4}
                            value={profileData.research}
                            onChange={(e) => setProfileData(prev => ({ ...prev, research: e.target.value }))}
                            sx={{ mb: 2 }}
                            helperText="One research area per line (e.g., Quantum Materials, Nanotechnology, Energy Storage)"
                          />
                        </Grid>

                        {/* 7. Skills & Expertise */}
                        <Grid size={12}>
                          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', mt: 2 }}>
                            7. Skills & Expertise
                          </Typography>
                        </Grid>
                        
                        <Grid size={12}>
                          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                            Add your technical skills (one per line, will be displayed as chips)
                          </Typography>
                        </Grid>
                        
                        <Grid size={12}>
                          <TextField
                            fullWidth
                            label="Technical Skills & Competencies"
                            multiline
                            rows={4}
                            value={profileData.skills}
                            onChange={(e) => setProfileData(prev => ({ ...prev, skills: e.target.value }))}
                            sx={{ mb: 2 }}
                            helperText="One skill per line (e.g., Materials Synthesis, Device Fabrication, Data Analysis)"
                          />
                        </Grid>

                        {/* 8. Research Projects */}
                        <Grid size={12}>
                          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', mt: 2 }}>
                            8. Research Projects
                          </Typography>
                        </Grid>
                        
                        <Grid size={12}>
                          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                            Add your research projects (one project per line, format: Title, Description, Image URL, Tags, Status)
                          </Typography>
                        </Grid>
                        
                        <Grid size={12}>
                          <TextField
                            fullWidth
                            label="Research Projects"
                            multiline
                            rows={8}
                            value={profileData.researchProjects}
                            onChange={(e) => setProfileData(prev => ({ ...prev, researchProjects: e.target.value }))}
                            sx={{ mb: 2 }}
                            helperText="Format: Quantum Materials for Next-Gen Electronics, Developing novel quantum materials, https://image-url.com, Quantum Materials|Electronics|Computing, Active"
                          />
                        </Grid>

                        {/* 9. Publications */}
                        <Grid size={12}>
                          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', mt: 2 }}>
                            9. Publications
                          </Typography>
                        </Grid>
                        
                        <Grid size={12}>
                          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                            Add your publications (one publication per line, format: Title, Journal, Year, Authors, DOI, Impact)
                          </Typography>
                        </Grid>
                        
                        <Grid size={12}>
                          <TextField
                            fullWidth
                            label="Publications"
                            multiline
                            rows={6}
                            value={profileData.publications}
                            onChange={(e) => setProfileData(prev => ({ ...prev, publications: e.target.value }))}
                            sx={{ mb: 2 }}
                            helperText="Format: Advanced Quantum Materials, Nature Materials, 2024, Dr. [Name] et al., 10.1038/s41563-024-00000-0, High Impact"
                          />
                        </Grid>

                        {/* 10. Key Achievements */}
                        <Grid size={12}>
                          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', mt: 2 }}>
                            10. Key Achievements
                          </Typography>
                        </Grid>
                        
                        <Grid size={12}>
                          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                            Add your key achievements (one achievement per line, format: Title, Description, Year)
                          </Typography>
                        </Grid>
                        
                        <Grid size={12}>
                          <TextField
                            fullWidth
                            label="Key Achievements"
                            multiline
                            rows={4}
                            value={profileData.achievements}
                            onChange={(e) => setProfileData(prev => ({ ...prev, achievements: e.target.value }))}
                            sx={{ mb: 2 }}
                            helperText="Format: Best Paper Award, Recognized for outstanding contribution to materials science, 2024"
                          />
                        </Grid>

                        {/* Save Button */}
                        <Grid size={12}>
                          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                            <Button
                              type="submit"
                              variant="contained"
                              size="large"
                              disabled={saving}
                              startIcon={saving ? <CircularProgress size={20} /> : null}
                            >
                              {saving ? 'Saving...' : 'Save Profile'}
                            </Button>
                            <Button
                              variant="outlined"
                              size="large"
                              onClick={handlePublish}
                            >
                              Publish Changes
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </Box>
              )}

              {activeTab === 1 && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      File Management
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<Upload />}
                      onClick={() => setUploadDialogOpen(true)}
                    >
                      Upload File
                    </Button>
                  </Box>



                  <Grid container spacing={2}>
                    <Grid size={6}>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Images ({files.filter(f => f.type === 'image').length})
                      </Typography>
                      <List>
                        {files.filter(f => f.type === 'image').map((file) => (
                          <ListItem key={file.id} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mb: 1 }}>
                            <Avatar src={file.url} sx={{ mr: 2 }} />
                            <ListItemText
                              primary={file.name}
                              secondary={`${(file.size / 1024).toFixed(1)} KB`}
                            />
                            <ListItemSecondaryAction>
                              <IconButton
                                edge="end"
                                onClick={() => handleDownloadFile(file)}
                                sx={{ mr: 1 }}
                                title="Download"
                              >
                                <Download />
                              </IconButton>
                              <IconButton
                                edge="end"
                                onClick={() => handleDeleteFile(file.id)}
                                title="Delete"
                              >
                                <Delete />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                    <Grid size={6}>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Documents ({files.filter(f => f.type === 'document').length})
                      </Typography>
                      <List>
                        {files.filter(f => f.type === 'document').map((file) => (
                          <ListItem key={file.id} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mb: 1 }}>
                            <Avatar sx={{ mr: 2 }}>
                              <InsertDriveFile />
                            </Avatar>
                            <ListItemText
                              primary={file.name}
                              secondary={`${(file.size / 1024).toFixed(1)} KB`}
                            />
                            <ListItemSecondaryAction>
                              <IconButton
                                edge="end"
                                onClick={() => handleDownloadFile(file)}
                                sx={{ mr: 1 }}
                                title="Download"
                              >
                                <Download />
                              </IconButton>
                              <IconButton
                                edge="end"
                                onClick={() => handleSetAsCV(file.id)}
                                sx={{ mr: 1 }}
                                title="Set as CV"
                              >
                                <Description />
                              </IconButton>
                              <IconButton
                                edge="end"
                                onClick={() => handleDeleteFile(file.id)}
                                title="Delete"
                              >
                                <Delete />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                  </Grid>
                </Box>
              )}


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
                startIcon={<Description />}
                sx={{ mb: 2 }}
                onClick={() => {
                  setUploadType('document');
                  setUploadDialogOpen(true);
                }}
              >
                Upload CV/Document
              </Button>
            </Paper>

            {/* Get In Touch */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Get In Touch
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                  Contact Information
                </Typography>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  sx={{ mb: 2 }}
                  size="small"
                />
                <TextField
                  fullWidth
                  label="LinkedIn Profile"
                  value={profileData.linkedin}
                  onChange={(e) => setProfileData(prev => ({ ...prev, linkedin: e.target.value }))}
                  sx={{ mb: 2 }}
                  size="small"
                  helperText="Your LinkedIn profile URL"
                />
                <TextField
                  fullWidth
                  label="Location"
                  value={profileData.location}
                  onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                  sx={{ mb: 2 }}
                  size="small"
                  helperText="e.g., Tokyo, Japan"
                />
                <TextField
                  fullWidth
                  label="Phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  sx={{ mb: 2 }}
                  size="small"
                  helperText="e.g., +81-XX-XXXX-XXXX"
                />
              </Box>

              <Box>
                <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                  Research Interests
                </Typography>
                <TextField
                  fullWidth
                  label="Research Interests"
                  multiline
                  rows={3}
                  value={profileData.research}
                  onChange={(e) => setProfileData(prev => ({ ...prev, research: e.target.value }))}
                  sx={{ mb: 2 }}
                  size="small"
                  helperText="One interest per line (will be displayed as tags)"
                />
              </Box>
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
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Uploaded Files
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {files.length}
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



      {/* Upload Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Upload {uploadType === 'image' ? 'Image' : 'Document'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>File Type</InputLabel>
              <Select
                value={uploadType}
                onChange={(e) => setUploadType(e.target.value as 'image' | 'document')}
              >
                <MenuItem value="image">Image</MenuItem>
                <MenuItem value="document">Document (CV, PDF, etc.)</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<CloudUpload />}
              sx={{ mb: 2 }}
            >
              Choose File
              <input
                type="file"
                hidden
                accept={uploadType === 'image' ? 'image/*' : '.pdf,.doc,.docx'}
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
            </Button>

            {selectedFile && (
              <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="body2">
                  Selected: {selectedFile.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Size: {(selectedFile.size / 1024).toFixed(1)} KB
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleFileUpload} 
            variant="contained" 
            disabled={!selectedFile || uploading}
          >
            {uploading ? 'Uploading...' : 'Upload'}
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