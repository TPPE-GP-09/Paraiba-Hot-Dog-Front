import { useEffect, useState } from 'react'
import BarraDeNavegacao from '../../componentes/usuario/BarraDeNavegacaoUsuario'
import Botao from '../../componentes/usuario/inicio/Botao'
import BotaoUnidade from '../../componentes/usuario/inicio/BotaoUnidade'
import DuvidasFrequentes from '../../componentes/usuario/inicio/DuvidasFrequentes'
import Rodape from '../../componentes/usuario/Rodape'
import CarrosselNossosDogs, {
  type HotDogCard,
} from '../../componentes/usuario/inicio/CarrosselNossosDogs'
import imgSmashHome from '../../imagens/logos/img-smash-home.svg'
import smashDog from '../../imagens/itens/smash-mandacaru.jpeg'
import hotDogs from '../../imagens/itens/quatro-dogs.jpeg'
import sodaItaliana from '../../imagens/itens/bedida-soda.jpeg'
import {
  criarSlugUnidade,
  listarProdutos,
  listarUnidades,
  resolverUrlImagem,
  type Unidade,
} from '../../servicos/api'

const hotDogsCards = [
  { image: smashDog, title: 'Smash Dogs', alt: 'Smash Dogs' },
  { image: hotDogs, title: 'Hot Dogs', alt: 'Hot Dogs' },
  { image: sodaItaliana, title: 'Soda Italiana', alt: 'Soda Italiana' },
] as const

export default function Inicio() {
    const [cards, setCards] = useState<readonly HotDogCard[]>(hotDogsCards)
    const [unidades, setUnidades] = useState<
        { href: string; cidade: string; endereco: string }[]
    >([])

    useEffect(() => {
        listarProdutos()
            .then((produtos) => {
                const produtosComImagem = produtos
                    .filter((produto) => produto.ativo && produto.imagem_url)
                    .slice(0, 3)
                    .map((produto) => ({
                        image: resolverUrlImagem(produto.imagem_url)!,
                        title: produto.nome,
                        alt: produto.nome,
                    }))

                if (produtosComImagem.length === 3) {
                    setCards(produtosComImagem)
                }
            })
            .catch(() => undefined)

        listarUnidades()
            .then((unidadesApi) => {
                setUnidades(unidadesApi.map(mapearUnidade))
            })
            .catch(() => undefined)
    }, [])

    return (
        <>
            <BarraDeNavegacao />

            <main className="min-h-screen overflow-x-hidden bg-preto-v1 pt-16">
                {/* HERO */}
                <section className="pagina-container pt-10 min-[490px]:pt-[clamp(2.5rem,1rem+4vw,6rem)]">
                    <div className="flex w-full max-w-full min-w-0 flex-col items-center gap-6 text-center min-[490px]:grid min-[490px]:grid-cols-[auto_auto] min-[490px]:grid-rows-[auto_auto] min-[490px]:justify-center min-[490px]:gap-x-4 min-[490px]:gap-y-6 min-[768px]:gap-x-10 min-[1024px]:gap-x-16 min-[490px]:text-left">
                        <h1 className="font-barlow-condensed text-[clamp(2.25rem,11vw,3rem)] font-black leading-[0.95] text-branco drop-shadow-[0_0_8px_rgba(45,45,45,0.35)] min-[490px]:col-start-1 min-[490px]:row-start-1 min-[490px]:text-[clamp(2.75rem,2.75rem+(100vw-30.625rem)*0.0405,8rem)]">
                            <span className="min-[490px]:hidden">
                                O DOG MAIS <span className="text-amarelo">ARRETADO</span>
                                <br />
                                DE BRASÍLIA
                            </span>

                            <span className="hidden min-[490px]:block">
                                O DOG MAIS
                                <br />
                                <span className="text-amarelo">ARRETADO</span>
                                <br />
                                DE BRASÍLIA
                            </span>
                        </h1>

                        <Botao
                            variant="ifood"
                            className="mt-3 min-[490px]:col-start-1 min-[490px]:row-start-2 min-[490px]:mt-0 min-[490px]:justify-self-start"
                        >
                            FAZER PEDIDO
                        </Botao>

                        <img
                            src={imgSmashHome}
                            alt="Smash Home"
                            className="animacao-smash-home h-auto w-full max-w-[min(100%,400px)] object-contain min-[490px]:col-start-2 min-[490px]:row-start-1 min-[490px]:row-span-2 min-[490px]:h-full min-[490px]:w-auto min-[490px]:max-w-[clamp(11rem,34vw,40rem)] min-[490px]:justify-self-center min-[490px]:self-center"
                        />
                    </div>
                </section>

                {/* NOSSOS HOT DOGS */}
                <section className="pagina-container flex flex-col items-center pt-24 pb-16 text-center min-[490px]:pt-36">
                    <h2 className="font-barlow-condensed text-[clamp(2.25rem,10vw,3rem)] font-black uppercase text-branco min-[490px]:text-5xl">
                        Nossos <span className="text-amarelo">Hot Dogs</span>
                    </h2>

                    <p className="mt-6 max-w-3xl px-1 font-barlow-condensed text-[clamp(1.25rem,4.5vw,1.875rem)] leading-snug text-branco min-[490px]:max-w-4xl min-[490px]:text-3xl">
                        Cada dog é uma experiência. Ingredientes premium com o tempero que só Paraíba tem!
                    </p>

                    <CarrosselNossosDogs cards={cards} />

                    <Botao
                        className="mt-10"
                        onClick={() => {
                            window.location.href = '/cardapio'
                        }}
                    >
                        VER CARDÁPIO COMPLETO
                    </Botao>
                </section>

                {/* ENCONTRE O MAIS PERTO */}
                <section
                    id="unidades"
                    className="scroll-mt-16 pagina-container flex flex-col items-center pt-12 pb-16 text-center min-[490px]:pt-16 min-[490px]:pb-20"
                >
                    <h2 className="font-barlow-condensed text-[clamp(2.25rem,10vw,3rem)] font-black uppercase text-branco min-[490px]:text-[clamp(2.5rem,4vw,3.5rem)]">
                        Encontre o <span className="text-amarelo">mais perto</span>
                    </h2>

                    <div className="mt-8 flex w-full max-w-3xl flex-col gap-4 min-[490px]:mt-12 min-[490px]:gap-5">
                        {unidades.map(({ href, cidade, endereco }) => (
                            <BotaoUnidade
                                key={href}
                                href={href}
                                cidade={cidade}
                                endereco={endereco}
                            />
                        ))}
                    </div>
                </section>

                <DuvidasFrequentes />
            </main>

            <Rodape />
        </>
    )
}

function mapearUnidade(unidade: Unidade) {
    return {
        href: `/unidades/${criarSlugUnidade(unidade)}`,
        cidade: unidade.endereco.bairro.toUpperCase(),
        endereco: unidade.endereco.logradouro,
    }
}
