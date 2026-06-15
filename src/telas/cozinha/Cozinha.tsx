import { useEffect, useMemo, useState } from 'react'
import logoBranca from '../../imagens/logos/logo-branca.png'
import { atualizarStatusCozinha, cancelarPedido, listarCozinha, type CozinhaItem, type StatusCozinha } from '../../servicos/cozinhaApi'

type AbaCozinha = 'fila' | 'entregues'

type PedidoCozinha = {
  id: number
  hora: string
  mesa: string
  lote: number
  status: StatusCozinha
  itens: Array<{
    nome: string
    adicionais: string[]
    observacao?: string | null
    quantidade: number
  }>
}

const pedidosExemplo: PedidoCozinha[] = [
  {
    id: 234,
    hora: '21:57',
    mesa: 'Mesa 3',
    lote: 1,
    status: 'aberto',
    itens: [
      { nome: '1x Arretado', adicionais: ['Molho de Bacon', 'Molho de Ervas', 'Sem milho'], quantidade: 1 },
      { nome: '2x Tradicional', adicionais: ['Molho de Bacon', 'Molho de Ervas'], quantidade: 2 },
    ],
  },
  {
    id: 234,
    hora: '21:57',
    mesa: 'Mesa 3',
    lote: 2,
    status: 'preparando',
    itens: [
      { nome: '1x Arretado', adicionais: ['Molho de Bacon', 'Molho de Ervas', 'Sem milho'], quantidade: 1 },
      { nome: '2x Tradicional', adicionais: ['Molho de Bacon', 'Molho de Ervas'], quantidade: 2 },
    ],
  },
  {
    id: 234,
    hora: '21:58',
    mesa: 'Mesa 3',
    lote: 3,
    status: 'aberto',
    itens: [
      { nome: '1x Arretado', adicionais: ['Molho de Bacon', 'Molho de Ervas', 'Sem milho'], quantidade: 1 },
      { nome: '2x Tradicional', adicionais: ['Molho de Bacon', 'Molho de Ervas'], quantidade: 2 },
      { nome: '2x Smash', adicionais: ['Molho de Bacon', 'Molho de Ervas'], quantidade: 2 },
      { nome: '2x Coca Cola 500ml', adicionais: [], quantidade: 2 },
      { nome: '2x Batata', adicionais: [], quantidade: 2 },
    ],
  },
  {
    id: 236,
    hora: '21:39',
    mesa: 'Mesa 3',
    lote: 1,
    status: 'aberto',
    itens: [
      { nome: '1x Arretado', adicionais: ['Molho de Bacon', 'Molho de Ervas', 'Sem milho'], quantidade: 1 },
      { nome: '2x Tradicional', adicionais: ['Molho de Bacon', 'Molho de Ervas'], quantidade: 2 },
      { nome: '2x Coca Cola 500ml', adicionais: [], quantidade: 2 },
    ],
  },
]

const entreguesExemplo: PedidoCozinha[] = [
  {
    id: 228,
    hora: '20:45',
    mesa: 'Mesa 8',
    lote: 1,
    status: 'entregue',
    itens: [
      { nome: '2x Smash', adicionais: ['Ponto de Ervas'], quantidade: 2 },
      { nome: '1x Coca Cola 500ml', adicionais: [], quantidade: 1 },
    ],
  },
  {
    id: 229,
    hora: '20:50',
    mesa: 'Mesa 1',
    lote: 1,
    status: 'entregue',
    itens: [
      { nome: '1x Arretado', adicionais: ['Molho de Bacon', 'Sem milho'], quantidade: 1 },
      { nome: '1x Batata', adicionais: [], quantidade: 1 },
    ],
  },
]

