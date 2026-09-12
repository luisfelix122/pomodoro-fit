import React, { useState } from 'react'
import { CalculadoraIMC } from '../../dominio/servicios/CalculadoraIMC'
import { CalculadoraAgua } from '../../dominio/servicios/CalculadoraAgua'

interface PropiedadesModalPeso {
  pesoActualKg: number
  alturaCm: number
  alGuardar: (nuevoPesoKg: number, nota?: string) => void
  alCerrar: () => void
}

export const ModalActualizarPeso: React.FC<PropiedadesModalPeso> = ({
  pesoActualKg,
  alturaCm,
  alGuardar,
  alCerrar,
}) => {
  const [peso, setPeso] = useState(pesoActualKg)
  const [nota, setNota] = useState('')

  const imcPrevio = CalculadoraIMC.calcular(pesoActualKg, alturaCm)
  const imcNuevo = peso > 0 ? CalculadoraIMC.calcular(peso, alturaCm) : imcPrevio
  const nuevaMetaAgua = peso > 0 ? CalculadoraAgua.calcularMetaDiaria(peso) : 2000

  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault()
    if (peso > 0) {
      alGuardar(peso, nota.trim() || undefined)
    }
  }

  return (
    <div className="capa-modal" role="dialog" aria-modal="true" aria-labelledby="titulo-modal-peso">
      <div className="contenido-modal">
        <h2 id="titulo-modal-peso" className="panel-titulo">
          ⚖️ Actualizar Peso Corporal
        </h2>

        <form onSubmit={manejarEnvio} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="campo-formulario">
            <label className="etiqueta-campo" htmlFor="input-peso">
              Nuevo peso (en kilogramos):
            </label>
            <input
              id="input-peso"
              type="number"
              step="0.1"
              min="30"
              max="250"
              value={peso}
              onChange={(e) => setPeso(Number(e.target.value))}
              className="input-texto"
              required
            />
          </div>

          <div className="campo-formulario">
            <label className="etiqueta-campo" htmlFor="input-nota">
              Nota o contexto (opcional):
            </label>
            <input
              id="input-nota"
              type="text"
              placeholder="Ej. Pesaje en ayunas, post-entreno..."
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              className="input-texto"
            />
          </div>

          {/* Comparación instantánea */}
          <div
            style={{
              backgroundColor: 'var(--color-superficie-elevada)',
              padding: '1rem',
              borderRadius: 'var(--radio-md)',
              border: '1px solid var(--color-borde)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
              fontSize: '0.85rem',
            }}
          >
            <div>
              Nuevo IMC calculado: <strong>{imcNuevo.imc}</strong> ({imcNuevo.clasificacion})
            </div>
            <div>
              Nueva meta de agua recomendada: <strong>{nuevaMetaAgua} ml/día</strong>
            </div>
            <div style={{ color: 'var(--color-texto-secundario)', marginTop: '0.2rem' }}>
              {imcNuevo.mensajeSalud}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" className="boton-secundario" onClick={alCerrar}>
              Cancelar
            </button>
            <button type="submit" className="boton-principal">
              Guardar en Historial
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
