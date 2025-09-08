# URL Shortener Application

A complete URL shortener application built with React, TypeScript, Material-UI, and a custom logging middleware. This project demonstrates modern web development practices while fulfilling all the specified requirements.

## 🚀 Features

### ✅ Core Requirements Implemented

1. **React URL Shortener Web App**
   - Built with React 18 and TypeScript
   - Responsive Material-UI design
   - Client-side routing with React Router

2. **Mandatory Logging Integration**
   - Custom logging middleware package (`@urlshortener/logging-middleware`)
   - Comprehensive logging throughout the application
   - API calls to test server: `http://29.244.56.144/evaluation-service/logs`
   - No console.log usage - all logging through custom middleware

3. **URL Shortening Functionality**
   - Support for up to 5 URLs simultaneously
   - Custom shortcode support (optional)
   - Automatic shortcode generation if not provided
   - Configurable validity periods (default: 30 minutes)
   - Client-side validation for URLs and shortcodes

4. **Client-Side Redirection**
   - React Router handles shortened URL redirection
   - URL mapping managed client-side
   - Proper error handling for expired/invalid URLs

5. **Statistics and Analytics**
   - Comprehensive statistics page
   - Click tracking with timestamps, sources, and locations
   - Detailed click analytics for each shortened URL
   - URL management (view, copy, delete)

6. **Error Handling**
   - Robust client-side error handling
   - User-friendly error messages
   - Input validation with helpful feedback
   - Graceful handling of edge cases

## 📁 Project Structure

```
2201641550074/
├── LoggingMiddleware/           # Custom logging package
│   ├── src/
│   │   ├── types.ts            # Type definitions
│   │   ├── validator.ts        # Input validation
│   │   ├── logger.ts          # Main logging implementation
│   │   └── index.ts           # Package exports
│   ├── dist/                  # Built package
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
└── FrontendTest/               # React application
    ├── src/
    │   ├── App.tsx            # Main application component
    │   ├── types.ts           # Type definitions
    │   ├── urlService.ts      # URL management service
    │   └── index.tsx          # Application entry point
    ├── public/
    ├── package.json
    └── README.md
```

## 🛠 Technologies Used

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe JavaScript
- **Material-UI v5** - Google's Material Design components
- **React Router v6** - Client-side routing
- **Emotion** - CSS-in-JS styling

### Logging Middleware
- **TypeScript** - Type-safe implementation
- **Axios** - HTTP client for API calls
- **Robust validation** - Parameter validation and error handling
- **Retry logic** - Automatic retry for failed API calls

## 🎯 Key Features Demonstrated

### 1. URL Shortening Page
- **Multiple URL support**: Process up to 5 URLs simultaneously
- **Custom shortcodes**: Optional user-defined shortcodes with validation
- **Validity control**: Set expiration time in minutes
- **Real-time validation**: Client-side validation with instant feedback
- **Result display**: Show shortened URLs with copy functionality

### 2. Statistics Page
- **Comprehensive analytics**: View all shortened URLs
- **Click tracking**: Detailed click statistics with timestamps
- **Geographic data**: Mock geographic location tracking
- **Source tracking**: Track click sources (Direct, Google, Facebook, etc.)
- **URL management**: Copy, delete, and view detailed statistics

### 3. Redirection Handling
- **Client-side routing**: Handle `/{shortCode}` URLs
- **Click tracking**: Automatic click counting and analytics
- **Error handling**: Graceful handling of expired/invalid URLs
- **User feedback**: Clear messaging during redirection process

### 4. Logging Integration
- **Comprehensive logging**: Every operation logged through custom middleware
- **API integration**: All logs sent to specified test server
- **Validation**: Strict parameter validation (stack, level, package)
- **Error handling**: Retry logic and fallback mechanisms

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Installation

1. **Clone or extract the project**
   ```bash
   cd 2201641550074
   ```

2. **Build the logging middleware**
   ```bash
   cd LoggingMiddleware
   npm install
   npm run build
   ```

