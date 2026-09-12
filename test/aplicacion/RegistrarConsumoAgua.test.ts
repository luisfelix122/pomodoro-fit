import { describe, it, expect, beforeEach } from 'vitest'
import { RegistrarConsumoAgua } from '../../src/aplicacion/casos-de-uso/RegistrarConsumoAgua'
import { RepositorioUsuario } from '../../src/dominio/repositorios/RepositorioUsuario'
import { Usuario } from '../../src/dominio/modelos/Usuario'
import { RegistroDia } from '../../src/dominio/modelos/RegistroDia'
import { ZonaCuerpo } from '../../src/dominio/modelos/ZonaCuerpo'

class RepositorioEnMemoria implements RepositorioUsuario {
  public usuario: Usuario | null = null
  public dias: Map<string, RegistroDia> = new Map()

  async obtenerUsuarioActual(): Promise<Usuario | null> {
    return this.usuario
  }
  async guardarUsuario(usuario: Usuario): Promise<void> {
    this.usuario = usuario
  }
  async guardarRegistroDia(usuarioId: string, registro: RegistroDia): Promise<void> {
    this.dias.set(`${usuarioId}_${registro.fechaIso}`, registro)
  }
  async obtenerRegistroDia(usuarioId: string, fechaIso: string): Promise<RegistroDia | null> {
    return this.dias.get(`${usuarioId}_${fechaIso}`) || null
  }
}

describe('Caso de Uso: RegistrarConsumoAgua', () => {
  let repo: RepositorioEnMemoria
  let casoDeUso: RegistrarConsumoAgua
  const fechaIso = '2026-09-12'

  beforeEach(async () => {
    repo = new RepositorioEnMemoria()
    repo.usuario = {
      id: 'usr-1',
      nombre: 'Luis',
      pesoActualKg: 70,
      alturaCm: 175,
      historialPesos: [],
      historialDias: {},
      creadoEnIso: new Date().toISOString(),
    }
    const registroInicial: RegistroDia = {
      fechaIso,
      horasTrabajoEstimadas: 8,
      metaAguaJornadaMl: 1225,
      metaAguaFueraJornadaMl: 1225,
      consumoAguaMl: 250, // Ya tomó 1 vaso
      pomodorosCompletados: 1,
      pausasActivasCompletadas: 1,
      zonaElegida: ZonaCuerpo.TODO_EL_CUERPO,
      jornadaIniciada: true,
    }
    await repo.guardarRegistroDia('usr-1', registroInicial)
    casoDeUso = new RegistrarConsumoAgua(repo)
  })

  it('debe incrementar el consumo de agua por cantidad de mililitros o vasos', async () => {
    // Agrega 2 vasos de 250ml = 500ml
    const actualizado = await casoDeUso.ejecutar({
      usuarioId: 'usr-1',
      fechaIso,
      mililitros: 500,
    })

    expect(actualizado.consumoAguaMl).toBe(750)
  })
})
