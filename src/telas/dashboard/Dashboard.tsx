import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import BarraDeNavegacao from '../../componentes/globais/BarraDeNavegacao'
import Rodape from '../../componentes/globais/Rodape'
import { useAuth } from '../../contextos/useAuth'

type DashboardApi = {
  kpis: {
    receita_bruta: string
    lucro_liquido: string
    ticket_medio: string
    total_pedidos: number
    variacao_receita_bruta: string
    variacao_lucro_liquido: string
    variacao_ticket_medio: string
    variacao_total_pedidos: string
  }
  vendas_por_hora: Array<{
    hora: string
    quantidade: number
    destaque: boolean
  }>
  top_produtos: Array<{
    rank: number
    produto_id: number
    nome: string
    quantidade: number
    receita: string
    variacao: string
  }>
  mix_produtos: Array<{
    nome: string
    percentual: string
  }>
  vendas_totais: string
  pedidos_registrados: number
  destaque: {
    nome: string
    margem_ganho: string
    margem_liquida: string
  } | null
}

type KpiTone = 'positive' | 'negative'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000'
const mixColors = ['#ffcc00', '#d71920', '#9ba9b8']

const emptyDashboard: DashboardApi = {
  kpis: {
    receita_bruta: '0.00',
    lucro_liquido: '0.00',
    ticket_medio: '0.00',
    total_pedidos: 0,
    variacao_receita_bruta: '0.00',
    variacao_lucro_liquido: '0.00',
    variacao_ticket_medio: '0.00',
    variacao_total_pedidos: '0.00',
  },
  vendas_por_hora: Array.from({ length: 12 }, (_, index) => ({
    hora: `${String(index + 10).padStart(2, '0')}h`,
    quantidade: 0,
    destaque: false,
  })),
  top_produtos: [],
  mix_produtos: [],
  vendas_totais: '0.00',
  pedidos_registrados: 0,
  destaque: null,
}

