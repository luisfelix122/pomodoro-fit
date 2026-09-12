import React from 'react'
import { Ejercicio } from '../../dominio/modelos/Ejercicio'
import { ETIQUETAS_ZONA_CUERPO } from '../../dominio/modelos/ZonaCuerpo'

interface PropiedadesPanelEjercicio {
  ejercicio: Ejercicio | null
  esPausaActiva: boolean
  alSiguienteEjercicio: () => void
  alEjercicioAnterior: () => void
}

export const PanelEjercicioPausa: React.FC<PropiedadesPanelEjercicio> = ({
  ejercicio,
  esPausaActiva,
  alSiguienteEjercicio,
  alEjercicioAnterior,
}) => {
  if (!ejercicio) {
    return (
      <section className="panel-superficie">
        <h2 className="panel-titulo">Ejercicio de la Pausa</h2>
        <p style={{ color: 'var(--color-texto-secundario)', fontSize: '0.9rem' }}>
          Seleccioná una zona corporal para cargar la rutina del día.
        </p>
      </section>
    )
  }

  return (
    <section
      className="panel-superficie"
      style={{
        borderColor: esPausaActiva ? 'var(--color-pausa)' : 'var(--color-borde)',
        backgroundColor: esPausaActiva ? 'rgba(249, 115, 22, 0.03)' : 'var(--color-superficie)',
      }}
      aria-label="Detalles del ejercicio para la pausa activa"
    >
      <div className="panel-titulo">
        <span>{esPausaActiva ? '¡Momento de Moverte!' : 'Próximo Ejercicio'}</span>
        <span className="ejercicio-badge">
          {ETIQUETAS_ZONA_CUERPO[ejercicio.zona]}
        </span>
      </div>

      <div className="tarjeta-ejercicio">
        <div className="ejercicio-encabezado">
          <div>
            <h3 className="ejercicio-nombre">{ejercicio.nombre}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-texto-secundario)', marginTop: '0.2rem' }}>
              {ejercicio.descripcion}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', padding: '0.5rem 0', borderTop: '1px solid var(--color-borde)', borderBottom: '1px solid var(--color-borde)' }}>
          <div style={{ fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--color-texto-apagado)' }}>Duración: </span>
            <strong>{ejercicio.duracionSegundos} segundos</strong>
          </div>
          {ejercicio.repeticiones && (
            <div style={{ fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--color-texto-apagado)' }}>Objetivo: </span>
              <strong>{ejercicio.repeticiones}</strong>
            </div>
          )}
          <div style={{ fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--color-texto-apagado)' }}>Dificultad: </span>
            <strong style={{ color: '#10b981' }}>{ejercicio.dificultad}</strong>
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--color-texto-principal)', marginBottom: '0.5rem' }}>
            Instrucciones de ejecución:
          </h4>
          <ol className="lista-instrucciones">
            {ejercicio.instrucciones.map((instruccion, indice) => (
              <li key={indice}>{instruccion}</li>
            ))}
          </ol>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
          <button
            className="boton-secundario"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
            onClick={alEjercicioAnterior}
          >
            ← Anterior
          </button>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-texto-apagado)' }}>
            Podés rotar los ejercicios en cualquier momento
          </span>
          <button
            className="boton-secundario"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
            onClick={alSiguienteEjercicio}
          >
            Siguiente →
          </button>
        </div>
      </div>
    </section>
  )
}
