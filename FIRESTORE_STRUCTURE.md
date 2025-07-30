# Firestore Database Structure - Dynamic Content Only

This document explains the new Firestore database structure that only stores dynamic content from the CMS, with all static content moved to the codebase.

## Overview

The Firestore database now only stores **dynamic content** that is managed through the CMS. All **static content** (UI labels, buttons, messages, etc.) is now stored in the codebase at `src/config/staticContent.ts`.

## Database Collection: `dynamic-content`

### Collection Structure
```
dynamic-content/
├── hero/                    # Personal information and statistics
├── about/                   # Personal description
├── education/              # Education history
├── experience/             # Work experience
├── research-projects/      # Research projects
├── publications/           # Publications list
├── skills/                 # Skills and expertise
├── awards/                 # Awards and achievements
└── contact/                # Contact information
```

## Data Structure

### Document Structure
```typescript
interface DynamicContentData {
  id: string;                    // Document ID (e.g., 'hero', 'about')
  type: string;                  // Content type
  data: {
    en: any;                     // English content
    ja: any;                     // Japanese content
  };
  visible: boolean;              // Whether section is visible
  order: number;                 // Display order
  lastModified: Date;            // Last modification timestamp
}
```

### Content Types

#### 1. Hero Section (`type: 'hero'`)
```typescript
interface HeroData {
  name: string;                  // Full name
  title: string;                 // Professional title
  subtitle: string;              // Subtitle/description
  description: string;           // Long description
  statistics: {
    yearsOfExperience: string;   // Years of experience
    publicationsCount: string;   // Number of publications
    projectsCount: string;       // Number of projects
  };
}
```

**Example (Placeholder Content):**
```json
{
  "id": "hero",
  "type": "hero",
  "data": {
    "en": {
      "name": "[Your Name]",
      "title": "[Your Professional Title]",
      "subtitle": "[Your Specialization or Focus Area]",
      "description": "[Your professional description and expertise areas]",
      "statistics": {
        "yearsOfExperience": "[X]+",
        "publicationsCount": "[X]+",
        "projectsCount": "[X]+"
      }
    },
    "ja": {
      "name": "",
      "title": "",
      "subtitle": "",
      "description": "",
      "statistics": {
        "yearsOfExperience": "",
        "publicationsCount": "",
        "projectsCount": ""
      }
    }
  },
  "visible": true,
  "order": 1,
  "lastModified": "2024-01-01T00:00:00.000Z"
}
```

#### 2. About Section (`type: 'about'`)
```typescript
interface AboutData {
  description: string;           // Short description
  longDescription: string;       // Detailed description
}
```

#### 3. Education Section (`type: 'education'`)
```typescript
interface EducationEntry {
  degree: string;                // Degree name
  institution: string;           // Institution name
  year: string;                  // Year range
  description: string;           // Description
}
```

**Example (Placeholder Content):**
```json
{
  "id": "education",
  "type": "education",
  "data": {
    "en": [
      {
        "degree": "[Degree Name]",
        "institution": "[Institution Name]",
        "year": "[Year Range]",
        "description": "[Brief description of your studies and research focus]"
      }
    ],
    "ja": []
  },
  "visible": true,
  "order": 3,
  "lastModified": "2024-01-01T00:00:00.000Z"
}
```

#### 4. Experience Section (`type: 'experience'`)
```typescript
interface ExperienceEntry {
  position: string;              // Job title
  institution: string;           // Company/institution
  year: string;                  // Year range
  description: string;           // Job description
}
```

#### 5. Research Projects Section (`type: 'research-projects'`)
```typescript
interface ResearchProject {
  title: string;                 // Project title
  description: string;           // Project description
  image: string;                 // Project image URL
  tags: string[];                // Project tags
  status: string;                // Project status
  startDate: string;             // Start date
  endDate?: string;              // End date (optional)
}
```

#### 6. Publications Section (`type: 'publications'`)
```typescript
interface Publication {
  title: string;                 // Publication title
  journal: string;               // Journal name
  year: string;                  // Publication year
  authors: string;               // Authors
  doi: string;                   // DOI
  impact: string;                // Impact factor/rating
  abstract?: string;             // Abstract (optional)
}
```

#### 7. Skills Section (`type: 'skills'`)
```typescript
interface SkillsData {
  technicalSkills: string[];     // Technical skills
  researchAreas: string[];       // Research areas
  programmingLanguages: string[]; // Programming languages
  tools: string[];               // Tools and software
}
```

#### 8. Awards Section (`type: 'awards'`)
```typescript
interface AwardsData {
  awards: Achievement[];
}

interface Achievement {
  title: string;                 // Award title
  description: string;           // Award description
  year: string;                  // Year received
  organization?: string;          // Awarding organization
}
```

#### 9. Contact Section (`type: 'contact'`)
```typescript
interface ContactData {
  email: string;                 // Email address
  phone: string;                 // Phone number
  location: string;              // Location
  linkedin: string;              // LinkedIn URL
  researchGate?: string;         // ResearchGate URL (optional)
  googleScholar?: string;        // Google Scholar URL (optional)
  github?: string;               // GitHub URL (optional)
}
```

