import logo from '../../imagens/logos/logo-preta.png'
import iconeCacto from '../../imagens/outros/cacto-rodape.svg'
import RedesSociais from './RedesSociais'

const linksAcessoRapido = [

  { label: 'Cardápio', href: '/cardapio' },

  { label: 'Sobre nós', href: '/sobre-nos' },

  { label: 'Cartão fidelidade', href: '/cartao-fidelidade' },

] as const

function LinksAcessoRapidoHorizontal({ className = '' }: { className?: string }) {
  return (
    <nav aria-label="Acesso rápido" className={className}>
      <ul className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
        {linksAcessoRapido.map(({ label, href }, index) => (
          <li key={href} className="flex items-center gap-2">
            {index > 0 && (
              <span className="font-barlow text-amarelo" aria-hidden>
                •
              </span>
            )}
            <a
              href={href}
              className="font-barlow text-base text-preto-v1 transition-opacity hover:opacity-70"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default function Rodape() {
  return (
    <footer className="bg-branco">
      <div className="pagina-container py-8 min-[490px]:py-12 lg:py-14">
        {/* Mobile */}
        <div className="min-[490px]:hidden">
          <div className="flex w-full items-start justify-start gap-2">
            <div className="flex shrink-0 flex-col items-start gap-0">
              <a
                href="/"
                aria-label="Paraíba Hot Dog — início"
                className="block leading-none"
              >
                <img
                  src={logo}
                  alt="Paraíba Hot Dog"
                  className="block h-24 w-auto object-contain object-top"
                />
              </a>
              <RedesSociais variant="plain" className="-mt-5" />
            </div>

            <p className="font-barlow-condensed text-xl font-black uppercase leading-[0.95] text-preto-v1">
              O DOG MAIS
              <br />
              <span className="text-amarelo">ARRETADO</span>
              <br />
              DE BRASÍLIA
            </p>
          </div>
          <LinksAcessoRapidoHorizontal className="mt-8" />
        </div>

        {/* Tablet / Desktop */}
        <div className="hidden w-full max-w-full min-w-0 flex-col items-center gap-10 min-[490px]:flex min-[490px]:flex-row min-[490px]:items-center min-[490px]:justify-between min-[490px]:gap-8 lg:gap-12 xl:gap-16">
          <div className="flex w-full min-w-0 flex-row items-center gap-6 lg:gap-10">
            <div className="flex items-center gap-4 lg:gap-6">
              <a href="/" aria-label="Paraíba Hot Dog — início">
                <img
                  src={logo}
                  alt="Paraíba Hot Dog"
                  className="h-36 w-auto object-contain lg:h-44"
                />
              </a>
              <p className="font-barlow-condensed text-[clamp(1.25rem,3.5vw,2rem)] font-black uppercase leading-[0.95] text-preto-v1">
                O DOG MAIS
                <br />
                <span className="text-amarelo">ARRETADO</span>
                <br />
                DE BRASÍLIA
              </p>
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="font-barlow-semicondensed text-2xl font-semibold text-preto-v1">
                Acesso rápido
              </h3>

              <ul className="mt-1 flex flex-col gap-1">
                {linksAcessoRapido.map(({ label, href }) => (
                  <li key={href}>
                    <a
                      href={href}
                      className="flex items-center gap-1 font-barlow text-xl leading-none text-preto-v1 transition-opacity hover:opacity-70"
                    >
                      <img
                        src={iconeCacto}
                        alt=""
                        aria-hidden
                        className="h-5 w-auto shrink-0"
                      />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <RedesSociais variant="circulo" className="justify-end" />
        </div>
        <hr className="mt-8 border-0 h-px bg-gradient-to-r from-transparent via-preto-v3/30 to-transparent min-[490px]:mt-6" />
        <p className="mt-3 text-center font-barlow text-sm text-cinza-botao min-[490px]:text-base">
          © 2026 Paraíba Hot Dog. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}

