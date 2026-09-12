export enum TipoFase {
  TRABAJO = 'TRABAJO',
  PAUSA_ACTIVA = 'PAUSA_ACTIVA',
  DESCANSO_LARGO = 'DESCANSO_LARGO',
}

export interface ConfiguracionTemporizador {
  minutosTrabajo: number
  minutosPausaActiva: number
  minutosDescansoLargo?: number
  ciclosParaDescansoLargo?: number
}

export interface EstadoTemporizador {
  faseActual: TipoFase
  segundosRestantes: number
  estaCorriendo: boolean
  ciclosCompletados: number
  ejercicioActualIndice: number
}
