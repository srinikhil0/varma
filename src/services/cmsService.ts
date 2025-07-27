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

export interface SectionData {
  id: string;
  type: 'hero' | 'about' | 'research' | 'publications' | 'contact';
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

  // Save a section
  static async saveSection(section: SectionData): Promise<boolean> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, section.id);
      await setDoc(docRef, {
        ...section,
        lastModified: new Date()
      });
      return true;
    } catch (error) {
      console.error('Error saving section:', error);
      return false;
    }
  }

  // Update a section
  static async updateSection(sectionId: string, updates: Partial<SectionData>): Promise<boolean> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, sectionId);
      await updateDoc(docRef, {
        ...updates,
        lastModified: new Date()
      });
      return true;
    } catch (error) {
      console.error('Error updating section:', error);
      return false;
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
        title: { en: 'Dr. [Your Name]', ja: 'Dr. [お名前]' },
        content: { 
          en: 'Materials & Electronics Engineer specializing in nanotechnology and sustainable energy solutions.',
          ja: 'ナノテクノロジーと持続可能なエネルギーソリューションを専門とする材料・電子工学エンジニア。'
        },
        visible: true,
        order: 1,
        lastModified: new Date()
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
        order: 2,
        lastModified: new Date()
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
        order: 3,
        lastModified: new Date()
      }
    ];

    // Save default sections
    for (const section of defaultSections) {
      await CMSService.saveSection(section);
    }
  }
}; 