import { RepositorioUsuario } from '../../dominio/repositorios/RepositorioUsuario'
import { RegistroDia } from '../../dominio/modelos/RegistroDia'
import { ZonaCuerpo } from '../../dominio/modelos/ZonaCuerpo'

export interface EntradaRegistrarAgua {
  usuarioId: string
  fechaIso: string
  mililitros: number
}

export class RegistrarConsumoAgua {
  constructor(private repositorio: RepositorioUsuario) {}

  async ejecutar(entrada: EntradaRegistrarAgua): Promise<RegistroDia> {
    let registro = await this.repositorio.obtenerRegistroDia(entrada.usuarioId, entrada.fechaIso)

    if (!registro) {
      // Si no inició formalmente el día, se crea un registro base
      registro = {
        fechaIso: entrada.fechaIso,
        horasTrabajoEstimadas: 8,
        metaAguaJornadaMl: 1500,
        metaAguaFueraJornadaMl: 1000,
        consumoAguaMl: 0,
        pomodorosCompletados: 0,
        pausasActivasCompletadas: 0,
        zonaElegida: ZonaCuerpo.TODO_EL_CUERPO,
        jornadaIniciada: false,
      }
    }

    const nuevoConsumo = Math.max(0, registro.consumoAguaMl + entrada.mililitros)
    const registroActualizado: RegistroDia = {
      ...registro,
      consumoAguaMl: nuevoConsumo,
    }

    await this.repositorio.guardarRegistroDia(entrada.usuarioId, registroActualizado)
    return registroActualizado
  }
}