function agruparItens(items: CozinhaItem[]) {
  const grupos = new Map<string, PedidoCozinha>()

  items.forEach((item) => {
    const key = `${item.pedido_id}-${item.lote}`
    const pedido = grupos.get(key) ?? {
      id: item.pedido_id,
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      mesa: item.nome_comanda,
      lote: item.lote,
      status: item.status,
      itens: [],
    }

    pedido.status = item.status === 'preparando' ? 'preparando' : pedido.status
    pedido.itens.push({
      nome: `${item.quantidade}x ${item.produto_variacao_nome ?? item.produto_nome}`,
      adicionais: item.adicionais.map((adicional) => adicional.nome),
      observacao: item.observacao,
      quantidade: item.quantidade,
    })
    grupos.set(key, pedido)
  })

  return Array.from(grupos.values())
}

function textoBotaoStatus(status: StatusCozinha) {
  return status === 'preparando' ? 'Preparando' : 'Preparar'
}

function emojiProduto(nome: string) {
  const normalized = nome.toLowerCase()

  if (normalized.includes('smash')) return '🍔'
  if (normalized.includes('batata')) return '🍟'
  if (normalized.includes('coca') || normalized.includes('refri')) return '🥤'

  return '🌭'
}

function CancelarModal({
  pedido,
  onFechar,
  onConfirmar,
}: {
  pedido: PedidoCozinha
  onFechar: () => void
  onConfirmar: (motivo: string) => void
}) {
  const [motivo, setMotivo] = useState('')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4" onClick={onFechar}>
      <div
        className="w-full max-w-sm overflow-hidden rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="bg-preto-v1 px-6 pb-5 pt-6">
          <h2 className="font-barlow-condensed text-xl font-black uppercase tracking-widest text-branco">
            Cancelar Pedido #{pedido.id}
          </h2>
          <div className="mt-4 h-[2px] w-full bg-[#ff2b2b]" />
        </header>

        <div className="bg-branco px-6 py-5">
          <label className="mb-2 block text-sm font-bold tracking-wide text-preto-v1">
            Motivo do cancelamento:
          </label>
          <textarea
            className="w-full resize-none rounded border border-[#ddd] p-3 text-sm text-preto-v1 placeholder-[#bbb] focus:border-[#ff2b2b] focus:outline-none"
            placeholder="Descreva o motivo"
            rows={4}
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3 bg-branco px-6 pb-6">
          <button
            className="h-12 rounded border-2 border-[#ccc] font-barlow-condensed text-sm font-black uppercase tracking-wider text-[#555] transition-colors hover:bg-[#f5f5f5]"
            onClick={onFechar}
            type="button"
          >
            Voltar
          </button>
          <button
            className="h-12 rounded bg-[#ff2b2b] font-barlow-condensed text-sm font-black uppercase tracking-wider text-branco transition-colors hover:bg-[#e02020]"
            onClick={() => onConfirmar(motivo)}
            type="button"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}

