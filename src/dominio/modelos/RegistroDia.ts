import { ZonaCuerpo } from './ZonaCuerpo'

export interface RegistroDia {
  fechaIso: string
  horasTrabajoEstimadas: number
  metaAguaJornadaMl: number
  metaAguaFueraJornadaMl: number
  consumoAguaMl: number
  pomodorosCompletados: number
  pausasActivasCompletadas: number
  zonaElegida: ZonaCuerpo
  jornadaIniciada: boolean
}
