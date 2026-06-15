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

export async function solicitarRecuperacaoSenha(email: string) {
  const response = await apiFetch('/auth/esqueci-senha', {
    auth: false,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })

  if (!response.ok) {
    throw new Error(`Password recovery failed: ${response.status}`)
  }

  const result = (await response.json()) as {
    email_status: string
    message: string
  }

  if (result.email_status !== 'sent') {
    throw new Error(`Password recovery email not sent: ${result.email_status}`)
  }

  return result
}

export async function redefinirSenha(token: string, novaSenha: string) {
  const response = await apiFetch('/auth/redefinir-senha', {
    auth: false,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token,
      nova_senha: novaSenha,
    }),
  })

  if (!response.ok) {
    throw new Error(`Password reset failed: ${response.status}`)
  }
}
