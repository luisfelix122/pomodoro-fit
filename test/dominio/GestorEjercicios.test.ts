import { describe, it, expect } from 'vitest'
import { GestorEjercicios } from '../../src/dominio/servicios/GestorEjercicios'
import { ZonaCuerpo } from '../../src/dominio/modelos/ZonaCuerpo'

describe('GestorEjercicios', () => {
  it('debe obtener ejercicios específicos para cada zona corporal', () => {
    const gestor = new GestorEjercicios()
    const ejerciciosPiernas = gestor.obtenerPorZona(ZonaCuerpo.TREN_INFERIOR)

    expect(ejerciciosPiernas.length).toBeGreaterThan(0)
    expect(ejerciciosPiernas.every(e => e.zona === ZonaCuerpo.TREN_INFERIOR)).toBe(true)
  })

  it('debe devolver ejercicios variados cuando la zona es TODO_EL_CUERPO', () => {
    const gestor = new GestorEjercicios()
    const ejerciciosCompletos = gestor.obtenerPorZona(ZonaCuerpo.TODO_EL_CUERPO)

    expect(ejerciciosCompletos.length).toBeGreaterThan(0)
    // Debe incluir variedad de grupos o ejercicios funcionales de cuerpo completo
    const zonasPresentes = new Set(ejerciciosCompletos.map(e => e.zona))
    expect(zonasPresentes.size).toBeGreaterThanOrEqual(2)
  })

  it('debe permitir obtener el siguiente ejercicio de forma cíclica sin desbordar el índice', () => {
    const gestor = new GestorEjercicios()
    const lista = gestor.obtenerPorZona(ZonaCuerpo.CORE)
    const primer = gestor.obtenerSiguiente(lista, 0)
    const siguiente = gestor.obtenerSiguiente(lista, 1)
    const ciclico = gestor.obtenerSiguiente(lista, lista.length) // índice fuera de rango vuelve al 0

    expect(primer.id).toBe(lista[0].id)
    expect(siguiente.id).toBe(lista[1].id)
    expect(ciclico.id).toBe(lista[0].id)
  })

  it('debe permitir reordenar la rutina según una lista de identificadores personalizada', () => {
    const gestor = new GestorEjercicios()
    const listaOriginal = gestor.obtenerPorZona(ZonaCuerpo.TREN_SUPERIOR)
    const idsInvertidos = [...listaOriginal].reverse().map(e => e.id)

    const reordenada = gestor.reordenarPersonalizado(listaOriginal, idsInvertidos)
    expect(reordenada[0].id).toBe(idsInvertidos[0])
    expect(reordenada[reordenada.length - 1].id).toBe(idsInvertidos[idsInvertidos.length - 1])
  })
})
