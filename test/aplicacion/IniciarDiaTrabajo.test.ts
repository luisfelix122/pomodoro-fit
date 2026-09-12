import { describe, it, expect, beforeEach } from 'vitest'
import { IniciarDiaTrabajo } from '../../src/aplicacion/casos-de-uso/IniciarDiaTrabajo'
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

describe('Caso de Uso: IniciarDiaTrabajo', () => {
  let repo: RepositorioEnMemoria
  let casoDeUso: IniciarDiaTrabajo

  beforeEach(() => {
    repo = new RepositorioEnMemoria()
    repo.usuario = {
      id: 'usr-1',
      nombre: 'Luis',
      pesoActualKg: 70, // 70 * 35 = 2450 ml
      alturaCm: 175,
      historialPesos: [],
      historialDias: {},
      creadoEnIso: new Date().toISOString(),
    }
    casoDeUso = new IniciarDiaTrabajo(repo)
  })

  it('debe calcular las metas hídricas según las horas de trabajo elegidas e iniciar la jornada', async () => {
    const fechaIso = '2026-09-12'
    const horasTrabajo = 8
    const zonaElegida = ZonaCuerpo.TREN_SUPERIOR

    const registro = await casoDeUso.ejecutar({
      usuarioId: 'usr-1',
      fechaIso,
      horasTrabajo,
      zonaElegida,
    })

    expect(registro.jornadaIniciada).toBe(true)
    expect(registro.horasTrabajoEstimadas).toBe(8)
    expect(registro.zonaElegida).toBe(ZonaCuerpo.TREN_SUPERIOR)
    // 8 horas de 16 despierto = 50% de 2450 = 1225 ml
    expect(registro.metaAguaJornadaMl).toBe(1225)
    expect(registro.metaAguaFueraJornadaMl).toBe(1225)
    expect(registro.consumoAguaMl).toBe(0)
  })
})
