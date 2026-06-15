import { useMemo, type ReactNode } from 'react'
import { getStoredToken } from '../servicos/apiFetch'
import { extrairRolesToken, tokenExpirado } from '../servicos/authToken'
import { AuthContext, type AuthContextValue } from './authContextCore'

function readCookie(name: string) {
  const cookie = document.cookie
    .split('; ')
    .find((item) => item.startsWith(`${name}=`))

  return cookie ? decodeURIComponent(cookie.split('=').slice(1).join('=')) : null
}

function readToken() {
  const storedToken = getStoredToken()
  if (storedToken) return storedToken

  for (const key of ['token', 'access_token', 'auth_token', 'kc_token']) {
    const cookieToken = readCookie(key)
    if (cookieToken) return cookieToken
  }

  return null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const value = useMemo<AuthContextValue>(() => {
    const getToken = () => readToken()
    const token = getToken()
    const roles = tokenExpirado(token) ? [] : extrairRolesToken(token)

    return {
      token,
      roles,
      isAuthenticated: Boolean(token) && !tokenExpirado(token),
      getToken,
      getAuthHeaders: () => {
        const token = getToken()
        return token ? { Authorization: `Bearer ${token}` } : ({} as HeadersInit)
      },
      hasRole: (role) => roles.includes(role),
    }
  }, [])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
