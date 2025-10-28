import { useEffect, useState, useRef } from 'react'
import { Alert, Box, FormControlLabel, Switch, Typography, Avatar, Divider } from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import BadgeIcon from '@mui/icons-material/Badge'
import ContactPhoneIcon from '@mui/icons-material/ContactPhone'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import { 
  FormCard, 
  FormContainer, 
  FormSection,
  FormTitle, 
  FormSectionTitle,
  ButtonGroup, 
  StyledTextField,
  SubmitButton,
  CancelButton,
  FileUploadContainer,
  AvatarPreview,
  CustomInputLabel
} from '../../styles/employeeAccMaker.styles'
import { useEmployeeAccMaker } from '../../hooks/employeeAccMaker.hook'

export default function EmployeeAccMaker() {
  const { creating, error, lastCreated, register } = useEmployeeAccMaker()
  const [form, setForm] = useState({
    lastName: '',
    firstName: '',
    middleName: '',
    suffixes: '',
    email: '',
    password: '',
    contactNumber: '',
    address: '',
    birthDate: '',
    age: '',
    isAdmin: false,
  })
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked, files } = e.target as HTMLInputElement
    if (name === 'profileImage' && files) {
      const file = files[0] || null
      setProfileImageFile(file)
      
      // Create preview URL
      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string)
        }
        reader.readAsDataURL(file)
      } else {
        setPreviewUrl(null)
      }
      return
    }
    setForm((s) => ({ ...s, [name]: type === 'checkbox' ? checked : value }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await register({
      lastName: form.lastName.trim(),
      firstName: form.firstName.trim(),
      middleName: form.middleName.trim() || null,
      suffixes: form.suffixes.trim() || null,
      email: form.email.trim(),
      password: form.password,
      contactNumber: form.contactNumber.trim() || null,
      address: form.address.trim() || null,
      birthDate: form.birthDate ? new Date(form.birthDate).toISOString() : null,
      age: form.age ? Number(form.age) : null,
      isAdmin: form.isAdmin,
      profileImageFile,
    })
  }

  const handleFileUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  useEffect(() => {
    if (lastCreated) {
      setForm({
        lastName: '',
        firstName: '',
        middleName: '',
        suffixes: '',
        email: '',
        password: '',
        contactNumber: '',
        address: '',
        birthDate: '',
        age: '',
        isAdmin: false,
      })
      setProfileImageFile(null)
      setPreviewUrl(null)
    }
  }, [lastCreated])

  return (
    <FormContainer component="form" onSubmit={onSubmit}>
      <FormCard>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <PersonAddIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
          <FormTitle variant="h4">Create Employee Account</FormTitle>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Fill out the form below to create a new employee account. All fields marked with * are required.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
        {lastCreated && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 3, 
              borderRadius: 2,
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': { boxShadow: '0 0 0 0 rgba(76, 175, 80, 0.4)' },
                '70%': { boxShadow: '0 0 0 10px rgba(76, 175, 80, 0)' },
                '100%': { boxShadow: '0 0 0 0 rgba(76, 175, 80, 0)' },
              }
            }}
          >
            Employee created successfully: {lastCreated.email}
          </Alert>
        )}
        
        <FormSection>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <BadgeIcon sx={{ mr: 1, color: 'primary.main' }} />
            <FormSectionTitle variant="h6">Personal Information</FormSectionTitle>
          </Box>
          
          <Box sx={{ 
            display: 'grid', 
            gap: 2.5, 
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } 
          }}>
            <StyledTextField 
              label="First Name *" 
              name="firstName" 
              value={form.firstName} 
              onChange={onChange} 
              required 
              fullWidth
            />
            <StyledTextField 
              label="Last Name *" 
              name="lastName" 
              value={form.lastName} 
              onChange={onChange} 
              required 
              fullWidth
            />
            <StyledTextField 
              label="Middle Name" 
              name="middleName" 
              value={form.middleName} 
              onChange={onChange}
              fullWidth
            />
            <StyledTextField 
              label="Suffixes" 
              name="suffixes" 
              value={form.suffixes} 
              onChange={onChange}
              fullWidth
            />
          </Box>
        </FormSection>

        <FormSection>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ContactPhoneIcon sx={{ mr: 1, color: 'primary.main' }} />
            <FormSectionTitle variant="h6">Contact Details</FormSectionTitle>
          </Box>
          
          <Box sx={{ 
            display: 'grid', 
            gap: 2.5, 
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } 
          }}>
            <StyledTextField 
              label="Email *" 
              name="email" 
              type="email" 
              value={form.email} 
              onChange={onChange} 
              required 
              fullWidth
            />
            <StyledTextField 
              label="Password *" 
              name="password" 
              type="password" 
              value={form.password} 
              onChange={onChange} 
              required 
              fullWidth
            />
            <StyledTextField 
              label="Contact Number" 
              name="contactNumber" 
              value={form.contactNumber} 
              onChange={onChange}
              fullWidth
            />
            <StyledTextField 
              label="Address" 
              name="address" 
              value={form.address} 
              onChange={onChange}
              fullWidth
            />
            <StyledTextField
              label="Birth Date"
              name="birthDate"
              type="date"
              value={form.birthDate}
              onChange={onChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <StyledTextField 
              label="Age" 
              name="age" 
              type="number" 
              value={form.age} 
              onChange={onChange}
              fullWidth
            />
          </Box>
        </FormSection>

        <FormSection>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <UploadFileIcon sx={{ mr: 1, color: 'primary.main' }} />
            <FormSectionTitle variant="h6">Profile Image</FormSectionTitle>
          </Box>
          
          {previewUrl ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              mb: 2 
            }}>
              <AvatarPreview>
                <img 
                  src={previewUrl} 
                  alt="Profile preview" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </AvatarPreview>
              <Typography variant="body2" color="primary" sx={{ cursor: 'pointer', mt: 1 }} onClick={handleFileUploadClick}>
                Change Image
              </Typography>
            </Box>
          ) : (
            <FileUploadContainer onClick={handleFileUploadClick}>
              <Avatar 
                sx={{ 
                  width: 60, 
                  height: 60, 
                  bgcolor: 'background.paper',
                  color: 'primary.main',
                  margin: '0 auto',
                  mb: 2,
                  border: '2px dashed',
                  p: 1
                }}
              >
                <UploadFileIcon fontSize="large" />
              </Avatar>
              <Typography variant="body1" fontWeight={500} gutterBottom>
                Click to upload profile image
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Supports JPG, PNG or GIF up to 5MB
              </Typography>
            </FileUploadContainer>
          )}
          
          <input
            ref={fileInputRef}
            name="profileImage"
            type="file"
            accept="image/*"
            onChange={onChange}
            style={{ display: 'none' }}
          />
        </FormSection>

        <FormSection sx={{ borderBottom: 'none !important', pb: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AdminPanelSettingsIcon sx={{ mr: 1, color: form.isAdmin ? 'success.main' : 'text.secondary' }} />
            <FormSectionTitle variant="h6">Admin Privileges</FormSectionTitle>
          </Box>
          
          <FormControlLabel
            control={
              <Switch 
                checked={form.isAdmin} 
                onChange={onChange} 
                name="isAdmin" 
                color="success"
              />
            }
            label={
              <Typography variant="body1" color={form.isAdmin ? 'success.main' : 'text.secondary'} fontWeight={500}>
                {form.isAdmin ? "Admin privileges granted" : "Standard employee access"}
              </Typography>
            }
          />
        </FormSection>

        <Divider sx={{ my: 3 }} />

        <ButtonGroup>
          <CancelButton 
            variant="outlined" 
            onClick={() => window.history.back()} 
            disabled={creating}
          >
            Cancel
          </CancelButton>
          <SubmitButton 
            type="submit" 
            variant="contained" 
            disabled={creating}
          >
            {creating ? 'Creating...' : 'Create Employee'}
          </SubmitButton>
        </ButtonGroup>
      </FormCard>
    </FormContainer>
  )
}