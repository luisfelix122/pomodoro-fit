import { describe, it, expect, beforeEach } from 'vitest'
import { RepositorioLocalStorage } from '../../src/infraestructura/persistencia/RepositorioLocalStorage'
import { Usuario } from '../../src/dominio/modelos/Usuario'
import { RegistroDia } from '../../src/dominio/modelos/RegistroDia'
import { ZonaCuerpo } from '../../src/dominio/modelos/ZonaCuerpo'

describe('RepositorioLocalStorage', () => {
  let repo: RepositorioLocalStorage

  beforeEach(() => {
    localStorage.clear()
    repo = new RepositorioLocalStorage()
  })

  it('debe guardar y recuperar el usuario actual correctamente', async () => {
    const usuario: Usuario = {
      id: 'usr-luis',
      nombre: 'Luis',
      pesoActualKg: 74,
      alturaCm: 175,
      historialPesos: [{ id: 'p1', fechaIso: '2026-09-12', pesoKg: 74 }],
      historialDias: {},
      creadoEnIso: '2026-09-12T10:00:00Z',
    }

    await repo.guardarUsuario(usuario)
    const recuperado = await repo.obtenerUsuarioActual()

    expect(recuperado).not.toBeNull()
    expect(recuperado?.id).toBe('usr-luis')
    expect(recuperado?.nombre).toBe('Luis')
    expect(recuperado?.pesoActualKg).toBe(74)
  })

  it('debe guardar y recuperar registros diarios del usuario', async () => {
    const usuario: Usuario = {
      id: 'usr-luis',
      nombre: 'Luis',
      pesoActualKg: 74,
      alturaCm: 175,
      historialPesos: [],
      historialDias: {},
      creadoEnIso: '2026-09-12T10:00:00Z',
    }
    await repo.guardarUsuario(usuario)

    const registro: RegistroDia = {
      fechaIso: '2026-09-12',
      horasTrabajoEstimadas: 6,
      metaAguaJornadaMl: 1000,
      metaAguaFueraJornadaMl: 1500,
      consumoAguaMl: 500,
      pomodorosCompletados: 4,
      pausasActivasCompletadas: 4,
      zonaElegida: ZonaCuerpo.MOVILIDAD_POSTURA,
      jornadaIniciada: true,
    }

    await repo.guardarRegistroDia('usr-luis', registro)
    const obtenido = await repo.obtenerRegistroDia('usr-luis', '2026-09-12')

    expect(obtenido).not.toBeNull()
    expect(obtenido?.consumoAguaMl).toBe(500)
    expect(obtenido?.pomodorosCompletados).toBe(4)
  })

  it('debe exportar e importar datos en JSON correctamente', async () => {
    const usuario: Usuario = {
      id: 'usr-test',
      nombre: 'Tester',
      pesoActualKg: 80,
      alturaCm: 180,
      historialPesos: [],
      historialDias: {},
      creadoEnIso: '2026-09-12T10:00:00Z',
    }
    await repo.guardarUsuario(usuario)

    const jsonExportado = repo.exportarDatosJSON()
    expect(jsonExportado).toContain('Tester')

    localStorage.clear()
    expect(await repo.obtenerUsuarioActual()).toBeNull()

    repo.importarDatosJSON(jsonExportado)
    const restaurado = await repo.obtenerUsuarioActual()
    expect(restaurado?.nombre).toBe('Tester')
  })
})
