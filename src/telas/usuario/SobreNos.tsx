import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import BarraDeNavegacao from '../../componentes/usuario/BarraDeNavegacaoUsuario'
import Rodape from '../../componentes/usuario/Rodape'
import imgCarrossel2 from '../../imagens/sobre-nos/WhatsApp Image 2026-04-15 at 11.10.02.jpeg'
import imgCarrossel3 from '../../imagens/sobre-nos/WhatsApp Image 2026-04-15 at 11.29.49.jpeg'
import imgCarrossel4 from '../../imagens/sobre-nos/WhatsApp Image 2026-04-15 at 11.10.03.jpeg'
import { resolverUrlImagem } from '../../servicos/api'
import { listarPostsBlogApi, resolverImagemBlogApi, type BlogPostApi, type TipoBlogApi } from '../../servicos/blogApi'

const smashMandacaru = resolverUrlImagem('/uploads/produtos/smash-mandacaru.jpeg') ?? ''
const dogArretado = resolverUrlImagem('/uploads/produtos/dog-arretado.jpeg') ?? ''


const historias = [
  { imagem: imgCarrossel4, posicao: 'center center' },
  { imagem: imgCarrossel2, posicao: 'center top' },
  { imagem: imgCarrossel3, posicao: 'center center' },
] as const

const noticiasFallback = [
  {
    categoria: 'noticia' as const,
    titulo: 'Nova unidade abre no Lago Sul',
    descricao: 'Mais um ponto para quem quer matar a fome com hot dog arretado.',
    imagem: smashMandacaru,
    data: '10 MAR 2026',
  },
  {
    categoria: 'promocao' as const,
    titulo: 'Combo especial: hot dog + batata + refri por R$ 25',
    descricao: 'Promo por tempo limitado para comer bem sem pesar no bolso.',
    imagem: dogArretado,
    data: '18 ABR 2026',
  },
]

const depoimentos = [
  {
    nome: 'Juliana Costa',
    cidade: 'Brasilia',
    texto:
      'Simplesmente perfeito. O sabor paraibano autentico que eu procurava. Toda semana estou la.',
  },
  {
    nome: 'Marcos Lima',
    cidade: 'Taguatinga',
    texto:
      'O combo sai rapido e chega bonito. O atendimento e a historia da marca passam muita verdade.',
  },
  {
    nome: 'Fernanda Alves',
    cidade: 'Aguas Claras',
    texto:
      'Sempre volto pelo sabor e pela consistencia. Os dogs e os acompanhamentos nao falham.',
  },
]

