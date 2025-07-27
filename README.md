# PhD Portfolio Website with CMS

A modern, responsive portfolio website for a PhD Materials and Electronics Engineer with a built-in Content Management System (CMS) for easy content updates.

## 🌟 Features

### Website Features
- **Multi-language Support**: English and Japanese versions
- **Modern UI/UX**: Clean, professional design with smooth animations
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark/Light Theme**: Toggle between themes
- **Smooth Scrolling**: Navigation with smooth scroll to sections
- **Professional Sections**:
  - Hero section with animated statistics
  - About section with education and experience
  - Research section with projects and publications
  - Contact section with form and information

### CMS Features (No-Code Content Management)
- **Visual Content Editor**: Edit website content without touching code
- **Real-time Preview**: See changes before publishing
- **Multi-language Editing**: Edit content in both English and Japanese
- **Section Management**: Show/hide sections, reorder content
- **Image Management**: Upload and manage images
- **One-click Publishing**: Publish changes instantly
- **User-friendly Interface**: Designed for non-technical users

## 🚀 Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **UI Framework**: Material-UI (MUI) v5
- **Animations**: Framer Motion
- **Styling**: Emotion (CSS-in-JS)
- **Icons**: Material Icons + Lucide React
- **Backend**: Firebase (planned)
- **Deployment**: GCP + Firebase Hosting (planned)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portfolio-cms
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

## 🛠️ Development

### Project Structure
```
src/
├── components/
│   ├── Layout/
│   │   └── Header.tsx          # Navigation header
│   ├── Sections/
│   │   ├── Hero.tsx           # Hero section
│   │   ├── About.tsx          # About section
│   │   ├── Research.tsx       # Research section
│   │   └── Contact.tsx        # Contact section
│   └── CMS/
│       └── CMSDashboard.tsx   # Content management system
├── App.tsx                    # Main app component
└── main.tsx                   # App entry point
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Customization

### Adding New Sections
1. Create a new component in `src/components/Sections/`
2. Follow the existing pattern with language props
3. Add the section to `App.tsx`
4. Update navigation in `Header.tsx`

### Modifying Content
- **For Developers**: Edit content directly in component files
- **For Non-Technical Users**: Use the CMS interface (accessible via settings button in development mode)

### Styling
- Theme customization in `App.tsx`
- Component-specific styles using MUI's `sx` prop
- Global styles in `index.css`

## 🔧 CMS Usage

### Accessing CMS
1. Start the development server
2. Click the settings (⚙️) button in the bottom-right corner
3. The CMS dashboard will open in full-screen mode

### Editing Content
1. **Switch Language**: Toggle between English and Japanese
2. **Edit Sections**: Click the edit icon on any section
3. **Toggle Visibility**: Show/hide sections using the visibility toggle
4. **Publish Changes**: Click "Publish Changes" to save

### CMS Features
- **Visual Editor**: Edit text content in a user-friendly interface
- **Section Management**: Reorder, hide, or show sections
- **Live Preview**: See changes in real-time
- **Multi-language Support**: Edit content in both languages
- **Image Management**: Upload and manage images (coming soon)

## 🚀 Deployment

### Firebase Setup (Planned)
1. Create Firebase project
2. Enable Firestore and Storage
3. Configure authentication
4. Deploy to Firebase Hosting

### Environment Variables
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 📱 Responsive Design

The website is fully responsive and optimized for:
- **Desktop**: 1200px+ (full layout)
- **Tablet**: 768px - 1199px (adjusted layout)
- **Mobile**: < 768px (mobile-first design)

## 🎯 Target Audience

This portfolio website is designed for:
- **PhD Researchers** in Materials Science and Electronics Engineering
- **Academic Professionals** seeking to showcase their work
- **Research Institutions** looking for modern portfolio solutions
- **Non-technical users** who need easy content management

## 🔮 Future Enhancements

- [ ] Firebase integration for data persistence
- [ ] Image upload and management
- [ ] Blog section for research updates
- [ ] Analytics dashboard
- [ ] SEO optimization
- [ ] Advanced animations
- [ ] PDF export functionality
- [ ] Social media integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support or questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ for the academic community**