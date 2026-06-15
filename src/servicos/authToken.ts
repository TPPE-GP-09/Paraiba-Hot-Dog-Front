type JwtPayload = {
  exp?: number
  realm_access?: {
    roles?: string[]
  }
  resource_access?: Record<string, { roles?: string[] }>
}

function decodificarBase64Url(valor: string) {
  const base64 = valor.replace(/-/g, '+').replace(/_/g, '/')
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)

  return atob(`${base64}${padding}`)
}

export function lerPayloadToken(token: string | null): JwtPayload | null {
  if (!token) return null

  try {
    const payload = token.split('.')[1]
    if (!payload) return null

    return JSON.parse(decodificarBase64Url(payload)) as JwtPayload
  } catch {
    return null
  }
}

export function extrairRolesToken(token: string | null) {
  const payload = lerPayloadToken(token)
  const roles = new Set(payload?.realm_access?.roles ?? [])

  Object.values(payload?.resource_access ?? {}).forEach((client) => {
    client.roles?.forEach((role) => roles.add(role))
  })

  return [...roles]
}

export function tokenExpirado(token: string | null) {
  const expiracao = lerPayloadToken(token)?.exp

  return expiracao ? expiracao * 1000 <= Date.now() : false
}

export function tokenPossuiRole(token: string | null, role: string) {
  return extrairRolesToken(token).includes(role)
}
