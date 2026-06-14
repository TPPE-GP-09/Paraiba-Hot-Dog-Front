import Keycloak from 'keycloak-js'

/**
 * Instância do Keycloak configurada para o ambiente local.
 * Utiliza a Abordagem 2 — Direct Grant (Resource Owner Password Credentials).
 */
const keycloak = new Keycloak({
    url: 'http://localhost:8080',
    realm: 'paraiba-hotdog',
    clientId: 'paraiba-hotdog-api',
})

export default keycloak
