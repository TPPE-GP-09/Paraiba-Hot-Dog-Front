const MESES = [
  { value: '1', label: 'Janeiro' },
  { value: '2', label: 'Fevereiro' },
  { value: '3', label: 'Março' },
  { value: '4', label: 'Abril' },
  { value: '5', label: 'Maio' },
  { value: '6', label: 'Junho' },
  { value: '7', label: 'Julho' },
  { value: '8', label: 'Agosto' },
  { value: '9', label: 'Setembro' },
  { value: '10', label: 'Outubro' },
  { value: '11', label: 'Novembro' },
  { value: '12', label: 'Dezembro' },
]

type ControlesDashboardProps = {
  ano: string
  anoAtual: number
  exportando: boolean
  fechamentoMes: boolean
  filtrando: boolean
  mes: string
  onAnoChange: (ano: string) => void
  onExportarPdf: () => void
  onFechamentoMesChange: (v: boolean) => void
  onFiltrar: () => void
  onMesChange: (mes: string) => void
}

export default function ControlesDashboard({
  ano,
  anoAtual,
  exportando,
  fechamentoMes,
  filtrando,
  mes,
  onAnoChange,
  onExportarPdf,
  onFechamentoMesChange,
  onFiltrar,
  onMesChange,
}: ControlesDashboardProps) {
  return (
    <div className="flex flex-wrap items-end gap-4 pt-4 max-[900px]:gap-3">
      <button
        className={`h-10 min-w-40 rounded-lg border-2 px-4 text-[11px] font-black uppercase transition-colors ${
          fechamentoMes
            ? 'border-[#1597ff] bg-[#1597ff] text-white'
            : 'border-[#d8e1ed] bg-white text-[#243247] hover:border-[#1597ff]'
        }`}
        onClick={() => onFechamentoMesChange(!fechamentoMes)}
        type="button"
      >
        {fechamentoMes ? '✓ Fechamento do mês' : 'Fechamento do mês'}
      </button>

      <label className="grid gap-1.5 text-[10px] font-black uppercase text-[#7d8ea4]">
        Ano
        <input
          className="h-10 w-28 rounded-lg border border-[#d8e1ed] bg-white px-3 text-sm font-black text-[#243247] outline-none focus:border-[#1597ff] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={fechamentoMes}
          inputMode="numeric"
          max={anoAtual}
          min="2000"
          onChange={(e) => onAnoChange(e.target.value)}
          placeholder={String(anoAtual)}
          type="number"
          value={ano}
        />
      </label>

      <label className="grid gap-1.5 text-[10px] font-black uppercase text-[#7d8ea4]">
        Mês
        <select
          className="h-10 w-36 rounded-lg border border-[#d8e1ed] bg-white px-3 text-sm font-black text-[#243247] outline-none focus:border-[#1597ff] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={fechamentoMes}
          onChange={(e) => onMesChange(e.target.value)}
          value={mes}
        >
          <option value="">Todos</option>
          {MESES.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </label>

      <button
        className="h-10 min-w-32 rounded-lg bg-[#ef000c] px-5 text-[11px] font-black uppercase text-white disabled:cursor-not-allowed disabled:opacity-60"
        disabled={exportando}
        onClick={onExportarPdf}
        type="button"
      >
        {exportando ? 'Baixando...' : 'Exportar PDF'}
      </button>

      <button
        className="h-10 min-w-32 rounded-lg bg-[#ef000c] px-5 text-[11px] font-black uppercase text-white disabled:cursor-not-allowed disabled:opacity-60"
        disabled={filtrando}
        onClick={onFiltrar}
        type="button"
      >
        {filtrando ? 'Filtrando...' : 'Filtrar'}
      </button>
    </div>
  )
}
