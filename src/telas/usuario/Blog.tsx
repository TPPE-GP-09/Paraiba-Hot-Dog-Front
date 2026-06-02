import BarraDeNavegacao from '../../componentes/globais/BarraDeNavegacao'
import Rodape from '../../componentes/globais/Rodape'

export default function Blog() {
  return (
    <>
      <BarraDeNavegacao />

      <main className="min-h-screen bg-preto-v1 text-branco">
        {/* NOSSA HISTÓRIA */}
        <section className="pagina-container pt-16 pb-12">
          <div className="text-center">
            <h1 className="font-barlow-condensed text-4xl font-black uppercase text-branco">
              Nossa <span className="text-amarelo">História</span>
            </h1>
          </div>

          {/* Carrossel */}
          <div className="mt-8 relative">
            <div className="relative rounded-3xl overflow-hidden bg-[#1f1f1f] aspect-[16/9] border border-white/10">
              <div className="w-full h-full bg-gradient-to-b from-transparent to-black/40" />
              
              {/* Setas do carrossel */}
              <button className="absolute left-6 top-1/2 -translate-y-1/2 z-10 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/60 text-3xl text-branco transition hover:bg-black/80">
                ‹
              </button>
              <button className="absolute right-6 top-1/2 -translate-y-1/2 z-10 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/60 text-3xl text-branco transition hover:bg-black/80">
                ›
              </button>
            </div>
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
            <h2 className="font-barlow-condensed text-4xl font-black uppercase text-branco">
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
            <h2 className="font-barlow-condensed text-4xl font-black uppercase text-branco">
              O que nossos <span className="text-amarelo">Clientes Dizem</span>
            </h2>
          </div>

          {/* Depoimento */}
          <div className="mt-12 relative">
            <div className="rounded-2xl border border-white/10 bg-[#2a2a2a] p-8">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
                {/* Seta esquerda */}
                <button className="absolute left-3 top-1/2 -translate-y-1/2 lg:relative lg:translate-y-0 lg:left-0 lg:order-first inline-flex h-16 w-16 items-center justify-center rounded-full bg-amarelo text-black text-3xl font-bold transition hover:bg-[#d0b000] flex-shrink-0">
                  ‹
                </button>

                <div className="flex-1 text-center lg:text-left">
                  <p className="font-bold uppercase tracking-wider text-branco">Juliana Costa</p>
                  <p className="mt-2 text-sm uppercase tracking-wider text-[#9b9b9b]">2 ABR 2026</p>
                  <p className="mt-6 text-lg leading-8 text-branco italic">
                    "Simplesmente perfeito! O sabor paraibano autêntico que eu procurava. Toda semana estou lá!"
                  </p>
                </div>

                <div className="text-4xl text-amarelo font-bold flex-shrink-0">★★★★★</div>

                {/* Seta direita */}
                <button className="absolute right-3 top-1/2 -translate-y-1/2 lg:relative lg:translate-y-0 lg:right-0 lg:order-last inline-flex h-16 w-16 items-center justify-center rounded-full bg-amarelo text-black text-3xl font-bold transition hover:bg-[#d0b000] flex-shrink-0">
                  ›
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FIQUE POR DENTRO */}
        <section className="pagina-container pb-16">
          <div className="rounded-2xl border border-white/10 bg-[#1a1a1a] p-12 text-center">
            <h2 className="font-barlow-condensed text-4xl font-black uppercase text-branco">
              Fique Por Dentro
            </h2>
            <p className="mt-6 text-base text-[#d9d9d9]">
              Receba novidades, promoções e lançamentos direto no seu e-mail
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-0 justify-center max-w-3xl mx-auto">
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="flex-1 rounded-l-lg border border-white/10 bg-[#0a0a0a] px-6 py-4 text-base text-branco outline-none transition focus:border-amarelo focus:ring-2 focus:ring-amarelo/20 placeholder-[#666]"
              />
              <button className="inline-flex items-center justify-center rounded-r-lg bg-amarelo px-8 py-4 text-sm font-bold uppercase tracking-wider text-black transition hover:bg-[#d0b000] whitespace-nowrap">
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
