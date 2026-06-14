import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logoBranca from '../../imagens/logos/logo-branca.png'

// Keycloak local parameters (Direct Grant — Resource Owner Password Credentials)
const KEYCLOAK_URL = 'http://localhost:8080'
const KEYCLOAK_REALM = 'paraiba-hotdog'
const KEYCLOAK_CLIENT_ID = 'paraiba-hotdog-api'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    /**
     * Handles form submission via Keycloak Direct Grant
     * (Resource Owner Password Credentials flow).
     * Sends credentials directly to the Keycloak token endpoint
     * without redirecting the browser to the Keycloak login page.
     */
    async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)

        const tokenUrl = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`

        const body = new URLSearchParams({
            grant_type: 'password',
            client_id: KEYCLOAK_CLIENT_ID,
            username: email,
            password: password,
        })

        try {
            const response = await fetch(tokenUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: body.toString(),
            })

            if (!response.ok) {
                // Keycloak returns 401 for invalid credentials
                throw new Error(`Authentication failed: ${response.status}`)
            }

            const data = await response.json()

            // Save the access token to localStorage
            localStorage.setItem('token', data.access_token)

            // Redirect to the home screen
            navigate('/')
        } catch (error) {
            console.error('Login error:', error)
            alert('Credenciais inválidas ou servidor fora do ar. Verifique seus dados e tente novamente.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen flex-col bg-gray-100">

            {/* HEADER — thin black navigation bar with prominent logo */}
            <header className="w-full bg-preto-v1 px-6 py-2 h-16 flex items-center overflow-visible">
                <a href="/" aria-label="Paraíba Hot Dog — início">
                    <img
                        src={logoBranca}
                        alt="Paraíba Hot Dog"
                        className="h-24 w-auto object-contain relative z-10"
                    />
                </a>
            </header>

            {/* MAIN CONTENT — centered login form */}
            <main className="flex flex-1 items-center justify-center px-4 py-12">
                <div className="w-full max-w-sm rounded-2xl bg-white px-8 py-10 shadow-lg">

                    {/* TITLE */}
                    <h1 className="mb-2 font-barlow-condensed text-4xl font-black uppercase tracking-wide text-preto-v1">
                        Login
                    </h1>
                    <p className="mb-8 font-barlow text-sm text-cinza-base">
                        Acesse o painel Paraíba Hot Dog
                    </p>

                    {/* FORM */}
                    <form onSubmit={handleLogin} noValidate className="flex flex-col gap-5">

                        {/* EMAIL FIELD */}
                        <div className="flex flex-col gap-1.5">
                            <label
                                htmlFor="email"
                                className="font-barlow text-sm font-semibold text-preto-v1"
                            >
                                E-mail
                            </label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                                className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-barlow text-sm text-preto-v1 outline-none transition-colors placeholder:text-gray-400 focus:border-amarelo focus:ring-2 focus:ring-amarelo/30 disabled:opacity-60"
                            />
                        </div>

                        {/* PASSWORD FIELD */}
                        <div className="flex flex-col gap-1.5">
                            <label
                                htmlFor="password"
                                className="font-barlow text-sm font-semibold text-preto-v1"
                            >
                                Senha
                            </label>
                            <input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                                className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-barlow text-sm text-preto-v1 outline-none transition-colors placeholder:text-gray-400 focus:border-amarelo focus:ring-2 focus:ring-amarelo/30 disabled:opacity-60"
                            />
                        </div>

                        {/* FORGOT PASSWORD LINK */}
                        <div className="text-right">
                            <a
                                href="/esqueci-senha"
                                className="font-barlow text-xs font-semibold text-cinza-base transition-colors hover:text-amarelo"
                            >
                                Esqueci minha senha
                            </a>
                        </div>

                        {/* SUBMIT BUTTON */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-1 w-full rounded-xl bg-amarelo py-3 font-barlow-condensed text-base font-bold uppercase tracking-widest text-preto-v1 shadow-md transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? 'ENTRANDO...' : 'ENTRAR'}
                        </button>
                    </form>

                    {/* CARD FOOTER */}
                    <p className="mt-8 font-barlow text-sm text-cinza-base">
                        Não tem uma conta?{' '}
                        <a
                            href="/cadastro"
                            className="font-semibold text-preto-v1 transition-colors hover:text-amarelo"
                        >
                            Cadastre-se
                        </a>
                    </p>
                </div>
            </main>
        </div>
    )
}