function PedidoCard({
  disabled = false,
  onCancelar,
  onEntregar,
  onPreparar,
  pedido,
}: {
  disabled?: boolean
  onCancelar?: (pedido: PedidoCozinha) => void
  onEntregar?: (pedido: PedidoCozinha) => void
  onPreparar?: (pedido: PedidoCozinha) => void
  pedido: PedidoCozinha
}) {
  const preparando = pedido.status === 'preparando'
  const entregue = pedido.status === 'entregue'

  return (
    <article
      className={`w-full overflow-hidden rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] sm:w-[300px] ${
        preparando
          ? 'border-2 border-amarelo'
          : entregue
            ? 'border border-[#e0e0e0] opacity-55'
            : 'border border-[#e0e0e0]'
      } bg-[#f7f7f7]`}
    >
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <span className="font-barlow-condensed text-sm font-black tracking-wider text-preto-v1">
          Pedido #{pedido.id}
        </span>
        <time className="font-barlow-condensed text-sm font-black tracking-wider text-amarelo">
          {pedido.hora}
        </time>
      </div>

      <div className="mx-4 mb-4 h-px bg-[#e8e8e8]" />

      <div className="min-h-[180px] px-4 pb-4">
        <p className="mb-3 text-xs font-bold tracking-widest uppercase text-[#999]">{pedido.mesa}</p>
        <div className="space-y-4">
          {pedido.itens.map((item, index) => (
            <section key={`${item.nome}-${index}`}>
              <h3 className="font-barlow-condensed text-[15px] font-black uppercase leading-none tracking-wider text-preto-v1">
                {item.nome} <span aria-hidden>{emojiProduto(item.nome)}</span>
              </h3>
              {!!item.adicionais.length && (
                <ul className="mt-1.5 space-y-0.5 text-[11px] font-semibold leading-tight tracking-wide text-[#888]">
                  {item.adicionais.map((adicional) => (
                    <li key={adicional}>• {adicional}</li>
                  ))}
                </ul>
              )}
              {item.observacao && (
                <p className="mt-1.5 text-[11px] font-bold leading-tight tracking-wide text-[#d71920]">
                  {item.observacao}
                </p>
              )}
            </section>
          ))}
        </div>
      </div>

      <div className="mx-4 h-px bg-[#e8e8e8]" />

      {entregue ? (
        <div className="px-4 py-3">
          <div className="h-10 rounded bg-[#ebebeb] text-center font-barlow-condensed text-xs font-black uppercase leading-10 tracking-wider text-[#aaa]">
            Entregue às {pedido.hora}
          </div>
        </div>
      ) : (
        <footer className="grid grid-cols-3 gap-2 px-4 py-3">
          <button
            className={`h-10 min-w-0 overflow-hidden rounded font-barlow-condensed text-[9px] font-black uppercase leading-none tracking-wide transition-colors ${
              preparando
                ? 'bg-amarelo text-preto-v1'
                : 'border border-amarelo text-amarelo hover:bg-amarelo/10'
            } disabled:cursor-not-allowed disabled:opacity-40`}
            disabled={disabled || preparando}
            onClick={() => onPreparar?.(pedido)}
            type="button"
          >
            {textoBotaoStatus(pedido.status)}
          </button>
          <button
            className="h-10 min-w-0 overflow-hidden rounded border border-[#20c86f] font-barlow-condensed text-[11px] font-black uppercase leading-none tracking-wide text-[#20c86f] transition-colors hover:bg-[#20c86f]/10 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={disabled}
            onClick={() => onEntregar?.(pedido)}
            type="button"
          >
            Entregue
          </button>
          <button
            className="h-10 min-w-0 overflow-hidden rounded border border-[#ff2b2b] font-barlow-condensed text-[11px] font-black uppercase leading-none tracking-wide text-[#ff2b2b] transition-colors hover:bg-[#ff2b2b]/10 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={disabled}
            onClick={() => onCancelar?.(pedido)}
            type="button"
          >
            Cancelar
          </button>
        </footer>
      )}
    </article>
  )
}

