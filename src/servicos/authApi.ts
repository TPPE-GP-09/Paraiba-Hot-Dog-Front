import { apiFetch, saveAuthTokens } from './apiFetch'

const keycloakUrl = import.meta.env.VITE_KEYCLOAK_URL ?? 'http://localhost:8080'
const keycloakRealm = import.meta.env.VITE_KEYCLOAK_REALM ?? 'paraiba-hotdog'
const keycloakClientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID ?? 'paraiba-hotdog-api'

type KeycloakTokenResponse = {
  access_token: string
  expires_in?: number
  id_token?: string
  refresh_expires_in?: number
  refresh_token?: string
  token_type?: string
}

export async function loginWithKeycloak(username: string, password: string) {
  const body = new URLSearchParams({
    grant_type: 'password',
    client_id: keycloakClientId,
    username,
    password,
  })

  const response = await apiFetch(`/realms/${keycloakRealm}/protocol/openid-connect/token`, {
    auth: false,
    baseUrl: keycloakUrl,
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })

  if (!response.ok) {
    throw new Error(`Authentication failed: ${response.status}`)
  }

  const tokens = (await response.json()) as KeycloakTokenResponse
  saveAuthTokens(tokens)

  return tokens
}

