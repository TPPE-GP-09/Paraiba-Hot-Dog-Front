import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import BarraDeNavegacao from "../../componentes/usuario/BarraDeNavegacaoUsuario";
import Rodape from "../../componentes/usuario/Rodape";
import type { ProdutoCardapio, SecaoCardapio } from "../../model/cardapio";
import { listarSecoesCardapio } from "../../repository/cardapioRepository";
import { listarUnidades, type Unidade } from "../../servicos/api";

const formatadorPreco = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function formatarPreco(preco: string | number) {
  return formatadorPreco.format(Number(preco));
}

function CardProduto({
  produto,
  onSelect,
}: {
  produto: ProdutoCardapio;
  onSelect: (produto: ProdutoCardapio) => void;
}) {
  const precoNormal = produto.variacoes.find(
    (variacao) => variacao.tipo === "normal",
  );
  const precoCombo = produto.variacoes.find(
    (variacao) => variacao.tipo === "combo",
  );
  const imagem = produto.imagemLocal ?? produto.imagem_url ?? "";

  return (
    <button
      type="button"
      onClick={() => onSelect(produto)}
      className="group flex w-full flex-col overflow-hidden rounded-[12px] bg-[#222] text-left shadow-[0_12px_24px_rgba(0,0,0,0.28)] outline-none transition-transform duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-amarelo min-[640px]:h-44 min-[640px]:flex-row"
      aria-label={`Ver detalhes de ${produto.nome}`}
    >
      <div className="order-2 grid min-h-[12rem] flex-1 grid-rows-[minmax(0,1fr)_3.25rem] gap-2 px-3 py-3 text-branco min-[640px]:order-1 min-[640px]:min-h-0 min-[640px]:py-4">
        <div className="min-h-0 overflow-hidden">
          <h3 className="line-clamp-2 font-barlow text-lg font-black leading-tight drop-shadow-[0_3px_3px_rgba(0,0,0,0.2)]">
            {produto.nome}
          </h3>

          <p className="mt-1 line-clamp-4 font-barlow text-sm leading-[1.2] text-branco/85 drop-shadow-[0_3px_3px_rgba(0,0,0,0.15)] min-[640px]:line-clamp-2">
            {produto.descricao}
          </p>
        </div>

        <div className="flex h-[3.25rem] items-end justify-between gap-4 border-t border-branco/5 pt-2">
          <div className="min-h-[2.75rem] text-left font-barlow-condensed font-black text-branco min-[640px]:ml-auto min-[640px]:text-right">
            {precoNormal && (
              <p className="text-xl leading-none">
                {formatarPreco(precoNormal.preco)}
              </p>
            )}
            {precoCombo && (
              <p className="mt-1 text-sm leading-[0.95]">
                {formatarPreco(precoCombo.preco)}
                <span className="block text-xs text-amarelo">(COMBO)</span>
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="order-1 h-44 w-full overflow-hidden border-b border-preto-v1 bg-preto-v3 min-[640px]:order-3 min-[640px]:h-full min-[640px]:w-48 min-[640px]:border-b-0 min-[640px]:border-l">
        {imagem ? (
          <img
            src={imagem}
            alt={produto.nome}
            className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105 group-hover:brightness-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-preto-v3 font-barlow-condensed text-2xl font-black uppercase text-amarelo">
            Paraíba
          </div>
        )}
      </div>
    </button>
  );
}

function DetalheProduto({
  produto,
  onClose,
}: {
  produto: ProdutoCardapio;
  onClose: () => void;
}) {
  const imagem = produto.imagemLocal ?? produto.imagem_url ?? "";

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end bg-preto-v1/80 px-4 py-4 backdrop-blur-sm min-[640px]:items-center min-[640px]:justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="produto-detalhe-titulo"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[5px] bg-[#222] text-branco shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="grid min-[768px]:grid-cols-[minmax(0,0.95fr)_minmax(20rem,1fr)]">
          <div className="aspect-square overflow-hidden bg-preto-v3 min-[768px]:aspect-auto min-[768px]:h-[28rem]">
            {imagem ? (
              <img
                src={imagem}
                alt={produto.nome}
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="flex h-full items-center justify-center font-barlow-condensed text-4xl font-black uppercase text-amarelo">
                Paraíba
              </div>
            )}
          </div>

          <div className="flex flex-col p-5 min-[640px]:p-6">
            <div className="flex items-start gap-4">
              <div className="min-w-0 flex-1">
                <p className="font-barlow-condensed text-lg font-black uppercase text-amarelo">
                  Cardápio
                </p>
                <h3
                  id="produto-detalhe-titulo"
                  className="mt-1 font-barlow text-3xl font-black leading-none text-branco"
                >
                  {produto.nome}
                </h3>
              </div>

              <button
                type="button"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[5px] border border-branco/15 text-branco transition-colors hover:border-amarelo hover:text-amarelo"
                onClick={onClose}
                aria-label="Fechar detalhes"
              >
                <X aria-hidden className="h-5 w-5" strokeWidth={3} />
              </button>
            </div>

            <p className="mt-4 font-barlow text-sm leading-snug text-branco/85">
              {produto.descricao}
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              {produto.variacoes.map((variacao) => (
                <div
                  key={variacao.id}
                  className="rounded-[5px] border border-branco/15 px-4 py-3"
                >
                  <p className="font-barlow text-xs font-semibold uppercase text-branco/55">
                    {variacao.nome}
                  </p>
                  <p className="font-barlow-condensed text-2xl font-black leading-none text-branco">
                    {formatarPreco(variacao.preco)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h4 className="font-barlow-condensed text-2xl font-black uppercase text-amarelo">
                Adicionais
              </h4>

              {produto.adicionais.length > 0 ? (
                <ul className="mt-3 grid gap-2">
                  {produto.adicionais.map((adicional) => (
                    <li
                      key={adicional.id}
                      className="flex items-center justify-between gap-4 rounded-[5px] border border-branco/10 px-3 py-2 font-barlow text-sm"
                    >
                      <span className="min-w-0 text-branco/90">
                        {adicional.nome}
                      </span>
                      <span className="shrink-0 font-barlow-condensed text-xl font-black text-branco">
                        {formatarPreco(adicional.preco)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 font-barlow text-sm text-branco/65">
                  Nenhum adicional cadastrado para este item.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavegacaoCategorias({
  secoes,
  secaoAtivaId,
}: {
  secoes: SecaoCardapio[];
  secaoAtivaId: string;
}) {
  return (
    <nav
      aria-label="Categorias do cardápio"
      className="sticky top-16 z-[40] mt-10 bg-preto-v1/95 backdrop-blur"
    >
      <div className="pagina-container py-0">
        <div className="flex justify-center overflow-x-auto">
          <ul className="inline-flex w-max min-w-max snap-x snap-mandatory items-stretch gap-0 overflow-x-auto rounded-[14px] border border-branco/10 bg-[#171717] px-1 shadow-[0_10px_24px_rgba(0,0,0,0.22)] [scroll-behavior:smooth] [-webkit-overflow-scrolling:touch] select-none">
            {secoes.map((secao) => (
              <li
                key={secao.id}
                className="min-w-[7.25rem] snap-start flex-none min-[640px]:min-w-40"
              >
                <a
                  href={`#${secao.id}`}
                  className={`relative flex items-center justify-center whitespace-nowrap border-b-2 px-4 py-4 font-barlow-condensed text-sm font-black uppercase leading-none transition-colors duration-200 min-[640px]:px-6 min-[640px]:text-xl ${
                    secaoAtivaId === secao.id
                      ? "border-amarelo text-amarelo"
                      : "border-transparent text-branco/75 hover:border-branco/50 hover:text-branco"
                  }`}
                >
                  {secao.titulo}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

function SecaoProdutos({
  secao,
  onSelectProduto,
  ativa,
}: {
  secao: SecaoCardapio;
  onSelectProduto: (produto: ProdutoCardapio) => void;
  ativa: boolean;
}) {
  return (
    <section id={secao.id} className="scroll-mt-36 pt-14 first:pt-12">
      <h2
        className={`font-barlow-condensed text-[clamp(2rem,8vw,3.5rem)] font-black uppercase leading-none transition-colors ${
          ativa ? "text-amarelo" : "text-branco"
        }`}
      >
        {secao.titulo}
      </h2>

      {secao.produtos.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-4 pb-5 min-[520px]:grid-cols-2 min-[640px]:gap-5 min-[1180px]:grid-cols-3">
          {secao.produtos.map((produto) => (
            <CardProduto
              key={produto.id}
              produto={produto}
              onSelect={onSelectProduto}
            />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-[12px] border border-branco/10 bg-[#222] px-4 py-5 font-barlow text-sm text-branco/60">
          Categoria cadastrada. Os itens dessa seção ainda não foram
          adicionados.
        </div>
      )}
    </section>
  );
}

export default function Cardapio() {
  const [secoes, setSecoes] = useState<SecaoCardapio[]>([]);
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [unidadeSelecionadaId, setUnidadeSelecionadaId] = useState<number | "">(
    "",
  );
  const [carregando, setCarregando] = useState(true);
  const [carregandoUnidades, setCarregandoUnidades] = useState(true);
  const [erroCarregamento, setErroCarregamento] = useState(false);
  const [erroUnidades, setErroUnidades] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] =
    useState<ProdutoCardapio | null>(null);
  const [secaoAtivaId, setSecaoAtivaId] = useState(() =>
    window.location.hash.replace("#", ""),
  );
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    let ativo = true;

    listarSecoesCardapio(unidadeSelecionadaId || null, false, true)
      .then((resultado) => {
        if (!ativo) return;
        setSecoes(resultado);
        setErroCarregamento(false);
      })
      .catch(() => {
        if (ativo) setErroCarregamento(true);
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, [unidadeSelecionadaId]);

  useEffect(() => {
    let ativo = true;

    listarUnidades()
      .then((resultado) => {
        if (!ativo) return;
        setUnidades(resultado);
        setErroUnidades(false);
      })
      .catch(() => {
        if (ativo) setErroUnidades(true);
      })
      .finally(() => {
        if (ativo) setCarregandoUnidades(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  const totalProdutos = useMemo(
    () => secoes.reduce((total, secao) => total + secao.produtos.length, 0),
    [secoes],
  );
  const unidadeSelecionada = useMemo(
    () =>
      unidades.find((unidade) => unidade.id === unidadeSelecionadaId) ?? null,
    [unidadeSelecionadaId, unidades],
  );
  const secaoAtivaExibida = secaoAtivaId || secoes[0]?.id || "";

  useEffect(() => {
    if (!secoes.length) return;

    observerRef.current?.disconnect();
    const observer = new IntersectionObserver(
      (entries) => {
        const visiveis = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visiveis[0]?.target.id) {
          setSecaoAtivaId(visiveis[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: "-35% 0px -55% 0px",
        threshold: [0.15, 0.3, 0.5, 0.7],
      },
    );

    observerRef.current = observer;
    secoes.forEach((secao) => {
      const elemento = document.getElementById(secao.id);
      if (elemento) observer.observe(elemento);
    });

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, [secoes]);

  return (
    <>
      <BarraDeNavegacao />

      <main className="min-h-screen overflow-x-clip bg-preto-v1 pt-[8.75rem] text-branco">
        <section className="pagina-container pt-12 pb-16 min-[768px]:pt-16">
          <div className="max-w-4xl">
            <p className="font-barlow text-sm font-semibold uppercase text-amarelo">
              Paraíba Hot Dog
            </p>
            <h1 className="mt-3 font-barlow-condensed text-[clamp(3rem,15vw,7rem)] font-black uppercase leading-[0.85] text-branco">
              Cardápio
            </h1>
            <p className="mt-5 max-w-2xl font-barlow-condensed text-2xl font-semibold leading-tight text-branco/85 min-[640px]:text-3xl">
              Smashdogs, hotdogs, bebidas e acompanhamentos com o tempero mais
              arretado de Brasília.
            </p>
          </div>

          <div className="mt-8 max-w-xl font-barlow">
            <label
              htmlFor="unidade-cardapio"
              className="block text-sm font-semibold uppercase text-branco/75"
            >
              Unidade
            </label>
            <select
              id="unidade-cardapio"
              value={unidadeSelecionadaId}
              disabled={carregandoUnidades}
              onChange={(event) => {
                setCarregando(true);
                setProdutoSelecionado(null);
                setUnidadeSelecionadaId(
                  event.target.value ? Number(event.target.value) : "",
                );
              }}
              className="mt-2 h-12 w-full rounded-[5px] border border-branco/15 bg-[#222] px-4 font-barlow text-base font-semibold text-branco outline-none transition-colors focus:border-amarelo focus:ring-2 focus:ring-amarelo/30 disabled:cursor-not-allowed disabled:text-branco/45"
            >
              <option value="">
                {carregandoUnidades
                  ? "Carregando unidades..."
                  : "Todas as unidades"}
              </option>
              {unidades.map((unidade) => (
                <option key={unidade.id} value={unidade.id}>
                  {unidade.nome}
                </option>
              ))}
            </select>
            {erroUnidades && (
              <p className="mt-2 text-sm text-branco/55">
                Não foi possível carregar as unidades. O cardápio completo
                continua disponível.
              </p>
            )}
          </div>

          {!carregando && (
            <NavegacaoCategorias
              secoes={secoes}
              secaoAtivaId={secaoAtivaExibida}
            />
          )}

          {carregando ? (
            <div className="mt-12 rounded-[5px] border border-branco/10 bg-[#222] px-5 py-8 font-barlow text-branco/80">
              Carregando cardápio...
            </div>
          ) : erroCarregamento ? (
            <div className="mt-12 rounded-[5px] border border-branco/10 bg-[#222] px-5 py-8 font-barlow text-branco/80">
              Não foi possível carregar o cardápio no momento.
            </div>
          ) : (
            <>
              <p className="mt-6 font-barlow text-sm text-branco/60">
                {totalProdutos} itens disponíveis
                {unidadeSelecionada ? ` em ${unidadeSelecionada.nome}` : ""}.
              </p>

              <div>
                {secoes.map((secao) => (
                  <SecaoProdutos
                    key={secao.id}
                    secao={secao}
                    ativa={secao.id === secaoAtivaExibida}
                    onSelectProduto={setProdutoSelecionado}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      </main>

      {produtoSelecionado && (
        <DetalheProduto
          produto={produtoSelecionado}
          onClose={() => setProdutoSelecionado(null)}
        />
      )}

      <Rodape />
    </>
  );
}
