import { useEffect, useState, useRef } from 'react'
import { 
  Alert, 
  Box, 
  CircularProgress, 
  Divider, 
  Switch,
  FormControlLabel,
  Typography, 
  Avatar
} from '@mui/material'
import { useEmployeeUpdate } from '../../hooks/employeeUpdate.hook'
import { 
  FormContainer, 
  FormCard, 
  FormTitle, 
  FormSection, 
  FormSectionTitle, 
  StyledTextField, 
  ButtonGroup, 
  SaveButton, 
  BackButton, 
  FileUploadContainer, 
  AvatarPreview, 
  StatusBadge 
} from '../../styles/employeeUpdate.style'
import PersonIcon from '@mui/icons-material/Person'
import BadgeIcon from '@mui/icons-material/Badge'
import ContactPhoneIcon from '@mui/icons-material/ContactPhone'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SaveIcon from '@mui/icons-material/Save'
import LockIcon from '@mui/icons-material/Lock'
import EditIcon from '@mui/icons-material/Edit'
import CakeIcon from '@mui/icons-material/Cake'
import SecurityIcon from '@mui/icons-material/Security'

export default function EmployeeUpdate() {
  const { item, loading, saving, error, submit, goBack } = useEmployeeUpdate()
  const [form, setForm] = useState({
    lastName: '', 
    firstName: '', 
    middleName: '', 
    suffixes: '',
    email: '', 
    contactNumber: '', 
    address: '', 
    birthDate: '', 
    age: '', 
    isAdmin: false,
    password: '',
    isRestricted: false,
  })
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (item) {
      setForm({
        lastName: item.lastName || '',
        firstName: item.firstName || '',
        middleName: item.middleName || '',
        suffixes: item.suffixes || '',
        email: item.email || '',
        contactNumber: item.contactNumber || '',
        address: item.address || '',
        birthDate: item.birthDate ? item.birthDate.slice(0, 10) : '',
        age: item.age != null ? String(item.age) : '',
        isAdmin: !!item.isAdmin,
        password: '',
        isRestricted: !!item.isRestricted,
      })
      
      // Set profile image preview if exists
      if (item.profileImage) {
        setPreviewUrl(item.profileImage)
      }
    }
  }, [item])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked, files } = e.target
    if (name === 'profileImage' && files) { 
      const file = files[0] || null
      setFile(file)
      
      // Create preview URL
      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string)
        }
        reader.readAsDataURL(file)
      }
      return 
    }
    setForm((s) => ({ ...s, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleFileUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await submit({
      lastName: form.lastName.trim(),
      firstName: form.firstName.trim(),
      middleName: form.middleName.trim() || null,
      suffixes: form.suffixes.trim() || null,
      email: form.email.trim(),
      contactNumber: form.contactNumber.trim() || null,
      address: form.address.trim() || null,
      birthDate: form.birthDate ? new Date(form.birthDate).toISOString() : null,
      age: form.age ? Number(form.age) : null,
      isAdmin: form.isAdmin,
      isRestricted: form.isRestricted,
      profileImageFile: file,
      password: form.password ? form.password : null,
    })
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  return (
    <FormContainer component="form" onSubmit={onSubmit}>
      <FormCard>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <EditIcon sx={{ fontSize: 28, color: 'primary.main', mr: 2 }} />
          <FormTitle variant="h4">Update Employee</FormTitle>
        </Box>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && item && (
          <>
            {saveSuccess && (
              <Alert 
                severity="success" 
                sx={{ 
                  mb: 3, 
                  borderRadius: 2,
                  animation: 'pulse 2s infinite',
                  '@keyframes pulse': {
                    '0%': { boxShadow: '0 0 0 0 rgba(56, 181, 158, 0.4)' },
                    '70%': { boxShadow: '0 0 0 10px rgba(56, 181, 158, 0)' },
                    '100%': { boxShadow: '0 0 0 0 rgba(56, 181, 158, 0)' },
                  }
                }}
              >
                Employee updated successfully
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <StatusBadge 
              sx={{ 
                backgroundColor: form.isAdmin ? 'success.light' : 'info.light',
                color: form.isAdmin ? 'success.dark' : 'info.dark',
              }}
            >
              {form.isAdmin ? (
                <AdminPanelSettingsIcon fontSize="small" />
              ) : (
                <PersonIcon fontSize="small" />
              )}
              {form.isAdmin ? 'Admin' : 'Employee'}
            </StatusBadge>

            <FormSection>
              {/* Profile Image Section */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                {previewUrl ? (
                  <AvatarPreview>
                    <img 
                      src={previewUrl} 
                      alt="Profile preview" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  </AvatarPreview>
                ) : (
                  <Avatar 
                    sx={{ 
                      width: 100, 
                      height: 100, 
                      bgcolor: 'primary.light', 
                      fontSize: '2rem',
                      mb: 2
                    }}
                  >
                    {(form.firstName[0] || '') + (form.lastName[0] || '')}
                  </Avatar>
                )}

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Employee ID: {item._id}
                </Typography>

                <FileUploadContainer 
                  onClick={handleFileUploadClick}
                  sx={{ maxWidth: 400, width: '100%', mt: 2 }}
                >
                  <UploadFileIcon color="primary" sx={{ mb: 1 }} />
                  <Typography variant="body2">
                    {previewUrl ? 'Change profile image' : 'Upload profile image'}
                  </Typography>
                </FileUploadContainer>

                <input
                  ref={fileInputRef}
                  name="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={onChange}
                  style={{ display: 'none' }}
                />
              </Box>
            </FormSection>

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
                  sx={{ gridColumn: { sm: '1 / -1' } }}
                />
              </Box>
            </FormSection>

            <FormSection>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CakeIcon sx={{ mr: 1, color: 'primary.main' }} />
                <FormSectionTitle variant="h6">Additional Details</FormSectionTitle>
              </Box>
              
              <Box sx={{ 
                display: 'grid', 
                gap: 2.5, 
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } 
              }}>
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
                <SecurityIcon sx={{ mr: 1, color: 'primary.main' }} />
                <FormSectionTitle variant="h6">Security & Permissions</FormSectionTitle>
              </Box>
              
              <StyledTextField 
                label="New Password" 
                name="password" 
                type="password" 
                value={form.password} 
                onChange={onChange}
                fullWidth
                placeholder="Leave blank to keep current password"
                helperText="Only fill this if you want to change the password"
                sx={{ mb: 3 }}
              />
              
              <Box sx={{ 
                display: 'grid', 
                gap: 2, 
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } 
              }}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={form.isAdmin} 
                      onChange={onChange} 
                      name="isAdmin"
                      color="primary"
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AdminPanelSettingsIcon 
                        fontSize="small" 
                        color={form.isAdmin ? "primary" : "disabled"} 
                      />
                      <Typography>
                        Admin Privileges
                      </Typography>
                    </Box>
                  }
                />

                <FormControlLabel
                  control={
                    <Switch 
                      checked={form.isRestricted} 
                      onChange={onChange} 
                      name="isRestricted"
                      color="error"
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LockIcon 
                        fontSize="small" 
                        color={form.isRestricted ? "error" : "disabled"} 
                      />
                      <Typography>
                        Restrict Account
                      </Typography>
                    </Box>
                  }
                />
              </Box>
            </FormSection>

            <Divider sx={{ my: 3 }} />

            <ButtonGroup>
              <BackButton 
                startIcon={<ArrowBackIcon />} 
                onClick={goBack} 
                variant="outlined"
                disabled={saving}
              >
                Back to List
              </BackButton>
              <SaveButton 
                startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />} 
                type="submit" 
                variant="contained"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </SaveButton>
            </ButtonGroup>
          </>
        )}
      </FormCard>
    </FormContainer>
  )
}