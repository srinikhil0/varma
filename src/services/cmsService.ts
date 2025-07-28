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
        title: { en: 'Dr. Venkata Sai Varma', ja: 'Dr. ヴェンカタ・サイ・ヴァルマ' },
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
          en: 'Dedicated researcher with over 8 years of experience in materials science and electronics engineering. Passionate about advancing technology for sustainable development and contributing to breakthrough innovations in nanotechnology.',
          ja: '材料科学と電子工学の分野で8年以上の経験を持つ専念した研究者です。持続可能な開発のための技術革新とナノテクノロジーにおける画期的なイノベーションへの貢献に情熱を持っています。'
        },
        visible: true,
        order: 2,
        lastModified: new Date()
      },
      {
        id: 'education',
        type: 'education',
        title: { en: 'Education', ja: '学歴' },
        content: { 
          en: '• Ph.D. in Materials Science and Engineering, [University Name], 2020-2024\n• M.S. in Electronics Engineering, [University Name], 2018-2020\n• B.S. in Materials Engineering, [University Name], 2014-2018',
          ja: '• 材料科学工学博士号、[大学名]、2020-2024\n• 電子工学修士号、[大学名]、2018-2020\n• 材料工学学士号、[大学名]、2014-2018'
        },
        visible: true,
        order: 3,
        lastModified: new Date()
      },
      {
        id: 'experience',
        type: 'experience',
        title: { en: 'Work Experience', ja: '職歴' },
        content: { 
          en: '• Senior Research Engineer, [Company/Institution], 2022-Present\n• Research Associate, [Company/Institution], 2020-2022\n• Graduate Research Assistant, [University], 2018-2020',
          ja: '• シニア研究エンジニア、[会社/機関]、2022-現在\n• 研究員、[会社/機関]、2020-2022\n• 大学院研究助手、[大学]、2018-2020'
        },
        visible: true,
        order: 4,
        lastModified: new Date()
      },
      {
        id: 'research',
        type: 'research',
        title: { en: 'Research Interests', ja: '研究分野' },
        content: { 
          en: '• Quantum Materials and Devices\n• Nanotechnology and Nanomaterials\n• Sustainable Energy Solutions\n• Advanced Electronic Materials\n• Semiconductor Physics\n• Renewable Energy Technologies',
          ja: '• 量子材料とデバイス\n• ナノテクノロジーとナノ材料\n• 持続可能なエネルギーソリューション\n• 先進電子材料\n• 半導体物理学\n• 再生可能エネルギー技術'
        },
        visible: true,
        order: 5,
        lastModified: new Date()
      },
      {
        id: 'publications',
        type: 'publications',
        title: { en: 'Publications', ja: '論文・出版物' },
        content: { 
          en: '• "Advanced Nanomaterials for Energy Applications," Journal of Materials Science, 2024\n• "Quantum Materials in Electronic Devices," Nature Materials, 2023\n• "Sustainable Energy Solutions," Energy & Environmental Science, 2023\n• "Nanotechnology in Electronics," Advanced Materials, 2022',
          ja: '• 「エネルギー応用のための先進ナノ材料」、材料科学ジャーナル、2024\n• 「電子デバイスにおける量子材料」、ネイチャー・マテリアルズ、2023\n• 「持続可能なエネルギーソリューション」、エネルギー・環境科学、2023\n• 「電子工学におけるナノテクノロジー」、アドバンスド・マテリアルズ、2022'
        },
        visible: true,
        order: 6,
        lastModified: new Date()
      },
      {
        id: 'projects',
        type: 'projects',
        title: { en: 'Projects', ja: 'プロジェクト' },
        content: { 
          en: '• Development of Quantum Computing Materials (2023-2024)\n• Sustainable Energy Storage Solutions (2022-2023)\n• Advanced Semiconductor Technologies (2021-2022)\n• Nanomaterials for Environmental Applications (2020-2021)',
          ja: '• 量子コンピューティング材料の開発（2023-2024）\n• 持続可能なエネルギー貯蔵ソリューション（2022-2023）\n• 先進半導体技術（2021-2022）\n• 環境応用のためのナノ材料（2020-2021）'
        },
        visible: true,
        order: 7,
        lastModified: new Date()
      },
      {
        id: 'skills',
        type: 'skills',
        title: { en: 'Skills & Expertise', ja: 'スキル・専門知識' },
        content: { 
          en: '• Materials Characterization (SEM, TEM, XRD, AFM)\n• Nanofabrication Techniques\n• Quantum Materials Synthesis\n• Electronic Device Fabrication\n• Data Analysis & Modeling\n• Programming (Python, MATLAB, C++)\n• Project Management\n• Scientific Writing & Communication',
          ja: '• 材料特性評価（SEM、TEM、XRD、AFM）\n• ナノ加工技術\n• 量子材料合成\n• 電子デバイス製造\n• データ分析・モデリング\n• プログラミング（Python、MATLAB、C++）\n• プロジェクト管理\n• 科学論文執筆・コミュニケーション'
        },
        visible: true,
        order: 8,
        lastModified: new Date()
      },
      {
        id: 'awards',
        type: 'awards',
        title: { en: 'Awards & Recognition', ja: '受賞・表彰' },
        content: { 
          en: '• Outstanding Researcher Award, Materials Science Society, 2024\n• Best Paper Award, International Conference on Nanotechnology, 2023\n• Young Scientist Fellowship, National Science Foundation, 2022\n• Graduate Student Excellence Award, University, 2020',
          ja: '• 優秀研究者賞、材料科学学会、2024\n• 最優秀論文賞、国際ナノテクノロジー会議、2023\n• 若手科学者フェローシップ、国立科学財団、2022\n• 大学院生優秀賞、大学、2020'
        },
        visible: true,
        order: 9,
        lastModified: new Date()
      },
      {
        id: 'contact',
        type: 'contact',
        title: { en: 'Contact Information', ja: '連絡先' },
        content: { 
          en: '• Email: venkatasaivarma28@gmail.com\n• LinkedIn: linkedin.com/in/venkatasaivarma\n• ResearchGate: researchgate.net/profile/venkatasaivarma\n• Google Scholar: scholar.google.com/citations?user=venkatasaivarma',
          ja: '• メール: venkatasaivarma28@gmail.com\n• LinkedIn: linkedin.com/in/venkatasaivarma\n• ResearchGate: researchgate.net/profile/venkatasaivarma\n• Google Scholar: scholar.google.com/citations?user=venkatasaivarma'
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