export default function SobreNos() {
  const [imagemAtiva, setImagemAtiva] = useState(0)
  const [depoimentoAtivo, setDepoimentoAtivo] = useState(0)
  const [posts, setPosts] = useState<BlogCard[]>([])
  const [filtro, setFiltro] = useState<'todos' | TipoBlogApi>('todos')
  const [carregandoPosts, setCarregandoPosts] = useState(true)

  const historiaAtual = historias[imagemAtiva]
  const depoimento = depoimentos[depoimentoAtivo]

  const estatisticas = useMemo(
    () => [
      { valor: '10+', legenda: 'Anos de funcionamento' },
      { valor: '4,9', legenda: 'Avaliacao media' },
      { valor: '3', legenda: 'Unidades' },
    ],
    [],
  )

  useEffect(() => {
    let ativo = true

    async function carregarPosts() {
      setCarregandoPosts(true)
      try {
        const [noticiasApi, promocoesApi] = await Promise.all([
          listarPostsBlogApi('noticia'),
          listarPostsBlogApi('promocao'),
        ])

        if (!ativo) return
        const unificados = [...noticiasApi, ...promocoesApi]
          .sort((a, b) => b.data.localeCompare(a.data))
          .map(mapearPost)

        setPosts(unificados.length ? unificados : noticiasFallback.map(mapearFallback))
      } catch {
        if (ativo) setPosts(noticiasFallback.map(mapearFallback))
      } finally {
        if (ativo) setCarregandoPosts(false)
      }
    }

    carregarPosts()

    return () => {
      ativo = false
    }
  }, [])

  const postsFiltrados = posts.filter((post) => filtro === 'todos' || post.tipo === filtro)

  return (
    <>
      <BarraDeNavegacao variant="light" />

      <main className="min-h-screen bg-preto-v1 pt-16 text-branco">
        <section className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="font-barlow-condensed text-sm font-black uppercase tracking-[0.26em] text-amarelo">
              Nossa historia
            </p>
            <h1 className="mt-2 font-barlow-condensed text-[clamp(2.25rem,7vw,4rem)] font-black uppercase leading-[0.9]">
              Nossa <span className="text-amarelo">historia</span>
            </h1>
          </div>

          <div className="mt-8 overflow-hidden rounded-[24px] border border-branco/10 bg-[#111] shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
            <div className="relative isolate overflow-hidden bg-[#090909] px-3 py-3 sm:px-4 sm:py-4">
              <div className="absolute inset-0">
                <img
                  src={historiaAtual.imagem}
                  alt=""
                  aria-hidden
                  className="h-full w-full scale-105 object-cover opacity-20 blur-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/15 to-black/60" />
              </div>

              <div className="relative">
                <div className="relative overflow-hidden rounded-[22px] border border-white/10 bg-black/25 shadow-[0_18px_40px_rgba(0,0,0,0.3)]">
                  <img
                    src={historiaAtual.imagem}
                    alt="Historia da Paraiba Hot Dog"
                    className="h-[230px] w-full object-cover sm:h-[330px] lg:h-[390px]"
                    style={{ objectPosition: historiaAtual.posicao }}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-transparent" />
                </div>

                <button
                  type="button"
                  onClick={() => setImagemAtiva((atual) => (atual - 1 + historias.length) % historias.length)}
                  className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-branco transition hover:bg-black"
                  aria-label="Imagem anterior"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  onClick={() => setImagemAtiva((atual) => (atual + 1) % historias.length)}
                  className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/70 text-branco transition hover:bg-black"
                  aria-label="Proxima imagem"
                >
                  <ChevronRight size={22} />
                </button>
              </div>
            </div>

            <div className="px-4 py-5 sm:px-6 sm:py-7">
              <p className="mx-auto max-w-4xl text-center font-barlow text-sm leading-7 text-branco/80 sm:text-base">
                Nascemos da paixão pela gastronomia de rua e pelo sabor autentico da Paraiba.
                Desde 2015, levamos o melhor hot dog arretado para os brasiliense com qualidade,
                fartura e tradição. Nossa missão e servir ingredientes frescos, receitas
                exclusivas e um atendimento que faz voce se sentir em casa.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3 sm:gap-4">
                {estatisticas.map((item) => (
                  <article key={item.legenda} className="rounded-2xl bg-[#242424] px-4 py-5 text-center">
                    <strong className="block font-barlow-condensed text-4xl font-black text-amarelo">
                      {item.valor}
                    </strong>
                    <span className="mt-1 block text-[10px] font-black uppercase tracking-[0.2em] text-branco/70">
                      {item.legenda}
                    </span>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-barlow-condensed text-[clamp(2.3rem,6vw,4rem)] font-black uppercase leading-[0.9]">
              <span className="text-branco">Noticias e </span>
              <span className="text-amarelo">Promocoes</span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-branco/75 sm:text-base">
              Fique por dentro das novidades e aproveite
              <br />
              nossas ofertas
            </p>
          </div>

          <div className="mt-8 flex justify-center">
            <div className="grid grid-cols-3 gap-1.5 rounded-md bg-[#2d2d2d] p-1.5">
              <button type="button" onClick={() => setFiltro('todos')} className={`rounded px-6 py-2 text-[10px] font-black uppercase ${filtro === 'todos' ? 'bg-amarelo text-preto-v1' : 'bg-[#434343] text-branco/80'}`}>
                Todos
              </button>
              <button type="button" onClick={() => setFiltro('noticia')} className={`rounded px-6 py-2 text-[10px] font-black uppercase ${filtro === 'noticia' ? 'bg-amarelo text-preto-v1' : 'bg-[#434343] text-branco/80'}`}>
                Noticias
              </button>
              <button type="button" onClick={() => setFiltro('promocao')} className={`rounded px-6 py-2 text-[10px] font-black uppercase ${filtro === 'promocao' ? 'bg-amarelo text-preto-v1' : 'bg-[#434343] text-branco/80'}`}>
                Promocoes
              </button>
            </div>
          </div>

          {carregandoPosts && (
            <p className="mt-6 text-center text-sm text-branco/50">Carregando noticias e promocoes...</p>
          )}

          <div className="mt-8 grid gap-4 lg:grid-cols-2 lg:gap-5">
            {postsFiltrados.map((noticia) => (
              <article
                key={noticia.titulo}
                className="overflow-hidden rounded-[18px] border border-branco/10 bg-[#2a2a2a] shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
              >
                <div className="relative">
                  <img
                    src={noticia.imagem}
                    alt={noticia.titulo}
                    className="h-[280px] w-full object-cover"
                  />
                  <span className="absolute left-3 top-3 rounded bg-amarelo px-2 py-1 text-[9px] font-black uppercase text-preto-v1">
                    {noticia.tipo === 'noticia' ? 'Noticias' : 'Promocao'}
                  </span>
                </div>
                <div className="px-4 py-4 sm:px-5 sm:py-5">
                  <div className="text-[10px] font-black uppercase tracking-[0.22em] text-branco/45">
                    {noticia.data}
                  </div>
                  <h3 className="mt-2 font-barlow-condensed text-[clamp(1.6rem,3vw,2.1rem)] font-black uppercase leading-tight text-branco">
                    {noticia.titulo}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-branco/75">{noticia.descricao}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-5xl px-4 py-8 pb-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-barlow-condensed text-[clamp(2rem,5vw,3.25rem)] font-black uppercase">
              O que nossos <span className="text-amarelo">clientes dizem</span>
            </h2>
          </div>

          <div className="mx-auto mt-8 max-w-4xl rounded-2xl bg-[#2a2a2a] px-5 py-6 shadow-[0_12px_40px_rgba(0,0,0,0.3)] sm:px-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-barlow-condensed text-xl font-black uppercase">{depoimento.nome}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-branco/50">{depoimento.cidade}</p>
              </div>
              <div className="flex items-center gap-1 text-amarelo" aria-label="5 estrelas">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} size={16} fill="currentColor" />
                ))}
              </div>
            </div>

            <p className="mt-5 text-sm leading-7 text-branco/80 sm:text-base">
              &quot;{depoimento.texto}&quot;
            </p>

            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setDepoimentoAtivo((atual) => (atual - 1 + depoimentos.length) % depoimentos.length)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-amarelo text-preto-v1 transition hover:brightness-95"
                aria-label="Depoimento anterior"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex gap-2">
                {depoimentos.map((item, index) => (
                  <button
                    key={item.nome}
                    type="button"
                    onClick={() => setDepoimentoAtivo(index)}
                    className={`h-2.5 rounded-full transition-all ${index === depoimentoAtivo ? 'w-8 bg-amarelo' : 'w-2.5 bg-branco/25'}`}
                    aria-label={`Ver depoimento de ${item.nome}`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => setDepoimentoAtivo((atual) => (atual + 1) % depoimentos.length)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-amarelo text-preto-v1 transition hover:brightness-95"
                aria-label="Proximo depoimento"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </section>
      </main>

      <Rodape />
    </>
  )
}

type BlogCard = {
  id: number
  titulo: string
  descricao: string
  imagem: string
  data: string
  tipo: TipoBlogApi
}

function mapearPost(post: BlogPostApi): BlogCard {
  return {
    id: post.id,
    titulo: post.titulo,
    descricao: post.descricao ?? '',
    imagem: resolverImagemBlogApi(post.imagem_url) ?? smashMandacaru,
    data: formatarDataBlog(post.data),
    tipo: post.tipo,
  }
}

function mapearFallback(post: (typeof noticiasFallback)[number]): BlogCard {
  return {
    id: post.titulo.length,
    titulo: post.titulo,
    descricao: post.descricao,
    imagem: post.imagem,
    data: post.data,
    tipo: post.categoria,
  }
}

function formatarDataBlog(data: string) {
  const valor = new Date(`${data}T00:00:00`)
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
    .format(valor)
    .replace('.', '')
    .toUpperCase()
}
