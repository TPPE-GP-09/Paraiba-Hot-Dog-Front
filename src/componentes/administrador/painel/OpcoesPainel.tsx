import { useState } from 'react'
import {
  ChefHat,
  ClipboardPen,
  Database,
  Search,
  Settings,
  Wrench,
} from 'lucide-react'
import BotaoOpcaoPainel from './BotaoOpcaoPainel'
import ModalConfiguracoes from './ModalConfiguracoes'

const opcoesPainel = [
  {
    rotulo: 'Anotar Pedidos',
    href: '/admin/anotar-pedidos',
    icone: <ClipboardPen size={36} strokeWidth={1.75} aria-hidden />,
  },
  {
    rotulo: 'Cozinha',
    href: '/admin/cozinha',
    icone: <ChefHat size={36} strokeWidth={1.75} aria-hidden />,
  },
  {
    rotulo: 'Dashboard',
    href: '/admin/dashboard',
    icone: (
      <span className="relative inline-flex h-9 w-9 items-center justify-center">
        <Database size={32} strokeWidth={1.75} aria-hidden />
        <Search
          size={18}
          strokeWidth={2}
          className="absolute -bottom-0.5 -right-0.5"
          aria-hidden
        />
      </span>
    ),
  },
  {
    rotulo: 'Configurações',
    href: undefined,
    icone: (
      <span className="relative inline-flex h-9 w-9 items-center justify-center">
        <Settings size={30} strokeWidth={1.75} aria-hidden />
        <Wrench
          size={20}
          strokeWidth={1.75}
          className="absolute -bottom-0.5 -right-1 rotate-12"
          aria-hidden
        />
      </span>
    ),
  },
] as const

export default function OpcoesPainel() {
  const [modalConfiguracoesAberto, setModalConfiguracoesAberto] = useState(false)

  function abrirModalConfiguracoes() {
    setModalConfiguracoesAberto(true)
  }

  function fecharModalConfiguracoes() {
    setModalConfiguracoesAberto(false)
  }

  return (
    <>
      <div className="mt-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
        {opcoesPainel.map(({ rotulo, href, icone }) =>
          href ? (
            <BotaoOpcaoPainel
              key={rotulo}
              rotulo={rotulo}
              href={href}
              icone={icone}
            />
          ) : (
            <BotaoOpcaoPainel
              key={rotulo}
              rotulo={rotulo}
              icone={icone}
              onClick={abrirModalConfiguracoes}
            />
          ),
        )}
      </div>

      <ModalConfiguracoes
        aberto={modalConfiguracoesAberto}
        onFechar={fecharModalConfiguracoes}
      />
    </>
  )
}
