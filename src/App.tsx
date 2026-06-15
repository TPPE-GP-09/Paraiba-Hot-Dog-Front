import Painel from './telas/administrador/Painel'
import GestaoUnidades from './telas/administrador/GestaoUnidades'
import GestaoUsuarios from './telas/administrador/GestaoUsuarios'
import { useAuth } from './contextos/useAuth'
import CartaoFidelidade from './telas/usuario/CartaoFidelidade'
import Cozinha from './telas/cozinha/Cozinha'
import Dashboard from './telas/dashboard/Dashboard'
import Inicio from './telas/usuario/Inicio'
import Login from './telas/usuario/Login'
import RecuperarSenha from './telas/usuario/RecuperarSenha'
import RedefinirSenha from './telas/usuario/RedefinirSenha'
import UnidadeAraucarias from './telas/usuario/UnidadeAraucarias'

export default function App() {
  const { pathname } = window.location
  const { isAuthenticated, hasRole } = useAuth()

  const rotaAdministrativa = pathname.startsWith('/admin') || pathname === '/dashboard'

  if (rotaAdministrativa && !isAuthenticated) {
    return <Login />
  }

  if (rotaAdministrativa && !hasRole('administrador')) {
    return <AcessoNegado />
  }

  if (pathname === '/admin') {
    return <Painel />
  }

  if (pathname === '/admin/configuracoes/usuarios') {
    return <GestaoUsuarios />
  }

  if (pathname === '/admin/configuracoes/unidades') {
    return <GestaoUnidades />
  }

  if (pathname === '/dashboard' || pathname === '/admin/dashboard') {
    return <Dashboard />
  }

  if (pathname === '/cozinha') {
    return <Cozinha />
  }

  if (pathname === '/login') {
    return <Login />
  }

  if (pathname === '/cartao-fidelidade') {
    return <CartaoFidelidade />
  }

  if (pathname === '/esqueci-senha') {
    return <RecuperarSenha />
  }

  if (pathname === '/recuperar-senha') {
    return <RedefinirSenha />
  }

  if (pathname.startsWith('/unidades/')) {
    return <UnidadeAraucarias slug={pathname.replace('/unidades/', '')} />
  }

  return <Inicio />
}

function AcessoNegado() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-preto-v1 px-6 text-center text-branco">
      <div>
        <h1 className="font-barlow-condensed text-4xl font-black uppercase text-amarelo">
          Acesso negado
        </h1>
        <p className="mt-3 font-barlow text-lg">
          Esta área é exclusiva para administradores.
        </p>
        <a
          href="/"
          className="mt-6 inline-flex rounded-xl bg-amarelo px-6 py-3 font-barlow-condensed font-bold uppercase text-preto-v1"
        >
          Voltar ao início
        </a>
      </div>
    </main>
  )
}
