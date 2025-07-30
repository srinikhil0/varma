# Content Separation Documentation

This document explains the separation between static and dynamic content in the project.

## Overview

The project content is divided into two main categories:

1. **Static Content** - Fixed UI elements, labels, and text that don't change
2. **Dynamic Content** - Content managed through the CMS that can be updated

## Static Content

### Location
- File: `src/config/staticContent.ts`
- Utilities: `src/utils/contentUtils.ts`

### What is Static Content?
Static content includes:
- Navigation labels (Home, About, Research, Contact)
- Button text (Download CV, Send Message, etc.)
- Form labels (Name, Email, Subject, etc.)
- Status messages (Loading..., Error, Success, etc.)
- Error messages (This field is required, etc.)
- Success messages (Message sent successfully, etc.)
- Placeholder text (Enter your name, etc.)
- Tooltips (Download my CV/Resume, etc.)
- Accessibility labels (Toggle navigation menu, etc.)

### Structure
```typescript
export const staticContent = {
  en: {
    navigation: { home: "Home", about: "About", ... },
    buttons: { downloadCV: "Download CV", ... },
    forms: { name: "Name", email: "Email", ... },
    status: { loading: "Loading...", ... },
    errors: { required: "This field is required", ... },
    success: { messageSent: "Message sent successfully", ... },
    placeholders: { enterName: "Enter your name", ... },
    tooltips: { downloadCV: "Download my CV/Resume", ... },
    accessibility: { menuButton: "Toggle navigation menu", ... }
  },
  ja: {
    // Japanese translations of all static content
  }
};
```

### Usage
```typescript
import { getStaticItem } from '../utils/contentUtils';

// Get specific static content
const buttonText = getStaticItem('en', 'buttons', 'downloadCV');
// Returns: "Download CV"

// Get entire section
const navigation = getStaticSection('en', 'navigation');
// Returns: { home: "Home", about: "About", ... }
```

## Dynamic Content

### Location
- CMS Service: `src/services/cmsService.ts`
- Parsing Utilities: `src/utils/contentUtils.ts`

### What is Dynamic Content?
Dynamic content includes:
- Personal information (name, title, description)
- Research projects and publications
- Education and experience details
- Contact information
- Skills and expertise
- Awards and achievements
- Statistics (years of experience, publications count, etc.)

### Structure
Dynamic content is stored in Firestore and follows this structure:
```typescript
interface SectionData {
  id: string;
  type: 'hero' | 'about' | 'education' | 'experience' | 'research' | 'publications' | 'projects' | 'skills' | 'awards' | 'contact';
  title: { en: string; ja: string };
  content: { en: string; ja: string };
  visible: boolean;
  order: number;
  lastModified: Date;
}
```

### Usage
```typescript
import { parseDynamicContent } from '../utils/contentUtils';

// Parse dynamic content from CMS data
const dynamicContent = parseDynamicContent(sections, 'en');

// Access specific sections
const heroTitle = dynamicContent.hero?.title;
const aboutDescription = dynamicContent.about?.description;
```

## Content Flow

### 1. Static Content
```
staticContent.ts → contentUtils.ts → Components
```

### 2. Dynamic Content
```
Firestore → cmsService.ts → contentUtils.ts → Components
```

## Component Usage Pattern

### Before (Mixed Content)
```typescript
const content = {
  en: {
    title: heroSection?.title?.en || "Dr. [Your Name]",
    subtitle: heroSection?.content?.en || "Materials & Electronics Engineer",
    cta: "Download CV", // Static content mixed with dynamic
    contact: "Get in Touch" // Static content mixed with dynamic
  }
};
```

### After (Separated Content)
```typescript
// Static content
const static = getStaticContent(language);
const buttonText = static.buttons.downloadCV;
const contactText = static.buttons.getInTouch;

// Dynamic content
const dynamic = parseDynamicContent(sections, language);
const title = dynamic.hero?.title || "Dr. [Your Name]";
const subtitle = dynamic.hero?.subtitle || "Materials & Electronics Engineer";
```

## Benefits of This Separation

1. **Clear Ownership**: Static content is managed by developers, dynamic content by CMS users
2. **Easier Maintenance**: UI labels are centralized and consistent
3. **Better Translation**: Static content has proper Japanese translations
4. **Type Safety**: TypeScript interfaces ensure content structure
5. **Performance**: Static content doesn't require database queries
6. **Fallbacks**: Components work even when CMS data is unavailable

## Migration Guide

### For Existing Components

1. **Import utilities**:
```typescript
import { getStaticContent, parseDynamicContent } from '../utils/contentUtils';
```

2. **Separate static and dynamic content**:
```typescript
// Static content
const static = getStaticContent(language);

// Dynamic content
const dynamic = parseDynamicContent(sections, language);
```

3. **Use appropriate content type**:
```typescript
// Static content for UI elements
<Typography>{static.buttons.downloadCV}</Typography>

// Dynamic content for personal information
<Typography>{dynamic.hero?.title}</Typography>
```

### For New Components

1. **Always use static content for UI elements**
2. **Use dynamic content only for CMS-managed data**
3. **Provide fallbacks for dynamic content**
4. **Use TypeScript interfaces for type safety**

## CMS Integration

The CMS dashboard (`src/components/CMS/CMSDashboard.tsx`) manages only dynamic content. Static content is not editable through the CMS interface.

### CMS Sections
- Hero (title, subtitle, description, statistics)
- About (description, long description)
- Education (structured data)
- Experience (structured data)
- Research (interests, areas)
- Publications (structured data)
- Projects (structured data)
- Skills (technical skills list)
- Awards (achievements list)
- Contact (contact information)

### Static Content (Not in CMS)
- Navigation labels
- Button text
- Form labels
- Status messages
- Error messages
- Success messages
- Placeholder text
- Tooltips
- Accessibility labels

## Best Practices

1. **Never mix static and dynamic content in the same object**
2. **Always provide fallbacks for dynamic content**
3. **Use TypeScript interfaces for type safety**
4. **Keep static content organized by category**
5. **Use consistent naming conventions**
6. **Provide translations for all static content**
7. **Use helper functions for content access**
8. **Document any new content categories**

## File Structure

```
src/
├── config/
│   └── staticContent.ts          # Static content definitions
├── utils/
│   └── contentUtils.ts           # Content utility functions
├── services/
│   └── cmsService.ts             # CMS service for dynamic content
└── components/
    └── Sections/                 # Components using both content types
        ├── Hero.tsx
        ├── About.tsx
        ├── Research.tsx
        └── Contact.tsx
```

This separation ensures a clean, maintainable, and scalable content management system. 