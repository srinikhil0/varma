import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { TranslationService } from './translationService';

export interface SectionData {
  id: string;
  type: 'hero' | 'about' | 'education' | 'experience' | 'research' | 'publications' | 'projects' | 'skills' | 'awards' | 'contact';
  title: { en: string; ja: string };
  content: { en: string; ja: string };
  visible: boolean;
  order: number;
  lastModified: Date;
}

export interface WebsiteContent {
  sections: SectionData[];
  lastPublished: Date;
  version: number;
}

// CMS Service for managing website content
export class CMSService {
  private static COLLECTION_NAME = 'website-content';

  // Get all sections
  static async getSections(): Promise<SectionData[]> {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, this.COLLECTION_NAME), orderBy('order'))
      );
      
      const sections: SectionData[] = [];
      querySnapshot.forEach((doc) => {
        sections.push({ id: doc.id, ...doc.data() } as SectionData);
      });
      
      return sections;
    } catch (error) {
      console.error('Error fetching sections:', error);
      return [];
    }
  }

  // Get a single section
  static async getSection(sectionId: string): Promise<SectionData | null> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, sectionId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as SectionData;
      }
      return null;
    } catch (error) {
      console.error('Error fetching section:', error);
      return null;
    }
  }

  // Save a section with auto-translation
  static async saveSection(section: SectionData): Promise<boolean> {
    try {
      // Auto-translate if translation service is available
      if (TranslationService.isInitialized()) {
        const updatedSection = await this.autoTranslateSection(section);
        const docRef = doc(db, this.COLLECTION_NAME, section.id);
        await setDoc(docRef, {
          ...updatedSection,
          lastModified: new Date()
        });
      } else {
        const docRef = doc(db, this.COLLECTION_NAME, section.id);
        await setDoc(docRef, {
          ...section,
          lastModified: new Date()
        });
      }
      return true;
    } catch (error) {
      console.error('Error saving section:', error);
      return false;
    }
  }

  // Auto-translate section content
  private static async autoTranslateSection(section: SectionData): Promise<SectionData> {
    try {
      const updatedSection = { ...section };

      // If English content exists but Japanese is empty, translate to Japanese
      if (section.title.en && !section.title.ja) {
        const titleTranslation = await TranslationService.translateToJapanese(section.title.en);
        updatedSection.title.ja = titleTranslation.translatedText;
      }

      if (section.content.en && !section.content.ja) {
        const contentTranslation = await TranslationService.translateToJapanese(section.content.en);
        updatedSection.content.ja = contentTranslation.translatedText;
      }

      // If Japanese content exists but English is empty, translate to English
      if (section.title.ja && !section.title.en) {
        const titleTranslation = await TranslationService.translateToEnglish(section.title.ja);
        updatedSection.title.en = titleTranslation.translatedText;
      }

      if (section.content.ja && !section.content.en) {
        const contentTranslation = await TranslationService.translateToEnglish(section.content.ja);
        updatedSection.content.en = contentTranslation.translatedText;
      }

      return updatedSection;
    } catch (error) {
      console.error('Auto-translation error:', error);
      return section; // Return original section if translation fails
    }
  }

  // Update a section with auto-translation
  static async updateSection(sectionId: string, updates: Partial<SectionData>): Promise<boolean> {
    try {
      // Auto-translate if translation service is available
      if (TranslationService.isInitialized()) {
        const updatedUpdates = await this.autoTranslateUpdates(updates);
        const docRef = doc(db, this.COLLECTION_NAME, sectionId);
        await updateDoc(docRef, {
          ...updatedUpdates,
          lastModified: new Date()
        });
      } else {
        const docRef = doc(db, this.COLLECTION_NAME, sectionId);
        await updateDoc(docRef, {
          ...updates,
          lastModified: new Date()
        });
      }
      return true;
    } catch (error) {
      console.error('Error updating section:', error);
      return false;
    }
  }

  // Auto-translate updates
  private static async autoTranslateUpdates(updates: Partial<SectionData>): Promise<Partial<SectionData>> {
    try {
      const updatedUpdates = { ...updates };

      // Handle title updates
      if (updates.title) {
        if (!updatedUpdates.title) {
          updatedUpdates.title = { en: '', ja: '' };
        }
        
        if (updates.title.en && !updates.title.ja) {
          const titleTranslation = await TranslationService.translateToJapanese(updates.title.en);
          updatedUpdates.title.ja = titleTranslation.translatedText;
        } else if (updates.title.ja && !updates.title.en) {
          const titleTranslation = await TranslationService.translateToEnglish(updates.title.ja);
          updatedUpdates.title.en = titleTranslation.translatedText;
        }
      }

      // Handle content updates
      if (updates.content) {
        if (!updatedUpdates.content) {
          updatedUpdates.content = { en: '', ja: '' };
        }
        
        if (updates.content.en && !updates.content.ja) {
          const contentTranslation = await TranslationService.translateToJapanese(updates.content.en);
          updatedUpdates.content.ja = contentTranslation.translatedText;
        } else if (updates.content.ja && !updates.content.en) {
          const contentTranslation = await TranslationService.translateToEnglish(updates.content.ja);
          updatedUpdates.content.en = contentTranslation.translatedText;
        }
      }

      return updatedUpdates;
    } catch (error) {
      console.error('Auto-translation error:', error);
      return updates; // Return original updates if translation fails
    }
  }

  // Delete a section
  static async deleteSection(sectionId: string): Promise<boolean> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, sectionId);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Error deleting section:', error);
      return false;
    }
  }

  // Publish changes
  static async publishChanges(): Promise<boolean> {
    try {
      const docRef = doc(db, 'website-settings', 'publish');
      await setDoc(docRef, {
        lastPublished: new Date(),
        version: Date.now()
      });
      return true;
    } catch (error) {
      console.error('Error publishing changes:', error);
      return false;
    }
  }

  // Subscribe to real-time updates
  static subscribeToSections(callback: (sections: SectionData[]) => void) {
    return onSnapshot(
      query(collection(db, this.COLLECTION_NAME), orderBy('order')),
      (querySnapshot) => {
        const sections: SectionData[] = [];
        querySnapshot.forEach((doc) => {
          sections.push({ id: doc.id, ...doc.data() } as SectionData);
        });
        callback(sections);
      }
    );
  }
}

