import { UtensilsCrossed } from 'lucide-react'
import OpcaoConfiguracao from './OpcaoConfiguracao'

type EdicaoCardapioProps = {
  onNavigate?: () => void
}

export default function EdicaoCardapio({ onNavigate }: EdicaoCardapioProps) {
  return (
    <OpcaoConfiguracao
      rotulo="Edição de cardápio"
      href="/admin/configuracoes/cardapio"
      icone={<UtensilsCrossed size={36} strokeWidth={1.75} aria-hidden />}
      onNavigate={onNavigate}
    />
  )
}
