import BarraDeNavegacao from '../../componentes/globais/BarraDeNavegacao'
import Rodape from '../../componentes/globais/Rodape'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import { useRef } from 'react';

export default function Blog() {
  const swiperHistoriaRef = useRef(null);
  const swiperDepoimentosRef = useRef(null);

  // Dados dos carrosseis
  const fotosHistoria = [
    { id: 1, bg: 'bg-gradient-to-br from-amarelo/20 to-black/40' },
    { id: 2, bg: 'bg-gradient-to-br from-amarelo/10 to-preto-v1' },
    { id: 3, bg: 'bg-gradient-to-br from-black/40 to-amarelo/20' },
  ];

  const depoimentos = [
    {
      id: 1,
      nome: 'Juliana Costa',
      data: '2 ABR 2026',
      texto: '"Simplesmente perfeito! O sabor paraibano autêntico que eu procurava. Toda semana estou lá!"',
      estrelas: 5,
    },
    {
      id: 2,
      nome: 'Carlos Silva',
      data: '28 MAR 2026',
      texto: '"Melhor hot dog que já comi! O atendimento é impecável e os ingredientes são sempre frescos."',
      estrelas: 5,
    },
    {
      id: 3,
      nome: 'Marina Lima',
      data: '15 MAR 2026',
      texto: '"A tradição paraibana em cada mordida. Já virou nosso lugar favorito para comer!"',
      estrelas: 5,
    },
  ];

  return (
    <>
      <BarraDeNavegacao />

      <main className="min-h-screen bg-preto-v1 text-branco">
        {/* NOSSA HISTÓRIA */}
        <section className="pagina-container pt-16 pb-12">
          <div className="text-center">
            <h1 className="font-barlow-condensed text-3xl sm:text-4xl font-black uppercase text-branco mt-6">
              Nossa <span className="text-amarelo">História</span>
            </h1>
          </div>

          {/* Carrossel */}
          <div className="mt-8 relative">
            <Swiper
              ref={swiperHistoriaRef}
              modules={[Navigation]}
              navigation={{
                prevEl: '.swiper-button-prev-historia',
                nextEl: '.swiper-button-next-historia',
              }}
              loop={true}
              className="rounded-3xl overflow-hidden"
            >
              {fotosHistoria.map((foto) => (
                <SwiperSlide key={foto.id}>
                  <div className={`${foto.bg} aspect-[16/9] w-full h-full bg-[#1f1f1f] border border-white/10`} />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Setas customizadas */}
            <button className="swiper-button-prev-historia absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 inline-flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-transparent text-lg sm:text-2xl font-black text-branco transition hover:scale-110 text-center cursor-pointer select-none">
              ❮
            </button>
            <button className="swiper-button-next-historia absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 inline-flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-transparent text-lg sm:text-2xl font-black text-branco transition hover:scale-110 text-center cursor-pointer select-none">
              ❯
            </button>
          </div>

          {/* Texto descritivo */}
          <div className="mt-10 text-center">
            <p className="text-base leading-7 text-[#d9d9d9] max-w-4xl mx-auto">
              Nascemos da paixão pela gastronomia de rua e pelo sabor autêntico da Paraíba. Desde 2015, levamos o melhor hot dog arretado para os brasilienses que buscam qualidade e tradição.
            </p>
            <p className="mt-5 text-base leading-7 text-[#d9d9d9] max-w-4xl mx-auto">
              Nossa missão é servir ingredientes frescos, receitas exclusivas e um atendimento que faz você se sentir em casa. Cada hot dog é preparado com carinho e os temperos que fazem a diferença.
            </p>
          </div>

          {/* Cards de estatísticas */}
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-[#2a2a2a] p-10 text-center">
              <p className="text-5xl font-black text-amarelo">10+</p>
              <p className="mt-3 text-sm uppercase tracking-widest text-branco font-bold">anos de funcionamento</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#2a2a2a] p-10 text-center">
              <p className="text-5xl font-black text-amarelo">4,9</p>
              <p className="mt-3 text-sm uppercase tracking-widest text-branco font-bold">avaliação média</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#2a2a2a] p-10 text-center">
              <p className="text-5xl font-black text-amarelo">3</p>
              <p className="mt-3 text-sm uppercase tracking-widest text-branco font-bold">unidades</p>
            </div>
          </div>
        </section>

        {/* NOTÍCIAS E PROMOÇÕES */}
        <section className="pagina-container border-t border-white/10 pt-16 pb-12">
          <div className="text-center">
            <h2 className="font-barlow-condensed text-3xl sm:text-4xl font-black uppercase text-branco">
              Notícias e <span className="text-amarelo">Promoções</span>
            </h2>
            <p className="mt-4 text-base text-[#d9d9d9]">
              Fique por dentro das novidades e aproveite nossas ofertas
            </p>
          </div>

          {/* Botões de filtro */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button className="rounded-lg border-2 border-amarelo bg-amarelo px-6 py-3 text-sm font-bold uppercase tracking-wider text-black transition hover:bg-[#d0b000]">
              Todos
            </button>
            <button className="rounded-lg border border-white/20 bg-[#2a2a2a] px-6 py-3 text-sm font-bold uppercase tracking-wider text-branco transition hover:bg-[#3a3a3a]">
              Notícias
            </button>
            <button className="rounded-lg border border-white/20 bg-[#2a2a2a] px-6 py-3 text-sm font-bold uppercase tracking-wider text-branco transition hover:bg-[#3a3a3a]">
              Promoções
            </button>
          </div>

          {/* Cards de notícias */}
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {/* Notícia 1 */}
            <article className="overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1a] transition hover:border-amarelo/40">
              <div className="aspect-video bg-[#2a2a2a] relative">
                <span className="absolute top-4 left-4 inline-flex rounded border-2 border-amarelo bg-transparent px-3 py-1 text-xs font-bold uppercase tracking-wider text-amarelo">
                  Notícias
                </span>
              </div>
              <div className="p-8">
                <p className="text-xs uppercase tracking-wider text-[#9b9b9b] font-semibold">📅 10 ABR 2026 • ⏱ 3 MIN</p>
                <h3 className="mt-4 text-2xl font-black uppercase text-branco">
                  Nova unidade abre no Lago Sul
                </h3>
                <p className="mt-4 text-base leading-7 text-[#d9d9d9]">
                  Aproveite nossa promoção especial! Combo completo com desconto até o final do mês
                </p>
              </div>
            </article>

            {/* Notícia 2 */}
            <article className="overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1a] transition hover:border-amarelo/40">
              <div className="aspect-video bg-[#2a2a2a] relative">
                <span className="absolute top-4 left-4 inline-flex rounded border-2 border-amarelo bg-transparent px-3 py-1 text-xs font-bold uppercase tracking-wider text-amarelo">
                  Promoções
                </span>
              </div>
              <div className="p-8">
                <p className="text-xs uppercase tracking-wider text-[#9b9b9b] font-semibold">📅 8 ABR 2026 • ⏱ 2 MIN</p>
                <h3 className="mt-4 text-2xl font-black uppercase text-branco">
                  Combo especial: hot dog + batata + refri por R$ 25
                </h3>
                <p className="mt-4 text-base leading-7 text-[#d9d9d9]">
                  Aproveite nossa promoção especial! Combo completo com desconto até o final do mês
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* O QUE NOSSOS CLIENTES DIZEM */}
        <section className="pagina-container border-t border-white/10 pt-16 pb-12">
          <div className="text-center">
            <h2 className="font-barlow-condensed text-3xl sm:text-4xl font-black uppercase text-branco">
              O que nossos <span className="text-amarelo">Clientes Dizem</span>
            </h2>
          </div>

          {/* Depoimento */}
          <div className="mt-12 relative px-6 md:px-8">
            <Swiper
              ref={swiperDepoimentosRef}
              modules={[Navigation]}
              navigation={{
                prevEl: '.swiper-button-prev-depoimentos',
                nextEl: '.swiper-button-next-depoimentos',
              }}
              loop={true}
              className="rounded-2xl overflow-hidden"
            >
              {depoimentos.map((dep) => (
                <SwiperSlide key={dep.id}>
                  <div className="rounded-2xl border border-white/10 bg-[#2a2a2a] p-8">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
                      <div className="flex-1 text-center lg:text-left">
                        <p className="font-bold uppercase tracking-wider text-branco">{dep.nome}</p>
                        <p className="mt-2 text-sm uppercase tracking-wider text-[#9b9b9b]">{dep.data}</p>
                        <p className="mt-6 text-lg leading-8 text-branco italic">
                          {dep.texto}
                        </p>
                      </div>
                      <div className="text-4xl text-amarelo font-bold flex-shrink-0">
                        {'★'.repeat(dep.estrelas)}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Setas customizadas avaliações */}
            <button className="swiper-button-prev-depoimentos absolute left-0 sm:left-1 md:left-2 top-1/2 -translate-y-1/2 z-10 inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-amarelo text-black text-lg sm:text-xl font-black transition hover:bg-[#d0b000] cursor-pointer">
              ❮
            </button>
            <button className="swiper-button-next-depoimentos absolute right-0 sm:right-1 md:right-2 top-1/2 -translate-y-1/2 z-10 inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-amarelo text-black text-lg sm:text-xl font-black transition hover:bg-[#d0b000] cursor-pointer">
              ❯
            </button>
          </div>
        </section>

        {/* FIQUE POR DENTRO */}
        <section className="pagina-container pb-16">
          <div className="rounded-2xl border border-white/10 bg-[#1a1a1a] p-12 text-center">
            <h2 className="font-barlow-condensed text-3xl sm:text-4xl font-black uppercase text-branco">
              Fique Por Dentro
            </h2>
            <p className="mt-6 text-base text-[#d9d9d9]">
              Receba novidades, promoções e lançamentos direto no seu e-mail
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:gap-0 justify-center max-w-3xl mx-auto">
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="flex-1 rounded-lg sm:rounded-r-none sm:rounded-l-lg border border-white/10 bg-[#0a0a0a] px-6 py-4 text-base text-branco outline-none transition focus:border-amarelo focus:ring-2 focus:ring-amarelo/20 placeholder-[#666]"
              />
              <button className="inline-flex items-center justify-center rounded-lg sm:rounded-l-none sm:rounded-r-lg bg-amarelo px-8 py-4 text-sm font-bold uppercase tracking-wider text-black transition hover:bg-[#d0b000] whitespace-nowrap">
                Cadastrar
              </button>
            </div>
          </div>
        </section>
      </main>

      <Rodape />
    </>
  )
}