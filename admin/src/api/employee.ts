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
  birthDate?: string | null // ISO string (e.g., '2001-01-31')
  age?: number | null
  isAdmin?: boolean
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
}) {
  const payload = {
    ...input,
    password: 'firebase-manage',
    profileImage: null as null,
  }
  const { data } = await api.post<EmployeeResponse>('/employees', payload)
  return data
}

export async function listEmployees() {
  const { data } = await api.get<EmployeeResponse[]>('/employees')
  return data
}