import logoBranca from '../../imagens/logos/logo-branca.png'

export default function CabecalhoAdmin() {
  return (
    <header className="flex h-16 w-full shrink-0 items-center overflow-visible bg-preto-v1 px-6">
      <a href="/" aria-label="Paraíba Hot Dog — início">
        <img
          src={logoBranca}
          alt="Paraíba Hot Dog"
          className="relative z-10 h-30 w-auto object-contain"
        />
      </a>
    </header>
  )
}
