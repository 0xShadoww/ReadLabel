# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

ReadLabel is an AI-powered Progressive Web App (PWA) that analyzes food ingredient labels to provide health risk assessments. The app uses OCR to extract text from photos, then leverages Google Gemini AI to categorize ingredients and provide consumption advice.

## Development Commands

### Setup and Installation
```bash
# Install dependencies
npm install

# Copy environment template and configure API keys
cp .env.example .env.local
```

### Development
```bash
# Start development server (typically runs on localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

### Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- Camera.test.jsx

# Run tests for specific component/service
npm test -- --testPathPattern=services/ocr
```

### PWA and Deployment
```bash
# Test PWA functionality locally
npm run preview

# Deploy to Vercel (if configured)
vercel deploy

# Deploy to production
vercel --prod
```

## Architecture Overview

### Core Data Flow
1. **Image Capture**: Camera component captures ingredient label photo
2. **OCR Processing**: Tesseract.js extracts text from image
3. **Text Cleaning**: Utils normalize and clean extracted text
4. **AI Analysis**: Gemini API analyzes ingredients for health risks
5. **Risk Categorization**: Ingredients classified as Safe/Moderate/High Concern
6. **Results Display**: Health score (1-10) and consumption advice shown
7. **Caching**: Results stored locally for offline access

### Key Service Architecture

**OCR Pipeline**: `tesseractService.js` → `imagePreprocessing.js` → `textCleaning.js`
- Handles image optimization, text extraction, and data normalization

**AI Analysis Pipeline**: `geminiService.js` → `promptTemplates.js` → `ingredientParser.js`
- Manages API calls, prompt engineering, and response parsing

**Offline Strategy**: `ingredientDatabase.js` ↔ `localStorage.js` ↔ `offlineManager.js`
- Provides fallback data when Gemini API is unavailable or rate-limited

**PWA Layer**: `serviceWorkerRegistration.js` ↔ `sw.js` ↔ `installPrompt.js`
- Manages caching, offline functionality, and app installation

### Component Hierarchy
```
App.jsx
├── AppLayout.jsx
│   ├── LandingScreen.jsx
│   ├── CameraInterface.jsx
│   │   ├── ImageCapture.jsx
│   │   └── CameraPermissions.jsx
│   ├── LoadingScreen.jsx
│   └── ResultsDisplay.jsx
│       ├── HealthScore.jsx
│       ├── IngredientCategories.jsx
│       └── AdviceSection.jsx
```

## Critical Configuration Files

### Environment Variables (.env.local)
Required API keys and configuration:
- `VITE_GEMINI_API_KEY`: Google Gemini 2.5 Pro API key
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key
- `VITE_CLOUDINARY_CLOUD_NAME`: Image storage (optional)

### PWA Configuration
- `public/manifest.json`: App metadata, icons, display settings
- `public/sw.js`: Service worker for caching and offline functionality
- `src/services/pwa/serviceWorkerRegistration.js`: Registration logic

### Build Configuration
- `vite.config.js`: Build optimization, PWA plugins, proxy settings
- `vercel.json`: Serverless function routes, build settings
- `tailwind.config.js`: CSS framework configuration with custom colors

## Data Management

### Ingredient Database Structure
The local fallback database (`src/data/ingredientDatabase.json`) contains 500+ ingredients with:
- Ingredient name and aliases
- Risk category (safe/moderate/high)
- Health impact description
- Regulatory status (FSSAI compliance)

### Health Risk Categories
- **Safe**: Natural ingredients, basic components (water, flour, etc.)
- **Moderate Concern**: Preservatives, processed oils, high sodium items
- **High Concern**: Trans fats, artificial colors, harmful additives

### Caching Strategy
1. **API Responses**: Cached in localStorage for 24 hours
2. **Images**: Processed and discarded (privacy-first)
3. **Ingredient Database**: Stored in IndexedDB for offline access
4. **User Preferences**: Saved in localStorage

## API Integration

### Gemini AI Service
Rate limiting: 1,500 requests/day (free tier)
- Handles ingredient analysis with specialized prompts
- Focuses on Indian food regulations (FSSAI)
- Returns structured JSON with health scoring

### Vercel Serverless Functions (`/api/`)
- `analyze.js`: Main analysis endpoint with image processing
- `ocr.js`: Dedicated OCR processing endpoint
- `health.js`: API health check and diagnostics

## Testing Strategy

### Unit Tests
- **Components**: React Testing Library for UI components
- **Services**: Jest mocks for API calls and external dependencies
- **Utils**: Pure function testing for data processing logic

### Mock Data
- `tests/mocks/mockImages.js`: Base64 test images
- `tests/mocks/mockIngredients.js`: Sample ingredient lists
- `tests/mocks/mockResponses.js`: API response fixtures

### Critical Test Coverage
- Camera permissions and image capture flow
- OCR text extraction accuracy
- AI response parsing and error handling
- Offline fallback functionality
- PWA installation and service worker behavior

## Deployment Notes

### Vercel Configuration
- Build command: `npm run build`
- Output directory: `dist`
- Serverless functions in `/api` directory
- Environment variables set in Vercel dashboard

### PWA Deployment Checklist
- Icons generated for all required sizes (192px, 512px)
- Service worker registered and functional
- Manifest.json properly configured
- HTTPS enabled (required for camera access)
- Offline functionality tested

## Performance Considerations

### Image Processing
- Client-side compression before OCR
- Tesseract.js worker management
- Memory cleanup after processing

### API Optimization
- Request deduplication for common ingredients
- Intelligent caching based on ingredient similarity
- Graceful fallback to local database

### Mobile Performance
- Touch-optimized UI components
- Efficient camera stream handling
- Battery-conscious background processing

## Security Guidelines

### API Key Management
- Never commit API keys to repository
- Use environment variables for all sensitive data
- Implement rate limiting on serverless functions

### User Privacy
- Images processed locally, never stored
- No personal data collection
- Clear cache management options

### Input Validation
- Sanitize OCR text before AI processing
- Validate image file types and sizes
- Escape user-facing content display