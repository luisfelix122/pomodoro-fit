import React, { useState } from 'react'
import { ZonaCuerpo } from '../../dominio/modelos/ZonaCuerpo'
import { CalculadoraAgua } from '../../dominio/servicios/CalculadoraAgua'

interface PropiedadesModalIniciarDia {
  pesoUsuarioKg: number
  zonaActual: ZonaCuerpo
  alConfirmar: (horasTrabajo: number, vasosPrevios: number) => void
  alCerrar: () => void
}

export const ModalIniciarDia: React.FC<PropiedadesModalIniciarDia> = ({
  pesoUsuarioKg,
  alConfirmar,
  alCerrar,
}) => {
  const [horas, setHoras] = useState(8)
  const [vasosPrevios, setVasosPrevios] = useState(0)

  const metaDiariaTotal = CalculadoraAgua.calcularMetaDiaria(pesoUsuarioKg)
  const distribucion = CalculadoraAgua.distribuirPorJornada(metaDiariaTotal, horas, 16)

  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault()
    alConfirmar(horas, vasosPrevios)
  }

  return (
    <div className="capa-modal" role="dialog" aria-modal="true" aria-labelledby="titulo-iniciar-dia">
      <div className="contenido-modal">
        <h2 id="titulo-iniciar-dia" className="panel-titulo">
          ☀️ Iniciar Jornada de Trabajo
        </h2>

        <p style={{ color: 'var(--color-texto-secundario)', fontSize: '0.9rem' }}>
          Configurá tus horas de trabajo de hoy para que organicemos tu hidratación y descansos activos.
        </p>

        <form onSubmit={manejarEnvio} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Horas de trabajo */}
          <div className="campo-formulario">
            <label className="etiqueta-campo" htmlFor="horas-trabajo">
              ¿Cuántas horas vas a trabajar hoy?
            </label>
            <input
              id="horas-trabajo"
              type="number"
              min="1"
              max="16"
              value={horas}
              onChange={(e) => setHoras(Math.max(1, Math.min(16, Number(e.target.value))))}
              className="input-texto"
              required
            />
          </div>

          {/* Vasos ya tomados */}
          <div className="campo-formulario">
            <label className="etiqueta-campo" htmlFor="vasos-previos">
              ¿Ya tomaste agua antes de iniciar? (Número de vasos de 250ml)
            </label>
            <input
              id="vasos-previos"
              type="number"
              min="0"
              max="15"
              value={vasosPrevios}
              onChange={(e) => setVasosPrevios(Math.max(0, Number(e.target.value)))}
              className="input-texto"
            />
            {vasosPrevios > 0 && (
              <span style={{ fontSize: '0.8rem', color: 'var(--color-agua)' }}>
                Equivale a {vasosPrevios * 250} ml ya contabilizados.
              </span>
            )}
          </div>

          {/* Resumen Calculado */}
          <div
            style={{
              backgroundColor: 'var(--color-superficie-elevada)',
              padding: '1rem',
              borderRadius: 'var(--radio-md)',
              border: '1px solid var(--color-borde)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              fontSize: '0.875rem',
            }}
          >
            <div>Meta total del día: <strong>{metaDiariaTotal} ml</strong></div>
            <div style={{ color: '#38bdf8' }}>
              Agua durante tus {horas}h de trabajo: <strong>{distribucion.aguaJornadaMl} ml</strong>
            </div>
            <div style={{ color: 'var(--color-texto-secundario)' }}>
              Agua en tu tiempo libre (fuera de jornada): <strong>{distribucion.aguaFueraJornadaMl} ml</strong>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" className="boton-secundario" onClick={alCerrar}>
              Cancelar
            </button>
            <button type="submit" className="boton-principal">
              ¡Comenzar Jornada!
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
