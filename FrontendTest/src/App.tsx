import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { 
  Link as LinkIcon, 
  Home as HomeIcon, 
  Analytics as AnalyticsIcon,
  ContentCopy as CopyIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { Log, initializeLogger } from '@urlshortener/logging-middleware';
import { urlService } from './urlService';
import { ShortenUrlRequest, UrlStatistics, DEFAULT_VALIDITY_MINUTES, MAX_URLS_PER_REQUEST } from './types';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <AppBar position="sticky">
      <Toolbar>
        <LinkIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          URL Shortener
        </Typography>
        <Button color="inherit" startIcon={<HomeIcon />} onClick={() => navigate('/')}>
          Home
        </Button>
        <Button color="inherit" startIcon={<AnalyticsIcon />} onClick={() => navigate('/stats')}>
          Statistics
        </Button>
      </Toolbar>
    </AppBar>
  );
};

interface UrlFormData {
  originalUrl: string;
  customShortcode: string;
  validityMinutes: string;
}

const UrlForm: React.FC = () => {
  const [urlForms, setUrlForms] = useState<UrlFormData[]>([{
    originalUrl: '',
    customShortcode: '',
    validityMinutes: ''
  }]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<UrlStatistics[]>([]);
  const [error, setError] = useState<string | null>(null);

  const addUrlForm = () => {
    if (urlForms.length < MAX_URLS_PER_REQUEST) {
      setUrlForms([...urlForms, {
        originalUrl: '',
        customShortcode: '',
        validityMinutes: ''
      }]);
      Log('frontend', 'info', 'component', `Added URL form. Total forms: ${urlForms.length + 1}`);
    }
  };

  const removeUrlForm = (index: number) => {
    if (urlForms.length > 1) {
      const newForms = urlForms.filter((_, i) => i !== index);
      setUrlForms(newForms);
      Log('frontend', 'info', 'component', `Removed URL form. Total forms: ${newForms.length}`);
    }
  };

  const updateUrlForm = (index: number, field: keyof UrlFormData, value: string) => {
    const newForms = [...urlForms];
    newForms[index] = { ...newForms[index], [field]: value };
    setUrlForms(newForms);
  };

  const validateUrls = (): string[] => {
    const errors: string[] = [];
    
    urlForms.forEach((form, index) => {
      if (!form.originalUrl.trim()) {
        errors.push(`URL ${index + 1}: Please enter a URL`);
      } else if (!form.originalUrl.match(/^https?:\/\/.+/)) {
        errors.push(`URL ${index + 1}: Please enter a valid URL starting with http:// or https://`);
      }
      
      if (form.customShortcode.trim() && !form.customShortcode.match(/^[a-zA-Z0-9]{3,20}$/)) {
        errors.push(`URL ${index + 1}: Custom shortcode must be 3-20 characters, letters and numbers only`);
      }
      
      if (form.validityMinutes && (isNaN(parseInt(form.validityMinutes)) || parseInt(form.validityMinutes) < 1)) {
        errors.push(`URL ${index + 1}: Validity must be a positive number`);
      }
    });
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const validationErrors = validateUrls();
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join('\n'));
      }

      await Log('frontend', 'info', 'component', `Starting to shorten ${urlForms.length} URLs`);
      
      const requests: ShortenUrlRequest[] = urlForms
        .filter(form => form.originalUrl.trim())
        .map(form => ({
          originalUrl: form.originalUrl.trim(),
          customShortcode: form.customShortcode.trim() || undefined,
          validityMinutes: form.validityMinutes ? parseInt(form.validityMinutes) : DEFAULT_VALIDITY_MINUTES
        }));

      const shortenedUrls: UrlStatistics[] = [];
      const errors: string[] = [];

      for (let i = 0; i < requests.length; i++) {
        try {
          const shortened = await urlService.shortenUrl(requests[i]);
          shortenedUrls.push(shortened);
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : 'Unknown error';
          errors.push(`URL ${i + 1}: ${errorMsg}`);
          await Log('frontend', 'error', 'component', `Failed to shorten URL ${i + 1}: ${errorMsg}`);
        }
      }

      if (shortenedUrls.length > 0) {
        setResults(shortenedUrls);
        setUrlForms([{
          originalUrl: '',
          customShortcode: '',
          validityMinutes: ''
        }]);
        await Log('frontend', 'info', 'component', `Successfully shortened ${shortenedUrls.length} URLs`);
      }
      
      if (errors.length > 0) {
        setError(`Some URLs failed to shorten:\n${errors.join('\n')}`);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      await Log('frontend', 'error', 'component', `Form submission failed: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    Log('frontend', 'info', 'component', `Copied to clipboard: ${text}`);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" color="primary">
        URL Shortener
      </Typography>
      
      <Typography variant="h6" align="center" color="textSecondary" gutterBottom>
        Shorten up to {MAX_URLS_PER_REQUEST} URLs simultaneously
      </Typography>
      
      <Typography variant="body2" align="center" color="textSecondary" paragraph>
        Default validity: {DEFAULT_VALIDITY_MINUTES} minutes | Custom shortcodes optional
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          {urlForms.map((form, index) => (
            <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" color="primary">
                  URL #{index + 1}
                </Typography>
                <Box>
                  {index === urlForms.length - 1 && urlForms.length < MAX_URLS_PER_REQUEST && (
                    <Button
                      size="small"
                      onClick={addUrlForm}
                      variant="outlined"
                      sx={{ mr: 1 }}
                    >
                      + Add URL
                    </Button>
                  )}
                  {urlForms.length > 1 && (
                    <Button
                      size="small"
                      onClick={() => removeUrlForm(index)}
                      variant="outlined"
                      color="error"
                    >
                      Remove
                    </Button>
                  )}
                </Box>
              </Box>
              
              <TextField
                fullWidth
                label="Enter URL to shorten"
                value={form.originalUrl}
                onChange={(e) => updateUrlForm(index, 'originalUrl', e.target.value)}
                margin="normal"
                required
                placeholder="https://example.com/very-long-url"
              />
              
              <Box display="flex" gap={2}>
                <TextField
                  label="Custom Shortcode (optional)"
                  value={form.customShortcode}
                  onChange={(e) => updateUrlForm(index, 'customShortcode', e.target.value)}
                  margin="normal"
                  sx={{ flex: 1 }}
                  placeholder="mylink123"
                  helperText="3-20 characters, letters and numbers only"
                />
                <TextField
                  label="Validity (minutes)"
                  value={form.validityMinutes}
                  onChange={(e) => updateUrlForm(index, 'validityMinutes', e.target.value)}
                  margin="normal"
                  type="number"
                  sx={{ flex: 1 }}
                  placeholder={DEFAULT_VALIDITY_MINUTES.toString()}
                  helperText={`Default: ${DEFAULT_VALIDITY_MINUTES} min`}
                />
              </Box>
            </Box>
          ))}
          
          <Box textAlign="center" mt={3}>
            <Button 
              type="submit" 
              variant="contained" 
              size="large" 
              disabled={loading || urlForms.every(form => !form.originalUrl.trim())}
              sx={{ px: 4 }}
            >
              {loading ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
              Shorten {urlForms.filter(form => form.originalUrl.trim()).length} URL{urlForms.filter(form => form.originalUrl.trim()).length !== 1 ? 's' : ''}
            </Button>
          </Box>
        </form>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3, whiteSpace: 'pre-line' }}>
          {error}
        </Alert>
      )}

      {results.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Successfully Shortened {results.length} URL{results.length !== 1 ? 's' : ''}!
          </Typography>
          {results.map((result, index) => (
            <Box key={result.id} sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Short URL #{index + 1}
              </Typography>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Typography variant="body1" sx={{ flexGrow: 1, fontWeight: 'bold', color: 'primary.main' }}>
                  {result.shortUrl}
                </Typography>
                <IconButton onClick={() => copyToClipboard(result.shortUrl)} size="small">
                  <CopyIcon />
                </IconButton>
              </Box>
              <Typography variant="body2" color="textSecondary" gutterBottom sx={{ wordBreak: 'break-all' }}>
                Original: {result.originalUrl}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Created: {result.createdAt.toLocaleString()} | Expires: {result.expiresAt.toLocaleString()}
              </Typography>
            </Box>
          ))}
        </Paper>
      )}
    </Container>
  );
};

const StatsPage: React.FC = () => {
  const [urls, setUrls] = useState<UrlStatistics[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedUrl, setExpandedUrl] = useState<string | null>(null);

  useEffect(() => {
    loadUrls();
    Log('frontend', 'info', 'page', 'User accessed URL Statistics page');
  }, []);

  const loadUrls = async () => {
    try {
      const data = await urlService.getAllUrls();
      setUrls(data);
      await Log('frontend', 'info', 'page', `Loaded ${data.length} URLs for statistics display`);
    } catch (error) {
      await Log('frontend', 'error', 'page', `Failed to load URLs: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (shortCode: string) => {
    if (window.confirm('Are you sure you want to delete this URL?')) {
      await urlService.deleteUrl(shortCode);
      await loadUrls();
      await Log('frontend', 'info', 'page', `User deleted URL: ${shortCode}`);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    Log('frontend', 'info', 'page', `User copied URL to clipboard: ${text}`);
  };

  const handleAccordionChange = (shortCode: string) => {
    setExpandedUrl(expandedUrl === shortCode ? null : shortCode);
    Log('frontend', 'debug', 'page', `${expandedUrl === shortCode ? 'Collapsed' : 'Expanded'} click details for: ${shortCode}`);
  };

  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress size={60} />
          <Box ml={2}>
            <Typography variant="h6">Loading URL Statistics...</Typography>
          </Box>
        </Box>
      </Container>
    );
  }

  const totalClicks = urls.reduce((sum, url) => sum + url.clickCount, 0);
  const activeUrls = urls.filter(url => new Date() <= url.expiresAt).length;
  const expiredUrls = urls.length - activeUrls;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" color="primary">
        URL Shortener Statistics
      </Typography>
      
      <Typography variant="h6" align="center" color="textSecondary" gutterBottom>
        Monitor and analyze your shortened URLs performance
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom color="primary">
          Summary Statistics
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  {urls.length}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total URLs
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main" fontWeight="bold">
                  {totalClicks}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Total Clicks
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="info.main" fontWeight="bold">
                  {activeUrls}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Active URLs
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="error.main" fontWeight="bold">
                  {expiredUrls}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Expired URLs
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
      
      {urls.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Typography variant="h5" color="textSecondary" gutterBottom>
            No URLs Found
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom>
            You haven't created any shortened URLs yet.
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Head over to the home page to create your first shortened URL!
          </Typography>
        </Box>
      ) : (
        <Box>
          <Typography variant="h5" gutterBottom color="primary">
            All Shortened URLs ({urls.length})
          </Typography>
          {urls.map((url) => (
            <Accordion 
              key={url.id}
              expanded={expandedUrl === url.shortCode}
              onChange={() => handleAccordionChange(url.shortCode)}
              sx={{ mb: 2 }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ width: '100%', pr: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography variant="h6" color="primary" gutterBottom>
                        {url.shortUrl}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="textSecondary" 
                        gutterBottom
                        sx={{ 
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '400px'
                        }}
                      >
                        {url.originalUrl}
                      </Typography>
                      <Box display="flex" gap={1} mt={1} alignItems="center">
                        <Chip label={`${url.clickCount} clicks`} color="success" size="small" />
                        <Chip 
                          label={new Date() > url.expiresAt ? 'Expired' : 'Active'} 
                          color={new Date() > url.expiresAt ? 'error' : 'info'} 
                          size="small" 
                        />
                        <Typography variant="caption" color="textSecondary">
                          Created: {formatRelativeTime(url.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <IconButton 
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(url.shortUrl);
                        }} 
                        size="small"
                      >
                        <CopyIcon />
                      </IconButton>
                      <IconButton 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(url.shortCode);
                        }} 
                        color="error" 
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
              </AccordionSummary>
              
              <AccordionDetails>
                <Box>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom color="primary">
                        URL Details
                      </Typography>
                      <Box mb={2}>
                        <Typography variant="subtitle2" color="textSecondary">
                          Original URL:
                        </Typography>
                        <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                          {url.originalUrl}
                        </Typography>
                      </Box>
                      <Box mb={2}>
                        <Typography variant="subtitle2" color="textSecondary">
                          Short Code:
                        </Typography>
                        <Typography variant="body2" fontFamily="monospace">
                          {url.shortCode}
                        </Typography>
                      </Box>
                      <Box mb={2}>
                        <Typography variant="subtitle2" color="textSecondary">
                          Created Date:
                        </Typography>
                        <Typography variant="body2">
                          {url.createdAt.toLocaleString()}
                        </Typography>
                      </Box>
                      <Box mb={2}>
                        <Typography variant="subtitle2" color="textSecondary">
                          Expiry Date:
                        </Typography>
                        <Typography variant="body2">
                          {url.expiresAt.toLocaleString()}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom color="primary">
                        Click Analytics ({url.clickCount} total clicks)
                      </Typography>
                      
                      {url.clicks.length === 0 ? (
                        <Box textAlign="center" py={4}>
                          <Typography variant="body2" color="textSecondary">
                            No clicks recorded yet
                          </Typography>
                        </Box>
                      ) : (
                        <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 400 }}>
                          <Table size="small" stickyHeader>
                            <TableHead>
                              <TableRow>
                                <TableCell><strong>Timestamp</strong></TableCell>
                                <TableCell><strong>Time Ago</strong></TableCell>
                                <TableCell><strong>Source</strong></TableCell>
                                <TableCell><strong>Location</strong></TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {url.clicks
                                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                                .slice(0, 50)
                                .map((click, index) => (
                                <TableRow key={click.id} hover>
                                  <TableCell>
                                    <Typography variant="body2">
                                      {click.timestamp.toLocaleString()}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2" color="textSecondary">
                                      {formatRelativeTime(click.timestamp)}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Chip 
                                      label={click.source} 
                                      size="small" 
                                      variant="outlined" 
                                      color="primary"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2">
                                      {click.location}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                          {url.clicks.length > 50 && (
                            <Box p={2} textAlign="center" bgcolor="#f5f5f5">
                              <Typography variant="caption" color="textSecondary">
                                Showing latest 50 of {url.clicks.length} clicks
                              </Typography>
                            </Box>
                          )}
                        </TableContainer>
                      )}
                    </Grid>
                  </Grid>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}
    </Container>
  );
};

const RedirectPage: React.FC = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (shortCode) {
      handleRedirect(shortCode);
    }
  }, [shortCode]);

  const handleRedirect = async (code: string) => {
    try {
      const originalUrl = await urlService.handleRedirection(code);
      if (originalUrl) {
        window.location.href = originalUrl;
      } else {
        setError('URL not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Redirection failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh">
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h5">Redirecting...</Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Box textAlign="center" py={8}>
          <Typography variant="h4" color="error" gutterBottom>
            Link Not Found
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {error}
          </Typography>
        </Box>
      </Container>
    );
  }

  return null;
};

function App() {
  useEffect(() => {
    initializeLogger({
      enableConsoleLog: true,
      retryAttempts: 3
    });
    
    Log('frontend', 'info', 'page', 'URL Shortener application started');
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
          <Navigation />
          <Routes>
            <Route path="/" element={<UrlForm />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/:shortCode" element={<RedirectPage />} />
          </Routes>
          <Box component="footer" sx={{ py: 3, textAlign: 'center', mt: 4 }}>
            <Typography variant="body2" color="textSecondary">
              © 2024 URL Shortener - Built with React, TypeScript & Material-UI
            </Typography>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
