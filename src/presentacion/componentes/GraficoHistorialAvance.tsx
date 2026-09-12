import React from 'react'
import { RegistroPeso } from '../../dominio/modelos/RegistroPeso'
import { RegistroDia } from '../../dominio/modelos/RegistroDia'

interface PropiedadesGraficoAvance {
  historialPesos: RegistroPeso[]
  historialDias: Record<string, RegistroDia>
  alAbrirModalPeso: () => void
}

export const GraficoHistorialAvance: React.FC<PropiedadesGraficoAvance> = ({
  historialPesos,
  historialDias,
  alAbrirModalPeso,
}) => {
  // Ordenar pesos por fecha
  const pesosOrdenados = [...historialPesos].sort(
    (a, b) => new Date(a.fechaIso).getTime() - new Date(b.fechaIso).getTime()
  )

  const diasArray = Object.values(historialDias).sort(
    (a, b) => new Date(b.fechaIso).getTime() - new Date(a.fechaIso).getTime()
  )

  // Dimensiones del gráfico SVG
  const anchoTotal = 600
  const altoTotal = 220
  const margen = { superior: 20, derecho: 30, inferior: 35, izquierdo: 50 }
  const anchoGrafico = anchoTotal - margen.izquierdo - margen.derecho
  const altoGrafico = altoTotal - margen.superior - margen.inferior

  // Cálculos de escalas
  const valoresPeso = pesosOrdenados.map((p) => p.pesoKg)
  const pesoMin = valoresPeso.length > 0 ? Math.floor(Math.min(...valoresPeso) - 2) : 50
  const pesoMax = valoresPeso.length > 0 ? Math.ceil(Math.max(...valoresPeso) + 2) : 90
  const rangoPeso = Math.max(1, pesoMax - pesoMin)

  const calcularX = (indice: number, total: number): number => {
    if (total <= 1) return margen.izquierdo + anchoGrafico / 2
    return margen.izquierdo + (indice / (total - 1)) * anchoGrafico
  }

  const calcularY = (peso: number): number => {
    return margen.superior + altoGrafico - ((peso - pesoMin) / rangoPeso) * altoGrafico
  }

  // Generar trazo SVG
  const puntosCoord = pesosOrdenados.map((p, idx) => ({
    x: calcularX(idx, pesosOrdenados.length),
    y: calcularY(p.pesoKg),
    peso: p.pesoKg,
    fecha: p.fechaIso,
    nota: p.nota,
  }))

  const dPath = puntosCoord.reduce(
    (acum, p, idx) => `${acum} ${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`,
    ''
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Sección Gráfico de Peso */}
      <section className="panel-superficie">
        <div className="panel-titulo">
          <span>Evolución Histórica de Peso (kg)</span>
          <button
            className="boton-secundario"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
            onClick={alAbrirModalPeso}
          >
            + Registrar Peso
          </button>
        </div>

        {pesosOrdenados.length === 0 ? (
          <p style={{ color: 'var(--color-texto-secundario)', textAlign: 'center', padding: '2rem 0' }}>
            Aún no hay registros de peso. Presioná &quot;Registrar Peso&quot; para comenzar tu gráfico.
          </p>
        ) : (
          <div className="contenedor-grafico">
            <svg
              className="svg-grafico"
              viewBox={`0 0 ${anchoTotal} ${altoTotal}`}
              preserveAspectRatio="xMidYMid meet"
              role="img"
              aria-label="Gráfico de evolución de peso a lo largo del tiempo"
            >
              {/* Líneas de guía horizontales */}
              {[0, 0.5, 1].map((fraccion, idx) => {
                const y = margen.superior + altoGrafico * fraccion
                const valorPesoGuia = Math.round(pesoMax - fraccion * rangoPeso)
                return (
                  <g key={idx}>
                    <line
                      x1={margen.izquierdo}
                      y1={y}
                      x2={margen.izquierdo + anchoGrafico}
                      y2={y}
                      className="eje-linea"
                      strokeDasharray="4"
                    />
                    <text x={margen.izquierdo - 8} y={y + 4} textAnchor="end" className="texto-eje">
                      {valorPesoGuia} kg
                    </text>
                  </g>
                )
              })}

              {/* Trazo de línea del peso */}
              {puntosCoord.length > 1 && <path d={dPath} className="linea-trazo-peso" />}

              {/* Puntos de datos */}
              {puntosCoord.map((pt, idx) => (
                <g key={idx}>
                  <circle cx={pt.x} cy={pt.y} r={5} className="punto-peso">
                    <title>{`${pt.fecha}: ${pt.peso} kg ${pt.nota ? `(${pt.nota})` : ''}`}</title>
                  </circle>
                  <text
                    x={pt.x}
                    y={pt.y - 10}
                    textAnchor="middle"
                    className="texto-eje"
                    style={{ fill: 'var(--color-texto-principal)', fontWeight: 600 }}
                  >
                    {pt.peso}
                  </text>
                  {/* Fecha abajo */}
                  <text
                    x={pt.x}
                    y={margen.superior + altoGrafico + 20}
                    textAnchor="middle"
                    className="texto-eje"
                  >
                    {pt.fecha.slice(5)}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        )}
      </section>

      {/* Historial de Días / Hábitos */}
      <section className="panel-superficie">
        <h3 className="panel-titulo">Historial de Jornadas e Hidratación</h3>
        {diasArray.length === 0 ? (
          <p style={{ color: 'var(--color-texto-secundario)', fontSize: '0.9rem' }}>
            Cuando inicies tu día o completes pomodoros, quedará el registro histórico acá.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {diasArray.map((dia) => {
              const metaTotal = dia.metaAguaJornadaMl + dia.metaAguaFueraJornadaMl
              const cumplioAgua = dia.consumoAguaMl >= metaTotal

              return (
                <div
                  key={dia.fechaIso}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.85rem 1rem',
                    backgroundColor: 'var(--color-superficie-elevada)',
                    borderRadius: 'var(--radio-md)',
                    border: '1px solid var(--color-borde)',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}
                >
                  <div>
                    <strong>{dia.fechaIso}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-texto-secundario)', marginTop: '0.2rem' }}>
                      Zona: <strong>{dia.zonaElegida}</strong> | Jornada: <strong>{dia.horasTrabajoEstimadas}h</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.85rem', textAlign: 'right' }}>
                      <div>Pomodoros: <strong>{dia.pomodorosCompletados}</strong></div>
                      <div style={{ color: 'var(--color-agua)' }}>
                        Agua: <strong>{dia.consumoAguaMl} / {metaTotal} ml</strong>
                      </div>
                    </div>

                    <span
                      style={{
                        padding: '0.25rem 0.6rem',
                        borderRadius: 'var(--radio-pleno)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backgroundColor: cumplioAgua ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: cumplioAgua ? '#34d399' : '#f87171',
                      }}
                    >
                      {cumplioAgua ? 'Meta Agua Cumplida' : 'En Progreso'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