3. **Setup the React application**
   ```bash
   cd ../FrontendTest
   npm install
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Access the application**
   - Open http://localhost:3000 in your browser
   - The application will automatically open

### Usage

1. **Create Short URLs**
   - Navigate to the home page
   - Enter a valid URL (must start with http:// or https://)
   - Optionally set a custom shortcode
   - Optionally set validity period (default: 30 minutes)
   - Click "Shorten URL"

2. **View Statistics**
   - Click "Statistics" in the navigation
   - View all created URLs with click counts
   - See detailed click analytics
   - Copy URLs or delete unwanted ones

3. **Use Short URLs**
   - Navigate to `http://localhost:3000/{shortCode}`
   - The application will track the click and redirect to the original URL
   - Expired URLs will show an error message

## 📊 Logging Middleware Details

### API Compliance
- **Endpoint**: `http://29.244.56.144/evaluation-service/logs`
- **Method**: POST
- **Validation**: All parameters validated according to requirements
- **Retry Logic**: Automatic retries with exponential backoff

### Supported Parameters
- **Stack**: `frontend`, `backend`
- **Level**: `debug`, `info`, `warn`, `error`, `fatal`
- **Package**: Frontend, backend, or shared packages as per specification
- **Message**: Descriptive logging messages

### Usage Example
```typescript
import { Log } from '@urlshortener/logging-middleware';

await Log('frontend', 'info', 'component', 'User clicked shorten button');
await Log('frontend', 'error', 'api', 'Failed to shorten URL: Invalid input');
```

## 🎨 User Interface

### Design Principles
- **Material Design**: Consistent Google Material Design language
- **Responsive Layout**: Works on desktop and mobile devices
- **Clean Interface**: Uncluttered design focusing on core functionality
- **Intuitive Navigation**: Clear navigation between features
- **Accessibility**: Proper semantic HTML and ARIA labels

### Key UI Components
- **Navigation Bar**: Consistent navigation across all pages
- **Form Components**: Well-structured forms with validation feedback
- **Statistics Cards**: Clear presentation of URL analytics
- **Loading States**: Proper loading indicators for async operations
- **Error Messages**: User-friendly error handling and messaging

## 🔧 Technical Implementation

### Client-Side Architecture
- **Component-based**: Modular React components
- **Type Safety**: Full TypeScript implementation
- **State Management**: React hooks for state management
- **Local Storage**: Persistent data storage in browser
- **Service Layer**: Abstracted URL management service

### Validation & Error Handling
- **Input Validation**: Real-time validation with user feedback
- **Error Boundaries**: Graceful error handling throughout the app
- **Network Error Handling**: Robust handling of network failures
- **User Feedback**: Clear messaging for all error conditions

## 🏆 Requirements Compliance

### ✅ All Requirements Met
- [x] React TypeScript application
- [x] Material-UI styling (no other CSS frameworks)
- [x] Mandatory logging middleware integration
- [x] No console.log usage
- [x] Up to 5 concurrent URL shortening
- [x] Custom shortcode support
- [x] 30-minute default validity
- [x] Client-side routing and redirection
- [x] Comprehensive statistics with click analytics
- [x] Robust error handling
- [x] Runs on http://localhost:3000
- [x] Clean, user-focused interface

## 🔮 Future Enhancements

While the current implementation meets all requirements, potential enhancements could include:
- Real backend API integration
- User authentication and personal URL management
- Bulk URL import/export
- Custom domain support
- Advanced analytics dashboard
- QR code generation for short URLs
- URL preview functionality
- Social sharing integration

## 📝 Notes

- This is a client-side implementation using localStorage for data persistence
- All logging goes through the custom middleware to the specified test server
- The application follows Material-UI design principles throughout
- Comprehensive TypeScript typing ensures type safety
- All requirements from the original specification have been implemented

---

**Built with ❤️ using React, TypeScript, and Material-UI**
