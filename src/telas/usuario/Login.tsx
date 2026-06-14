import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logoBranca from '../../imagens/logos/logo-branca.png'

// Parâmetros do Keycloak local (Direct Grant — Resource Owner Password Credentials)
const KEYCLOAK_URL = 'http://localhost:8080'
const KEYCLOAK_REALM = 'paraiba-hotdog'
const KEYCLOAK_CLIENT_ID = 'paraiba-hotdog-api'

export default function Login() {
    // Estados para controlar os campos do formulário
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [carregando, setCarregando] = useState(false)

    const navegar = useNavigate()

    /**
     * Realiza o login via Direct Grant (Resource Owner Password Credentials).
     * Envia as credenciais diretamente ao endpoint de token do Keycloak,
     * sem redirecionar o browser para a página de login do Keycloak.
     */
    async function lidarComLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setCarregando(true)

        const tokenUrl = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`

        const corpo = new URLSearchParams({
            grant_type: 'password',
            client_id: KEYCLOAK_CLIENT_ID,
            username: email,
            password: senha,
        })

        try {
            const resposta = await fetch(tokenUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: corpo.toString(),
            })

            if (!resposta.ok) {
                // Keycloak retorna 401 para credenciais inválidas
                throw new Error(`Falha na autenticação: ${resposta.status}`)
            }

            const dados = await resposta.json()

            // Salva o access token no localStorage conforme solicitado
            localStorage.setItem('token', dados.access_token)

            // Redireciona para a tela inicial
            navegar('/')
        } catch (erro) {
            console.error('Erro ao realizar login:', erro)
            alert('Credenciais inválidas ou servidor fora do ar. Verifique seus dados e tente novamente.')
        } finally {
            setCarregando(false)
        }
    }

    return (
        <div className="flex min-h-screen flex-col bg-gray-100">

            {/* CABEÇALHO — barra de navegação preta fina com logo destacada */}
            <header className="w-full bg-preto-v1 px-6 py-2 h-16 flex items-center overflow-visible">
                <a href="/" aria-label="Paraíba Hot Dog — início">
                    <img
                        src={logoBranca}
                        alt="Paraíba Hot Dog"
                        className="h-24 w-auto object-contain relative z-10"
                    />
                </a>
            </header>

            {/* CONTEÚDO PRINCIPAL — formulário centralizado */}
            <main className="flex flex-1 items-center justify-center px-4 py-12">
                <div className="w-full max-w-sm rounded-2xl bg-white px-8 py-10 shadow-lg">

                    {/* TÍTULO */}
                    <h1 className="mb-2 font-barlow-condensed text-4xl font-black uppercase tracking-wide text-preto-v1">
                        Login
                    </h1>
                    <p className="mb-8 font-barlow text-sm text-cinza-base">
                        Acesse o painel Paraíba Hot Dog
                    </p>

                    {/* FORMULÁRIO */}
                    <form onSubmit={lidarComLogin} noValidate className="flex flex-col gap-5">

                        {/* CAMPO DE E-MAIL */}
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
                                disabled={carregando}
                                className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-barlow text-sm text-preto-v1 outline-none transition-colors placeholder:text-gray-400 focus:border-amarelo focus:ring-2 focus:ring-amarelo/30 disabled:opacity-60"
                            />
                        </div>

                        {/* CAMPO DE SENHA */}
                        <div className="flex flex-col gap-1.5">
                            <label
                                htmlFor="senha"
                                className="font-barlow text-sm font-semibold text-preto-v1"
                            >
                                Senha
                            </label>
                            <input
                                id="senha"
                                type="password"
                                autoComplete="current-password"
                                placeholder="••••••••"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                                disabled={carregando}
                                className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-barlow text-sm text-preto-v1 outline-none transition-colors placeholder:text-gray-400 focus:border-amarelo focus:ring-2 focus:ring-amarelo/30 disabled:opacity-60"
                            />
                        </div>

                        {/* LINK ESQUECI A SENHA */}
                        <div className="text-right">
                            <a
                                href="/esqueci-senha"
                                className="font-barlow text-xs font-semibold text-cinza-base transition-colors hover:text-amarelo"
                            >
                                Esqueci minha senha
                            </a>
                        </div>

                        {/* BOTÃO ENTRAR */}
                        <button
                            type="submit"
                            disabled={carregando}
                            className="mt-1 w-full rounded-xl bg-amarelo py-3 font-barlow-condensed text-base font-bold uppercase tracking-widest text-preto-v1 shadow-md transition-opacity hover:opacity-90 active:opacity-80 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {carregando ? 'ENTRANDO...' : 'ENTRAR'}
                        </button>
                    </form>

                    {/* RODAPÉ DO CARD */}
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
