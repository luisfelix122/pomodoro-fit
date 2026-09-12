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

export function App() {
  // Instancias de infraestructura (persistentes)
  const repositorio = useMemo(() => new RepositorioLocalStorage(), [])
  const servicioSonido = useMemo(() => new GeneradorSonidoWeb(), [])
  const gestorEjercicios = useMemo(() => new GestorEjercicios(), [])

  // Casos de uso
  const casoIniciarDia = useMemo(() => new IniciarDiaTrabajo(repositorio), [repositorio])
  const casoRegistrarAgua = useMemo(() => new RegistrarConsumoAgua(repositorio), [repositorio])
  const casoActualizarPeso = useMemo(() => new ActualizarPesoUsuario(repositorio), [repositorio])

  // Estados de aplicación
  const [usuarioActual, setUsuarioActual] = useState<Usuario | null>(null)
  const [usuariosDisponibles, setUsuariosDisponibles] = useState<Usuario[]>([])
  const [registroDia, setRegistroDia] = useState<RegistroDia | null>(null)
  const [pestanaActiva, setPestanaActiva] = useState<TipoPestana>('CONCENTRACION')

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

  // Fecha de hoy en formato YYYY-MM-DD
  const fechaHoyIso = useMemo(() => new Date().toISOString().slice(0, 10), [])

  // Cargar usuario y datos iniciales
  const cargarDatosUsuario = useCallback(async () => {
    let usuario = await repositorio.obtenerUsuarioActual()
    const todos = (await repositorio.listarUsuariosLocales?.()) || []

    if (!usuario) {
      // Perfil por defecto inicial
      usuario = {
        id: `usr_${Date.now()}`,
        nombre: 'Luis',
        pesoActualKg: 72,
        alturaCm: 175,
        historialPesos: [
          { id: `peso_${Date.now()}`, fechaIso: fechaHoyIso, pesoKg: 72, nota: 'Peso inicial' },
        ],
        historialDias: {},
        creadoEnIso: new Date().toISOString(),
      }
      await repositorio.guardarUsuario(usuario)
    }

    setUsuarioActual(usuario)
    setUsuariosDisponibles(todos.length > 0 ? todos : [usuario])

    // Cargar registro de hoy
    const reg = await repositorio.obtenerRegistroDia(usuario.id, fechaHoyIso)
    if (reg) {
      setRegistroDia(reg)
      setZonaSeleccionada(reg.zonaElegida)
    }
  }, [repositorio, fechaHoyIso])

  useEffect(() => {
    cargarDatosUsuario()
  }, [cargarDatosUsuario])

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
              'Momento de despejar la mente y activar el cuerpo.'
            )
            // Cambiar automáticamente al siguiente ejercicio
            setIndiceEjercicioActual((prev) => prev + 1)
          } else if (nuevoEstado.faseActual === TipoFase.TRABAJO) {
            servicioSonido.reproducirSonidoInicioTrabajo()
            servicioSonido.enviarNotificacionNavegador(
              'Volver a Enfoque',
              'Comienza una nueva sesión de concentración.'
            )
          }

          // Registrar pomodoro completado si el usuario está activo
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
            repositorio.guardarRegistroDia(usuarioActual.id, regActualizado).then(() => {
              setRegistroDia(regActualizado)
            })
          }
        }
      }, 1000)
    }

    return () => {
      if (intervalo) clearInterval(intervalo)
    }
  }, [estadoTemp.estaCorriendo, servicioSonido, usuarioActual, registroDia, fechaHoyIso, zonaSeleccionada, repositorio])

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
  }

  // Guardar o Crear Perfil
  const crearOActualizarPerfil = async (
    nombre: string,
    pesoKg: number,
    alturaCm: number,
    email?: string
  ) => {
    const usuario: Usuario = {
      id: usuarioActual?.id || `usr_${Date.now()}`,
      nombre,
      email,
      pesoActualKg: pesoKg,
      alturaCm,
      historialPesos: usuarioActual?.historialPesos || [
        { id: `peso_${Date.now()}`, fechaIso: fechaHoyIso, pesoKg },
      ],
      historialDias: usuarioActual?.historialDias || {},
      creadoEnIso: usuarioActual?.creadoEnIso || new Date().toISOString(),
    }
    await repositorio.guardarUsuario(usuario)
    setUsuarioActual(usuario)
    const todos = (await repositorio.listarUsuariosLocales?.()) || [usuario]
    setUsuariosDisponibles(todos)
  }

  // Exportar / Importar JSON
  const exportarJSON = () => {
    const json = repositorio.exportarDatosJSON()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pomofit_respaldo_${fechaHoyIso}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importarJSON = (jsonString: string) => {
    const exito = repositorio.importarDatosJSON(jsonString)
    if (exito) {
      cargarDatosUsuario()
      alert('¡Datos restaurados con éxito!')
    } else {
      alert('El archivo de copia de seguridad no es válido.')
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

  return (
    <div className="contenedor-app">
      {/* Contrato visual Impeccable */}
      {/* THESIS: Pomodoro con pausas de calistenia y seguimiento hídrico estricto, sin distracciones ni tarjetas decorativas. */}
      {/* OWN-WORLD: Paleta deportiva profunda, grafismo nítido en SVG y Web Audio integrado. */}

      <BarraSuperior
        usuarioActual={usuarioActual}
        usuariosDisponibles={usuariosDisponibles}
        pestanaActiva={pestanaActiva}
        alCambiarPestana={setPestanaActiva}
        alCambiarUsuario={async (id) => {
          await repositorio.seleccionarUsuarioActivo(id)
          cargarDatosUsuario()
        }}
        alExportarJSON={exportarJSON}
        alImportarJSON={importarJSON}
      />

      <main>
        {pestanaActiva === 'CONCENTRACION' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <SelectorZonaCorporal
              zonaSeleccionada={zonaSeleccionada}
              alSeleccionarZona={(zona) => {
                setZonaSeleccionada(zona)
                setIndiceEjercicioActual(0)
                if (usuarioActual && registroDia) {
                  const regActualizado: RegistroDia = { ...registroDia, zonaElegida: zona }
                  repositorio.guardarRegistroDia(usuarioActual.id, regActualizado)
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

        {pestanaActiva === 'HIDRATACION' && usuarioActual && (
          <PanelHidratacion
            usuario={usuarioActual}
            registroDia={registroDia}
            alIniciarDia={() => setModalIniciarDiaAbierto(true)}
            alRegistrarAgua={registrarAgua}
            alAbrirModalPeso={() => setModalPesoAbierto(true)}
          />
        )}

        {pestanaActiva === 'HISTORIAL' && usuarioActual && (
          <GraficoHistorialAvance
            historialPesos={usuarioActual.historialPesos}
            historialDias={usuarioActual.historialDias || {}}
            alAbrirModalPeso={() => setModalPesoAbierto(true)}
          />
        )}

        {pestanaActiva === 'CUENTA' && (
          <PestanaCuentaAuth
            usuarioActual={usuarioActual}
            alCrearOActualizarPerfilLocal={crearOActualizarPerfil}
            alCerrarSesion={async () => {
              setUsuarioActual(null)
              setPestanaActiva('CUENTA')
            }}
          />
        )}
      </main>

      {/* Modales */}
      {modalIniciarDiaAbierto && usuarioActual && (
        <ModalIniciarDia
          pesoUsuarioKg={usuarioActual.pesoActualKg}
          zonaActual={zonaSeleccionada}
          alConfirmar={confirmarIniciarDia}
          alCerrar={() => setModalIniciarDiaAbierto(false)}
        />
      )}

      {modalPesoAbierto && usuarioActual && (
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
