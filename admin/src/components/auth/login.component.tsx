import { useState } from 'react'
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Alert,
} from '@mui/material'
import { Visibility, VisibilityOff, Login, AdminPanelSettings } from '@mui/icons-material'
import { useAuth } from '../../hooks/auth.hook'
import { Logo } from '../../styles/auth.styles'

export default function LoginForm() {
  const { signInEmail, loading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await signInEmail(email.trim(), password)
  }

  return (
    <Box component="form" onSubmit={onSubmit} noValidate>
      <Logo>
        <AdminPanelSettings sx={{ fontSize: 40 }} />
      </Logo>
      <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom>
        Admin Portal
      </Typography>
      <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
        Sign in to access the management dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        label="Email Address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        required
        margin="normal"
        variant="outlined"
      />

      <TextField
        label="Password"
        type={show ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        required
        margin="normal"
        variant="outlined"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShow((s) => !s)} edge="end">
                {show ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        size="large"
        startIcon={<Login />}
        disabled={loading}
        sx={{ mt: 3, py: 1.5, borderRadius: 2, textTransform: 'none', fontSize: 16 }}
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>
    </Box>
  )
}