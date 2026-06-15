import { useState, type FormEvent } from 'react'
import logoBranca from '../../imagens/logos/logo-branca.png'
import { loginWithKeycloak } from '../../servicos/authApi'
import { tokenPossuiRole } from '../../servicos/authToken'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    try {
      const tokens = await loginWithKeycloak(email, password)

      if (tokenPossuiRole(tokens.access_token, 'administrador')) {
        window.location.href = '/admin'
        return
      }

      window.location.href = '/'
    } catch (error) {
      console.error('Login error:', error)
      alert('Credenciais invalidas ou servidor fora do ar. Verifique seus dados e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <header className="flex h-16 w-full items-center overflow-visible bg-preto-v1 px-6 py-2">
        <a href="/" aria-label="Paraiba Hot Dog - inicio">
          <img
            src={logoBranca}
            alt="Paraiba Hot Dog"
            className="relative z-10 h-24 w-auto object-contain"
          />
        </a>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm rounded-2xl bg-white px-8 py-10 shadow-lg">
          <h1 className="mb-2 font-barlow-condensed text-4xl font-black uppercase tracking-wide text-preto-v1">
            Login
          </h1>
          <p className="mb-8 font-barlow text-sm text-cinza-base">
            Acesse o painel Paraiba Hot Dog
          </p>

          <form onSubmit={handleLogin} noValidate className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="font-barlow text-sm font-semibold text-preto-v1">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                disabled={loading}
                className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-barlow text-sm text-preto-v1 outline-none transition-colors placeholder:text-gray-400 focus:border-amarelo focus:ring-2 focus:ring-amarelo/30 disabled:opacity-60"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="font-barlow text-sm font-semibold text-preto-v1">
                Senha
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="********"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                disabled={loading}
                className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-barlow text-sm text-preto-v1 outline-none transition-colors placeholder:text-gray-400 focus:border-amarelo focus:ring-2 focus:ring-amarelo/30 disabled:opacity-60"
              />
            </div>

            <div className="text-right">
              <a
                href="/esqueci-senha"
                className="font-barlow text-xs font-semibold text-cinza-base transition-colors hover:text-amarelo"
              >
                Esqueci minha senha
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full rounded-xl bg-amarelo py-3 font-barlow-condensed text-base font-bold uppercase tracking-widest text-preto-v1 shadow-md transition-opacity hover:opacity-90 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'ENTRANDO...' : 'ENTRAR'}
            </button>
          </form>


        </div>
      </main>
    </div>
  )
}
