import { ZonaCuerpo } from './ZonaCuerpo'

export interface Ejercicio {
  id: string
  nombre: string
  descripcion: string
  zona: ZonaCuerpo
  duracionSegundos: number
  repeticiones?: string
  instrucciones: string[]
  dificultad: 'PRINCIPIANTE' | 'INTERMEDIO' | 'AVANZADO'
}
