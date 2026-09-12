import React, { useState } from 'react'
import { CalculadoraIMC } from '../../dominio/servicios/CalculadoraIMC'
import { CalculadoraAgua } from '../../dominio/servicios/CalculadoraAgua'

interface PropiedadesPantallaOnboarding {
  nombreInicial: string
  emailInicial?: string
  alCompletarPerfil: (datos: {
    nombre: string
    edad: number
    pesoKg: number
    alturaCm: number
  }) => void
}

export const PantallaOnboarding: React.FC<PropiedadesPantallaOnboarding> = ({
  nombreInicial,
  emailInicial,
  alCompletarPerfil,
}) => {
  const [nombre, setNombre] = useState(nombreInicial || 'Luis')
  const [edad, setEdad] = useState(26)
  const [pesoKg, setPesoKg] = useState(70)
  const [alturaCm, setAlturaCm] = useState(175)

  const resultadoIMC = pesoKg > 0 && alturaCm > 0
    ? CalculadoraIMC.calcular(pesoKg, alturaCm)
    : null

  const metaAgua = pesoKg > 0 ? CalculadoraAgua.calcularMetaDiaria(pesoKg) : 2400

  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault()
    if (pesoKg > 0 && alturaCm > 0 && edad > 0) {
      alCompletarPerfil({
        nombre: nombre.trim() || 'Usuario',
        edad,
        pesoKg,
        alturaCm,
      })
    }
  }

  return (
    <div className="contenedor-onboarding">
      <div className="tarjeta-onboarding">
        <div className="cabecera-onboarding">
          <span className="badge-paso">Paso 1 de 1 • Personalización</span>
          <h2 className="titulo-onboarding">Configurá tu Perfil Físico</h2>
          <p className="subtitulo-onboarding">
            {emailInicial ? `Conectado como ${emailInicial}. ` : ''}
            Para calcular con exactitud tu IMC y la hidratación ideal para tus pausas, ingresá tus datos:
          </p>
        </div>

        <form onSubmit={manejarEnvio} className="formulario-onboarding">
          <div className="campo-formulario">
            <label className="etiqueta-campo" htmlFor="onb-nombre">
              ¿Cómo te llamás?
            </label>
            <input
              id="onb-nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="input-texto"
              placeholder="Luis"
              required
            />
          </div>

          <div className="cuadricula-campos-onboarding">
            <div className="campo-formulario">
              <label className="etiqueta-campo" htmlFor="onb-edad">
                Edad (años)
              </label>
              <input
                id="onb-edad"
                type="number"
                min="10"
                max="110"
                value={edad}
                onChange={(e) => setEdad(Number(e.target.value))}
                className="input-texto"
                required
              />
            </div>

            <div className="campo-formulario">
              <label className="etiqueta-campo" htmlFor="onb-peso">
                Peso (kg)
              </label>
              <input
                id="onb-peso"
                type="number"
                step="0.5"
                min="30"
                max="250"
                value={pesoKg}
                onChange={(e) => setPesoKg(Number(e.target.value))}
                className="input-texto"
                required
              />
            </div>

            <div className="campo-formulario">
              <label className="etiqueta-campo" htmlFor="onb-altura">
                Altura (cm)
              </label>
              <input
                id="onb-altura"
                type="number"
                min="100"
                max="240"
                value={alturaCm}
                onChange={(e) => setAlturaCm(Number(e.target.value))}
                className="input-texto"
                required
              />
            </div>
          </div>

          {/* Tarjeta de Cálculo Físico en Tiempo Real */}
          {resultadoIMC && (
            <div className="panel-calculo-onboarding">
              <div className="fila-resultado-imc">
                <div>
                  <span className="etiqueta-resumen">Tu IMC Estimado:</span>
                  <div className="valor-imc-destacado">
                    {resultadoIMC.imc}{' '}
                    <span className="badge-clasificacion-imc">{resultadoIMC.clasificacion}</span>
                  </div>
                </div>
                <div>
                  <span className="etiqueta-resumen">Meta de Agua Ideal:</span>
                  <div className="valor-agua-destacado">{metaAgua} ml / día</div>
                </div>
              </div>
              <p className="consejo-salud">{resultadoIMC.mensajeSalud}</p>
            </div>
          )}

          <button type="submit" className="boton-principal-onboarding">
            Guardar y Comenzar
          </button>
        </form>
      </div>
    </div>
  )
}
