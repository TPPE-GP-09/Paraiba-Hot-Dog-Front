import Painel from './telas/administrador/Painel'
import Dashboard from './telas/dashboard/Dashboard'
import CartaoFidelidade from './telas/usuario/CartaoFidelidade'
import Inicio from './telas/usuario/Inicio'
import Login from './telas/usuario/Login'
import RecuperarSenha from './telas/usuario/RecuperarSenha'
import RedefinirSenha from './telas/usuario/RedefinirSenha'
import UnidadeAraucarias from './telas/usuario/UnidadeAraucarias'

export default function App() {
  const { pathname } = window.location

  if (pathname === '/admin') {
    return <Painel />
  }

  if (pathname === '/dashboard' || pathname === '/admin/dashboard') {
    return <Dashboard />
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
