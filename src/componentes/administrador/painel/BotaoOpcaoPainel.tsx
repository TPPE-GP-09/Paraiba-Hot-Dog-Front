import type { ReactNode } from 'react'

type BotaoOpcaoPainelProps = {
  icone: ReactNode
  rotulo: string
  href?: string
  onClick?: () => void
}

export default function BotaoOpcaoPainel({
  icone,
  rotulo,
  href = '#',
  onClick,
}: BotaoOpcaoPainelProps) {
  const className =
    'flex min-h-[7.5rem] flex-col items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-6 font-barlow-condensed text-base font-semibold uppercase tracking-wide text-preto-v1 shadow-sm transition-all duration-200 hover:border-gray-400 hover:bg-amarelo/10 hover:shadow-md sm:min-h-[9rem] sm:text-lg'
  const rotuloElemento = (
    <span className="font-barlow-condensed font-semibold">{rotulo}</span>
  )

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        <span className="flex h-10 items-center justify-center">{icone}</span>
        {rotuloElemento}
      </button>
    )
  }

  return (
    <a href={href} className={className}>
      <span className="flex h-10 items-center justify-center">{icone}</span>
      {rotuloElemento}
    </a>
  )
}
