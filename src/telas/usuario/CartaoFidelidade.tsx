import { useState, type FormEvent } from 'react'
import BarraDeNavegacao from '../../componentes/globais/BarraDeNavegacao'
import Rodape from '../../componentes/globais/Rodape'
import { consultarFidelidade } from '../../servicos/fidelidadeApi'

type ResultadoFidelidade =
  | {
      status: 'encontrado'
      nome: string
      pontos: number
      totalParaPremio: number
    }
  | {
      status: 'nao-encontrado'
    }
  | null

export default function CartaoFidelidade() {
  const [cadastro, setCadastro] = useState('')
  const [consultando, setConsultando] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [resultado, setResultado] = useState<ResultadoFidelidade>(null)

  async function handleConsultarFidelidade(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const cadastroNormalizado = cadastro.trim()

    if (!cadastroNormalizado) {
      setMensagem('Informe seu telefone ou e-mail para consultar sua fidelidade.')
      setResultado(null)
      return
    }

    setMensagem('')
    setConsultando(true)

    try {
      const fidelidade = await consultarFidelidade(cadastroNormalizado)

      if (!fidelidade) {
        setResultado({ status: 'nao-encontrado' })
        return
      }

      setResultado({
        status: 'encontrado',
        nome: fidelidade.nome,
        pontos: fidelidade.pontos,
        totalParaPremio: fidelidade.total_para_premio,
      })
    } catch (error) {
      console.error('Loyalty lookup error:', error)
      setMensagem('Nao foi possivel consultar sua fidelidade agora. Tente novamente em instantes.')
      setResultado(null)
    } finally {
      setConsultando(false)
    }
  }

  function atualizarCadastro(valor: string) {
    setCadastro(valor)
    setMensagem('')
    setResultado(null)
  }

  if (resultado?.status === 'encontrado') {
    const pontosExibidos = Math.min(resultado.pontos, resultado.totalParaPremio)
    const faltam = Math.max(resultado.totalParaPremio - pontosExibidos, 0)
    const carimbos = Array.from({ length: resultado.totalParaPremio }, (_, index) => index < pontosExibidos)

    return (
      <>
        <BarraDeNavegacao />

        <main className="min-h-[calc(100vh-4rem)] bg-preto-v1 pt-16 text-branco">
          <section className="pagina-container flex min-h-[calc(100vh-4rem)] items-center justify-center py-16">
            <div className="w-full max-w-[34rem] text-center">
              <h1 className="font-barlow-condensed text-[clamp(4rem,10vw,6.75rem)] font-black uppercase leading-none text-branco">
                E ai, <span className="text-amarelo">{resultado.nome}!</span>
              </h1>

              <article className="mx-auto mt-7 w-full max-w-[27rem] rounded-xl bg-[#1c1c1c] px-10 py-8 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
                <h2 className="font-barlow-condensed text-4xl font-black uppercase text-branco">
                  {faltam > 0 ? (
                    <>
                      Faltam <span className="text-amarelo">{faltam} dogs</span>
                    </>
                  ) : (
                    <span className="text-amarelo">Premio liberado!</span>
                  )}
                </h2>
                <p className="mt-3 font-barlow text-[15px] font-semibold text-branco/65">
                  Complete 10 e ganhe um Hot Dog gratis!
                </p>

                <div className="mx-auto mt-6 grid max-w-[17.5rem] grid-cols-5 gap-x-3 gap-y-2.5" aria-label={`${resultado.pontos} de ${resultado.totalParaPremio} carimbos`}>
                  {carimbos.map((preenchido, index) => (
                    <span
                      key={index}
                      className={`h-[18px] rounded-full border-[5px] ${
                        preenchido ? 'border-amarelo bg-[#d71920]' : 'border-[#555] bg-[#2b2b2b]'
                      }`}
                    />
                  ))}
                </div>
              </article>
            </div>
          </section>
        </main>

        <Rodape />
      </>
    )
  }

  return (
    <>
      <BarraDeNavegacao />

      <main className="min-h-[calc(100vh-4rem)] bg-preto-v1 pt-16 text-branco">
        <section className="pagina-container flex min-h-[calc(100vh-4rem)] items-center py-14 min-[640px]:py-20">
          <div className="w-full max-w-[39rem]">
            <h1 className="font-barlow-condensed text-[clamp(4rem,13vw,7.5rem)] font-black uppercase leading-[0.9] text-branco">
              Meus
              <br />
              <span className="text-amarelo">Pontos</span>
            </h1>

            <p className="mt-8 max-w-[32rem] font-barlow-condensed text-[clamp(1.25rem,4vw,1.75rem)] font-semibold leading-snug text-branco">
              Acumule pontos a cada pedido e ganhe um Hot Dog gratis ao completar 10 carimbos.
              Consulte seu saldo pelo telefone ou e-mail cadastrado.
            </p>

            <form onSubmit={handleConsultarFidelidade} className="mt-12 w-full max-w-[40rem]">
              <label htmlFor="cadastro-fidelidade" className="font-barlow text-xl font-bold text-branco">
                Acesse seu cadastro
              </label>

              <input
                id="cadastro-fidelidade"
                type="text"
                value={cadastro}
                onChange={(event) => atualizarCadastro(event.target.value)}
                placeholder="Digite seu telefone ou e-mail"
                disabled={consultando}
                className="mt-4 h-14 w-full rounded-lg border-2 border-branco/45 bg-branco/10 px-5 font-barlow text-xl font-semibold text-branco outline-none transition-colors placeholder:text-branco/55 focus:border-amarelo focus:bg-branco/15"
              />

              <button
                type="submit"
                disabled={consultando}
                className="mt-4 h-16 w-full rounded-full bg-branco px-8 font-barlow text-2xl font-bold text-preto-v1 transition-opacity hover:opacity-90 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {consultando ? 'Consultando...' : 'Consultar Fidelidade'}
              </button>

              {mensagem && (
                <p className="mt-4 font-barlow text-base font-semibold text-amarelo" role="status">
                  {mensagem}
                </p>
              )}

              {resultado?.status === 'nao-encontrado' && (
                <article className="mt-8 rounded-lg bg-[#1c1c1c] px-8 py-7 text-center shadow-[0_14px_34px_rgba(0,0,0,0.3)]">
                  <h2 className="font-barlow text-xl font-black text-branco">
                    Oxente, nao te achamos!
                  </h2>
                  <p className="mx-auto mt-3 max-w-[24rem] font-barlow text-base leading-snug text-branco/55">
                    Parece que voce ainda nao faz parte do nosso clube de fidelidade.
                  </p>
                  <p className="mx-auto mt-4 max-w-[28rem] font-barlow text-base leading-snug text-branco/55">
                    De uma passadinha na nossa unidade mais proxima e saboreie o dog mais arretado da cidade.
                    Seu cadastro e feito na hora!
                  </p>
                </article>
              )}
            </form>
          </div>
        </section>
      </main>

      <Rodape />
    </>
  )
}
