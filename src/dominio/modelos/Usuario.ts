import { RegistroPeso } from './RegistroPeso'
import { RegistroDia } from './RegistroDia'

export interface Usuario {
  id: string
  nombre: string
  email?: string
  pesoActualKg: number
  alturaCm: number
  edad?: number
  historialPesos: RegistroPeso[]
  historialDias: Record<string, RegistroDia> // Clave formato YYYY-MM-DD
  creadoEnIso: string
}
