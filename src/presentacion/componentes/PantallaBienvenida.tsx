import React, { useState } from 'react'
import { ServicioAutenticacionFirebase } from '../../infraestructura/firebase/ServicioAutenticacionFirebase'

interface PropiedadesPantallaBienvenida {
  alAutenticarGoogle: (datos: { id: string; nombre: string; email?: string | null }) => void
  alContinuarComoInvitado: () => void
}

export const PantallaBienvenida: React.FC<PropiedadesPantallaBienvenida> = ({
  alAutenticarGoogle,
  alContinuarComoInvitado,
}) => {
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [nombreRegistro, setNombreRegistro] = useState('')
  const [modoRegistro, setModoRegistro] = useState(false)
  const [mostrarFormCorreo, setMostrarFormCorreo] = useState(false)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const manejarLoginGoogle = async () => {
    setCargando(true)
    setError(null)
    try {
      const usuario = await ServicioAutenticacionFirebase.iniciarSesionConGoogle()
      alAutenticarGoogle(usuario)
    } catch (err: unknown) {
      console.error(err)
      const msg = err instanceof Error ? err.message : 'Error al conectar con Google'
      // Si el popup se cerró o falta habilitar en Firebase Console, dar feedback claro
      if (msg.includes('popup-closed-by-user')) {
        setError('El inicio de sesión fue cancelado. Podés intentar nuevamente o entrar como invitado.')
      } else if (msg.includes('unauthorized-domain')) {
        setError('El dominio actual no está en la lista autorizada de Firebase. Podés ingresar como invitado o verificar Firebase Console.')
      } else {
        setError(msg)
      }
    } finally {
      setCargando(false)
    }
  }

  const manejarAuthCorreo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!correo || !contrasena) return
    setCargando(true)
    setError(null)

    try {
      if (modoRegistro) {
        const u = await ServicioAutenticacionFirebase.registrarConCorreo(correo, contrasena, nombreRegistro || 'Usuario')
        alAutenticarGoogle(u)
      } else {
        const u = await ServicioAutenticacionFirebase.iniciarSesionConCorreo(correo, contrasena)
        alAutenticarGoogle(u)
      }
    } catch (err: unknown) {
      console.error(err)
      const msg = err instanceof Error ? err.message : 'Error al autenticar'
      setError(msg)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="contenedor-bienvenida">
      <div className="tarjeta-bienvenida">
        <div className="cabecera-bienvenida">
          <div className="logo-bienvenida">PF</div>
          <h1 className="titulo-bienvenida">Pomodoro Fit</h1>
          <p className="descripcion-bienvenida">
            Tu espacio de alta concentración laboral con pausas activas de ejercicio e hidratación guiada.
          </p>
        </div>

        {error && (
          <div className="alerta-error" role="alert">
            {error}
          </div>
        )}

        <div className="acciones-bienvenida">
          {/* Botón Principal: Continuar con Google */}
          <button
            type="button"
            className="boton-google-principal"
            onClick={manejarLoginGoogle}
            disabled={cargando}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>{cargando ? 'Conectando...' : 'Iniciar Sesión con Google'}</span>
          </button>

          <div className="separador-o">
            <span>o continuá de forma local</span>
          </div>

          <button
            type="button"
            className="boton-invitado"
            onClick={alContinuarComoInvitado}
          >
            Entrar como Invitado (Perfil Local)
          </button>

          <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
            <button
              type="button"
              className="enlace-texto-toggle"
              onClick={() => setMostrarFormCorreo(!mostrarFormCorreo)}
            >
              {mostrarFormCorreo ? 'Ocultar acceso con correo' : '¿Preferís correo y contraseña?'}
            </button>
          </div>

          {mostrarFormCorreo && (
            <form onSubmit={manejarAuthCorreo} className="formulario-correo-animado">
              {modoRegistro && (
                <div className="campo-formulario">
                  <label className="etiqueta-campo">Tu Nombre</label>
                  <input
                    type="text"
                    value={nombreRegistro}
                    onChange={(e) => setNombreRegistro(e.target.value)}
                    className="input-texto"
                    placeholder="Luis"
                    required={modoRegistro}
                  />
                </div>
              )}

              <div className="campo-formulario">
                <label className="etiqueta-campo">Correo electrónico</label>
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="input-texto"
                  placeholder="usuario@ejemplo.com"
                  required
                />
              </div>

              <div className="campo-formulario">
                <label className="etiqueta-campo">Contraseña</label>
                <input
                  type="password"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  className="input-texto"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
                <button
                  type="button"
                  className="enlace-texto-toggle"
                  onClick={() => setModoRegistro(!modoRegistro)}
                >
                  {modoRegistro ? '¿Ya tenés cuenta? Iniciar Sesión' : '¿Crear cuenta nueva?'}
                </button>
                <button type="submit" className="boton-principal" disabled={cargando}>
                  {modoRegistro ? 'Registrarse' : 'Entrar'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
