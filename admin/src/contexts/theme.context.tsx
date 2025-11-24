import { createContext, useContext, useMemo, useState, ReactNode } from 'react'
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline } from '@mui/material'
import type { PaletteMode } from '@mui/material'

type ThemeContextType = {
  mode: PaletteMode
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useThemeMode() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useThemeMode must be used within ThemeProvider')
  return context
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<PaletteMode>(() => {
    const saved = localStorage.getItem('theme-mode')
    return (saved === 'dark' || saved === 'light') ? saved : 'light'
  })

  const toggleTheme = () => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme-mode', next)
      return next
    })
  }

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                primary: { main: '#3b82f6' },
                secondary: { main: '#fd8c73' },
                background: { default: '#f8fafc', paper: '#ffffff' },
                text: { primary: '#1e293b', secondary: '#64748b' },
              }
            : {
                primary: { main: '#60a5fa' },
                secondary: { main: '#fb923c' },
                background: { default: '#0f172a', paper: '#1e293b' },
                text: { primary: '#f1f5f9', secondary: '#cbd5e1' },
              }),
        },
        typography: {
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        },
        shape: { borderRadius: 12 },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 600,
              },
            },
          },
        },
      }),
    [mode]
  )

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  )
}