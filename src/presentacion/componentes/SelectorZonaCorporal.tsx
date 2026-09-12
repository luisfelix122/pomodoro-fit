import React from 'react'
import { ZonaCuerpo } from '../../dominio/modelos/ZonaCuerpo'

interface PropiedadesSelectorZona {
  zonaSeleccionada: ZonaCuerpo
  alSeleccionarZona: (zona: ZonaCuerpo) => void
}

interface OpcionZona {
  zona: ZonaCuerpo
  titulo: string
  subtitulo: string
}

const OPCIONES_ZONAS: OpcionZona[] = [
  {
    zona: ZonaCuerpo.TODO_EL_CUERPO,
    titulo: 'Todo el Cuerpo',
    subtitulo: 'Full body funcional y dinámico',
  },
  {
    zona: ZonaCuerpo.TREN_SUPERIOR,
    titulo: 'Tren Superior',
    subtitulo: 'Pecho, brazos y espalda',
  },
  {
    zona: ZonaCuerpo.TREN_INFERIOR,
    titulo: 'Tren Inferior',
    subtitulo: 'Piernas, glúteos y gemelos',
  },
  {
    zona: ZonaCuerpo.CORE,
    titulo: 'Core & Abdomen',
    subtitulo: 'Faja lumbar y estabilidad',
  },
  {
    zona: ZonaCuerpo.MOVILIDAD_POSTURA,
    titulo: 'Movilidad & Postura',
    subtitulo: 'Cuello, cadera y flexibilidad',
  },
]

export const SelectorZonaCorporal: React.FC<PropiedadesSelectorZona> = ({
  zonaSeleccionada,
  alSeleccionarZona,
}) => {
  return (
    <section className="panel-superficie" aria-label="Selección del área de trabajo del día">
      <div className="panel-titulo">
        <span>¿Qué parte querés trabajar hoy?</span>
        <span style={{ fontSize: '0.8rem', color: 'var(--color-texto-secundario)' }}>
          Afecta los ejercicios de cada pausa
        </span>
      </div>

      <div className="cuadricula-zonas">
        {OPCIONES_ZONAS.map((opcion) => {
          const estaActiva = zonaSeleccionada === opcion.zona
          return (
            <button
              key={opcion.zona}
              type="button"
              className={`tarjeta-zona ${estaActiva ? 'seleccionada' : ''}`}
              onClick={() => alSeleccionarZona(opcion.zona)}
              aria-pressed={estaActiva}
            >
              <div className="tarjeta-zona-titulo">{opcion.titulo}</div>
              <div className="tarjeta-zona-desc">{opcion.subtitulo}</div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
