import { describe, it, expect } from 'vitest'
import { CalculadoraIMC } from '../../src/dominio/servicios/CalculadoraIMC'

describe('CalculadoraIMC', () => {
  it('debe calcular el IMC correctamente para valores normales', () => {
    const pesoKg = 70
    const alturaCm = 175
    const resultado = CalculadoraIMC.calcular(pesoKg, alturaCm)

    // IMC = 70 / (1.75 * 1.75) = 22.86
    expect(resultado.imc).toBeCloseTo(22.86, 1)
    expect(resultado.clasificacion).toBe('Peso normal')
  })

  it('debe clasificar correctamente bajo peso, sobrepeso y obesidad', () => {
    expect(CalculadoraIMC.calcular(45, 170).clasificacion).toBe('Bajo peso')
    expect(CalculadoraIMC.calcular(80, 170).clasificacion).toBe('Sobrepeso')
    expect(CalculadoraIMC.calcular(100, 170).clasificacion).toBe('Obesidad')
  })

  it('debe arrojar error si el peso o la altura son inválidos', () => {
    expect(() => CalculadoraIMC.calcular(0, 170)).toThrow('El peso debe ser mayor a cero')
    expect(() => CalculadoraIMC.calcular(70, 0)).toThrow('La altura debe ser mayor a cero')
  })
})
