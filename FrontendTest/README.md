# URL Shortener - React Frontend Application

A professional URL shortening service built with React, TypeScript, and Material-UI. This application provides URL shortening capabilities with comprehensive analytics, click tracking, and a modern responsive interface.

## 🚀 Features

### Core Functionality
- **Multiple URL Shortening**: Process up to 5 URLs simultaneously
- **Custom Short Codes**: Optional custom short codes (3-20 characters)
- **Expiration Management**: Configurable URL validity periods
- **Client-Side Routing**: Handle short URL redirections with `/shortCode` routes
- **Local Storage**: Persistent data storage in browser
- **Real-Time Validation**: Comprehensive form validation with error handling

### Analytics & Statistics
- **Comprehensive Dashboard**: Real-time statistics with summary cards
- **Click Tracking**: Detailed click analytics with timestamps, sources, and locations
- **Performance Metrics**: Total URLs, total clicks, active/expired URL counts
- **Visual Data Display**: Professional tables and charts for analytics
- **Click History**: View latest 50 clicks per URL with sorting capabilities

### User Experience
- **Material-UI Design**: Modern, responsive interface
- **Progressive Loading**: Smart loading states and progress indicators
- **Copy to Clipboard**: One-click URL copying functionality
- **Mobile Responsive**: Optimized for all device sizes
- **Error Handling**: Graceful error management with user feedback
- **Navigation**: Persistent navigation bar with Home and Statistics pages

### Advanced Features
- **Custom Logging**: Integration with `@urlshortener/logging-middleware`
- **TypeScript**: Full type safety throughout the application
- **Form Management**: Dynamic form addition/removal for multiple URLs
- **Accordion Interface**: Expandable URL details with click analytics
- **Status Indicators**: Visual chips showing active/expired URL status
- **Relative Time Display**: Human-readable time formatting (e.g., "2h ago")

## 🛠️ Technology Stack

- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Full type safety and enhanced developer experience
- **Material-UI (MUI)**: Professional component library with theming
- **React Router**: Client-side routing for SPA navigation
- **Custom Logging Middleware**: Professional logging solution
- **Local Storage API**: Browser-based data persistence
- **ESLint & TypeScript**: Code quality and type checking

## 📦 Installation & Setup

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager
- Custom logging middleware package (included as local dependency)

### Installation Steps

1. **Clone or navigate to the project directory**:
   ```bash
   cd FrontendTest
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage Guide

### Creating Short URLs

1. **Navigate to Home Page**: Click "Home" in the navigation bar
2. **Enter URLs**: Add up to 5 URLs in the form
3. **Configure Options** (Optional):
   - Custom short code (3-20 alphanumeric characters)
   - Validity period in minutes
4. **Submit**: Click "Shorten URLs" to generate short links
5. **Copy & Share**: Use the copy button to copy shortened URLs

### Viewing Analytics

1. **Access Statistics**: Click "Statistics" in the navigation bar
2. **View Summary**: See overview cards with total metrics
3. **Expand Details**: Click on any URL accordion to view:
   - Original URL and creation details
   - Click analytics table with timestamps
   - Source tracking and location data
4. **Manage URLs**: Copy or delete URLs directly from the interface

### URL Redirection

- **Access Short URLs**: Visit `http://localhost:3000/yourShortCode`
- **Automatic Redirect**: App will redirect to original URL
- **Click Tracking**: Each access is logged with analytics data
- **Error Handling**: Invalid or expired URLs show appropriate messages

## 🏗️ Project Structure

```
FrontendTest/
├── src/
│   ├── App.tsx                 # Main application component
│   ├── types.ts                # TypeScript type definitions
│   ├── urlService.ts           # URL shortening service logic
│   ├── index.tsx               # Application entry point
│   └── index.css               # Global styles
├── public/
│   ├── index.html              # HTML template
│   └── favicon.ico             # Application icon
├── package.json                # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
└── README.md                  # This file
```

## 🔧 Available Scripts

### Development
```bash
npm start          # Start development server (http://localhost:3000)
npm test           # Run test suite
npm run build      # Build production bundle
npm run eject      # Eject from Create React App (one-way operation)
```

### Build & Deployment
```bash
npm run build      # Creates optimized production build in 'build/' folder
npm run preview    # Preview production build locally
```

## 📊 Data Management

### Local Storage Schema
The application uses browser localStorage with the following structure:

```typescript
interface StoredUrlData {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  createdAt: Date;
  expiresAt: Date;
  clickCount: number;
  clicks: ClickData[];
}

interface ClickData {
  id: string;
  timestamp: Date;
  source: string;
  location: string;
  userAgent?: string;
}
```

### Data Persistence
- **Automatic Saving**: All URL data is automatically saved to localStorage
- **Session Recovery**: Data persists across browser sessions
- **Export/Import**: Data can be manually backed up from browser storage
- **Clean Up**: Expired URLs are automatically filtered from active lists

## 🎨 Customization

### Theming
The application uses Material-UI theming system:

```typescript
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',  // Customize primary color
    },
    background: {
      default: '#f5f5f5', // Customize background
    },
  },
});
```

### Configuration
Key constants can be modified in `types.ts`:

```typescript
export const DEFAULT_VALIDITY_MINUTES = 43200; // 30 days
export const MAX_URLS_PER_REQUEST = 5;          // Maximum URLs per batch
export const SHORT_CODE_LENGTH = 6;             // Generated short code length
```

## 🔍 Logging & Monitoring

The application includes comprehensive logging using the custom logging middleware:

### Log Categories
- **User Actions**: Navigation, URL creation, deletion, copying
- **System Events**: Data loading, form submissions, redirections
- **Error Tracking**: Failed operations, validation errors
- **Performance**: Load times, data processing metrics

### Log Levels
- `info`: General application events
- `error`: Error conditions and failures
- `debug`: Detailed debugging information

## 🚨 Error Handling

### Validation Errors
- **URL Format**: Validates proper HTTP/HTTPS format
- **Custom Codes**: Validates alphanumeric format and length
- **Expiry Times**: Ensures positive validity periods
- **Duplicate Codes**: Prevents short code conflicts

### Runtime Errors
- **Storage Failures**: Handles localStorage limitations
- **Network Issues**: Graceful degradation for connectivity problems
- **Invalid Routes**: 404 handling for unknown short codes
- **Expired URLs**: Appropriate messaging for expired links

## 🔒 Security Considerations

- **Input Validation**: All user inputs are validated client-side
- **XSS Protection**: Proper sanitization of displayed URLs
- **Local Storage**: Sensitive data considerations for client-side storage
- **URL Validation**: Prevention of malicious URL shortening

## 📱 Browser Compatibility

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile Browsers**: iOS Safari, Chrome Mobile, Samsung Internet
- **Features Used**: ES6+, Local Storage, Clipboard API, History API

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

**Port 3000 already in use**:
```bash
# Kill process using port 3000
npx kill-port 3000
# Or use different port
PORT=3001 npm start
```

**Dependencies issues**:
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors**:
```bash
# Check TypeScript configuration
npx tsc --noEmit
```

### Performance Optimization

- **Large Click Data**: Consider implementing pagination for URLs with many clicks
- **Storage Limits**: Monitor localStorage usage for large datasets
- **Memory Usage**: Implement data cleanup for expired URLs

## 📞 Support

For questions, issues, or contributions:
- Create an issue in the repository
- Check the troubleshooting section above
- Review the code documentation and comments
