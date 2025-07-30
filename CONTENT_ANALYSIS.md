# Content Analysis - Static vs Dynamic

This document analyzes the current content in each component and categorizes it as static or dynamic.

## Hero Section (`src/components/Sections/Hero.tsx`)

### Static Content (Should be moved to `staticContent.ts`)
```typescript
// Button labels
cta: "Download CV",
contact: "Get in Touch",

// Statistics labels
experience: "Years of Research",
publications: "Publications", 
projects: "Projects Completed",

// Status messages
cvNotAvailable: "CV Not Available"
```

### Dynamic Content (From CMS)
```typescript
// Personal information
title: heroSection?.title?.en || "Dr. [Your Name]",
subtitle: heroSection?.content?.en || "Materials & Electronics Engineer",
description: "Pioneering research in advanced materials...",

// Statistics data
experience: statisticsSection ? statisticsSection.content[language].split('\n')[0].split(': ')[1] : '8+',
publications: statisticsSection ? statisticsSection.content[language].split('\n')[1].split(': ')[1] : '25+',
projects: statisticsSection ? statisticsSection.content[language].split('\n')[2].split(': ')[1] : '15+'
```

## About Section (`src/components/Sections/About.tsx`)

### Static Content (Should be moved to `staticContent.ts`)
```typescript
// Section titles
title: "About Me",
subtitle: "Materials & Electronics Research Specialist",

// Section labels
education: "Education",
experience: "Experience", 
research: "Research Areas",
skills: "Technical Skills"
```

### Dynamic Content (From CMS)
```typescript
// Personal information
description: "I am a dedicated researcher with over 8 years...",
longDescription: "My research encompasses the development...",

// Structured data
educationDetails: educationSection ? parseEducationData(educationSection.content[language]) : [],
experienceDetails: experienceSection ? parseExperienceData(experienceSection.content[language]) : [],
researchAreas: researchSection ? parseArrayData(researchSection.content[language]) : [],
technicalSkills: skillsSection ? parseArrayData(skillsSection.content[language]) : []
```

## Research Section (`src/components/Sections/Research.tsx`)

### Static Content (Should be moved to `staticContent.ts`)
```typescript
// Section titles
title: "Research & Publications",
subtitle: "Current Research Projects and Scientific Contributions",
currentResearch: "Current Research",
publicationsTitle: "Recent Publications",
achievementsTitle: "Key Achievements",
viewAll: "View All Publications"
```

### Dynamic Content (From CMS)
```typescript
// Research data
projects: researchProjectsSection ? parseResearchProjects(researchProjectsSection.content[language]) : [],
publications: publicationsSection ? parsePublications(publicationsSection.content[language]) : [],
achievements: achievementsSection ? parseAchievements(achievementsSection.content[language]) : []
```

## Contact Section (`src/components/Sections/Contact.tsx`)

### Static Content (Should be moved to `staticContent.ts`)
```typescript
// Section titles
title: "Get In Touch",
subtitle: "Let's discuss research opportunities and collaborations",
description: "I'm always interested in new research collaborations...",

// Form labels
sendMessage: "Send Message",
name: "Name",
email: "Email", 
subject: "Subject",
message: "Message",

// Section labels
contactInfo: "Contact Information",
researchInterests: "Research Interests",
collaboration: "Collaboration Opportunities",
speaking: "Speaking Engagements",

// Status messages
messageSent: "Message sent successfully!",
messageError: "Error sending message. Please try again.",
sending: "Sending...",

// Default research interests (fallback)
defaultInterests: ['Quantum Materials', 'Semiconductor Physics', 'Nanotechnology', 'Energy Storage']
```

### Dynamic Content (From CMS)
```typescript
// Contact information
location: contactInfo.location || "Tokyo, Japan",
phone: contactInfo.phone || "+81-XX-XXXX-XXXX",
emailAddress: contactInfo.email || "dr.name@university.ac.jp",
linkedin: contactInfo.linkedin || "LinkedIn Profile",

// Research interests
researchInterestsList: researchSection ? parseResearchInterests(researchSection.content[language]) : []
```

## Header Component (`src/components/Layout/Header.tsx`)

### Static Content (Should be moved to `staticContent.ts`)
```typescript
// Navigation labels
home: "Home",
about: "About", 
research: "Research",
contact: "Contact",

// Language labels
language: "Language",
theme: "Theme"
```

## Summary of Changes Needed

### 1. Move Static Content to `staticContent.ts`

**Navigation & Layout:**
- All navigation menu items
- Language and theme labels

**Button Labels:**
- Download CV
- Get in Touch
- Send Message
- View All Publications
- Contact Me

**Form Labels:**
- Name, Email, Subject, Message
- All form field labels

**Section Titles:**
- About Me
- Research & Publications
- Get In Touch
- Education, Experience, Research Areas, Technical Skills

**Status Messages:**
- Loading, Error, Success messages
- Form submission status

**Statistics Labels:**
- Years of Research
- Publications
- Projects Completed

### 2. Keep Dynamic Content in CMS

**Personal Information:**
- Name, title, subtitle
- Personal descriptions
- Contact details

**Professional Data:**
- Education history
- Work experience
- Research projects
- Publications
- Skills and expertise
- Awards and achievements

**Statistics:**
- Years of experience count
- Publication count
- Project count

### 3. Update Components

Each component should be updated to:

1. **Import static content utilities:**
```typescript
import { getStaticContent, parseDynamicContent } from '../utils/contentUtils';
```

2. **Separate static and dynamic content:**
```typescript
// Static content
const static = getStaticContent(language);

// Dynamic content  
const dynamic = parseDynamicContent(sections, language);
```

3. **Use appropriate content type:**
```typescript
// Static content for UI elements
<Typography>{static.buttons.downloadCV}</Typography>

// Dynamic content for personal information
<Typography>{dynamic.hero?.title}</Typography>
```

### 4. Benefits After Separation

1. **Clear Ownership**: Developers manage UI labels, CMS users manage personal content
2. **Consistent UI**: All buttons, labels, and messages are centralized
3. **Better Translation**: Static content has proper Japanese translations
4. **Type Safety**: TypeScript interfaces ensure content structure
5. **Performance**: Static content doesn't require database queries
6. **Maintainability**: UI changes don't require CMS updates

### 5. Migration Priority

1. **High Priority**: Move button labels and form labels to static content
2. **Medium Priority**: Move section titles and navigation labels
3. **Low Priority**: Move status messages and tooltips

This separation will make the codebase more maintainable and provide a better user experience for both developers and CMS users. 