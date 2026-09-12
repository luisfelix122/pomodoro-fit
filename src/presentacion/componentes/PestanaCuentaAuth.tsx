import React, { useState } from 'react'
import { Usuario } from '../../dominio/modelos/Usuario'
import { ServicioAutenticacionFirebase } from '../../infraestructura/firebase/ServicioAutenticacionFirebase'

interface PropiedadesPestanaCuenta {
  usuarioActual: Usuario | null
  alCrearOActualizarPerfilLocal: (nombre: string, pesoKg: number, alturaCm: number, email?: string) => void
  alCerrarSesion: () => void
}

export const PestanaCuentaAuth: React.FC<PropiedadesPestanaCuenta> = ({
  usuarioActual,
  alCrearOActualizarPerfilLocal,
  alCerrarSesion,
}) => {
  const [nombre, setNombre] = useState(usuarioActual?.nombre || '')
  const [pesoKg, setPesoKg] = useState(usuarioActual?.pesoActualKg || 70)
  const [alturaCm, setAlturaCm] = useState(usuarioActual?.alturaCm || 175)
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [esRegistro, setEsRegistro] = useState(false)
  const [mensajeEstado, setMensajeEstado] = useState<{ texto: string; error: boolean } | null>(null)
  const [cargando, setCargando] = useState(false)

  const firebaseDisponible = ServicioAutenticacionFirebase.estaDisponible()

  const manejarLoginGoogle = async () => {
    setCargando(true)
    setMensajeEstado(null)
    try {
      const datos = await ServicioAutenticacionFirebase.iniciarSesionConGoogle()
      alCrearOActualizarPerfilLocal(datos.nombre, pesoKg, alturaCm, datos.email || undefined)
      setMensajeEstado({ texto: `¡Bienvenido con Google, ${datos.nombre}!`, error: false })
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Error al conectar con Google'
      setMensajeEstado({ texto: errorMsg, error: true })
    } finally {
      setCargando(false)
    }
  }

  const manejarAuthCorreo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!correo || !contrasena) return
    setCargando(true)
    setMensajeEstado(null)

    try {
      if (esRegistro) {
        const datos = await ServicioAutenticacionFirebase.registrarConCorreo(correo, contrasena, nombre || 'Usuario')
        alCrearOActualizarPerfilLocal(nombre || datos.nombre, pesoKg, alturaCm, datos.email || undefined)
        setMensajeEstado({ texto: `Cuenta creada exitosamente para ${correo}`, error: false })
      } else {
        const datos = await ServicioAutenticacionFirebase.iniciarSesionConCorreo(correo, contrasena)
        alCrearOActualizarPerfilLocal(nombre || datos.nombre, pesoKg, alturaCm, datos.email || undefined)
        setMensajeEstado({ texto: `Sesión iniciada con éxito como ${correo}`, error: false })
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Error en la autenticación'
      setMensajeEstado({ texto: errorMsg, error: true })
    } finally {
      setCargando(false)
    }
  }

  const manejarGuardadoLocal = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nombre || pesoKg <= 0 || alturaCm <= 0) return
    alCrearOActualizarPerfilLocal(nombre, pesoKg, alturaCm, usuarioActual?.email)
    setMensajeEstado({ texto: 'Perfil local guardado correctamente en tu navegador.', error: false })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '680px', margin: '0 auto' }}>
      {/* Sección Casa / Bienvenida */}
      <section className="panel-superficie">
        <h2 className="panel-titulo">
          🏠 Casa & Autenticación de Usuario
        </h2>
        <p style={{ color: 'var(--color-texto-secundario)', fontSize: '0.9rem' }}>
          Tus datos se mantienen sincronizados y persistentes. Podés iniciar sesión con tu cuenta de Google, correo o utilizar un perfil local en tu navegador.
        </p>

        {mensajeEstado && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radio-md)',
              fontSize: '0.85rem',
              backgroundColor: mensajeEstado.error ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
              color: mensajeEstado.error ? '#f87171' : '#34d399',
              border: `1px solid ${mensajeEstado.error ? '#ef4444' : '#10b981'}`,
            }}
          >
            {mensajeEstado.texto}
          </div>
        )}

        {/* Estado actual de la sesión */}
        {usuarioActual ? (
          <div
            style={{
              backgroundColor: 'var(--color-superficie-elevada)',
              padding: '1.25rem',
              borderRadius: 'var(--radio-md)',
              border: '1px solid var(--color-borde)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>{usuarioActual.nombre}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-texto-secundario)' }}>
                {usuarioActual.email ? `Conectado: ${usuarioActual.email}` : 'Perfil Local Activo'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-texto-apagado)', marginTop: '0.25rem' }}>
                Peso: {usuarioActual.pesoActualKg} kg | Altura: {usuarioActual.alturaCm} cm
              </div>
            </div>

            <button
              className="boton-secundario"
              style={{ color: '#f87171' }}
              onClick={alCerrarSesion}
            >
              Cerrar Sesión
            </button>
          </div>
        ) : (
          <p style={{ color: 'var(--color-texto-apagado)', fontSize: '0.85rem' }}>
            No hay sesión activa. Ingresá tus datos para empezar.
          </p>
        )}

        {/* Opciones con Firebase (Google o Email) */}
        {firebaseDisponible ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
            <button
              className="boton-principal"
              style={{
                backgroundColor: '#ffffff',
                color: '#1e293b',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
              onClick={manejarLoginGoogle}
              disabled={cargando}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
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
              Continuar con Google
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-texto-apagado)' }}>
              — o con correo y contraseña —
            </div>

            <form onSubmit={manejarAuthCorreo} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div className="campo-formulario">
                <label className="etiqueta-campo">Correo electrónico</label>
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  className="input-texto"
                  placeholder="tu@correo.com"
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

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', fontSize: '0.85rem' }}
                  onClick={() => setEsRegistro(!esRegistro)}
                >
                  {esRegistro ? '¿Ya tenés cuenta? Iniciar Sesión' : '¿No tenés cuenta? Registrarte'}
                </button>
                <button type="submit" className="boton-principal" disabled={cargando}>
                  {cargando ? 'Procesando...' : esRegistro ? 'Crear Cuenta' : 'Entrar'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid var(--color-borde-enfasis)',
              borderRadius: 'var(--radio-md)',
              fontSize: '0.85rem',
            }}
          >
            <strong style={{ color: '#818cf8' }}>Modo Local Activado: </strong>
            Para activar inicio de sesión con Google y Firebase en la nube, podés agregar tus claves en el archivo{' '}
            <code>.env</code>. Mientras tanto, tu app funciona al 100% de manera autónoma y privada en tu navegador.
          </div>
        )}
      </section>

      {/* Configuración del Perfil Físico (Local) */}
      <section className="panel-superficie">
        <h3 className="panel-titulo">Datos de tu Perfil Físico</h3>
        <p style={{ color: 'var(--color-texto-secundario)', fontSize: '0.85rem' }}>
          Estos valores permiten calcular automáticamente tu IMC y tu meta de agua ideal.
        </p>

        <form onSubmit={manejarGuardadoLocal} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="campo-formulario">
            <label className="etiqueta-campo">Tu Nombre o Apodo</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="input-texto"
              placeholder="Ej. Luis"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="campo-formulario">
              <label className="etiqueta-campo">Peso (kg)</label>
              <input
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
              <label className="etiqueta-campo">Altura (cm)</label>
              <input
                type="number"
                min="100"
                max="250"
                value={alturaCm}
                onChange={(e) => setAlturaCm(Number(e.target.value))}
                className="input-texto"
                required
              />
            </div>
          </div>

          <button type="submit" className="boton-principal" style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}>
            Guardar Perfil
          </button>
        </form>
      </section>
    </div>
  )
}
