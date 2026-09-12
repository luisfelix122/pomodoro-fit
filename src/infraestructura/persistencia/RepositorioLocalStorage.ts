import { RepositorioUsuario } from '../../dominio/repositorios/RepositorioUsuario'
import { Usuario } from '../../dominio/modelos/Usuario'
import { RegistroDia } from '../../dominio/modelos/RegistroDia'

export class RepositorioLocalStorage implements RepositorioUsuario {
  private readonly CLAVE_USUARIO_ACTUAL = 'pomofit_usuario_actual_id'
  private readonly CLAVE_USUARIOS = 'pomofit_usuarios'
  private readonly CLAVE_REGISTROS_DIAS = 'pomofit_registros_dias'

  async obtenerUsuarioActual(): Promise<Usuario | null> {
    const idActual = localStorage.getItem(this.CLAVE_USUARIO_ACTUAL)
    if (!idActual) {
      const todos = await this.listarUsuariosLocales()
      return todos.length > 0 ? todos[0] : null
    }

    const mapaUsuarios = this.obtenerMapaUsuarios()
    return mapaUsuarios[idActual] || null
  }

  async guardarUsuario(usuario: Usuario): Promise<void> {
    const mapaUsuarios = this.obtenerMapaUsuarios()
    mapaUsuarios[usuario.id] = usuario
    localStorage.setItem(this.CLAVE_USUARIOS, JSON.stringify(mapaUsuarios))
    localStorage.setItem(this.CLAVE_USUARIO_ACTUAL, usuario.id)
  }

  async guardarRegistroDia(usuarioId: string, registro: RegistroDia): Promise<void> {
    const mapaRegistros = this.obtenerMapaRegistros()
    const clave = `${usuarioId}_${registro.fechaIso}`
    mapaRegistros[clave] = registro
    localStorage.setItem(this.CLAVE_REGISTROS_DIAS, JSON.stringify(mapaRegistros))

    // También actualizamos el usuario si tiene el mapa
    const mapaUsuarios = this.obtenerMapaUsuarios()
    const usuario = mapaUsuarios[usuarioId]
    if (usuario) {
      usuario.historialDias = usuario.historialDias || {}
      usuario.historialDias[registro.fechaIso] = registro
      localStorage.setItem(this.CLAVE_USUARIOS, JSON.stringify(mapaUsuarios))
    }
  }

  async obtenerRegistroDia(usuarioId: string, fechaIso: string): Promise<RegistroDia | null> {
    const mapaRegistros = this.obtenerMapaRegistros()
    const clave = `${usuarioId}_${fechaIso}`
    return mapaRegistros[clave] || null
  }

  async listarUsuariosLocales(): Promise<Usuario[]> {
    const mapa = this.obtenerMapaUsuarios()
    return Object.values(mapa)
  }

  async seleccionarUsuarioActivo(id: string): Promise<void> {
    localStorage.setItem(this.CLAVE_USUARIO_ACTUAL, id)
  }

  exportarDatosJSON(): string {
    const datos = {
      version: 1,
      fechaExportacion: new Date().toISOString(),
      usuarios: this.obtenerMapaUsuarios(),
      registros: this.obtenerMapaRegistros(),
      usuarioActualId: localStorage.getItem(this.CLAVE_USUARIO_ACTUAL),
    }
    return JSON.stringify(datos, null, 2)
  }

  importarDatosJSON(jsonString: string): boolean {
    try {
      const datos = JSON.parse(jsonString)
      if (datos && datos.usuarios) {
        localStorage.setItem(this.CLAVE_USUARIOS, JSON.stringify(datos.usuarios))
      }
      if (datos && datos.registros) {
        localStorage.setItem(this.CLAVE_REGISTROS_DIAS, JSON.stringify(datos.registros))
      }
      if (datos && datos.usuarioActualId) {
        localStorage.setItem(this.CLAVE_USUARIO_ACTUAL, datos.usuarioActualId)
      }
      return true
    } catch {
      return false
    }
  }

  private obtenerMapaUsuarios(): Record<string, Usuario> {
    try {
      const datos = localStorage.getItem(this.CLAVE_USUARIOS)
      return datos ? JSON.parse(datos) : {}
    } catch {
      return {}
    }
  }

  private obtenerMapaRegistros(): Record<string, RegistroDia> {
    try {
      const datos = localStorage.getItem(this.CLAVE_REGISTROS_DIAS)
      return datos ? JSON.parse(datos) : {}
    } catch {
      return {}
    }
  }
}
