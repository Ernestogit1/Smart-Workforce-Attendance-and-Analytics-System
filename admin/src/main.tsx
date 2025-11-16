import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { Provider } from 'react-redux'
import { store } from './store/index.store'
import { BrowserRouter } from 'react-router-dom'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { setAuthToken } from './api/auth'
import './index.css'

const theme = createTheme({
  palette: {
    primary: { 
      main: '#3a36db', // rich blue
      dark: '#2a288c',
      light: '#6562e6'
    },
    secondary: { 
      main: '#fd8c73', // coral accent
      dark: '#e5674e',
      light: '#ffb7a5'  
    },
    background: {
      default: '#f8fafc', // very light gray
      paper: '#ffffff',
    },
    success: { main: '#38b59e' }, // teal
    error: { main: '#f25767' }, // rose red
    warning: { main: '#fbbe45' }, // amber
    info: { main: '#47a3ff' }, // sky blue
  },
  typography: {
    fontFamily: "'Nunito', 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif",
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: { 
    borderRadius: 12 
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px 0 rgba(0,0,0,0.05)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#2a2a2a',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          borderRight: 'none',
          boxShadow: '0 0 15px rgba(0,0,0,0.05)',
        },
      },
    },
  },
})
const token = localStorage.getItem('token')
if (token) setAuthToken(token)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>
)
