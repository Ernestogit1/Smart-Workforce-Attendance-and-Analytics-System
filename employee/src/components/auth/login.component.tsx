import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../store/index.store'
import { clearError, loginThunk } from '../../store/slices/auth.slice'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
  Fade,
  Zoom,
  CircularProgress,
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  Business as BusinessIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material'
import {
  loginHeaderSx,
  loginTitleSx,
  loginSubtitleSx,
  loginFormSx,
  loginTextFieldSx,
  loginButtonSx,
  loginDividerSx,
  loginFooterSx,
} from '../../styles/auth.style'

export default function EmployeeLogin() {
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error } = useSelector((s: RootState) => s.auth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    dispatch(clearError())
    const action = await dispatch(loginThunk({ email: email.trim(), password }))
    if (loginThunk.fulfilled.match(action)) {
      navigate('/', { replace: true })
    }
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={loginHeaderSx}>
        <Zoom in={true} timeout={600}>
          <Box 
            sx={{ 
              display: 'inline-flex', 
              marginBottom: '20px',
            }}
          >
            <Box
              sx={{
                width: '72px',
                height: '72px',
                borderRadius: '18px',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 16px 32px -8px rgba(99, 102, 241, 0.6)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'scale(1.05) rotate(5deg)',
                  boxShadow: '0 20px 40px -10px rgba(99, 102, 241, 0.7)',
                },
              }}
            >
              <BusinessIcon sx={{ fontSize: 36, color: 'white' }} />
            </Box>
          </Box>
        </Zoom>
        
        <Typography sx={loginTitleSx}>
          Welcome Back
        </Typography>
        <Typography sx={loginSubtitleSx}>
          Sign in to access your employee portal
        </Typography>
      </Box>

      {/* Error Alert */}
      <Fade in={!!error}>
        <Box>
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                marginBottom: '20px',
                borderRadius: '12px',
                border: '2px solid #fecaca',
                backgroundColor: '#fef2f2',
                color: '#dc2626',
                fontWeight: 500,
                fontSize: '14px',
                '& .MuiAlert-icon': {
                  color: '#dc2626',
                },
              }}
            >
              {error}
            </Alert>
          )}
        </Box>
      </Fade>

      {/* Login Form */}
      <Box component="form" onSubmit={onSubmit} sx={loginFormSx}>
        <Box>
          <TextField
            fullWidth
            type="email"
            label="Email Address"
            placeholder="yourname@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            sx={loginTextFieldSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ color: '#6366f1', fontSize: 22 }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box>
          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            sx={loginTextFieldSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ color: '#6366f1', fontSize: 22 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    disabled={loading}
                    sx={{
                      color: '#6366f1',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(99, 102, 241, 0.08)',
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading || !email || !password}
          sx={loginButtonSx}
          endIcon={loading ? <CircularProgress size={18} color="inherit" /> : <ArrowForwardIcon sx={{ fontSize: 20 }} />}
        >
          {loading ? 'Signing In' : 'Sign In'}
        </Button>
      </Box>

      {/* Divider */}
      <Divider sx={loginDividerSx}>
        <Typography 
          sx={{ 
            fontSize: '12px',
            color: '#94a3b8',
            fontWeight: 700,
            letterSpacing: '1.5px',
          }}
        >
          SECURE LOGIN
        </Typography>
      </Divider>

      {/* Footer */}
      <Box sx={loginFooterSx}>
        <Typography 
          variant="body2" 
          sx={{ 
            fontSize: '14px',
            color: '#64748b',
            fontWeight: 500,
            lineHeight: 1.6,
          }}
        >
          Need help? <Box component="span" sx={{ color: '#6366f1', fontWeight: 600, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>Contact Support</Box>
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            display: 'block', 
            marginTop: '18px',
            color: '#94a3b8',
            fontSize: '13px',
            fontWeight: 500,
          }}
        >
          © {new Date().getFullYear()} Your Company. All rights reserved.
        </Typography>
      </Box>
    </Box>
  )
}