import { describe, it, expect, beforeEach } from 'vitest'
import { ActualizarPesoUsuario } from '../../src/aplicacion/casos-de-uso/ActualizarPesoUsuario'
import { RepositorioUsuario } from '../../src/dominio/repositorios/RepositorioUsuario'
import { Usuario } from '../../src/dominio/modelos/Usuario'
import { RegistroDia } from '../../src/dominio/modelos/RegistroDia'

class RepositorioEnMemoria implements RepositorioUsuario {
  public usuario: Usuario | null = null

  async obtenerUsuarioActual(): Promise<Usuario | null> {
    return this.usuario
  }
  async guardarUsuario(usuario: Usuario): Promise<void> {
    this.usuario = usuario
  }
  async guardarRegistroDia(): Promise<void> {}
  async obtenerRegistroDia(): Promise<RegistroDia | null> {
    return null
  }
}

describe('Caso de Uso: ActualizarPesoUsuario', () => {
  let repo: RepositorioEnMemoria
  let casoDeUso: ActualizarPesoUsuario

  beforeEach(() => {
    repo = new RepositorioEnMemoria()
    repo.usuario = {
      id: 'usr-1',
      nombre: 'Luis',
      pesoActualKg: 75,
      alturaCm: 175,
      historialPesos: [
        { id: 'p-1', fechaIso: '2026-09-01', pesoKg: 75 },
      ],
      historialDias: {},
      creadoEnIso: new Date().toISOString(),
    }
    casoDeUso = new ActualizarPesoUsuario(repo)
  })

  it('debe actualizar el peso actual y añadir una nueva entrada al historial cronológico', async () => {
    const usuarioActualizado = await casoDeUso.ejecutar({
      usuarioId: 'usr-1',
      nuevoPesoKg: 73.5,
      fechaIso: '2026-09-12',
      nota: 'Entrenamiento regular',
    })

    expect(usuarioActualizado.pesoActualKg).toBe(73.5)
    expect(usuarioActualizado.historialPesos.length).toBe(2)
    expect(usuarioActualizado.historialPesos[1].pesoKg).toBe(73.5)
    expect(usuarioActualizado.historialPesos[1].nota).toBe('Entrenamiento regular')
  })
})
