import { RepositorioUsuario } from '../../dominio/repositorios/RepositorioUsuario'
import { RegistroDia } from '../../dominio/modelos/RegistroDia'
import { ZonaCuerpo } from '../../dominio/modelos/ZonaCuerpo'
import { CalculadoraAgua } from '../../dominio/servicios/CalculadoraAgua'

export interface EntradaIniciarDia {
  usuarioId: string
  fechaIso: string
  horasTrabajo: number
  zonaElegida: ZonaCuerpo
  vasosPreviosTomados?: number
  volumenVasoMl?: number
}

export class IniciarDiaTrabajo {
  constructor(private repositorio: RepositorioUsuario) {}

  async ejecutar(entrada: EntradaIniciarDia): Promise<RegistroDia> {
    const usuario = await this.repositorio.obtenerUsuarioActual()
    if (!usuario) {
      throw new Error('No se encontró el perfil de usuario para iniciar el día')
    }

    const metaDiariaTotal = CalculadoraAgua.calcularMetaDiaria(usuario.pesoActualKg)
    const distribucion = CalculadoraAgua.distribuirPorJornada(
      metaDiariaTotal,
      entrada.horasTrabajo,
      16 // Horas promedio despierto
    )

    const volumenVaso = entrada.volumenVasoMl ?? 250
    const aguaPrevia = (entrada.vasosPreviosTomados ?? 0) * volumenVaso

    const registroExistente = await this.repositorio.obtenerRegistroDia(
      entrada.usuarioId,
      entrada.fechaIso
    )

    const nuevoRegistro: RegistroDia = {
      fechaIso: entrada.fechaIso,
      horasTrabajoEstimadas: entrada.horasTrabajo,
      metaAguaJornadaMl: distribucion.aguaJornadaMl,
      metaAguaFueraJornadaMl: distribucion.aguaFueraJornadaMl,
      consumoAguaMl: (registroExistente?.consumoAguaMl ?? 0) + aguaPrevia,
      pomodorosCompletados: registroExistente?.pomodorosCompletados ?? 0,
      pausasActivasCompletadas: registroExistente?.pausasActivasCompletadas ?? 0,
      zonaElegida: entrada.zonaElegida,
      jornadaIniciada: true,
    }

    await this.repositorio.guardarRegistroDia(entrada.usuarioId, nuevoRegistro)
    return nuevoRegistro
  }
}
