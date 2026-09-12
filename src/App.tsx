import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import './presentacion/estilos/diseno.css'

// Dominio y Modelos
import { Usuario } from './dominio/modelos/Usuario'
import { ZonaCuerpo } from './dominio/modelos/ZonaCuerpo'
import { Ejercicio } from './dominio/modelos/Ejercicio'
import { TipoFase } from './dominio/modelos/EstadoTemporizador'
import { RegistroDia } from './dominio/modelos/RegistroDia'

// Servicios de Dominio
import { GestorEjercicios } from './dominio/servicios/GestorEjercicios'
import { TemporizadorPomodoro } from './dominio/servicios/TemporizadorPomodoro'

// Infraestructura
import { RepositorioLocalStorage } from './infraestructura/persistencia/RepositorioLocalStorage'
import { GeneradorSonidoWeb } from './infraestructura/audio/GeneradorSonidoWeb'
import { ServicioAutenticacionFirebase } from './infraestructura/firebase/ServicioAutenticacionFirebase'
import { RepositorioFirestore } from './infraestructura/firebase/RepositorioFirestore'

// Casos de Uso
import { IniciarDiaTrabajo } from './aplicacion/casos-de-uso/IniciarDiaTrabajo'
import { RegistrarConsumoAgua } from './aplicacion/casos-de-uso/RegistrarConsumoAgua'
import { ActualizarPesoUsuario } from './aplicacion/casos-de-uso/ActualizarPesoUsuario'

// Componentes de Presentación
import { BarraSuperior, TipoPestana } from './presentacion/componentes/BarraSuperior'
import { RelojPomodoro } from './presentacion/componentes/RelojPomodoro'
import { PanelEjercicioPausa } from './presentacion/componentes/PanelEjercicioPausa'
import { SelectorZonaCorporal } from './presentacion/componentes/SelectorZonaCorporal'
import { PanelHidratacion } from './presentacion/componentes/PanelHidratacion'
import { GraficoHistorialAvance } from './presentacion/componentes/GraficoHistorialAvance'
import { ModalIniciarDia } from './presentacion/componentes/ModalIniciarDia'
import { ModalActualizarPeso } from './presentacion/componentes/ModalActualizarPeso'
import { PestanaCuentaAuth } from './presentacion/componentes/PestanaCuentaAuth'
import { PantallaBienvenida } from './presentacion/componentes/PantallaBienvenida'
import { PantallaOnboarding } from './presentacion/componentes/PantallaOnboarding'

