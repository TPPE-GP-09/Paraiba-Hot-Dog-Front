import { useEffect } from 'react'
import CardapioAdm from './telas/administrador/CardapioAdm'
import Painel from './telas/administrador/Painel'
import GestaoUnidades from './telas/administrador/GestaoUnidades'
import GestaoUsuarios from './telas/administrador/GestaoUsuarios'
import GestaoBlog from './telas/administrador/GestaoBlog'
import { useAuth } from './contextos/useAuth'
import Cardapio from './telas/usuario/Cardapio'
import CartaoFidelidade from './telas/usuario/CartaoFidelidade'
import Cozinha from './telas/cozinha/Cozinha'
import Dashboard from './telas/dashboard/Dashboard'
import Inicio from './telas/usuario/Inicio'
import Login from './telas/usuario/Login'
import SobreNos from './telas/usuario/SobreNos'
import RecuperarSenha from './telas/usuario/RecuperarSenha'
import RedefinirSenha from './telas/usuario/RedefinirSenha'
import UnidadeAraucarias from './telas/usuario/UnidadeAraucarias'
import AnotarPedidos from './telas/pedidos/AnotarPedidos'

export default function App() {
  const { pathname } = window.location
  const { isAuthenticated, hasRole } = useAuth()

  useEffect(() => {
    document.title = getPageTitle(pathname)
  }, [pathname])

  if (pathname === '/admin/login') {
    if (isAuthenticated && hasRole('administrador')) {
      return <RedirectTo href="/admin" />
    }

    return <Login />
  }

  const rotaAdministrativa =
    pathname.startsWith('/admin') ||
    pathname === '/dashboard' ||
    pathname === '/cozinha'

  if (rotaAdministrativa && !isAuthenticated) {
    return <Login />
  }

  if (rotaAdministrativa && !hasRole('administrador')) {
    return <AcessoNegado />
  }

  if (pathname === '/admin') {
    return <Painel />
  }

  if (pathname === '/admin/cardapio') {
    return <CardapioAdm />
  }

  if (pathname === '/admin/configuracoes/usuarios') {
    return <GestaoUsuarios />
  }

  if (pathname === '/admin/configuracoes/unidades') {
    return <GestaoUnidades />
  }

  if (pathname === '/admin/configuracoes/blog') {
    return <GestaoBlog />
  }

  if (pathname === '/admin/anotar-pedidos') {
    return <AnotarPedidos />
  }

  if (pathname === '/dashboard' || pathname === '/admin/dashboard') {
    return <Dashboard />
  }

  if (pathname === '/cozinha' || pathname === '/admin/cozinha') {
    return <Cozinha />
  }

  if (pathname === '/login') {
    return <Login />
  }

  if (pathname === '/cardapio') {
    return <Cardapio />
  }

  if (pathname === '/cartao-fidelidade') {
    return <CartaoFidelidade />
  }

  if (pathname === '/sobre-nos') {
    return <SobreNos />
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

function getPageTitle(pathname: string) {
  const baseTitle = 'Paraíba Hot Dog'

  if (pathname === '/cardapio') return `Cardápio | ${baseTitle}`
  if (pathname === '/cartao-fidelidade') return `Cartão Fidelidade | ${baseTitle}`
  if (pathname === '/sobre-nos') return `Sobre Nós | ${baseTitle}`
  if (pathname.startsWith('/unidades/')) return `Unidade | ${baseTitle}`
  if (pathname === '/login' || pathname === '/admin/login') return `Login | ${baseTitle}`
  if (pathname === '/esqueci-senha' || pathname === '/recuperar-senha') {
    return `Recuperar Senha | ${baseTitle}`
  }
  if (pathname === '/admin') return `Painel Administrativo | ${baseTitle}`
  if (pathname === '/admin/cardapio') return `Cardápio Admin | ${baseTitle}`
  if (pathname === '/admin/configuracoes/usuarios') return `Usuários | ${baseTitle}`
  if (pathname === '/admin/configuracoes/unidades') return `Unidades | ${baseTitle}`
  if (pathname === '/admin/configuracoes/blog') return `Blog | ${baseTitle}`
  if (pathname === '/admin/anotar-pedidos') return `Anotar Pedidos | ${baseTitle}`
  if (pathname === '/dashboard' || pathname === '/admin/dashboard') return `Dashboard | ${baseTitle}`
  if (pathname === '/cozinha' || pathname === '/admin/cozinha') return `Cozinha | ${baseTitle}`

  return baseTitle
}

function RedirectTo({ href }: { href: string }) {
  window.location.replace(href)
  return null
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
