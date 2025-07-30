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

// Dynamic content interfaces - only for CMS-managed data
export interface HeroData {
  name: string;
  title: string;
  subtitle: string;
  description: string;
  statistics: {
    yearsOfExperience: string;
    publicationsCount: string;
    projectsCount: string;
  };
}

export interface AboutData {
  description: string;
  longDescription: string;
}

export interface EducationEntry {
  degree: string;
  institution: string;
  year: string;
  description: string;
}

export interface ExperienceEntry {
  position: string;
  institution: string;
  year: string;
  description: string;
}

export interface ResearchProject {
  title: string;
  description: string;
  image: string;
  tags: string[];
  status: string;
  startDate: string;
  endDate?: string;
}

export interface Publication {
  title: string;
  journal: string;
  year: string;
  authors: string;
  doi: string;
  impact: string;
  abstract?: string;
}

export interface Achievement {
  title: string;
  description: string;
  year: string;
  organization?: string;
}

export interface ContactData {
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  researchGate?: string;
  googleScholar?: string;
  github?: string;
}

export interface SkillsData {
  technicalSkills: string[];
  researchAreas: string[];
  programmingLanguages: string[];
  tools: string[];
}

export interface AwardsData {
  awards: Achievement[];
}

// Main content data structure
export interface DynamicContentData {
  id: string;
  type: 'hero' | 'about' | 'education' | 'experience' | 'research-projects' | 'publications' | 'skills' | 'awards' | 'contact';
  data: {
    en: HeroData | AboutData | EducationEntry[] | ExperienceEntry[] | ResearchProject[] | Publication[] | SkillsData | AwardsData | ContactData;
    ja: HeroData | AboutData | EducationEntry[] | ExperienceEntry[] | ResearchProject[] | Publication[] | SkillsData | AwardsData | ContactData;
  };
  visible: boolean;
  order: number;
  lastModified: Date;
}

export interface WebsiteContent {
  sections: DynamicContentData[];
  lastPublished: Date;
  version: number;
}

// CMS Service for managing dynamic website content only
export class CMSService {
  private static COLLECTION_NAME = 'dynamic-content';