function formatCurrency(value: string | number) {
  return Number(value).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

function formatPercentage(value: string | number) {
  const numberValue = Number(value)
  const sign = numberValue > 0 ? '+' : ''

  return `${sign}${numberValue.toLocaleString('pt-BR', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 1,
  })}%`
}

function variationTone(value: string | number): KpiTone {
  return Number(value) < 0 ? 'negative' : 'positive'
}

export default function Dashboard() {
  const [dashboard, setDashboard] = useState<DashboardApi>(emptyDashboard)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { getAuthHeaders } = useAuth()

  useEffect(() => {
    const controller = new AbortController()

    async function loadDashboard() {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`${apiBaseUrl}/bi/dashboard`, {
          signal: controller.signal,
          headers: getAuthHeaders(),
        })

        if (response.status === 401) {
          throw new Error('A API recusou a requisicao. Informe um token valido no localStorage ou nos cookies.')
        }

        if (!response.ok) {
          throw new Error('Nao foi possivel carregar os indicadores da API.')
        }

        setDashboard(await response.json())
      } catch (requestError) {
        if (requestError instanceof DOMException && requestError.name === 'AbortError') {
          return
        }

        setDashboard(emptyDashboard)
        setError(requestError instanceof Error ? requestError.message : 'Erro inesperado ao carregar a dashboard.')
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboard()

    return () => controller.abort()
  }, [getAuthHeaders])

  const kpis = [
    {
      label: 'Receita Bruta',
      value: formatCurrency(dashboard.kpis.receita_bruta),
      change: formatPercentage(dashboard.kpis.variacao_receita_bruta),
      tone: variationTone(dashboard.kpis.variacao_receita_bruta),
      featured: true,
    },
    {
      label: 'Lucro Liquido',
      value: formatCurrency(dashboard.kpis.lucro_liquido),
      change: formatPercentage(dashboard.kpis.variacao_lucro_liquido),
      tone: variationTone(dashboard.kpis.variacao_lucro_liquido),
    },
    {
      label: 'Ticket Medio',
      value: formatCurrency(dashboard.kpis.ticket_medio),
      change: formatPercentage(dashboard.kpis.variacao_ticket_medio),
      tone: variationTone(dashboard.kpis.variacao_ticket_medio),
    },
  ]

  const maxSalesByHour = useMemo(
    () => Math.max(...dashboard.vendas_por_hora.map((sale) => sale.quantidade), 1),
    [dashboard.vendas_por_hora],
  )
  const mixPrincipal = dashboard.mix_produtos[0]?.percentual ?? '0'

  return (
    <>
      <BarraDeNavegacao variant="dark" />

      <main className="min-h-screen bg-[#edf2f8] pt-16 text-[#243247]">
        <section className="min-h-[calc(100vh-4rem)] w-full bg-[#edf2f8]" aria-label="Dashboard BI Paraiba Hot Dog">
          <div className="min-h-[calc(100vh-4rem)] px-[6vw] py-7 max-[900px]:px-3.5 max-[900px]:py-4">
            <div className="mb-5 flex items-end justify-between gap-4 max-[900px]:grid">
              <span className="text-xs font-black uppercase text-[#7d8ea4]">Tela do BI</span>
              <h1 className="m-0 text-2xl font-black text-[#172033]">Resumo operacional</h1>
            </div>

            {(isLoading || error) && (
              <div
                className={`mb-3 rounded border px-3 py-2.5 text-xs font-extrabold ${
                  error
                    ? 'border-[#f4a5ad] bg-[#ffe4e7] text-[#8a1018]'
                    : 'border-[#ffdb38] bg-[#fff1a6] text-[#604f00]'
                }`}
              >
                {error ?? 'Carregando indicadores da API...'}
              </div>
            )}

            <section className="mb-3.5 grid grid-cols-4 gap-3 max-[900px]:grid-cols-1" aria-label="Indicadores principais">
              {kpis.map((kpi) => (
                <article
                  className={`min-h-[98px] rounded-md border bg-white p-3.5 ${
                    kpi.featured ? 'border-[3px] border-[#1597ff] p-3' : 'border-[#d8e1ed]'
                  }`}
                  key={kpi.label}
                >
                  <span className="mb-2 block text-xs font-extrabold text-[#8799af]">{kpi.label}</span>
                  <strong className="block text-xl font-black text-[#223149]">{kpi.value}</strong>
                  <div className="mt-3 flex items-center gap-2">
                    <b
                      className={`rounded px-1.5 py-1 text-[10px] font-black ${
                        kpi.tone === 'negative' ? 'bg-[#ffe0e4] text-[#d71920]' : 'bg-[#d8fff4] text-[#078669]'
                      }`}
                    >
                      {kpi.change}
                    </b>
                    <small className="text-[10px] font-bold text-[#9cadbf]">vs. mes passado</small>
                  </div>
                </article>
              ))}

              <article className="min-h-[98px] rounded-md border border-[#ffcc00] bg-[#ffcc00] p-3.5">
                <span className="mb-2 block text-xs font-extrabold text-[#725d00]">Total de Pedidos</span>
                <strong className="block text-xl font-black text-[#223149]">{dashboard.kpis.total_pedidos}</strong>
                <div className="mt-3 flex items-center gap-2">
                  <b className="rounded bg-black px-1.5 py-1 text-[10px] font-black text-white">
                    {formatPercentage(dashboard.kpis.variacao_total_pedidos)}
                  </b>
                  <small className="text-[10px] font-bold text-[#725d00]">vs. mes passado</small>
                </div>
              </article>
            </section>

            <div className="grid grid-cols-[minmax(0,1fr)_258px] gap-3 max-[900px]:grid-cols-1">
              <section className="grid gap-3">
                <article className="min-h-[204px] rounded-md border border-[#d8e1ed] bg-white p-4">
                  <h2 className="m-0 text-sm font-black text-[#314259]">Volume de vendas por hora</h2>
                  <div className="mt-5 flex h-[122px] items-end gap-3 overflow-x-auto pr-3 max-[900px]:gap-2" aria-label="Grafico de volume de vendas por hora">
                    {dashboard.vendas_por_hora.map((sale) => (
                      <div className="flex h-full w-7 shrink-0 flex-col items-center justify-end gap-2 text-[9px] font-extrabold text-[#a1afc0]" key={sale.hora}>
                        <div
                          className={`min-h-[18px] w-full rounded-[5px] ${
                            sale.destaque ? 'bg-[#ffcc00]' : 'bg-[#dde4ee]'
                          }`}
                          title={`${sale.hora}: ${sale.quantidade} vendas`}
                          style={{ height: `${Math.max((sale.quantidade / maxSalesByHour) * 88, 10)}%` }}
                        />
                        <span>{sale.hora}</span>
                      </div>
                    ))}
                  </div>
                  <div className="ml-1.5 flex gap-7 text-[10px] font-bold text-[#9caabd]">
                    <span>Pico do almoco: 13h</span>
                    <span>Pico da janta: 19h</span>
                  </div>
                </article>

                <article className="min-h-[304px] rounded-md border border-[#d8e1ed] bg-white p-4">
                  <h2 className="m-0 text-sm font-black text-[#314259]">Top 10 produtos mais vendidos</h2>
                  <div className="overflow-x-auto">
                    <table className="mt-3.5 w-full min-w-[620px] border-collapse text-[11px]">
                      <thead>
                        <tr>
                          <th className="border-b border-[#edf1f6] py-3 text-left font-black text-[#9badc1]">Rank</th>
                          <th className="border-b border-[#edf1f6] py-3 text-left font-black text-[#9badc1]">Produto</th>
                          <th className="border-b border-[#edf1f6] py-3 text-left font-black text-[#9badc1]">Qtd.</th>
                          <th className="border-b border-[#edf1f6] py-3 text-left font-black text-[#9badc1]">Receita</th>
                          <th className="border-b border-[#edf1f6] py-3 text-left font-black text-[#9badc1]">Variacao</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboard.top_produtos.map((product) => (
                          <tr key={product.produto_id}>
                            <td className="w-16 border-b border-[#edf1f6] py-3 font-black text-[#8a6f00]">
                              #{String(product.rank).padStart(2, '0')}
                            </td>
                            <td className="border-b border-[#edf1f6] py-3 font-black text-[#243349]">{product.nome}</td>
                            <td className="border-b border-[#edf1f6] py-3 font-bold text-[#53657a]">{product.quantidade} un.</td>
                            <td className="border-b border-[#edf1f6] py-3 font-bold text-[#53657a]">{formatCurrency(product.receita)}</td>
                            <td
                              className={`border-b border-[#edf1f6] py-3 font-black ${
                                variationTone(product.variacao) === 'negative' ? 'text-[#d71920]' : 'text-[#008768]'
                              }`}
                            >
                              {formatPercentage(product.variacao)}
                            </td>
                          </tr>
                        ))}
                        {!dashboard.top_produtos.length && (
                          <tr>
                            <td colSpan={5} className="h-20 border-b border-[#edf1f6] text-center font-bold text-[#53657a]">
                              Nenhum produto vendido no periodo.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </article>

                <div className="flex items-center gap-9 pt-4 max-[900px]:gap-3">
                  <button className="h-10 min-w-32 rounded-lg bg-[#ef000c] px-5 text-[11px] font-black uppercase text-white" type="button">
                    Exportar relatorio
                  </button>
                  <button className="h-10 min-w-32 rounded-lg bg-[#ef000c] px-5 text-[11px] font-black uppercase text-white" type="button">
                    Filtrar
                  </button>
                </div>
              </section>

              <aside className="grid gap-3" aria-label="Resumo lateral">
                <article className="min-h-[204px] rounded-md border border-[#d8e1ed] bg-white p-4">
                  <h2 className="m-0 text-sm font-black text-[#314259]">Mix de produtos</h2>
                  <div
                    className="relative mx-auto mt-4 mb-3 grid h-[104px] w-[104px] place-items-center content-center rounded-full after:absolute after:h-[60px] after:w-[60px] after:rounded-full after:bg-[#f8fbff]"
                    aria-label={`${formatPercentage(mixPrincipal)} do produto principal`}
                    style={
                      {
                        background: `conic-gradient(#ffcc00 0 ${Number(mixPrincipal)}%, #ffffff ${Number(mixPrincipal)}% 100%)`,
                      } as CSSProperties
                    }
                  >
                    <span className="relative z-10 text-base font-black text-[#1d2b40]">{formatPercentage(mixPrincipal).replace('+', '')}</span>
                    <small className="relative z-10 text-[8px] font-extrabold text-[#9badc1]">principal</small>
                  </div>

                  <div className="grid gap-1.5">
                    {dashboard.mix_produtos.map((item, index) => (
                      <div className="flex items-center justify-between text-[9px] font-extrabold text-[#7d8ea4]" key={item.nome}>
                        <span className="flex items-center gap-2">
                          <i className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: mixColors[index] ?? '#9ba9b8' }} />
                          {item.nome}
                        </span>
                        <strong className="text-[#1e2d42]">{formatPercentage(item.percentual).replace('+', '')}</strong>
                      </div>
                    ))}
                    {!dashboard.mix_produtos.length && <span className="text-[9px] font-extrabold text-[#9badc1]">Sem vendas registradas</span>}
                  </div>
                </article>

                <article className="min-h-[104px] rounded-md bg-[#ffcc00] p-4">
                  <span className="block text-[10px] font-black uppercase text-[#796300]">Vendas totais</span>
                  <strong className="my-2 block text-[22px] font-black text-black">{formatCurrency(dashboard.vendas_totais)}</strong>
                  <div className="flex items-center justify-between text-[9px] font-extrabold text-[#796300]">
                    <small>{dashboard.pedidos_registrados} pedidos registrados</small>
                    <b className="rounded bg-black px-2.5 py-1.5 text-[8px] uppercase text-white">Live</b>
                  </div>
                </article>

                <article className="min-h-[188px] rounded-md bg-[#c91521] p-4 text-white">
                  <span className="block w-36 rounded bg-white/20 px-2.5 py-1.5 text-[10px] font-black uppercase">
                    Destaque do portfolio
                  </span>
                  <h2 className="mt-3.5 mb-1 text-base font-black text-white">{dashboard.destaque?.nome ?? 'Sem vendas'}</h2>
                  <p className="mb-6 text-[10px] font-bold text-white/70">Produto com maior receita registrada.</p>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <small className="mb-2 block text-[9px] font-extrabold text-white/70">Margem de ganho</small>
                      <strong className="text-[26px] font-black">{formatPercentage(dashboard.destaque?.margem_ganho ?? 0).replace('+', '')}</strong>
                    </div>
                    <div>
                      <small className="mb-2 block text-[9px] font-extrabold text-white/70">Margem liquida</small>
                      <strong className="text-[26px] font-black">{formatPercentage(dashboard.destaque?.margem_liquida ?? 0).replace('+', '')}</strong>
                    </div>
                  </div>
                </article>
              </aside>
            </div>
          </div>
        </section>
      </main>

    </>
  )
}
