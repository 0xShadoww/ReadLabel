# ReadLabel - AI-Powered Food Ingredient Analyzer

<div align="center">
  <img src="https://img.shields.io/badge/PWA-Ready-brightgreen" alt="PWA Ready" />
  <img src="https://img.shields.io/badge/React-18.2.0-blue" alt="React" />
  <img src="https://img.shields.io/badge/Vite-5.0.0-purple" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.3.6-cyan" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/AI-Gemini%202.5%20Pro-orange" alt="Gemini AI" />
</div>

ReadLabel is a Progressive Web App (PWA) that helps users make informed food choices by analyzing ingredient labels through AI-powered risk assessment. Scan any food label with your camera and get instant health insights powered by Google Gemini AI.

## ✨ Features

- **📱 PWA Experience**: Install like a native app on any device
- **📷 Camera Integration**: Scan ingredient labels with your smartphone camera
- **🤖 AI Analysis**: Powered by Google Gemini 2.5 Pro for accurate ingredient analysis
- **🚦 Health Risk Assessment**: Categorizes ingredients as Safe, Moderate Concern, or High Concern
- **🎯 Smart Recommendations**: Get personalized consumption advice
- **📱 Offline Capable**: Works without internet connection using local ingredient database
- **🎨 Modern UI**: Dark theme with smooth animations and mobile-first design
- **🔒 Privacy First**: Photos processed locally, never stored or uploaded

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- A modern web browser with camera support
- Google Gemini API key (optional for full functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/readlabel.git
   cd readlabel
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your API keys:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_SUPABASE_URL=your_supabase_url (optional)
   VITE_SUPABASE_ANON_KEY=your_supabase_key (optional)
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` and start scanning food labels!

## 🏗️ Architecture

ReadLabel follows a modern PWA architecture with the following key components:

### Core Data Flow
```
📱 Camera Capture → 🔍 OCR (Tesseract.js) → 🧠 AI Analysis (Gemini) → 📊 Risk Assessment → 💾 Local Cache
```

### Tech Stack

**Frontend Framework**
- **React 18** with functional components and hooks
- **Vite** for lightning-fast development and building
- **TailwindCSS** for utility-first styling

**PWA Features**
- **Service Workers** for caching and offline functionality
- **Web App Manifest** for installability
- **Workbox** for advanced caching strategies

**AI & Processing**
- **Tesseract.js** for client-side OCR text extraction
- **Google Gemini 2.5 Pro** for AI-powered ingredient analysis
- **Local ingredient database** (500+ ingredients) for offline fallback

**State Management**
- **React Hooks** (useState, useEffect, custom hooks)
- **Local Storage** for caching results
- **Context API** for global state when needed

## 📁 Project Structure

```
readlabel/
├── public/                     # Static assets and PWA files
│   ├── icons/                  # App icons (192px, 512px)
│   └── manifest.json           # PWA manifest (auto-generated)
│
├── src/
│   ├── components/             # React components
│   │   ├── Analysis/           # Results and analysis components
│   │   ├── Camera/             # Camera interface and permissions
│   │   ├── Layout/             # App layout and structure
│   │   └── UI/                 # Reusable UI components
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── useCamera.js        # Camera management
│   │   ├── useOCR.js           # Text extraction
│   │   ├── useAnalysis.js      # AI analysis
│   │   └── usePWAInstall.js    # PWA installation
│   │
│   ├── services/               # Business logic services
│   │   ├── ai/                 # AI and analysis services
│   │   ├── database/           # Data storage utilities
│   │   ├── ocr/                # OCR processing
│   │   └── pwa/                # PWA functionality
│   │
│   ├── utils/                  # Utility functions
│   ├── styles/                 # Global styles and CSS
│   └── data/                   # Static data and databases
│
├── api/                        # Vercel serverless functions
├── tests/                      # Test files and mocks
└── docs/                       # Documentation
```

## 🛠️ Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run preview         # Preview production build locally

# Code Quality
npm run lint            # Lint code with ESLint
npm run format          # Format code with Prettier

# Testing
npm test                # Run all tests
npm run test:watch      # Run tests in watch mode  
npm run test:coverage   # Generate test coverage report

# Deployment
vercel deploy           # Deploy to Vercel staging
vercel --prod           # Deploy to Vercel production
```

## 🧪 Testing

ReadLabel includes comprehensive testing with Vitest and React Testing Library:

```bash
# Run specific test files
npm test -- LandingScreen.test.jsx
npm test -- --testPathPattern=hooks

# Generate coverage report
npm run test:coverage
```

Test structure:
- **Component tests**: UI behavior and user interactions
- **Hook tests**: Custom hook functionality and edge cases
- **Service tests**: Business logic and API integrations
- **Utility tests**: Pure function testing

## 📱 PWA Features

### Installation
- **Automatic prompts** for installation on supported devices
- **Custom install UI** with dismissal and retry logic
- **Cross-platform support** (iOS, Android, Desktop)

### Offline Functionality
- **Service worker caching** for core app functionality
- **Local ingredient database** for offline analysis
- **Graceful degradation** when offline

### Performance
- **Lazy loading** of non-critical components
- **Image optimization** and compression
- **Efficient caching strategies** using Workbox

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GEMINI_API_KEY` | Google Gemini API key for AI analysis | Optional* |
| `VITE_SUPABASE_URL` | Supabase project URL for analytics | Optional |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Optional |
| `VITE_CLOUDINARY_CLOUD_NAME` | Cloudinary for image storage | Optional |

*The app works offline with a local ingredient database when no API key is provided.

### Deployment

**Vercel (Recommended)**
```bash
# Deploy to staging
vercel deploy

# Deploy to production
vercel --prod
```

**Other Platforms**
The app can be deployed to any static hosting service:
- Netlify
- Cloudflare Pages
- GitHub Pages
- Firebase Hosting

## 🎨 Customization

### Theming
The app uses a custom Tailwind CSS theme defined in `tailwind.config.js`:

```javascript
// Custom color palette
colors: {
  primary: { /* Warm orange tones */ },
  dark: { /* Dark theme colors */ },
  success: '#00FF88',
  warning: '#FFD700',
  danger: '#FF3B30'
}
```

### Adding New Ingredients
To extend the local ingredient database:

1. Edit `src/data/ingredientDatabase.json`
2. Follow the existing schema:
   ```json
   {
     "name": "Ingredient name",
     "aliases": ["alternative names"],
     "category": "safe|moderate|high",
     "description": "Health impact description"
   }
   ```

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Run the test suite (`npm test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Development Guidelines
- Follow the existing code style and patterns
- Write tests for new components and functionality
- Update documentation for new features
- Ensure PWA functionality remains intact

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


---

<div align="center">
  <p>Made with ❤️ for healthier food choices</p>
</div>
