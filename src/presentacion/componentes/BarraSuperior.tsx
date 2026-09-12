import React, { useRef } from 'react'
import { Usuario } from '../../dominio/modelos/Usuario'

export type TipoPestana = 'CONCENTRACION' | 'HIDRATACION' | 'HISTORIAL' | 'CUENTA'

interface PropiedadesBarraSuperior {
  usuarioActual: Usuario | null
  usuariosDisponibles: Usuario[]
  pestanaActiva: TipoPestana
  alCambiarPestana: (pestana: TipoPestana) => void
  alCambiarUsuario: (usuarioId: string) => void
  alExportarJSON: () => void
  alImportarJSON: (jsonString: string) => void
}

export const BarraSuperior: React.FC<PropiedadesBarraSuperior> = ({
  usuarioActual,
  usuariosDisponibles,
  pestanaActiva,
  alCambiarPestana,
  alCambiarUsuario,
  alExportarJSON,
  alImportarJSON,
}) => {
  const inputArchivoRef = useRef<HTMLInputElement>(null)

  const manejarArchivoSeleccionado = (evento: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = evento.target.files?.[0]
    if (!archivo) return

    const lector = new FileReader()
    lector.onload = (e) => {
      const contenido = e.target?.result as string
      if (contenido) {
        alImportarJSON(contenido)
      }
    }
    lector.readAsText(archivo)
  }

  return (
    <header className="barra-superior">
      <div className="marca-app">
        <div className="logo-icono" aria-hidden="true">PF</div>
        <div>
          <h1 className="titulo-marca">Pomodoro Fit</h1>
          <p className="subtitulo-marca">Productividad, Pausas Activas e Hidratación</p>
        </div>
      </div>

      <nav className="navegacion-pestanas" aria-label="Navegación principal">
        <button
          className={`pestana-boton ${pestanaActiva === 'CONCENTRACION' ? 'activa' : ''}`}
          onClick={() => alCambiarPestana('CONCENTRACION')}
        >
          Concentración & Ejercicio
        </button>
        <button
          className={`pestana-boton ${pestanaActiva === 'HIDRATACION' ? 'activa' : ''}`}
          onClick={() => alCambiarPestana('HIDRATACION')}
        >
          Agua & Jornada
        </button>
        <button
          className={`pestana-boton ${pestanaActiva === 'HISTORIAL' ? 'activa' : ''}`}
          onClick={() => alCambiarPestana('HISTORIAL')}
        >
          Evolución & Peso
        </button>
        <button
          className={`pestana-boton ${pestanaActiva === 'CUENTA' ? 'activa' : ''}`}
          onClick={() => alCambiarPestana('CUENTA')}
        >
          {usuarioActual ? `Perfil (${usuarioActual.nombre})` : 'Iniciar Sesión'}
        </button>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {usuariosDisponibles.length > 1 && (
          <select
            className="input-texto"
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
            value={usuarioActual?.id || ''}
            onChange={(e) => alCambiarUsuario(e.target.value)}
            aria-label="Seleccionar perfil activo"
          >
            {usuariosDisponibles.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nombre}
              </option>
            ))}
          </select>
        )}

        <button
          className="boton-secundario"
          style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
          onClick={alExportarJSON}
          title="Descargar copia de seguridad en JSON"
        >
          Exportar
        </button>

        <button
          className="boton-secundario"
          style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
          onClick={() => inputArchivoRef.current?.click()}
          title="Restaurar copia de seguridad desde JSON"
        >
          Importar
        </button>
        <input
          type="file"
          ref={inputArchivoRef}
          onChange={manejarArchivoSeleccionado}
          accept=".json"
          style={{ display: 'none' }}
        />
      </div>
    </header>
  )
}
