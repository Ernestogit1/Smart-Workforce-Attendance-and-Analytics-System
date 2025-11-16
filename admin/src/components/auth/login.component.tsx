
import { useState } from 'react'
import {
  Box,
  Avatar,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Alert,
  FormControlLabel,
  Checkbox,
  Link,
} from '@mui/material'
import { Visibility, VisibilityOff, Login, AdminPanelSettings } from '@mui/icons-material'
import { useAuth } from '../../hooks/auth.hook'

export default function LoginForm() {
  const { signInEmail, loading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [remember, setRemember] = useState(false)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await signInEmail(email.trim(), password)
  }

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      noValidate
      sx={{
        width: '100%',
        maxWidth: 420,
        mx: 'auto',
        mt: 8,
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64 }}>
          <AdminPanelSettings sx={{ fontSize: 32, color: 'common.white' }} />
        </Avatar>

        <Typography variant="h5" fontWeight={700} textAlign="center">
          Admin Portal
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Sign in to access the management dashboard
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ borderRadius: 1 }}>
          {error}
        </Alert>
      )}

      <TextField
        label="Email address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        required
        autoComplete="email"
      />

      <TextField
        label="Password"
        type={show ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        required
        autoComplete="current-password"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShow((s) => !s)}
                edge="end"
                aria-label={show ? 'Hide password' : 'Show password'}
              >
                {show ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <FormControlLabel
          control={<Checkbox size="small" checked={remember} onChange={(e) => setRemember(e.target.checked)} />}
          label={<Typography variant="body2">Remember me</Typography>}
        />
        <Link href="#" underline="hover" variant="body2">
          Forgot?
        </Link>
      </Box>

      <Button
        type="submit"
        variant="contained"
        fullWidth
        startIcon={<Login />}
        disabled={loading}
        sx={{ py: 1.25, textTransform: 'none', fontSize: 15 }}
        aria-label="Sign in"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>
    </Box>
  )
}
// ...existing code...