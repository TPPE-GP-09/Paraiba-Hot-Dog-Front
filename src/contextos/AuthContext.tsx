import { useMemo, type ReactNode } from 'react'
import { AuthContext, type AuthContextValue } from './authContextCore'

const TOKEN_KEYS = ['access_token', 'token', 'auth_token', 'kc_token'] as const

function readCookie(name: string) {
  const cookie = document.cookie
    .split('; ')
    .find((item) => item.startsWith(`${name}=`))

  return cookie ? decodeURIComponent(cookie.split('=').slice(1).join('=')) : null
}

function readToken() {
  for (const key of TOKEN_KEYS) {
    const localToken = localStorage.getItem(key)
    if (localToken) return localToken

    const cookieToken = readCookie(key)
    if (cookieToken) return cookieToken
  }

  return null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const value = useMemo<AuthContextValue>(() => {
    const getToken = () => readToken()

    return {
      token: getToken(),
      getToken,
      getAuthHeaders: () => {
        const token = getToken()
        return token ? { Authorization: `Bearer ${token}` } : ({} as HeadersInit)
      },
    }
  }, [])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
