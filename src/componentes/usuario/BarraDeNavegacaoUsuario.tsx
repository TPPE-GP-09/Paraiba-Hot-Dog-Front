import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Menu, User, X } from 'lucide-react'
import logo from '../../imagens/logos/logo-preta.png'

const navLinks = [
  { label: 'Cardápio', href: '/cardapio' },
  { label: 'Unidades', href: '#unidades' },
  { label: 'Sobre nós', href: '/sobre-nos' },
  { label: 'Cartão fidelidade', href: '/cartao-fidelidade' },
] as const

const ADMIN_HREF = '/admin'

const MIN_GAP_RIGHT = 20
const RIGHT_ACTION_WIDTH = 44

const linkClassName =
  'font-barlow-condensed text-2xl font-semibold text-preto-v1 transition-colors hover:text-amarelo'

function NavItems() {
  return navLinks.map(({ label, href }) => (
    <li key={href}>
      <a href={href} className={linkClassName}>
        {label}
      </a>
    </li>
  ))
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [useMobileMenu, setUseMobileMenu] = useState(false)

  const barRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLAnchorElement>(null)
  const measureListRef = useRef<HTMLUListElement>(null)

  const checkLayout = useCallback(() => {
    const bar = barRef.current
    const logo = logoRef.current
    const measureList = measureListRef.current

    if (!bar || !logo || !measureList) return

    const style = getComputedStyle(bar)
    const paddingX = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight)
    const requiredNavWidth = measureList.scrollWidth
    const availableNavWidth =
      bar.clientWidth - logo.offsetWidth - paddingX - RIGHT_ACTION_WIDTH - MIN_GAP_RIGHT

    setUseMobileMenu(requiredNavWidth > availableNavWidth)
  }, [])

  useLayoutEffect(() => {
    checkLayout()
  }, [checkLayout])

  useEffect(() => {
    const targets = [barRef.current, logoRef.current, measureListRef.current].filter(
      Boolean,
    ) as Element[]

    const observer = new ResizeObserver(checkLayout)
    targets.forEach((el) => observer.observe(el))
    window.addEventListener('resize', checkLayout)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', checkLayout)
    }
  }, [checkLayout])

  useEffect(() => {
    if (!useMobileMenu) setIsOpen(false)
  }, [useMobileMenu])

  const toggleMenu = () => setIsOpen((open) => !open)
  const closeMenu = () => setIsOpen(false)

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full bg-branco ${isOpen ? '' : 'h-16'}`}
    >
      <div
        ref={barRef}
        className="pagina-container relative flex h-16 items-center"
      >
        {/* Lista invisível só para medir a largura necessária dos títulos */}
        <ul
          ref={measureListRef}
          className="pointer-events-none invisible absolute flex items-center gap-6 whitespace-nowrap md:gap-8 xl:gap-10"
          aria-hidden
        >
          <NavItems />
        </ul>

        <a
          ref={logoRef}
          href="/"
          className="relative z-10 flex h-full shrink-0 items-start"
          aria-label="Paraíba Hot Dog — início"
          onClick={closeMenu}
        >
          <img
            src={logo}
            alt="Paraíba Hot Dog"
            className="h-full max-h-full w-auto max-w-none object-contain object-left scale-180"
          />
        </a>

        {!useMobileMenu && (
          <>
            {/* Tablet / telas menores: títulos à direita (comportamento atual) */}
            <nav
              className="relative z-10 flex min-w-0 flex-1 justify-center overflow-hidden pr-2 xl:hidden"
              aria-label="Navegação principal"
            >
              <ul className="flex items-center gap-6 whitespace-nowrap md:gap-8">
                <NavItems />
              </ul>
            </nav>

            {/* Desktop (PC): títulos centralizados na tela */}
            <nav
              className="pointer-events-none absolute inset-0 hidden items-center justify-center xl:flex"
              aria-label="Navegação principal"
            >
              <ul className="pointer-events-auto flex items-center gap-10 whitespace-nowrap">
                <NavItems />
              </ul>
            </nav>
          </>
        )}

        {useMobileMenu && <div className="min-w-0 flex-1" aria-hidden />}

        {useMobileMenu ? (
          <button
            type="button"
            className="relative z-10 ml-auto flex shrink-0 items-center justify-center p-2 text-preto-v1"
            onClick={toggleMenu}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {isOpen ? <X size={32} strokeWidth={2} /> : <Menu size={32} strokeWidth={2} />}
          </button>
        ) : (
          <a
            href={ADMIN_HREF}
            className="relative z-10 ml-auto flex shrink-0 items-center justify-center p-2 text-preto-v1 transition-colors hover:text-amarelo"
            aria-label="Acesso administrativo"
          >
            <User size={28} strokeWidth={2} />
          </a>
        )}
      </div>

      {isOpen && useMobileMenu && (
        <nav
          id="mobile-menu"
          className="border-t border-preto-v1/10 bg-branco px-6 py-5"
          aria-label="Navegação principal"
        >
          <ul className="flex flex-col gap-5">
            {navLinks.map(({ label, href }) => (
              <li key={href}>
                <a href={href} className={linkClassName} onClick={closeMenu}>
                  {label}
                </a>
              </li>
            ))}
            <li>
              <a href={ADMIN_HREF} className={linkClassName} onClick={closeMenu}>
                Acesso restrito
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