  // Get all dynamic content sections
  static async getSections(): Promise<DynamicContentData[]> {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, this.COLLECTION_NAME), orderBy('order'))
      );
      
      const sections: DynamicContentData[] = [];
      querySnapshot.forEach((doc) => {
        sections.push({ id: doc.id, ...doc.data() } as DynamicContentData);
      });
      
      return sections;
    } catch (error) {
      console.error('Error fetching dynamic content sections:', error);
      return [];
    }
  }

  // Get a single dynamic content section
  static async getSection(sectionId: string): Promise<DynamicContentData | null> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, sectionId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as DynamicContentData;
      }
      return null;
    } catch (error) {
      console.error('Error fetching dynamic content section:', error);
      return null;
    }
  }

  // Save a dynamic content section with auto-translation
  static async saveSection(section: DynamicContentData): Promise<boolean> {
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
      console.error('Error saving dynamic content section:', error);
      return false;
    }
  }

  // Auto-translate section content
  private static async autoTranslateSection(section: DynamicContentData): Promise<DynamicContentData> {
    try {
      const updatedSection = { ...section };

      // Translate text fields based on section type
      if (section.type === 'hero') {
        const heroData = section.data.en as HeroData;
        if (heroData && !section.data.ja) {
          const translatedHero = await this.translateHeroData(heroData);
          updatedSection.data.ja = translatedHero;
        }
      } else if (section.type === 'about') {
        const aboutData = section.data.en as AboutData;
        if (aboutData && !section.data.ja) {
          const translatedAbout = await this.translateAboutData(aboutData);
          updatedSection.data.ja = translatedAbout;
        }
      } else if (section.type === 'contact') {
        const contactData = section.data.en as ContactData;
        if (contactData && !section.data.ja) {
          const translatedContact = await this.translateContactData(contactData);
          updatedSection.data.ja = translatedContact;
        }
      }

      return updatedSection;
    } catch (error) {
      console.error('Auto-translation error:', error);
      return section; // Return original section if translation fails
    }
  }

  // Helper methods for translating specific data types
  private static async translateHeroData(heroData: HeroData): Promise<HeroData> {
    try {
      const [nameTranslation, titleTranslation, subtitleTranslation, descriptionTranslation] = await Promise.all([
        TranslationService.translateToJapanese(heroData.name),
        TranslationService.translateToJapanese(heroData.title),
        TranslationService.translateToJapanese(heroData.subtitle),
        TranslationService.translateToJapanese(heroData.description)
      ]);

      return {
        ...heroData,
        name: nameTranslation.translatedText,
        title: titleTranslation.translatedText,
        subtitle: subtitleTranslation.translatedText,
        description: descriptionTranslation.translatedText
      };
    } catch (error) {
      console.error('Error translating hero data:', error);
      return heroData;
    }
  }

  private static async translateAboutData(aboutData: AboutData): Promise<AboutData> {
    try {
      const [descriptionTranslation, longDescriptionTranslation] = await Promise.all([
        TranslationService.translateToJapanese(aboutData.description),
        TranslationService.translateToJapanese(aboutData.longDescription)
      ]);

      return {
        description: descriptionTranslation.translatedText,
        longDescription: longDescriptionTranslation.translatedText
      };
    } catch (error) {
      console.error('Error translating about data:', error);
      return aboutData;
    }
  }

  private static async translateContactData(contactData: ContactData): Promise<ContactData> {
    try {
      const locationTranslation = await TranslationService.translateToJapanese(contactData.location);

      return {
        ...contactData,
        location: locationTranslation.translatedText
      };
    } catch (error) {
      console.error('Error translating contact data:', error);
      return contactData;
    }
  }

  // Update a dynamic content section with auto-translation
  static async updateSection(sectionId: string, updates: Partial<DynamicContentData>): Promise<boolean> {
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
      console.error('Error updating dynamic content section:', error);
      return false;
    }
  }

  // Auto-translate updates
  private static async autoTranslateUpdates(updates: Partial<DynamicContentData>): Promise<Partial<DynamicContentData>> {
    try {
      const updatedUpdates = { ...updates };

      // Handle data updates based on type
      if (updates.data?.en && !updates.data?.ja && updates.type) {
        if (!updatedUpdates.data) {
          updatedUpdates.data = { 
            en: updates.data.en, 
            ja: null as unknown as HeroData | AboutData | EducationEntry[] | ExperienceEntry[] | ResearchProject[] | Publication[] | SkillsData | AwardsData | ContactData 
          };
        }
        
        if (updates.type === 'hero') {
          const translatedHero = await this.translateHeroData(updates.data.en as HeroData);
          updatedUpdates.data.ja = translatedHero;
        } else if (updates.type === 'about') {
          const translatedAbout = await this.translateAboutData(updates.data.en as AboutData);
          updatedUpdates.data.ja = translatedAbout;
        } else if (updates.type === 'contact') {
          const translatedContact = await this.translateContactData(updates.data.en as ContactData);
          updatedUpdates.data.ja = translatedContact;
        }
      }

      return updatedUpdates;
    } catch (error) {
      console.error('Auto-translation error:', error);
      return updates; // Return original updates if translation fails
    }
  }

  // Delete a dynamic content section
  static async deleteSection(sectionId: string): Promise<boolean> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, sectionId);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Error deleting dynamic content section:', error);
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
  static subscribeToSections(callback: (sections: DynamicContentData[]) => void) {
    return onSnapshot(
      query(collection(db, this.COLLECTION_NAME), orderBy('order')),
      (querySnapshot) => {
        const sections: DynamicContentData[] = [];
        querySnapshot.forEach((doc) => {
          sections.push({ id: doc.id, ...doc.data() } as DynamicContentData);
        });
        callback(sections);
      }
    );
  }
}

// Initialize default dynamic content if database is empty
export const initializeDefaultContent = async () => {
  const sections = await CMSService.getSections();
  
  if (sections.length === 0) {
    // Don't save placeholder data to Firestore
    // The database should remain empty until user adds real content
    console.log('Database is empty. Please add your content through the CMS.');
  }
}; 