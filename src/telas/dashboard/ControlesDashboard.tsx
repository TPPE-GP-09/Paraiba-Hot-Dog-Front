type ControlesDashboardProps = {
  ano: string
  anoAtual: number
  exportando: boolean
  filtrando: boolean
  onAnoChange: (ano: string) => void
  onExportarPdf: () => void
  onFiltrar: () => void
}

export default function ControlesDashboard({
  ano,
  anoAtual,
  exportando,
  filtrando,
  onAnoChange,
  onExportarPdf,
  onFiltrar,
}: ControlesDashboardProps) {
  return (
    <div className="flex flex-wrap items-end gap-9 pt-4 max-[900px]:gap-3">
      <label className="grid gap-1.5 text-[10px] font-black uppercase text-[#7d8ea4]">
        Ano
        <input
          className="h-10 w-28 rounded-lg border border-[#d8e1ed] bg-white px-3 text-sm font-black text-[#243247] outline-none focus:border-[#1597ff]"
          inputMode="numeric"
          max={anoAtual}
          min="2000"
          onChange={(event) => onAnoChange(event.target.value)}
          placeholder={String(anoAtual)}
          type="number"
          value={ano}
        />
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
