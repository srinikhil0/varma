import React, { useState, useEffect, useCallback } from 'react';
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
  InputLabel,
  Chip
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
import type { 
  DynamicContentData, 
  SkillsData, 
  ResearchProject, 
  Publication, 
  AwardsData 
} from '../../services/cmsService';
import { TranslationService } from '../../services/translationService';
import { signOut } from 'firebase/auth';
import { auth, storage, db } from '../../config/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { doc, setDoc, collection, query, orderBy, onSnapshot, updateDoc, deleteDoc } from 'firebase/firestore';

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

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: Date;
  status: 'new' | 'read' | 'replied';
}

const CMSDashboard: React.FC<CMSDashboardProps> = ({ onClose }) => {
  const [previewMode, setPreviewMode] = useState(false);
  const [sections, setSections] = useState<DynamicContentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'image' | 'document'>('image');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Translation state
  const [translationEnabled] = useState(TranslationService.isInitialized());
  const [translationMemoryStats, setTranslationMemoryStats] = useState({ totalEntries: 0, totalSize: 0 });

  // Contact messages state
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);

  // Email notification state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [adminEmail, setAdminEmail] = useState('admin@example.com');
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState('');

  // Profile data state - Empty by default with Japanese translations
  const [profileData, setProfileData] = useState({
    // English content
    name: '',
    title: '',
    overview: '',
    about: '',
    education: '',
    experience: '',
    research: '',
    skills: '',
    researchProjects: '',
    publications: '',
    achievements: '',
    email: '',
    linkedin: '',
    location: '',
    phone: '',
    // Statistics
    yearsExperience: '',
    publicationsCount: '',
    projectsCount: '',
    // Japanese translations
    nameJa: '',
    titleJa: '',
    overviewJa: '',
    aboutJa: '',
    educationJa: '',
    experienceJa: '',
    researchJa: '',
    skillsJa: '',
    researchProjectsJa: '',
    publicationsJa: '',
    achievementsJa: '',
    locationJa: '',
    phoneJa: ''
  });

  // Send email notification for new messages
  const sendEmailNotification = useCallback(async (message: ContactMessage) => {
    if (!emailNotifications) return;

    try {
      // In a real implementation, you would use a service like SendGrid, Mailgun, or Firebase Functions
      // For now, we'll simulate the email notification
      console.log('Email notification would be sent to:', adminEmail);
      console.log('New message from:', message.name, '(', message.email, ')');
      console.log('Subject:', message.subject);
      console.log('Message:', message.message);
      
      // You can integrate with services like:
      // - SendGrid: https://sendgrid.com/
      // - Mailgun: https://www.mailgun.com/
      // - Firebase Functions with Nodemailer
      // - EmailJS for client-side email sending
      
      setSnackbar({
        open: true,
        message: `Email notification sent for new message from ${message.name}`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error sending email notification:', error);
    }
  }, [emailNotifications, adminEmail]);

  const loadContactMessages = useCallback(async () => {
    try {
      setLoadingMessages(true);
      
      // Set up real-time listener for contact messages
      const messagesQuery = query(collection(db, 'contact-messages'), orderBy('timestamp', 'desc'));
      const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
        const messages: ContactMessage[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const message: ContactMessage = {
            id: doc.id,
            name: data.name || '',
            email: data.email || '',
            subject: data.subject || '',
            message: data.message || '',
            timestamp: data.timestamp?.toDate() || new Date(),
            status: data.status || 'new'
          };
          
          messages.push(message);
        });
        
        setContactMessages(messages);
        setLoadingMessages(false);
      });

      // Return unsubscribe function for cleanup
      return unsubscribe;
    } catch (error) {
      console.error('Error loading contact messages:', error);
      setLoadingMessages(false);
    }
  }, []);

  // Handle email notifications for new messages
  useEffect(() => {
    if (contactMessages.length > 0 && emailNotifications) {
      const newMessages = contactMessages.filter(msg => msg.status === 'new');
      newMessages.forEach(message => {
        sendEmailNotification(message);
      });
    }
  }, [contactMessages, emailNotifications, sendEmailNotification]);

  // Load sections and files from Firebase
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Only initialize default content if database is truly empty
        const sectionsData = await CMSService.getSections();
        if (sectionsData.length === 0) {
          console.log('Database is empty, initializing default content...');
          await initializeDefaultContent();
          // Reload sections after initialization
          const updatedSections = await CMSService.getSections();
          setSections(updatedSections);
        } else {
          setSections(sectionsData);
        }
        
        await loadFiles();
        await loadContactMessages();
        
        // Load translation memory stats
        const stats = TranslationService.getMemoryStats();
        setTranslationMemoryStats(stats);
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
  }, [loadContactMessages]);

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

  // Auto-translate English content to Japanese (only for dynamic content)
  const handleAutoTranslate = async (field: string) => {
    if (!translationEnabled) {
      setSnackbar({
        open: true,
        message: 'Translation service not initialized. Please check your API key.',
        severity: 'error'
      });
      return;
    }

    const englishText = profileData[field as keyof typeof profileData] as string;
    if (!englishText.trim()) {
      setSnackbar({
        open: true,
        message: 'Please enter English content first.',
        severity: 'error'
      });
      return;
    }

    try {
      setSaving(true);
      const result = await TranslationService.translateToJapanese(englishText);
      
      if (result.translatedText) {
        const japaneseField = `${field}Ja` as keyof typeof profileData;
        setProfileData(prev => ({
          ...prev,
          [japaneseField]: result.translatedText
        }));
        
        setSnackbar({
          open: true,
          message: `Translated ${field} to Japanese successfully!`,
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: 'Translation failed. Please try again.',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Translation error:', error);
      setSnackbar({
        open: true,
        message: 'Translation failed. Please check your API key.',
        severity: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  // Auto-translate all dynamic content to Japanese (static content is hardcoded)
  const handleTranslateAll = async () => {
    if (!translationEnabled) {
      setSnackbar({
        open: true,
        message: 'Translation service not initialized. Please check your API key.',
        severity: 'error'
      });
      return;
    }

    try {
      setSaving(true);
      
      // Only translate dynamic content fields (user's personal information)
      const dynamicFieldsToTranslate = [
        'name', 'title', 'overview', 'about', 'education', 'experience', 
        'research', 'skills', 'researchProjects', 'publications', 'achievements',
        'location', 'phone'
      ];

      let translatedCount = 0;
      for (const field of dynamicFieldsToTranslate) {
        const englishText = profileData[field as keyof typeof profileData] as string;
        if (englishText.trim()) {
          const result = await TranslationService.translateToJapanese(englishText);
          if (result.translatedText) {
            const japaneseField = `${field}Ja` as keyof typeof profileData;
            setProfileData(prev => ({
              ...prev,
              [japaneseField]: result.translatedText
            }));
            translatedCount++;
          }
        }
      }

      setSnackbar({
        open: true,
        message: `Translated ${translatedCount} dynamic content fields to Japanese successfully!`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Batch translation error:', error);
      setSnackbar({
        open: true,
        message: 'Translation failed. Please try again.',
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

      // Parse Japanese education data
      const educationEntriesJa = profileData.educationJa
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

      // Parse Japanese experience data
      const experienceEntriesJa = profileData.experienceJa
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

      // Parse Japanese research areas
      const researchAreasJa = profileData.researchJa
        .split('\n')
        .filter(line => line.trim());

      // Parse skills
      const skills = profileData.skills
        .split('\n')
        .filter(line => line.trim());

      // Parse Japanese skills
      const skillsJa = profileData.skillsJa
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
      
      // Create sections with new data structure
      const updatedSections: DynamicContentData[] = [
        {
          id: 'hero',
          type: 'hero',
          data: {
            en: {
              name: profileData.name,
              title: profileData.title,
              subtitle: 'Research Specialist',
              description: profileData.overview,
              statistics: {
                yearsOfExperience: `${profileData.yearsExperience}+`,
                publicationsCount: `${profileData.publicationsCount}+`,
                projectsCount: `${profileData.projectsCount}+`
              }
            },
            ja: {
              name: profileData.nameJa || profileData.name,
              title: profileData.titleJa || profileData.title,
              subtitle: '研究専門家',
              description: profileData.overviewJa || profileData.overview,
              statistics: {
                yearsOfExperience: `${profileData.yearsExperience}+`,
                publicationsCount: `${profileData.publicationsCount}+`,
                projectsCount: `${profileData.projectsCount}+`
              }
            }
          },
          visible: true,
          order: 1,
          lastModified: new Date()
        },
        {
          id: 'about',
          type: 'about',
          data: {
            en: {
              description: profileData.about,
              longDescription: profileData.about
            },
            ja: {
              description: profileData.aboutJa || profileData.about,
              longDescription: profileData.aboutJa || profileData.about
            }
          },
          visible: true,
          order: 2,
          lastModified: new Date()
        },
        {
          id: 'education',
          type: 'education',
          data: {
            en: educationEntries,
            ja: educationEntriesJa.length > 0 ? educationEntriesJa : educationEntries
          },
          visible: true,
          order: 3,
          lastModified: new Date()
        },
        {
          id: 'experience',
          type: 'experience',
          data: {
            en: experienceEntries,
            ja: experienceEntriesJa.length > 0 ? experienceEntriesJa : experienceEntries
          },
          visible: true,
          order: 4,
          lastModified: new Date()
        },
        {
          id: 'skills',
          type: 'skills',
          data: {
            en: {
              researchAreas: researchAreas,
              technicalSkills: skills
            } as SkillsData,
            ja: {
              researchAreas: researchAreasJa.length > 0 ? researchAreasJa : researchAreas,
              technicalSkills: skillsJa.length > 0 ? skillsJa : skills
            } as SkillsData
          },
          visible: true,
          order: 5,
          lastModified: new Date()
        },
        {
          id: 'research-projects',
          type: 'research-projects',
          data: {
            en: researchProjects as ResearchProject[],
            ja: researchProjects as ResearchProject[]
          },
          visible: true,
          order: 6,
          lastModified: new Date()
        },
        {
          id: 'publications',
          type: 'publications',
          data: {
            en: publications as Publication[],
            ja: publications as Publication[]
          },
          visible: true,
          order: 7,
          lastModified: new Date()
        },
        {
          id: 'awards',
          type: 'awards',
          data: {
            en: {
              awards: achievements
            } as AwardsData,
            ja: {
              awards: achievements
            } as AwardsData
          },
          visible: true,
          order: 8,
          lastModified: new Date()
        },
        {
          id: 'contact',
          type: 'contact',
          data: {
            en: {
              email: profileData.email,
              linkedin: profileData.linkedin,
              location: profileData.location,
              phone: profileData.phone
            },
            ja: {
              email: profileData.email,
              linkedin: profileData.linkedin,
              location: profileData.locationJa || profileData.location,
              phone: profileData.phoneJa || profileData.phone
            }
          },
          visible: true,
          order: 9,
          lastModified: new Date()
        }
      ];

      // Save all sections to Firestore
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

  // Handle replying to messages
  const handleReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;

    try {
      // In a real implementation, you would send the reply email here
      console.log('Reply would be sent to:', selectedMessage.email);
      console.log('Reply content:', replyText);
      
      // Update message status to replied
      const messageRef = doc(db, 'contact-messages', selectedMessage.id);
      await updateDoc(messageRef, { 
        status: 'replied',
        replySentAt: new Date(),
        replyContent: replyText
      });
      
      setSnackbar({
        open: true,
        message: `Reply sent to ${selectedMessage.name}`,
        severity: 'success'
      });
      
      // Close dialog and reset
      setReplyDialogOpen(false);
      setSelectedMessage(null);
      setReplyText('');
    } catch (error) {
      console.error('Error sending reply:', error);
      setSnackbar({
        open: true,
        message: 'Error sending reply',
        severity: 'error'
      });
    }
  };

  // Translation functions
  // TODO: Update translation functions for new data structure
  // const handleTranslateSection = async (section: DynamicContentData) => {
  //   console.log('Translation functions need to be updated for new data structure');
  //   setSnackbar({
  //     open: true,
  //     message: 'Translation feature temporarily disabled - needs update for new data structure',
  //     severity: 'info'
  //   });
  // };

  // const handleTranslateAllSections = async () => {
  //   console.log('Batch translation functions need to be updated for new data structure');
  //   setSnackbar({
  //     open: true,
  //     message: 'Batch translation feature temporarily disabled - needs update for new data structure',
  //     severity: 'info'
  //   });
  // };



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
            {translationEnabled && (
              <Button
                variant="contained"
                color="info"
                onClick={handleTranslateAll}
                disabled={saving}
                startIcon={<Description />}
              >
                {saving ? 'Translating...' : 'Auto-Translate Dynamic Content'}
              </Button>
            )}
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

        {/* Translation Status */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            💡 Translation Info: Static content (UI labels, buttons) uses hardcoded Japanese. 
            Only dynamic content (your personal info) uses Google Translate API.
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color={translationEnabled ? 'success.main' : 'error.main'}>
              Translation: {translationEnabled ? 'Available' : 'Not Available'}
            </Typography>
            {translationEnabled && (
              <Typography variant="body2" color="text.secondary">
                Memory: {translationMemoryStats.totalEntries} entries ({Math.round(translationMemoryStats.totalSize / 1024)}KB)
              </Typography>
            )}
          </Box>
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
                  <Tab 
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        Contact Messages
                        {contactMessages.filter(msg => msg.status === 'new').length > 0 && (
                          <Chip 
                            label={contactMessages.filter(msg => msg.status === 'new').length} 
                            color="error" 
                            size="small" 
                            sx={{ minWidth: 20, height: 20 }}
                          />
                        )}
                      </Box>
                    } 
                  />
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
                            label="Full Name (English)"
                            placeholder="Enter your full name"
                            value={profileData.name}
                            onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                            sx={{ mb: 2 }}
                          />
                        </Grid>
                        
                        <Grid size={6}>
                          <TextField
                            fullWidth
                            label="Professional Title (English)"
                            placeholder="e.g., Research Scientist, Professor, Data Analyst"
                            value={profileData.title}
                            onChange={(e) => setProfileData(prev => ({ ...prev, title: e.target.value }))}
                            sx={{ mb: 2 }}
                          />
                        </Grid>

                        {/* Japanese Translation Fields */}
                        <Grid size={6}>
                          <TextField
                            fullWidth
                            label="Full Name (日本語)"
                            placeholder="お名前を入力してください"
                            value={profileData.nameJa}
                            onChange={(e) => setProfileData(prev => ({ ...prev, nameJa: e.target.value }))}
                            sx={{ mb: 2 }}
                            InputProps={{
                              endAdornment: (
                                <Button
                                  size="small"
                                  onClick={() => handleAutoTranslate('name')}
                                  disabled={!profileData.name.trim() || !translationEnabled}
                                  sx={{ minWidth: 'auto', px: 1 }}
                                >
                                  <Description fontSize="small" />
                                </Button>
                              )
                            }}
                          />
                        </Grid>
                        
                        <Grid size={6}>
                          <TextField
                            fullWidth
                            label="Professional Title (日本語)"
                            placeholder="例：研究科学者、教授、データアナリスト"
                            value={profileData.titleJa}
                            onChange={(e) => setProfileData(prev => ({ ...prev, titleJa: e.target.value }))}
                            sx={{ mb: 2 }}
                            InputProps={{
                              endAdornment: (
                                <Button
                                  size="small"
                                  onClick={() => handleAutoTranslate('title')}
                                  disabled={!profileData.title.trim() || !translationEnabled}
                                  sx={{ minWidth: 'auto', px: 1 }}
                                >
                                  <Description fontSize="small" />
                                </Button>
                              )
                            }}
                          />
                        </Grid>
                        
                        <Grid size={12}>
                          <TextField
                            fullWidth
                            label="Quick Overview (English)"
                            placeholder="Brief description of your expertise and specialization areas"
                            multiline
                            rows={3}
                            value={profileData.overview}
                            onChange={(e) => setProfileData(prev => ({ ...prev, overview: e.target.value }))}
                            sx={{ mb: 2 }}
                            helperText="Brief professional summary (appears in hero section)"
                          />
                        </Grid>

                        <Grid size={12}>
                          <TextField
                            fullWidth
                            label="Quick Overview (日本語)"
                            placeholder="専門知識と専門分野の簡単な説明"
                            multiline
                            rows={3}
                            value={profileData.overviewJa}
                            onChange={(e) => setProfileData(prev => ({ ...prev, overviewJa: e.target.value }))}
                            sx={{ mb: 2 }}
                            helperText="専門的な要約（ヒーローセクションに表示）"
                            InputProps={{
                              endAdornment: (
                                <Button
                                  size="small"
                                  onClick={() => handleAutoTranslate('overview')}
                                  disabled={!profileData.overview.trim() || !translationEnabled}
                                  sx={{ minWidth: 'auto', px: 1 }}
                                >
                                  <Description fontSize="small" />
                                </Button>
                              )
                            }}
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
                            placeholder="e.g., 8"
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
                            placeholder="e.g., 25"
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
                            placeholder="e.g., 15"
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
                            label="About Me Description (English)"
                            placeholder="Detailed description of your professional background, research expertise, and career journey"
                            multiline
                            rows={4}
                            value={profileData.about}
                            onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))}
                            sx={{ mb: 2 }}
                            helperText="Detailed description about your background, expertise, and research focus"
                          />
                        </Grid>

                        <Grid size={12}>
                          <TextField
                            fullWidth
                            label="About Me Description (日本語)"
                            placeholder="専門的背景、研究専門知識、キャリアの旅の詳細な説明"
                            multiline
                            rows={4}
                            value={profileData.aboutJa}
                            onChange={(e) => setProfileData(prev => ({ ...prev, aboutJa: e.target.value }))}
                            sx={{ mb: 2 }}
                            helperText="背景、専門知識、研究焦点に関する詳細な説明"
                            InputProps={{
                              endAdornment: (
                                <Button
                                  size="small"
                                  onClick={() => handleAutoTranslate('about')}
                                  disabled={!profileData.about.trim() || !translationEnabled}
                                  sx={{ minWidth: 'auto', px: 1 }}
                                >
                                  <Description fontSize="small" />
                                </Button>
                              )
                            }}
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
                            label="Education Details (English)"
                            placeholder="Ph.D. in Materials Science, University of Technology, 2020, Specialized in advanced semiconductor materials&#10;M.S. in Physics, State University, 2018, Focused on quantum mechanics and solid-state physics&#10;B.S. in Engineering, Technical Institute, 2016, Graduated with honors"
                            multiline
                            rows={6}
                            value={profileData.education}
                            onChange={(e) => setProfileData(prev => ({ ...prev, education: e.target.value }))}
                            sx={{ mb: 2 }}
                            helperText="Format: Ph.D. in Materials Science, University of Technology, 2020, Specialized in advanced semiconductor materials"
                          />
                        </Grid>

                        <Grid size={12}>
                          <TextField
                            fullWidth
                            label="Education Details (日本語)"
                            placeholder="材料科学博士、工科大学、2020年、先進半導体材料に特化&#10;物理学修士、州立大学、2018年、量子力学と固体物理学に焦点&#10;工学学士、工科大学、2016年、優秀な成績で卒業"
                            multiline
                            rows={6}
                            value={profileData.educationJa}
                            onChange={(e) => setProfileData(prev => ({ ...prev, educationJa: e.target.value }))}
                            sx={{ mb: 2 }}
                            helperText="形式：材料科学博士、工科大学、2020年、先進半導体材料に特化"
                            InputProps={{
                              endAdornment: (
                                <Button
                                  size="small"
                                  onClick={() => handleAutoTranslate('education')}
                                  disabled={!profileData.education.trim() || !translationEnabled}
                                  sx={{ minWidth: 'auto', px: 1 }}
                                >
                                  <Description fontSize="small" />
                                </Button>
                              )
                            }}
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
                            label="Work Experience Details (English)"
                            placeholder="Senior Research Engineer, Advanced Materials Institute, 2020-Present, Leading research in quantum materials and device fabrication&#10;Research Associate, National Laboratory, 2018-2020, Conducted experiments on novel materials synthesis&#10;Graduate Research Assistant, University Department, 2016-2018, Assisted in data analysis and experimental design"
                            multiline
                            rows={6}
                            value={profileData.experience}
                            onChange={(e) => setProfileData(prev => ({ ...prev, experience: e.target.value }))}
                            sx={{ mb: 2 }}
                            helperText="Format: Senior Research Engineer, Advanced Materials Institute, 2020-Present, Leading research in quantum materials"
                          />
                        </Grid>

                        <Grid size={12}>
                          <TextField
                            fullWidth
                            label="Work Experience Details (日本語)"
                            placeholder="シニア研究エンジニア、先進材料研究所、2020年-現在、量子材料とデバイス製造の研究を主導&#10;研究員、国立研究所、2018-2020年、新規材料合成の実験を実施&#10;大学院研究助手、大学学部、2016-2018年、データ分析と実験設計を支援"
                            multiline
                            rows={6}
                            value={profileData.experienceJa}
                            onChange={(e) => setProfileData(prev => ({ ...prev, experienceJa: e.target.value }))}
                            sx={{ mb: 2 }}
                            helperText="形式：シニア研究エンジニア、先進材料研究所、2020年-現在、量子材料の研究を主導"
                            InputProps={{
                              endAdornment: (
                                <Button
                                  size="small"
                                  onClick={() => handleAutoTranslate('experience')}
                                  disabled={!profileData.experience.trim() || !translationEnabled}
                                  sx={{ minWidth: 'auto', px: 1 }}
                                >
                                  <Description fontSize="small" />
                                </Button>
                              )
                            }}
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
                            label="Research Areas & Specializations (English)"
                            placeholder="Quantum Materials&#10;Nanotechnology&#10;Energy Storage&#10;Semiconductor Physics&#10;Device Fabrication&#10;Materials Characterization"
                            multiline
                            rows={4}
                            value={profileData.research}
                            onChange={(e) => setProfileData(prev => ({ ...prev, research: e.target.value }))}
                            sx={{ mb: 2 }}
                            helperText="One research area per line (e.g., Quantum Materials, Nanotechnology, Energy Storage)"
                          />
                        </Grid>

                        <Grid size={12}>
                          <TextField
                            fullWidth
                            label="Research Areas & Specializations (日本語)"
                            placeholder="量子材料&#10;ナノテクノロジー&#10;エネルギー貯蔵&#10;半導体物理学&#10;デバイス製造&#10;材料特性評価"
                            multiline
                            rows={4}
                            value={profileData.researchJa}
                            onChange={(e) => setProfileData(prev => ({ ...prev, researchJa: e.target.value }))}
                            sx={{ mb: 2 }}
                            helperText="1行に1つの研究分野（例：量子材料、ナノテクノロジー、エネルギー貯蔵）"
                            InputProps={{
                              endAdornment: (
                                <Button
                                  size="small"
                                  onClick={() => handleAutoTranslate('research')}
                                  disabled={!profileData.research.trim() || !translationEnabled}
                                  sx={{ minWidth: 'auto', px: 1 }}
                                >
                                  <Description fontSize="small" />
                                </Button>
                              )
                            }}
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
                            label="Technical Skills & Competencies (English)"
                            placeholder="Materials Synthesis&#10;Device Fabrication&#10;Data Analysis&#10;Electron Microscopy&#10;X-ray Diffraction&#10;Python Programming"
                            multiline
                            rows={4}
                            value={profileData.skills}
                            onChange={(e) => setProfileData(prev => ({ ...prev, skills: e.target.value }))}
                            sx={{ mb: 2 }}
                            helperText="One skill per line (e.g., Materials Synthesis, Device Fabrication, Data Analysis)"
                          />
                        </Grid>

                        <Grid size={12}>
                          <TextField
                            fullWidth
                            label="Technical Skills & Competencies (日本語)"
                            placeholder="材料合成&#10;デバイス製造&#10;データ分析&#10;電子顕微鏡&#10;X線回折&#10;Pythonプログラミング"
                            multiline
                            rows={4}
                            value={profileData.skillsJa}
                            onChange={(e) => setProfileData(prev => ({ ...prev, skillsJa: e.target.value }))}
                            sx={{ mb: 2 }}
                            helperText="1行に1つのスキル（例：材料合成、デバイス製造、データ分析）"
                            InputProps={{
                              endAdornment: (
                                <Button
                                  size="small"
                                  onClick={() => handleAutoTranslate('skills')}
                                  disabled={!profileData.skills.trim() || !translationEnabled}
                                  sx={{ minWidth: 'auto', px: 1 }}
                                >
                                  <Description fontSize="small" />
                                </Button>
                              )
                            }}
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
                            placeholder="Quantum Materials for Next-Gen Electronics, Developing novel quantum materials for advanced computing applications, https://example.com/project1.jpg, Quantum Materials|Electronics|Computing, Active&#10;Energy Storage Solutions, Investigating next-generation battery technologies, https://example.com/project2.jpg, Energy Storage|Batteries|Sustainability, Active&#10;Nanotechnology Applications, Exploring nanoscale materials for biomedical applications, https://example.com/project3.jpg, Nanotechnology|Biomedical|Materials, Completed"
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
                            placeholder="Advanced Quantum Materials for Next-Generation Electronics, Nature Materials, 2024, Dr. [Your Name] et al., 10.1038/s41563-024-00000-0, High Impact&#10;Novel Energy Storage Materials, Science Advances, 2023, [Your Name] et al., 10.1126/sciadv.abc1234, High Impact&#10;Nanoscale Materials for Biomedical Applications, Advanced Materials, 2023, [Your Name] et al., 10.1002/adma.202300000, High Impact"
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
                            placeholder="Best Paper Award, Recognized for outstanding contribution to materials science research, 2024&#10;Young Scientist Award, National recognition for innovative research in quantum materials, 2023&#10;Research Grant Recipient, Secured $500K funding for advanced materials research, 2022"
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

              {activeTab === 2 && (
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                    Contact Messages
                  </Typography>
                  
                  <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Messages: {contactMessages.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      New Messages: {contactMessages.filter(msg => msg.status === 'new').length}
                    </Typography>
                  </Box>

                  <Box>
                    {loadingMessages ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                      </Box>
                    ) : contactMessages.length === 0 ? (
                      <Paper sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="h6" color="text.secondary">
                          No contact messages yet
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Contact form submissions will appear here
                        </Typography>
                      </Paper>
                    ) : (
                      contactMessages.map((message) => (
                        <Paper key={message.id} sx={{ p: 3, mb: 2 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Box>
                              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {message.subject}
                              </Typography>
                              <Typography variant="body2" color="primary">
                                From: {message.name} ({message.email})
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {message.timestamp.toLocaleDateString()} at {message.timestamp.toLocaleTimeString()}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              {message.status === 'new' && (
                                <Chip label="New" color="error" size="small" />
                              )}
                              {message.status === 'read' && (
                                <Chip label="Read" color="warning" size="small" />
                              )}
                              {message.status === 'replied' && (
                                <Chip label="Replied" color="success" size="small" />
                              )}
                            </Box>
                          </Box>
                          
                          <Typography variant="body1" sx={{ mb: 2 }}>
                            {message.message}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={async () => {
                                // Mark as read
                                try {
                                  const messageRef = doc(db, 'contact-messages', message.id);
                                  await updateDoc(messageRef, { status: 'read' });
                                } catch (error) {
                                  console.error('Error updating message status:', error);
                                  setSnackbar({
                                    open: true,
                                    message: 'Error updating message status',
                                    severity: 'error'
                                  });
                                }
                              }}
                              disabled={message.status === 'read' || message.status === 'replied'}
                            >
                              Mark as Read
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => {
                                setSelectedMessage(message);
                                setReplyDialogOpen(true);
                              }}
                              disabled={message.status === 'replied'}
                            >
                              Reply
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={async () => {
                                // Mark as replied
                                try {
                                  const messageRef = doc(db, 'contact-messages', message.id);
                                  await updateDoc(messageRef, { status: 'replied' });
                                } catch (error) {
                                  console.error('Error updating message status:', error);
                                  setSnackbar({
                                    open: true,
                                    message: 'Error updating message status',
                                    severity: 'error'
                                  });
                                }
                              }}
                              disabled={message.status === 'replied'}
                            >
                              Mark as Replied
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={async () => {
                                // Delete message
                                try {
                                  const messageRef = doc(db, 'contact-messages', message.id);
                                  await deleteDoc(messageRef);
                                  setSnackbar({
                                    open: true,
                                    message: 'Message deleted successfully',
                                    severity: 'success'
                                  });
                                } catch (error) {
                                  console.error('Error deleting message:', error);
                                  setSnackbar({
                                    open: true,
                                    message: 'Error deleting message',
                                    severity: 'error'
                                  });
                                }
                              }}
                              color="error"
                            >
                              Delete
                            </Button>
                          </Box>
                        </Paper>
                      ))
                    )}
                  </Box>
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
                  placeholder="your.email@example.com"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  sx={{ mb: 2 }}
                  size="small"
                />
                <TextField
                  fullWidth
                  label="LinkedIn Profile"
                  placeholder="https://linkedin.com/in/your-profile"
                  value={profileData.linkedin}
                  onChange={(e) => setProfileData(prev => ({ ...prev, linkedin: e.target.value }))}
                  sx={{ mb: 2 }}
                  size="small"
                  helperText="Your LinkedIn profile URL"
                />
                <TextField
                  fullWidth
                  label="Location (English)"
                  placeholder="e.g., Tokyo, Japan"
                  value={profileData.location}
                  onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                  sx={{ mb: 2 }}
                  size="small"
                  helperText="e.g., Tokyo, Japan"
                />
                <TextField
                  fullWidth
                  label="Phone (English)"
                  placeholder="e.g., +81-XX-XXXX-XXXX"
                  value={profileData.phone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  sx={{ mb: 2 }}
                  size="small"
                  helperText="e.g., +81-XX-XXXX-XXXX"
                />

                {/* Japanese Contact Fields */}
                <TextField
                  fullWidth
                  label="Location (日本語)"
                  placeholder="例：東京都、日本"
                  value={profileData.locationJa}
                  onChange={(e) => setProfileData(prev => ({ ...prev, locationJa: e.target.value }))}
                  sx={{ mb: 2 }}
                  size="small"
                  helperText="例：東京都、日本"
                  InputProps={{
                    endAdornment: (
                      <Button
                        size="small"
                        onClick={() => handleAutoTranslate('location')}
                        disabled={!profileData.location.trim() || !translationEnabled}
                        sx={{ minWidth: 'auto', px: 1 }}
                      >
                        <Description fontSize="small" />
                      </Button>
                    )
                  }}
                />
                <TextField
                  fullWidth
                  label="Phone (日本語)"
                  placeholder="例：+81-XX-XXXX-XXXX"
                  value={profileData.phoneJa}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phoneJa: e.target.value }))}
                  sx={{ mb: 2 }}
                  size="small"
                  helperText="例：+81-XX-XXXX-XXXX"
                  InputProps={{
                    endAdornment: (
                      <Button
                        size="small"
                        onClick={() => handleAutoTranslate('phone')}
                        disabled={!profileData.phone.trim() || !translationEnabled}
                        sx={{ minWidth: 'auto', px: 1 }}
                      >
                        <Description fontSize="small" />
                      </Button>
                    )
                  }}
                />
              </Box>

              <Box>
                <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                  Research Interests
                </Typography>
                <TextField
                  fullWidth
                  label="Research Interests"
                  placeholder="Quantum Materials&#10;Nanotechnology&#10;Energy Storage&#10;Semiconductor Physics"
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
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Contact Messages
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {contactMessages.length}
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

            {/* Email Notifications Settings */}
            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Email Notifications
              </Typography>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                  />
                }
                label="Enable email notifications for new messages"
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Admin Email"
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                size="small"
                helperText="Email address to receive notifications"
                disabled={!emailNotifications}
              />
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

      {/* Reply Dialog */}
      <Dialog
        open={replyDialogOpen}
        onClose={() => setReplyDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Reply to {selectedMessage?.name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Original message from {selectedMessage?.email}:
            </Typography>
            <Paper sx={{ p: 2, mb: 3, backgroundColor: 'grey.50' }}>
              <Typography variant="body1">
                <strong>Subject:</strong> {selectedMessage?.subject}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                <strong>Message:</strong> {selectedMessage?.message}
              </Typography>
            </Paper>
            
            <TextField
              fullWidth
              label="Your Reply"
              multiline
              rows={6}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply here..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReplyDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleReply} 
            variant="contained" 
            disabled={!replyText.trim()}
          >
            Send Reply
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CMSDashboard; 