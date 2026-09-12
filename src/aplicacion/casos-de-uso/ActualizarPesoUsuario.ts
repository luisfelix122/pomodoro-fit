import { RepositorioUsuario } from '../../dominio/repositorios/RepositorioUsuario'
import { Usuario } from '../../dominio/modelos/Usuario'
import { RegistroPeso } from '../../dominio/modelos/RegistroPeso'

export interface EntradaActualizarPeso {
  usuarioId: string
  nuevoPesoKg: number
  fechaIso: string
  nota?: string
}

export class ActualizarPesoUsuario {
  constructor(private repositorio: RepositorioUsuario) {}

  async ejecutar(entrada: EntradaActualizarPeso): Promise<Usuario> {
    const usuario = await this.repositorio.obtenerUsuarioActual()
    if (!usuario) {
      throw new Error('No se encontró el usuario para actualizar el peso')
    }

    if (entrada.nuevoPesoKg <= 0) {
      throw new Error('El nuevo peso debe ser mayor a cero')
    }

    const nuevoRegistroPeso: RegistroPeso = {
      id: `peso_${Date.now()}`,
      fechaIso: entrada.fechaIso,
      pesoKg: entrada.nuevoPesoKg,
      nota: entrada.nota,
    }

    const historialActualizado = [...usuario.historialPesos, nuevoRegistroPeso]

    const usuarioActualizado: Usuario = {
      ...usuario,
      pesoActualKg: entrada.nuevoPesoKg,
      historialPesos: historialActualizado,
    }

    await this.repositorio.guardarUsuario(usuarioActualizado)
    return usuarioActualizado
  }
}
