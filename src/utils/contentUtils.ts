import { staticContent } from '../config/staticContent';
import type { Language } from '../config/staticContent';
import type { 
  DynamicContentData,
  HeroData,
  AboutData,
  EducationEntry,
  ExperienceEntry,
  ResearchProject,
  Publication,
  ContactData,
  SkillsData,
  AwardsData
} from '../services/cmsService';

// Helper function to get static content by language
export const getStaticContent = (language: Language) => {
  return staticContent[language];
};

// Helper function to get specific static content section
export const getStaticSection = (language: Language, section: keyof typeof staticContent.en) => {
  return staticContent[language][section];
};

// Helper function to get specific static content item
export const getStaticItem = (
  language: Language, 
  section: keyof typeof staticContent.en, 
  item: string
) => {
  const sectionContent = staticContent[language][section] as Record<string, string>;
  return sectionContent[item] || item;
};

// Type for dynamic content that comes from CMS
export interface DynamicContent {
  // Hero Section
  hero?: {
    name: string;
    title: string;
    subtitle: string;
    description: string;
    statistics: {
      yearsOfExperience: string;
      publicationsCount: string;
      projectsCount: string;
    };
  };
  
  // About Section
  about?: {
    description: string;
    longDescription: string;
  };
  
  // Education Section
  education?: EducationEntry[];
  
  // Experience Section
  experience?: ExperienceEntry[];
  
  // Research Projects Section
  researchProjects?: ResearchProject[];
  
  // Publications Section
  publications?: Publication[];
  
  // Skills Section
  skills?: SkillsData;
  
  // Awards Section
  awards?: AwardsData;
  
  // Contact Section
  contact?: ContactData;
}

// Helper function to parse dynamic content from CMS data
export const parseDynamicContent = (
  sections: DynamicContentData[], 
  language: Language
): DynamicContent => {
  const content: DynamicContent = {};
  
  // Parse Hero Section
  const heroSection = sections.find(section => section.id === 'hero');
  if (heroSection && heroSection.type === 'hero') {
    const heroData = heroSection.data[language] as HeroData;
    if (heroData) {
      content.hero = heroData;
    }
  }
  
  // Parse About Section
  const aboutSection = sections.find(section => section.id === 'about');
  if (aboutSection && aboutSection.type === 'about') {
    const aboutData = aboutSection.data[language] as AboutData;
    if (aboutData) {
      content.about = aboutData;
    }
  }
  
  // Parse Education Section
  const educationSection = sections.find(section => section.id === 'education');
  if (educationSection && educationSection.type === 'education') {
    const educationData = educationSection.data[language] as EducationEntry[];
    if (educationData && Array.isArray(educationData)) {
      content.education = educationData;
    }
  }
  
  // Parse Experience Section
  const experienceSection = sections.find(section => section.id === 'experience');
  if (experienceSection && experienceSection.type === 'experience') {
    const experienceData = experienceSection.data[language] as ExperienceEntry[];
    if (experienceData && Array.isArray(experienceData)) {
      content.experience = experienceData;
    }
  }
  
  // Parse Research Projects Section
  const researchProjectsSection = sections.find(section => section.id === 'research-projects');
  if (researchProjectsSection && researchProjectsSection.type === 'research-projects') {
    const researchProjectsData = researchProjectsSection.data[language] as ResearchProject[];
    if (researchProjectsData && Array.isArray(researchProjectsData)) {
      content.researchProjects = researchProjectsData;
    }
  }
  
  // Parse Publications Section
  const publicationsSection = sections.find(section => section.id === 'publications');
  if (publicationsSection && publicationsSection.type === 'publications') {
    const publicationsData = publicationsSection.data[language] as Publication[];
    if (publicationsData && Array.isArray(publicationsData)) {
      content.publications = publicationsData;
    }
  }
  
  // Parse Skills Section
  const skillsSection = sections.find(section => section.id === 'skills');
  if (skillsSection && skillsSection.type === 'skills') {
    const skillsData = skillsSection.data[language] as SkillsData;
    if (skillsData) {
      content.skills = skillsData;
    }
  }
  
  // Parse Awards Section
  const awardsSection = sections.find(section => section.id === 'awards');
  if (awardsSection && awardsSection.type === 'awards') {
    const awardsData = awardsSection.data[language] as AwardsData;
    if (awardsData) {
      content.awards = awardsData;
    }
  }
  
  // Parse Contact Section
  const contactSection = sections.find(section => section.id === 'contact');
  if (contactSection && contactSection.type === 'contact') {
    const contactData = contactSection.data[language] as ContactData;
    if (contactData) {
      content.contact = contactData;
    }
  }
  
  return content;
};



