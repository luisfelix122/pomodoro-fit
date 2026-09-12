import { Usuario } from '../modelos/Usuario'
import { RegistroDia } from '../modelos/RegistroDia'

export interface RepositorioUsuario {
  obtenerUsuarioActual(): Promise<Usuario | null>
  guardarUsuario(usuario: Usuario): Promise<void>
  guardarRegistroDia(usuarioId: string, registro: RegistroDia): Promise<void>
  obtenerRegistroDia(usuarioId: string, fechaIso: string): Promise<RegistroDia | null>
  listarUsuariosLocales?(): Promise<Usuario[]>
}
