import { createContext } from 'react'

export type AuthContextValue = {
  token: string | null
  roles: string[]
  isAuthenticated: boolean
  getToken: () => string | null
  getAuthHeaders: () => HeadersInit
  hasRole: (role: string) => boolean
}

export const AuthContext = createContext<AuthContextValue | null>(null)