// Initialize default content if database is empty
export const initializeDefaultContent = async () => {
  const sections = await CMSService.getSections();
  
  if (sections.length === 0) {
    const defaultSections: SectionData[] = [
      {
        id: 'hero',
        type: 'hero',
        title: { en: 'Dr. Venkata Sai Varma', ja: '' },
        content: { 
          en: 'Materials & Electronics Engineer specializing in nanotechnology and sustainable energy solutions.',
          ja: ''
        },
        visible: true,
        order: 1,
        lastModified: new Date()
      },
      {
        id: 'about',
        type: 'about',
        title: { en: 'About Me', ja: '' },
        content: { 
          en: 'Dedicated researcher with over 8 years of experience in materials science and electronics engineering. Passionate about advancing technology for sustainable development and contributing to breakthrough innovations in nanotechnology.',
          ja: ''
        },
        visible: true,
        order: 2,
        lastModified: new Date()
      },
      {
        id: 'education',
        type: 'education',
        title: { en: 'Education', ja: '' },
        content: { 
          en: '• Ph.D. in Materials Science and Engineering, [University Name], 2020-2024\n• M.S. in Electronics Engineering, [University Name], 2018-2020\n• B.S. in Materials Engineering, [University Name], 2014-2018',
          ja: ''
        },
        visible: true,
        order: 3,
        lastModified: new Date()
      },
      {
        id: 'experience',
        type: 'experience',
        title: { en: 'Work Experience', ja: '' },
        content: { 
          en: '• Senior Research Engineer, [Company/Institution], 2022-Present\n• Research Associate, [Company/Institution], 2020-2022\n• Graduate Research Assistant, [University], 2018-2020',
          ja: ''
        },
        visible: true,
        order: 4,
        lastModified: new Date()
      },
      {
        id: 'research',
        type: 'research',
        title: { en: 'Research Interests', ja: '' },
        content: { 
          en: '• Quantum Materials and Devices\n• Nanotechnology and Nanomaterials\n• Sustainable Energy Solutions\n• Advanced Electronic Materials\n• Semiconductor Physics\n• Renewable Energy Technologies',
          ja: ''
        },
        visible: true,
        order: 5,
        lastModified: new Date()
      },
      {
        id: 'publications',
        type: 'publications',
        title: { en: 'Publications', ja: '' },
        content: { 
          en: '• "Advanced Nanomaterials for Energy Applications," Journal of Materials Science, 2024\n• "Quantum Materials in Electronic Devices," Nature Materials, 2023\n• "Sustainable Energy Solutions," Energy & Environmental Science, 2023\n• "Nanotechnology in Electronics," Advanced Materials, 2022',
          ja: ''
        },
        visible: true,
        order: 6,
        lastModified: new Date()
      },
      {
        id: 'projects',
        type: 'projects',
        title: { en: 'Projects', ja: '' },
        content: { 
          en: '• Development of Quantum Computing Materials (2023-2024)\n• Sustainable Energy Storage Solutions (2022-2023)\n• Advanced Semiconductor Technologies (2021-2022)\n• Nanomaterials for Environmental Applications (2020-2021)',
          ja: ''
        },
        visible: true,
        order: 7,
        lastModified: new Date()
      },
      {
        id: 'skills',
        type: 'skills',
        title: { en: 'Skills & Expertise', ja: '' },
        content: { 
          en: '• Materials Characterization (SEM, TEM, XRD, AFM)\n• Nanofabrication Techniques\n• Quantum Materials Synthesis\n• Electronic Device Fabrication\n• Data Analysis & Modeling\n• Programming (Python, MATLAB, C++)\n• Project Management\n• Scientific Writing & Communication',
          ja: ''
        },
        visible: true,
        order: 8,
        lastModified: new Date()
      },
      {
        id: 'awards',
        type: 'awards',
        title: { en: 'Awards & Recognition', ja: '' },
        content: { 
          en: '• Outstanding Researcher Award, Materials Science Society, 2024\n• Best Paper Award, International Conference on Nanotechnology, 2023\n• Young Scientist Fellowship, National Science Foundation, 2022\n• Graduate Student Excellence Award, University, 2020',
          ja: ''
        },
        visible: true,
        order: 9,
        lastModified: new Date()
      },
      {
        id: 'contact',
        type: 'contact',
        title: { en: 'Contact Information', ja: '' },
        content: { 
          en: '• Email: venkatasaivarma28@gmail.com\n• LinkedIn: linkedin.com/in/venkatasaivarma\n• ResearchGate: researchgate.net/profile/venkatasaivarma\n• Google Scholar: scholar.google.com/citations?user=venkatasaivarma',
          ja: ''
        },
        visible: true,
        order: 10,
        lastModified: new Date()
      }
    ];

    // Save default sections
    for (const section of defaultSections) {
      await CMSService.saveSection(section);
    }
  }
}; 