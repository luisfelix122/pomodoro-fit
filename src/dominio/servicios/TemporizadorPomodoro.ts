import {
  ConfiguracionTemporizador,
  EstadoTemporizador,
  TipoFase,
} from '../modelos/EstadoTemporizador'

export class TemporizadorPomodoro {
  private configuracion: Required<ConfiguracionTemporizador>
  private estado: EstadoTemporizador

  constructor(configuracion: ConfiguracionTemporizador) {
    this.configuracion = {
      minutosTrabajo: configuracion.minutosTrabajo,
      minutosPausaActiva: configuracion.minutosPausaActiva,
      minutosDescansoLargo: configuracion.minutosDescansoLargo ?? 15,
      ciclosParaDescansoLargo: configuracion.ciclosParaDescansoLargo ?? 4,
    }

    this.estado = {
      faseActual: TipoFase.TRABAJO,
      segundosRestantes: this.configuracion.minutosTrabajo * 60,
      estaCorriendo: false,
      ciclosCompletados: 0,
      ejercicioActualIndice: 0,
    }
  }

  obtenerEstado(): Readonly<EstadoTemporizador> {
    return { ...this.estado }
  }

  iniciar(): void {
    this.estado.estaCorriendo = true
  }

  pausar(): void {
    this.estado.estaCorriendo = false
  }

  reiniciarFaseActual(): void {
    this.estado.estaCorriendo = false
    this.estado.segundosRestantes = this.obtenerSegundosParaFase(this.estado.faseActual)
  }

  establecerSegundosRestantes(segundos: number): void {
    this.estado.segundosRestantes = Math.max(0, segundos)
  }

  /**
   * Avanza 1 segundo en el temporizador.
   * Devuelve `true` si hubo un cambio de fase (ej. de trabajo a pausa).
   */
  avanzarSegundo(): boolean {
    if (!this.estado.estaCorriendo) {
      return false
    }

    if (this.estado.segundosRestantes > 1) {
      this.estado.segundosRestantes -= 1
      return false
    }

    // Llegó a 0 -> Transicionar fase
    this.completarFaseActual()
    return true
  }

  completarFaseActual(): void {
    if (this.estado.faseActual === TipoFase.TRABAJO) {
      this.estado.ciclosCompletados += 1
      const tocaDescansoLargo =
        this.estado.ciclosCompletados % this.configuracion.ciclosParaDescansoLargo === 0

      this.estado.faseActual = tocaDescansoLargo
        ? TipoFase.DESCANSO_LARGO
        : TipoFase.PAUSA_ACTIVA
    } else {
      // Si venía de pausa activa o descanso largo, volvemos a trabajo
      if (this.estado.faseActual === TipoFase.PAUSA_ACTIVA) {
        this.estado.ejercicioActualIndice += 1
      }
      this.estado.faseActual = TipoFase.TRABAJO
    }

    this.estado.segundosRestantes = this.obtenerSegundosParaFase(this.estado.faseActual)
  }

  actualizarConfiguracion(nuevaConfiguracion: Partial<ConfiguracionTemporizador>): void {
    this.configuracion = {
      ...this.configuracion,
      ...nuevaConfiguracion,
    }
    // Si no está corriendo, actualizamos segundos de la fase actual
    if (!this.estado.estaCorriendo) {
      this.estado.segundosRestantes = this.obtenerSegundosParaFase(this.estado.faseActual)
    }
  }

  private obtenerSegundosParaFase(fase: TipoFase): number {
    switch (fase) {
      case TipoFase.TRABAJO:
        return this.configuracion.minutosTrabajo * 60
      case TipoFase.PAUSA_ACTIVA:
        return this.configuracion.minutosPausaActiva * 60
      case TipoFase.DESCANSO_LARGO:
        return this.configuracion.minutosDescansoLargo * 60
    }
  }
}
