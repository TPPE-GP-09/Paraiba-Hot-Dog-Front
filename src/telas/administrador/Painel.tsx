import { useState } from 'react'
import CabecalhoAdmin from '../../componentes/administrador/BarraDeNavegacaoAdmin'
import ModalConfirmacaoSaida from '../../componentes/administrador/painel/ModalConfirmacaoSaida'
import OpcoesPainel from '../../componentes/administrador/painel/OpcoesPainel'
import SeletorUnidade from '../../componentes/administrador/painel/SeletorUnidade'

const unidades = [
  'Samambaia Norte',
  'Águas Claras — Araucárias',
  'Águas Claras — Jequitibá',
] as const

export default function Painel() {
  const [unidadeSelecionada, setUnidadeSelecionada] = useState<string>(unidades[0])
  const [modalSairAberto, setModalSairAberto] = useState(false)

  function abrirModalSair() {
    setModalSairAberto(true)
  }

  function fecharModalSair() {
    setModalSairAberto(false)
  }

  function confirmarSaida() {
    setModalSairAberto(false)
    window.location.href = '/login'
  }

  return (
    <div className="flex min-h-screen flex-col bg-branco">
      <CabecalhoAdmin />

      <main className="flex flex-1 flex-col items-center px-4 py-10 sm:py-14">
        <div className="flex w-full max-w-2xl flex-1 flex-col items-center">
          <h1 className="text-center font-barlow-condensed text-3xl font-semibold text-preto-v1 sm:text-5xl">
            Olá, Administrador
          </h1>

          <div className="mt-8 w-full">
            <SeletorUnidade
              opcoes={unidades}
              valor={unidadeSelecionada}
              onChange={setUnidadeSelecionada}
            />
          </div>

          <OpcoesPainel />
        </div>
      </main>

    <footer className="shrink-0 px-4 pb-8">
        <div className="mx-auto w-full max-w-2xl">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-cinza-base/60 to-transparent" />

            <div className="pt-6">
            <button
                type="button"
                onClick={abrirModalSair}
                className="mx-auto flex items-center gap-1 font-barlow text-sm text-cinza-base transition-colors hover:text-preto-v1"
            >
                <span aria-hidden>←</span>
                Sair
            </button>
            </div>
        </div>
    </footer>
      <ModalConfirmacaoSaida
        aberto={modalSairAberto}
        onConfirmar={confirmarSaida}
        onCancelar={fecharModalSair}
      />
    </div>
  )
}