export function App() {
  // Instancias de infraestructura
  const repositorioLocal = useMemo(() => new RepositorioLocalStorage(), [])
  const servicioSonido = useMemo(() => new GeneradorSonidoWeb(), [])
  const gestorEjercicios = useMemo(() => new GestorEjercicios(), [])

  // Casos de uso vinculados al repositorio
  const casoIniciarDia = useMemo(() => new IniciarDiaTrabajo(repositorioLocal), [repositorioLocal])
  const casoRegistrarAgua = useMemo(() => new RegistrarConsumoAgua(repositorioLocal), [repositorioLocal])
  const casoActualizarPeso = useMemo(() => new ActualizarPesoUsuario(repositorioLocal), [repositorioLocal])

  // Estado de Usuario y Sesión
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null)
  const [usuariosDisponibles, setUsuariosDisponibles] = useState<Usuario[]>([])
  const [registroDia, setRegistroDia] = useState<RegistroDia | null>(null)
  const [pestanaActiva, setPestanaActiva] = useState<TipoPestana>('CONCENTRACION')
  const [cargandoSesion, setCargandoSesion] = useState(true)

  // Temporizador y Ejercicios
  const [configTrabajoMin, setConfigTrabajoMin] = useState(25)
  const [configPausaMin, setConfigPausaMin] = useState(5)
  const temporizadorRef = useRef<TemporizadorPomodoro | null>(null)

  if (!temporizadorRef.current) {
    temporizadorRef.current = new TemporizadorPomodoro({
      minutosTrabajo: configTrabajoMin,
      minutosPausaActiva: configPausaMin,
    })
  }

  const [estadoTemp, setEstadoTemp] = useState(temporizadorRef.current.obtenerEstado())
  const [zonaSeleccionada, setZonaSeleccionada] = useState<ZonaCuerpo>(ZonaCuerpo.TODO_EL_CUERPO)
  const [indiceEjercicioActual, setIndiceEjercicioActual] = useState(0)

  // Modales
  const [modalIniciarDiaAbierto, setModalIniciarDiaAbierto] = useState(false)
  const [modalPesoAbierto, setModalPesoAbierto] = useState(false)

  // Fecha de hoy (YYYY-MM-DD)
  const fechaHoyIso = useMemo(() => new Date().toISOString().slice(0, 10), [])

  // Suscripción de sesión persistente con Firebase y LocalStorage
  useEffect(() => {
    const desuscribir = ServicioAutenticacionFirebase.suscribirseAEstadoSesion(async (authUsuario) => {
      if (authUsuario) {
        // Intentar recuperar de Firestore o LocalStorage
        const repoRemoto = new RepositorioFirestore(authUsuario.id)
        let usuario = await repoRemoto.obtenerUsuarioActual()

        if (!usuario) {
          usuario = await repositorioLocal.obtenerUsuarioActual()
        }

        if (usuario && usuario.id === authUsuario.id) {
          setUsuarioActual(usuario)
        } else {
          // Usuario autenticado que aún no completó su perfil físico
          setUsuarioActual({
            id: authUsuario.id,
            nombre: authUsuario.nombre,
            email: authUsuario.email || undefined,
            pesoActualKg: 0,
            alturaCm: 0,
            edad: 0,
            historialPesos: [],
            historialDias: {},
            creadoEnIso: new Date().toISOString(),
          })
        }
      } else {
        // Modo local o no autenticado
        const uLocal = await repositorioLocal.obtenerUsuarioActual()
        setUsuarioActual(uLocal)
      }
      setCargandoSesion(false)
    })

    return () => desuscribir()
  }, [repositorioLocal])

  // Cargar registros diarios cuando hay usuario activo
  const cargarRegistroDiario = useCallback(async (usuarioId: string) => {
    const reg = await repositorioLocal.obtenerRegistroDia(usuarioId, fechaHoyIso)
    if (reg) {
      setRegistroDia(reg)
      setZonaSeleccionada(reg.zonaElegida)
    }
    const todos = (await repositorioLocal.listarUsuariosLocales?.()) || []
    setUsuariosDisponibles(todos)
  }, [repositorioLocal, fechaHoyIso])

  useEffect(() => {
    if (usuarioActual && usuarioActual.pesoActualKg > 0) {
      cargarRegistroDiario(usuarioActual.id)
    }
  }, [usuarioActual, cargarRegistroDiario])

  // Lista de ejercicios de la zona activa
  const ejerciciosDeZona = useMemo<Ejercicio[]>(() => {
    return gestorEjercicios.obtenerPorZona(zonaSeleccionada)
  }, [gestorEjercicios, zonaSeleccionada])

  const ejercicioActual = useMemo<Ejercicio | null>(() => {
    if (ejerciciosDeZona.length === 0) return null
    return gestorEjercicios.obtenerSiguiente(ejerciciosDeZona, indiceEjercicioActual)
  }, [ejerciciosDeZona, gestorEjercicios, indiceEjercicioActual])

  // Loop del Temporizador
  useEffect(() => {
    let intervalo: ReturnType<typeof setInterval> | null = null

    if (estadoTemp.estaCorriendo) {
      intervalo = setInterval(() => {
        if (!temporizadorRef.current) return
        const fasePrevia = temporizadorRef.current.obtenerEstado().faseActual
        const cambioDeFase = temporizadorRef.current.avanzarSegundo()
        const nuevoEstado = temporizadorRef.current.obtenerEstado()
        setEstadoTemp(nuevoEstado)

        if (cambioDeFase) {
          if (nuevoEstado.faseActual === TipoFase.PAUSA_ACTIVA) {
            servicioSonido.reproducirSonidoPausaActiva()
            servicioSonido.enviarNotificacionNavegador(
              '¡Pausa Activa!',
              'Despejá la mente y realizá el ejercicio propuesto.'
            )
            setIndiceEjercicioActual((prev) => prev + 1)
          } else if (nuevoEstado.faseActual === TipoFase.TRABAJO) {
            servicioSonido.reproducirSonidoInicioTrabajo()
            servicioSonido.enviarNotificacionNavegador(
              'A Concentrarse',
              'Comienza tu bloque de enfoque y productividad.'
            )
          }

          if (usuarioActual && fasePrevia === TipoFase.TRABAJO) {
            const actualDia = registroDia || {
              fechaIso: fechaHoyIso,
              horasTrabajoEstimadas: 8,
              metaAguaJornadaMl: 1200,
              metaAguaFueraJornadaMl: 1200,
              consumoAguaMl: 0,
              pomodorosCompletados: 0,
              pausasActivasCompletadas: 0,
              zonaElegida: zonaSeleccionada,
              jornadaIniciada: false,
            }
            const regActualizado: RegistroDia = {
              ...actualDia,
              pomodorosCompletados: actualDia.pomodorosCompletados + 1,
            }
            repositorioLocal.guardarRegistroDia(usuarioActual.id, regActualizado).then(() => {
              setRegistroDia(regActualizado)
            })
          }
        }
      }, 1000)
    }

    return () => {
      if (intervalo) clearInterval(intervalo)
    }
  }, [estadoTemp.estaCorriendo, servicioSonido, usuarioActual, registroDia, fechaHoyIso, zonaSeleccionada, repositorioLocal])

  // Controles del Temporizador
  const iniciarTemporizador = () => {
    temporizadorRef.current?.iniciar()
    setEstadoTemp(temporizadorRef.current!.obtenerEstado())
  }

  const pausarTemporizador = () => {
    temporizadorRef.current?.pausar()
    setEstadoTemp(temporizadorRef.current!.obtenerEstado())
  }

  const reiniciarTemporizador = () => {
    temporizadorRef.current?.reiniciarFaseActual()
    setEstadoTemp(temporizadorRef.current!.obtenerEstado())
  }

  const saltarFaseTemporizador = () => {
    temporizadorRef.current?.completarFaseActual()
    setEstadoTemp(temporizadorRef.current!.obtenerEstado())
  }

  const actualizarTiemposTemporizador = (trabajoMin: number, pausaMin: number) => {
    setConfigTrabajoMin(trabajoMin)
    setConfigPausaMin(pausaMin)
    temporizadorRef.current?.actualizarConfiguracion({
      minutosTrabajo: trabajoMin,
      minutosPausaActiva: pausaMin,
    })
    setEstadoTemp(temporizadorRef.current!.obtenerEstado())
  }

  // Manejador Iniciar el Día
  const confirmarIniciarDia = async (horasTrabajo: number, vasosPrevios: number) => {
    if (!usuarioActual) return
    const nuevoReg = await casoIniciarDia.ejecutar({
      usuarioId: usuarioActual.id,
      fechaIso: fechaHoyIso,
      horasTrabajo,
      zonaElegida: zonaSeleccionada,
      vasosPreviosTomados: vasosPrevios,
    })
    setRegistroDia(nuevoReg)
    setModalIniciarDiaAbierto(false)
  }

  // Manejador Registro de Agua
  const registrarAgua = async (mililitros: number) => {
    if (!usuarioActual) return
    const regActualizado = await casoRegistrarAgua.ejecutar({
      usuarioId: usuarioActual.id,
      fechaIso: fechaHoyIso,
      mililitros,
    })
    setRegistroDia(regActualizado)

    const metaTotal = regActualizado.metaAguaJornadaMl + regActualizado.metaAguaFueraJornadaMl
    if (regActualizado.consumoAguaMl >= metaTotal) {
      servicioSonido.reproducirSonidoMetaAlcanzada()
    }
  }

  // Manejador Actualizar Peso
  const guardarNuevoPeso = async (nuevoPesoKg: number, nota?: string) => {
    if (!usuarioActual) return
    const usuarioActualizado = await casoActualizarPeso.ejecutar({
      usuarioId: usuarioActual.id,
      nuevoPesoKg,
      fechaIso: fechaHoyIso,
      nota,
    })
    setUsuarioActual(usuarioActualizado)
    setModalPesoAbierto(false)

    // Sincronizar en Firestore si hay sesión
    if (usuarioActualizado.email) {
      const repoRemoto = new RepositorioFirestore(usuarioActualizado.id)
      repoRemoto.guardarUsuario(usuarioActualizado).catch(() => {})
    }
  }

  // Completar Onboarding Físico (Peso, Altura, Edad)
  const completarOnboarding = async (datos: {
    nombre: string
    edad: number
    pesoKg: number
    alturaCm: number
  }) => {
    const usuarioId = usuarioActual?.id || `usr_${Date.now()}`
    const nuevoUsuario: Usuario = {
      id: usuarioId,
      nombre: datos.nombre,
      email: usuarioActual?.email,
      pesoActualKg: datos.pesoKg,
      alturaCm: datos.alturaCm,
      edad: datos.edad,
      historialPesos: [
        { id: `peso_${Date.now()}`, fechaIso: fechaHoyIso, pesoKg: datos.pesoKg, nota: 'Perfil inicial' },
      ],
      historialDias: {},
      creadoEnIso: new Date().toISOString(),
    }

    await repositorioLocal.guardarUsuario(nuevoUsuario)
    if (nuevoUsuario.email) {
      const repoRemoto = new RepositorioFirestore(nuevoUsuario.id)
      await repoRemoto.guardarUsuario(nuevoUsuario).catch(() => {})
    }

    setUsuarioActual(nuevoUsuario)
  }

  // Exportar / Importar JSON
  const exportarJSON = () => {
    const json = repositorioLocal.exportarDatosJSON()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pomofit_respaldo_${fechaHoyIso}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importarJSON = (jsonString: string) => {
    const exito = repositorioLocal.importarDatosJSON(jsonString)
    if (exito) {
      window.location.reload()
    } else {
      alert('El archivo de respaldo no es válido.')
    }
  }

  // Duración total de la fase actual
  const duracionTotalFaseSegundos = useMemo(() => {
    switch (estadoTemp.faseActual) {
      case TipoFase.TRABAJO:
        return configTrabajoMin * 60
      case TipoFase.PAUSA_ACTIVA:
        return configPausaMin * 60
      case TipoFase.DESCANSO_LARGO:
        return 15 * 60
    }
  }, [estadoTemp.faseActual, configTrabajoMin, configPausaMin])

  if (cargandoSesion) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: 'var(--color-texto-secundario)' }}>
        Cargando Pomodoro Fit...
      </div>
    )
  }

  // PANTALLA 1: Bienvenida e Inicio de Sesión con Google o Local
  if (!usuarioActual) {
    return (
      <PantallaBienvenida
        alAutenticarGoogle={(datos) => {
          setUsuarioActual({
            id: datos.id,
            nombre: datos.nombre,
            email: datos.email || undefined,
            pesoActualKg: 0,
            alturaCm: 0,
            edad: 0,
            historialPesos: [],
            historialDias: {},
            creadoEnIso: new Date().toISOString(),
          })
        }}
        alContinuarComoInvitado={() => {
          setUsuarioActual({
            id: `invitado_${Date.now()}`,
            nombre: 'Luis',
            pesoActualKg: 0,
            alturaCm: 0,
            edad: 0,
            historialPesos: [],
            historialDias: {},
            creadoEnIso: new Date().toISOString(),
          })
        }}
      />
    )
  }

  // PANTALLA 2: Onboarding Físico si faltan datos de peso, edad o altura
  const necesitaOnboarding =
    !usuarioActual.pesoActualKg ||
    usuarioActual.pesoActualKg <= 0 ||
    !usuarioActual.alturaCm ||
    usuarioActual.alturaCm <= 0 ||
    !usuarioActual.edad ||
    usuarioActual.edad <= 0

  if (necesitaOnboarding) {
    return (
      <PantallaOnboarding
        nombreInicial={usuarioActual.nombre}
        emailInicial={usuarioActual.email}
        alCompletarPerfil={completarOnboarding}
      />
    )
  }

  // PANTALLA 3: Tablero Principal (Espacioso, no amontonado, estándar Impeccable)
  return (
    <div className="contenedor-app">
      <BarraSuperior
        usuarioActual={usuarioActual}
        usuariosDisponibles={usuariosDisponibles}
        pestanaActiva={pestanaActiva}
        alCambiarPestana={setPestanaActiva}
        alCambiarUsuario={async (id) => {
          await repositorioLocal.seleccionarUsuarioActivo(id)
          const u = await repositorioLocal.obtenerUsuarioActual()
          setUsuarioActual(u)
        }}
        alExportarJSON={exportarJSON}
        alImportarJSON={importarJSON}
      />

      <main>
        {pestanaActiva === 'CONCENTRACION' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <SelectorZonaCorporal
              zonaSeleccionada={zonaSeleccionada}
              alSeleccionarZona={(zona) => {
                setZonaSeleccionada(zona)
                setIndiceEjercicioActual(0)
                if (usuarioActual && registroDia) {
                  const regActualizado: RegistroDia = { ...registroDia, zonaElegida: zona }
                  repositorioLocal.guardarRegistroDia(usuarioActual.id, regActualizado)
                  setRegistroDia(regActualizado)
                }
              }}
            />

            <div className="rejilla-operacion">
              <RelojPomodoro
                estado={estadoTemp}
                duracionTotalSegundos={duracionTotalFaseSegundos}
                alIniciar={iniciarTemporizador}
                alPausar={pausarTemporizador}
                alReiniciar={reiniciarTemporizador}
                alSaltarFase={saltarFaseTemporizador}
                alActualizarTiempos={actualizarTiemposTemporizador}
              />

              <PanelEjercicioPausa
                ejercicio={ejercicioActual}
                esPausaActiva={estadoTemp.faseActual === TipoFase.PAUSA_ACTIVA}
                alSiguienteEjercicio={() => setIndiceEjercicioActual((prev) => prev + 1)}
                alEjercicioAnterior={() =>
                  setIndiceEjercicioActual((prev) => Math.max(0, prev - 1))
                }
              />
            </div>
          </div>
        )}

        {pestanaActiva === 'HIDRATACION' && (
          <PanelHidratacion
            usuario={usuarioActual}
            registroDia={registroDia}
            alIniciarDia={() => setModalIniciarDiaAbierto(true)}
            alRegistrarAgua={registrarAgua}
            alAbrirModalPeso={() => setModalPesoAbierto(true)}
          />
        )}

        {pestanaActiva === 'HISTORIAL' && (
          <GraficoHistorialAvance
            historialPesos={usuarioActual.historialPesos}
            historialDias={usuarioActual.historialDias || {}}
            alAbrirModalPeso={() => setModalPesoAbierto(true)}
          />
        )}

        {pestanaActiva === 'CUENTA' && (
          <PestanaCuentaAuth
            usuarioActual={usuarioActual}
            alCrearOActualizarPerfilLocal={(nombre, pesoKg, alturaCm, email) => {
              completarOnboarding({ nombre, edad: usuarioActual.edad || 25, pesoKg, alturaCm })
            }}
            alCerrarSesion={async () => {
              await ServicioAutenticacionFirebase.cerrarSesion()
              setUsuarioActual(null)
            }}
          />
        )}
      </main>

      {/* Modales */}
      {modalIniciarDiaAbierto && (
        <ModalIniciarDia
          pesoUsuarioKg={usuarioActual.pesoActualKg}
          zonaActual={zonaSeleccionada}
          alConfirmar={confirmarIniciarDia}
          alCerrar={() => setModalIniciarDiaAbierto(false)}
        />
      )}

      {modalPesoAbierto && (
        <ModalActualizarPeso
          pesoActualKg={usuarioActual.pesoActualKg}
          alturaCm={usuarioActual.alturaCm}
          alGuardar={guardarNuevoPeso}
          alCerrar={() => setModalPesoAbierto(false)}
        />
      )}
    </div>
  )
}

export default App
