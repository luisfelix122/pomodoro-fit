import React, { useState } from 'react'
import { EstadoTemporizador, TipoFase } from '../../dominio/modelos/EstadoTemporizador'

interface PropiedadesRelojPomodoro {
  estado: EstadoTemporizador
  duracionTotalSegundos: number
  alIniciar: () => void
  alPausar: () => void
  alReiniciar: () => void
  alSaltarFase: () => void
  alActualizarTiempos?: (trabajoMin: number, pausaMin: number) => void
}

export const RelojPomodoro: React.FC<PropiedadesRelojPomodoro> = ({
  estado,
  duracionTotalSegundos,
  alIniciar,
  alPausar,
  alReiniciar,
  alSaltarFase,
  alActualizarTiempos,
}) => {
  const [mostrarAjustes, setMostrarAjustes] = useState(false)
  const [minTrabajo, setMinTrabajo] = useState(25)
  const [minPausa, setMinPausa] = useState(5)

  const formatearTiempo = (totalSegundos: number): string => {
    const minutos = Math.floor(totalSegundos / 60)
    const segundos = totalSegundos % 60
    return `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`
  }

  // Cálculo del progreso circular
  const radio = 110
  const circunferencia = 2 * Math.PI * radio
  const fraccionRestante = duracionTotalSegundos > 0 ? estado.segundosRestantes / duracionTotalSegundos : 0
  const desplazamientoGuion = circunferencia * (1 - fraccionRestante)

  const obtenerClaseFase = (): { claseTexto: string; nombre: string } => {
    switch (estado.faseActual) {
      case TipoFase.TRABAJO:
        return { claseTexto: 'fase-trabajo', nombre: 'Concentración y Enfoque' }
      case TipoFase.PAUSA_ACTIVA:
        return { claseTexto: 'fase-pausa', nombre: '¡Pausa Activa! A Moverse' }
      case TipoFase.DESCANSO_LARGO:
        return { claseTexto: 'fase-descanso', nombre: 'Descanso Prolongado' }
    }
  }

  const { claseTexto, nombre } = obtenerClaseFase()

  const guardarAjustes = (e: React.FormEvent) => {
    e.preventDefault()
    if (alActualizarTiempos) {
      alActualizarTiempos(minTrabajo, minPausa)
    }
    setMostrarAjustes(false)
  }

  return (
    <section className="panel-superficie" aria-label="Temporizador Pomodoro">
      <div className="panel-titulo">
        <span>Temporizador</span>
        <button
          className="boton-secundario"
          style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
          onClick={() => setMostrarAjustes(!mostrarAjustes)}
        >
          {mostrarAjustes ? 'Cerrar Ajustes' : 'Ajustar Tiempos'}
        </button>
      </div>

      {mostrarAjustes && (
        <form onSubmit={guardarAjustes} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', padding: '1rem', backgroundColor: 'var(--color-superficie-elevada)', borderRadius: 'var(--radio-md)' }}>
          <div className="campo-formulario" style={{ flex: '1 1 120px' }}>
            <label className="etiqueta-campo">Minutos Trabajo</label>
            <input
              type="number"
              min="1"
              max="90"
              value={minTrabajo}
              onChange={(e) => setMinTrabajo(Number(e.target.value))}
              className="input-texto"
            />
          </div>
          <div className="campo-formulario" style={{ flex: '1 1 120px' }}>
            <label className="etiqueta-campo">Minutos Pausa</label>
            <input
              type="number"
              min="1"
              max="30"
              value={minPausa}
              onChange={(e) => setMinPausa(Number(e.target.value))}
              className="input-texto"
            />
          </div>
          <div style={{ alignSelf: 'flex-end' }}>
            <button type="submit" className="boton-principal" style={{ padding: '0.75rem 1rem' }}>
              Aplicar
            </button>
          </div>
        </form>
      )}

      <div className="contenedor-temporizador">
        <div className="disco-tiempo">
          <svg className="reloj-svg" viewBox="0 0 260 260">
            <circle
              className="reloj-circulo-fondo"
              cx="130"
              cy="130"
              r={radio}
            />
            <circle
              className={`reloj-circulo-progreso ${claseTexto}`}
              cx="130"
              cy="130"
              r={radio}
              strokeDasharray={circunferencia}
              strokeDashoffset={desplazamientoGuion}
            />
          </svg>

          <span className="tiempo-digitos">{formatearTiempo(estado.segundosRestantes)}</span>
          <span className={`etiqueta-fase ${claseTexto}`}>{nombre}</span>
        </div>
      </div>

      <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-texto-secundario)' }}>
        Pomodoros completados hoy: <strong style={{ color: 'var(--color-texto-principal)' }}>{estado.ciclosCompletados}</strong>
      </div>

      <div className="fila-controles">
        {estado.estaCorriendo ? (
          <button className="boton-principal" onClick={alPausar} aria-label="Pausar temporizador">
            Pausar
          </button>
        ) : (
          <button className="boton-principal" onClick={alIniciar} aria-label="Iniciar temporizador">
            Iniciar
          </button>
        )}

        <button className="boton-secundario" onClick={alReiniciar} aria-label="Reiniciar fase">
          Reiniciar
        </button>

        <button className="boton-secundario" onClick={alSaltarFase} aria-label="Saltar a la siguiente fase">
          Saltar Fase
        </button>
      </div>
    </section>
  )
}