// Helper function to get hero data
export const getHeroData = (sections: DynamicContentData[], language: Language): HeroData | null => {
  const heroSection = sections.find(section => section.id === 'hero');
  if (heroSection && heroSection.type === 'hero') {
    return heroSection.data[language] as HeroData;
  }
  return null;
};

// Helper function to get about data
export const getAboutData = (sections: DynamicContentData[], language: Language): AboutData | null => {
  const aboutSection = sections.find(section => section.id === 'about');
  if (aboutSection && aboutSection.type === 'about') {
    return aboutSection.data[language] as AboutData;
  }
  return null;
};

// Helper function to get education data
export const getEducationData = (sections: DynamicContentData[], language: Language): EducationEntry[] => {
  const educationSection = sections.find(section => section.id === 'education');
  if (educationSection && educationSection.type === 'education') {
    const data = educationSection.data[language] as EducationEntry[];
    return Array.isArray(data) ? data : [];
  }
  return [];
};

// Helper function to get experience data
export const getExperienceData = (sections: DynamicContentData[], language: Language): ExperienceEntry[] => {
  const experienceSection = sections.find(section => section.id === 'experience');
  if (experienceSection && experienceSection.type === 'experience') {
    const data = experienceSection.data[language] as ExperienceEntry[];
    return Array.isArray(data) ? data : [];
  }
  return [];
};

// Helper function to get research projects data
export const getResearchProjectsData = (sections: DynamicContentData[], language: Language): ResearchProject[] => {
  const researchProjectsSection = sections.find(section => section.id === 'research-projects');
  if (researchProjectsSection && researchProjectsSection.type === 'research-projects') {
    const data = researchProjectsSection.data[language] as ResearchProject[];
    return Array.isArray(data) ? data : [];
  }
  return [];
};

// Helper function to get publications data
export const getPublicationsData = (sections: DynamicContentData[], language: Language): Publication[] => {
  const publicationsSection = sections.find(section => section.id === 'publications');
  if (publicationsSection && publicationsSection.type === 'publications') {
    const data = publicationsSection.data[language] as Publication[];
    return Array.isArray(data) ? data : [];
  }
  return [];
};

// Helper function to get skills data
export const getSkillsData = (sections: DynamicContentData[], language: Language): SkillsData | null => {
  const skillsSection = sections.find(section => section.id === 'skills');
  if (skillsSection && skillsSection.type === 'skills') {
    return skillsSection.data[language] as SkillsData;
  }
  return null;
};

// Helper function to get awards data
export const getAwardsData = (sections: DynamicContentData[], language: Language): AwardsData | null => {
  const awardsSection = sections.find(section => section.id === 'awards');
  if (awardsSection && awardsSection.type === 'awards') {
    return awardsSection.data[language] as AwardsData;
  }
  return null;
};

// Helper function to get contact data
export const getContactData = (sections: DynamicContentData[], language: Language): ContactData | null => {
  const contactSection = sections.find(section => section.id === 'contact');
  if (contactSection && contactSection.type === 'contact') {
    return contactSection.data[language] as ContactData;
  }
  return null;
}; 