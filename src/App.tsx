import Dashboard from './telas/dashboard/Dashboard'
import Inicio from './telas/usuario/Inicio'
import UnidadeAraucarias from './telas/usuario/UnidadeAraucarias'

export default function App() {
  const { pathname } = window.location

  if (pathname === '/dashboard') {
    return <Dashboard />
  }

  if (pathname.startsWith('/unidades/')) {
    return <UnidadeAraucarias slug={pathname.replace('/unidades/', '')} />
  }

  return <Inicio />
}