## What's NOT Stored in Firestore

### Static Content (Stored in Code)
- Navigation labels (Home, About, Research, Contact)
- Button text (Download CV, Send Message, etc.)
- Form labels (Name, Email, Subject, Message)
- Status messages (Loading, Error, Success)
- Section titles (About Me, Research & Publications)
- Statistics labels (Years of Research, Publications, Projects)
- Error messages and validation text
- Placeholder text
- Tooltips
- Accessibility labels

### Why This Separation?

1. **Performance**: Static content doesn't require database queries
2. **Consistency**: UI labels are centralized and consistent
3. **Translation**: Static content has proper Japanese translations
4. **Maintenance**: UI changes don't require CMS updates
5. **Type Safety**: TypeScript interfaces ensure content structure
6. **Clear Ownership**: Developers manage UI, CMS users manage content

## Migration from Old Structure

### Old Structure (Mixed Content)
```typescript
interface SectionData {
  id: string;
  type: string;
  title: { en: string; ja: string };    // Mixed static/dynamic
  content: { en: string; ja: string };  // Mixed static/dynamic
  visible: boolean;
  order: number;
  lastModified: Date;
}
```

### New Structure (Dynamic Only)
```typescript
interface DynamicContentData {
  id: string;
  type: string;
  data: {                              // Only dynamic content
    en: HeroData | AboutData | ...;
    ja: HeroData | AboutData | ...;
  };
  visible: boolean;
  order: number;
  lastModified: Date;
}
```

## Benefits of New Structure

1. **Cleaner Data**: Only user-managed content in database
2. **Better Performance**: No unnecessary database queries for UI labels
3. **Easier Maintenance**: UI changes don't affect CMS
4. **Type Safety**: Strongly typed interfaces for each content type
5. **Translation Support**: Automatic translation for dynamic content
6. **Scalability**: Easy to add new content types
7. **Separation of Concerns**: Clear distinction between static and dynamic content
8. **Truly Dynamic**: No hardcoded personal information - everything is placeholder content that users can replace

## CMS Integration

The CMS dashboard now only manages dynamic content:
- Personal information (name, title, description)
- Professional data (education, experience, skills)
- Research content (projects, publications, awards)
- Contact information

Static content is managed by developers in the codebase.

## Default Content (Placeholder)

When the database is empty, the system initializes with placeholder content that users can replace:

### Hero Section
- Name: `[Your Name]`
- Title: `[Your Professional Title]`
- Subtitle: `[Your Specialization or Focus Area]`
- Description: `[Your professional description and expertise areas]`
- Statistics: `[X]+` for all counts

### About Section
- Description: `[Your professional summary and background]`
- Long Description: `[Detailed description of your research, expertise, and professional journey]`

### Education Section
- Degree: `[Degree Name]`
- Institution: `[Institution Name]`
- Year: `[Year Range]`
- Description: `[Brief description of your studies and research focus]`

### Experience Section
- Position: `[Job Title]`
- Institution: `[Company/Institution Name]`
- Year: `[Year Range]`
- Description: `[Description of your role and responsibilities]`

### Contact Section
- Email: `[your.email@example.com]`
- Phone: `[Your Phone Number]`
- Location: `[Your Location]`
- LinkedIn: `[Your LinkedIn URL]`
- ResearchGate: `[Your ResearchGate URL]`
- Google Scholar: `[Your Google Scholar URL]`
- GitHub: `[Your GitHub URL]`

## Database Operations

### Reading Data
```typescript
// Get all dynamic content
const sections = await CMSService.getSections();

// Get specific section
const heroSection = await CMSService.getSection('hero');

// Subscribe to real-time updates
CMSService.subscribeToSections((sections) => {
  // Handle updates
});
```

### Writing Data
```typescript
// Save new section
await CMSService.saveSection(newSection);

// Update existing section
await CMSService.updateSection('hero', updates);

// Delete section
await CMSService.deleteSection('hero');
```

### Auto-Translation
The CMS service automatically translates content between English and Japanese when:
- English content is added but Japanese is empty
- Japanese content is added but English is empty
- Content is updated in one language

## Security Rules

```javascript
// Firestore security rules for dynamic-content collection
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /dynamic-content/{document} {
      allow read: if true;  // Public read access
      allow write: if request.auth != null;  // Authenticated write access
    }
  }
}
```

## Getting Started

1. **Initialize Database**: The system will automatically create placeholder content when first accessed
2. **Replace Placeholders**: Use the CMS dashboard to replace all `[Placeholder]` content with real information
3. **Add Content**: Add education, experience, projects, publications, and other sections as needed
4. **Customize**: All content is fully customizable through the CMS interface

This structure ensures a clean, maintainable, and truly dynamic content management system where users can completely customize their personal information without any hardcoded data. 