export default function Cozinha() {
  const [aba, setAba] = useState<AbaCozinha>('fila')
  const [entregues, setEntregues] = useState<PedidoCozinha[]>(entreguesExemplo)
  const [erro, setErro] = useState('')
  const [fila, setFila] = useState<PedidoCozinha[]>(pedidosExemplo)
  const [loading, setLoading] = useState(true)
  const [pedidoCancelando, setPedidoCancelando] = useState<PedidoCozinha | null>(null)
  const [updatingKey, setUpdatingKey] = useState<string | null>(null)

  async function carregarFila() {
    try {
      setLoading(true)
      setErro('')
      const items = await listarCozinha()
      setFila(items.length ? agruparItens(items) : pedidosExemplo)
    } catch {
      setErro('Nao foi possivel carregar a fila da API. Exibindo pedidos de exemplo.')
      setFila(pedidosExemplo)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void carregarFila()
    }, 0)

    return () => window.clearTimeout(timeout)
  }, [])

  const pedidosVisiveis = useMemo(() => (aba === 'fila' ? fila : entregues), [aba, entregues, fila])

  function atualizarPedidoLocal(pedido: PedidoCozinha, status: 'preparando' | 'entregue') {
    if (status === 'entregue') {
      setFila((atual) => atual.filter((item) => !(item.id === pedido.id && item.lote === pedido.lote)))
      setEntregues((atual) => [{ ...pedido, status: 'entregue' }, ...atual])
      return
    }

    setFila((atual) =>
      atual.map((item) => (item.id === pedido.id && item.lote === pedido.lote ? { ...item, status } : item)),
    )
  }

  async function mudarStatus(pedido: PedidoCozinha, status: 'preparando' | 'entregue') {
    const key = `${pedido.id}-${pedido.lote}`
    setUpdatingKey(key)

    try {
      await atualizarStatusCozinha(pedido.id, pedido.lote, status)

      atualizarPedidoLocal(pedido, status)
    } catch {
      setErro('Nao foi possivel atualizar o pedido agora.')
      atualizarPedidoLocal(pedido, status)
    } finally {
      setUpdatingKey(null)
    }
  }

  return (
    <main className="min-h-screen bg-branco text-preto-v1">
      {pedidoCancelando && (
        <CancelarModal
          pedido={pedidoCancelando}
          onFechar={() => setPedidoCancelando(null)}
          onConfirmar={async (motivo) => {
            if (!pedidoCancelando) return
            try {
              await cancelarPedido(pedidoCancelando.id, motivo)
            } catch {
              setErro('Nao foi possivel cancelar o pedido agora.')
            }
            setFila((atual) =>
              atual.filter((item) => !(item.id === pedidoCancelando.id && item.lote === pedidoCancelando.lote)),
            )
            setPedidoCancelando(null)
          }}
        />
      )}

      <header className="bg-preto-v1">
        <div className="flex h-16 items-center gap-4 px-4 sm:h-[108px] sm:gap-8 sm:px-9">
          <a href="/" aria-label="Paraiba Hot Dog - inicio" className="shrink-0">
            <img src={logoBranca} alt="Paraiba Hot Dog" className="h-14 w-auto object-contain sm:h-[108px]" />
          </a>

          <nav className="flex flex-1 items-center justify-center gap-5 font-barlow-condensed text-lg font-black uppercase sm:gap-12 sm:text-3xl">
            <button
              className={`transition-colors ${aba === 'fila' ? 'text-amarelo' : 'text-branco/45 hover:text-branco'}`}
              onClick={() => setAba('fila')}
              type="button"
            >
              Fila de pedidos
            </button>
            <button
              className={`transition-colors ${aba === 'entregues' ? 'text-amarelo' : 'text-branco/45 hover:text-branco'}`}
              onClick={() => setAba('entregues')}
              type="button"
            >
              Entregues
            </button>
          </nav>
        </div>
      </header>

      <section className="min-h-[calc(100vh-4rem)] bg-branco px-4 py-6 sm:min-h-[calc(100vh-6.75rem)] sm:px-8 sm:py-10 lg:px-16 lg:py-12">
        {(loading || erro) && (
          <p className="mb-5 min-h-6 font-barlow text-xs font-bold text-[#777]">
            {loading ? 'Carregando pedidos...' : erro}
          </p>
        )}

        <div className="flex flex-wrap items-start gap-4 sm:gap-6">
          {pedidosVisiveis.map((pedido) => (
            <PedidoCard
              disabled={updatingKey === `${pedido.id}-${pedido.lote}`}
              key={`${pedido.id}-${pedido.lote}-${pedido.hora}`}
              onCancelar={(item) => setPedidoCancelando(item)}
              onEntregar={(item) => mudarStatus(item, 'entregue')}
              onPreparar={(item) => mudarStatus(item, 'preparando')}
              pedido={pedido}
            />
          ))}
        </div>
      </section>
    </main>
  )
}
