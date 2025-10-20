import { useEffect, useState } from 'react'
import { Alert, Box, Button, FormControlLabel, Switch, TextField, Typography } from '@mui/material'
import { FormCard, FormContainer, FormSection, ButtonGroup } from '../../styles/employeeAccMaker.styles'
import { useEmployeeAccMaker } from '../../hooks/employeeAccMaker.hook'
import GreenButton from '../ui/buttons/greenButtons.ui'

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

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
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
    })
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
    }
  }, [lastCreated])

  return (
    <FormContainer component="form" onSubmit={onSubmit}>
      <FormCard>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Create Employee Account
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Password will be stored in Firebase. MongoDB will store "firebase-manage" in the password field and profileImage as null.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {lastCreated && <Alert severity="success" sx={{ mb: 2 }}>Employee created: {lastCreated.email}</Alert>}

        <FormSection>
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
            <TextField label="First Name" name="firstName" value={form.firstName} onChange={onChange} required />
            <TextField label="Last Name" name="lastName" value={form.lastName} onChange={onChange} required />
            <TextField label="Middle Name" name="middleName" value={form.middleName} onChange={onChange} />
            <TextField label="Suffixes" name="suffixes" value={form.suffixes} onChange={onChange} />
            <TextField label="Email" name="email" type="email" value={form.email} onChange={onChange} required />
            <TextField label="Password" name="password" type="password" value={form.password} onChange={onChange} required />
            <TextField label="Contact Number" name="contactNumber" value={form.contactNumber} onChange={onChange} />
            <TextField label="Address" name="address" value={form.address} onChange={onChange} />
            <TextField
              label="Birth Date"
              name="birthDate"
              type="date"
              value={form.birthDate}
              onChange={onChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField label="Age" name="age" type="number" value={form.age} onChange={onChange} />
          </Box>
        </FormSection>

        <FormSection>
          <FormControlLabel
            control={<Switch checked={form.isAdmin} onChange={onChange} name="isAdmin" />}
            label="Grant admin privileges"
          />
        </FormSection>

        <ButtonGroup>
          <Button variant="outlined" onClick={() => window.history.back()} disabled={creating}>Cancel</Button>
          <GreenButton type="submit" variant="contained" disabled={creating}>
            {creating ? 'Creating...' : 'Create Employee'}
          </GreenButton>
        </ButtonGroup>
      </FormCard>
    </FormContainer>
  )
}