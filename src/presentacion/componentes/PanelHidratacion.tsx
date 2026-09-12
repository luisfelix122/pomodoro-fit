import React, { useState } from 'react'
import { RegistroDia } from '../../dominio/modelos/RegistroDia'
import { Usuario } from '../../dominio/modelos/Usuario'
import { CalculadoraIMC } from '../../dominio/servicios/CalculadoraIMC'

interface PropiedadesPanelHidratacion {
  usuario: Usuario
  registroDia: RegistroDia | null
  alIniciarDia: () => void
  alRegistrarAgua: (mililitros: number) => void
  alAbrirModalPeso: () => void
}

export const PanelHidratacion: React.FC<PropiedadesPanelHidratacion> = ({
  usuario,
  registroDia,
  alIniciarDia,
  alRegistrarAgua,
  alAbrirModalPeso,
}) => {
  const [mlPersonalizado, setMlPersonalizado] = useState('')
  const [vasosPersonalizados, setVasosPersonalizados] = useState(1)

  const resultadoIMC = CalculadoraIMC.calcular(usuario.pesoActualKg, usuario.alturaCm)

  const metaTotalDiariaMl = (registroDia?.metaAguaJornadaMl ?? 0) + (registroDia?.metaAguaFueraJornadaMl ?? 0) || Math.round(usuario.pesoActualKg * 35)
  const metaJornadaMl = registroDia?.metaAguaJornadaMl ?? Math.round(metaTotalDiariaMl * 0.5)
  const metaFueraJornadaMl = registroDia?.metaAguaFueraJornadaMl ?? (metaTotalDiariaMl - metaJornadaMl)
  const consumoActualMl = registroDia?.consumoAguaMl ?? 0

  const porcentajeTotal = Math.min(100, Math.round((consumoActualMl / metaTotalDiariaMl) * 100))
  const vasosTomados = Math.floor(consumoActualMl / 250)
  const vasosObjetivo = Math.ceil(metaTotalDiariaMl / 250)

  const enviarAguaPersonalizada = (e: React.FormEvent) => {
    e.preventDefault()
    const ml = Number(mlPersonalizado)
    if (ml > 0) {
      alRegistrarAgua(ml)
      setMlPersonalizado('')
    }
  }

  const sumarVasosMultiples = () => {
    if (vasosPersonalizados > 0) {
      alRegistrarAgua(vasosPersonalizados * 250)
    }
  }

  return (
    <section className="panel-superficie" aria-label="Control de hidratación y metas">
      <div className="panel-titulo">
        <span>Hidratación Inteligente</span>
        {!registroDia?.jornadaIniciada ? (
          <button
            className="boton-principal"
            style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
            onClick={alIniciarDia}
          >
            ☀️ Iniciar el Día
          </button>
        ) : (
          <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}>
            ✓ Día Iniciado ({registroDia.horasTrabajoEstimadas}h de trabajo)
          </span>
        )}
      </div>

      {/* Resumen Físico / IMC */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--color-superficie-elevada)',
          padding: '0.85rem 1.25rem',
          borderRadius: 'var(--radio-md)',
          border: '1px solid var(--color-borde)',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-texto-secundario)' }}>Tu Perfil: </span>
          <strong>{usuario.pesoActualKg} kg</strong> | <strong>{usuario.alturaCm} cm</strong>
          <span style={{ marginLeft: '0.75rem', fontSize: '0.8rem', color: '#818cf8' }}>
            IMC: <strong>{resultadoIMC.imc}</strong> ({resultadoIMC.clasificacion})
          </span>
        </div>
        <button
          className="boton-secundario"
          style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
          onClick={alAbrirModalPeso}
        >
          Actualizar Peso
        </button>
      </div>

      {/* Tarjetas de Métricas de Agua */}
      <div className="fila-stats-agua">
        <div className="caja-stat">
          <span className="caja-stat-valor">{consumoActualMl} ml</span>
          <span className="caja-stat-etiqueta">
            Consumido hoy ({vasosTomados} de ~{vasosObjetivo} vasos)
          </span>
        </div>

        <div className="caja-stat">
          <span className="caja-stat-valor">{metaJornadaMl} ml</span>
          <span className="caja-stat-etiqueta">Meta Durante tu Trabajo</span>
        </div>

        <div className="caja-stat">
          <span className="caja-stat-valor">{metaFueraJornadaMl} ml</span>
          <span className="caja-stat-etiqueta">Meta Fuera de Jornada</span>
        </div>
      </div>

      {/* Barra de Progreso */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
          <span>Progreso de Meta Diaria Total ({metaTotalDiariaMl} ml)</span>
          <strong style={{ color: 'var(--color-agua)' }}>{porcentajeTotal}%</strong>
        </div>
        <div className="barra-progreso-agua">
          <div className="barra-progreso-relleno" style={{ width: `${porcentajeTotal}%` }} />
        </div>
      </div>

      {/* Acciones de Registro Rápido */}
      <div>
        <h4 style={{ fontSize: '0.9rem', marginBottom: '0.6rem', color: 'var(--color-texto-principal)' }}>
          Registrar Agua Tomada:
        </h4>
        <div className="botones-vasos">
          <button
            className="boton-secundario"
            onClick={() => alRegistrarAgua(250)}
          >
            + 1 Vaso (250 ml)
          </button>
          <button
            className="boton-secundario"
            onClick={() => alRegistrarAgua(500)}
          >
            + 2 Vasos (500 ml)
          </button>
          <button
            className="boton-secundario"
            onClick={() => alRegistrarAgua(750)}
          >
            + 1 Botella (750 ml)
          </button>
        </div>
      </div>

      {/* Registro de número de vasos o ml libre */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', paddingTop: '0.5rem', borderTop: '1px solid var(--color-borde)' }}>
        {/* Sumar N vasos */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-texto-secundario)' }}>Tomé</span>
          <input
            type="number"
            min="1"
            max="10"
            value={vasosPersonalizados}
            onChange={(e) => setVasosPersonalizados(Math.max(1, Number(e.target.value)))}
            className="input-texto"
            style={{ width: '65px', padding: '0.4rem 0.5rem' }}
          />
          <span style={{ fontSize: '0.85rem', color: 'var(--color-texto-secundario)' }}>vasos</span>
          <button
            className="boton-secundario"
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
            onClick={sumarVasosMultiples}
          >
            Agregar
          </button>
        </div>

        {/* Ingreso en ml */}
        <form onSubmit={enviarAguaPersonalizada} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="number"
            min="50"
            step="50"
            placeholder="Cant. en ml"
            value={mlPersonalizado}
            onChange={(e) => setMlPersonalizado(e.target.value)}
            className="input-texto"
            style={{ width: '120px', padding: '0.4rem 0.5rem' }}
          />
          <button
            type="submit"
            className="boton-secundario"
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
          >
            + ml
          </button>
        </form>
      </div>
    </section>
  )
}
