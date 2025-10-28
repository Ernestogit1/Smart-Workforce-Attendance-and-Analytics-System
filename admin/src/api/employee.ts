import { api } from './auth'

export type NewEmployeePayload = {
  lastName: string
  firstName: string
  middleName?: string | null
  suffixes?: string | null
  email: string
  password: string
  contactNumber?: string | null
  address?: string | null
  birthDate?: string | null // ISO string
  age?: number | null
  isAdmin?: boolean
  profileImageFile?: File | null
}

export type EmployeeResponse = {
  _id: string
  firebaseUid: string
  email: string
  lastName: string
  firstName: string
  middleName?: string | null
  suffixes?: string | null
  contactNumber?: string | null
  address?: string | null
  birthDate?: string | null
  age?: number | null
  profileImage?: string | null
  isRestricted?: boolean            // added
  isAdmin: boolean
  created_at: string
  updated_at: string
}

export async function createEmployeeRecord(input: {
  firebaseUid: string
  lastName: string
  firstName: string
  middleName?: string | null
  suffixes?: string | null
  email: string
  contactNumber?: string | null
  address?: string | null
  birthDate?: string | null
  age?: number | null
  isAdmin?: boolean
  profileImageFile?: File | null
}) {
  const fd = new FormData()
  fd.append('firebaseUid', input.firebaseUid)
  fd.append('email', input.email)
  fd.append('firstName', input.firstName)
  fd.append('lastName', input.lastName)
  if (input.middleName != null) fd.append('middleName', input.middleName)
  if (input.suffixes != null) fd.append('suffixes', input.suffixes)
  if (input.contactNumber != null) fd.append('contactNumber', input.contactNumber)
  if (input.address != null) fd.append('address', input.address)
  if (input.birthDate != null) fd.append('birthDate', input.birthDate)
  if (input.age != null) fd.append('age', String(input.age))
  // Only append when true; server defaults to False if omitted
  if (input.isAdmin) fd.append('isAdmin', 'true')
  if (input.profileImageFile) fd.append('profileImage', input.profileImageFile)

  // Do not send password here; backend saves "firebase-manage"
  const { data } = await api.post<EmployeeResponse>('/employees', fd)
  return data
}

export async function listEmployees() {
  const { data } = await api.get<EmployeeResponse[]>('/employees')
  return data
}

export async function getEmployee(id: string) {
  const { data } = await api.get<EmployeeResponse>(`/employees/${id}`)
  return data
}

export async function updateEmployee(
  id: string,
  input: Partial<{
    lastName: string
    firstName: string
    middleName: string | null
    suffixes: string | null
    email: string
    contactNumber: string | null
    address: string | null
    birthDate: string | null
    age: number | null
    isAdmin: boolean
    isRestricted: boolean           // added
    profileImageFile: File | null
    password: string | null
  }>
) {
  const fd = new FormData()
  if (input.lastName != null) fd.append('lastName', input.lastName)
  if (input.firstName != null) fd.append('firstName', input.firstName)
  if (input.middleName !== undefined) fd.append('middleName', input.middleName ?? '')
  if (input.suffixes !== undefined) fd.append('suffixes', input.suffixes ?? '')
  if (input.email != null) fd.append('email', input.email)               // triggers Firebase + Mongo update
  if (input.contactNumber !== undefined) fd.append('contactNumber', input.contactNumber ?? '')
  if (input.address !== undefined) fd.append('address', input.address ?? '')
  if (input.birthDate !== undefined) fd.append('birthDate', input.birthDate ?? '')
  if (input.age !== undefined && input.age !== null) fd.append('age', String(input.age))
  if (typeof input.isAdmin === 'boolean') fd.append('isAdmin', String(input.isAdmin))
  if (typeof input.isRestricted === 'boolean') fd.append('isRestricted', String(input.isRestricted)) // added
  if (input.profileImageFile) fd.append('profileImage', input.profileImageFile)
  if (input.password) fd.append('password', input.password)              // NEW

  const { data } = await api.patch<EmployeeResponse>(`/employees/${id}`, fd)
  return data
}