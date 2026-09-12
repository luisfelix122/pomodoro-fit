import { describe, it, expect } from 'vitest'
import { CalculadoraAgua } from '../../src/dominio/servicios/CalculadoraAgua'

describe('CalculadoraAgua', () => {
  it('debe calcular la meta de agua diaria base (35 ml por kg)', () => {
    const pesoKg = 70
    const metaMl = CalculadoraAgua.calcularMetaDiaria(pesoKg)

    // 70 * 35 = 2450 ml
    expect(metaMl).toBe(2450)
  })

  it('debe calcular el número de vasos equivalentes para una cantidad en ml', () => {
    // Si cada vaso es de 250ml, 1000ml son 4 vasos
    const vasos = CalculadoraAgua.calcularVasos(1000, 250)
    expect(vasos).toBe(4)
  })

  it('debe distribuir el agua entre la jornada laboral y el resto del día', () => {
    const metaDiariaMl = 2400
    const horasTrabajo = 8 // de 16 horas despierto = 50%
    const distribucion = CalculadoraAgua.distribuirPorJornada(metaDiariaMl, horasTrabajo, 16)

    expect(distribucion.aguaJornadaMl).toBe(1200)
    expect(distribucion.aguaFueraJornadaMl).toBe(1200)
  })

  it('debe arrojar error si el peso o las horas de trabajo son negativas o exceden el límite', () => {
    expect(() => CalculadoraAgua.calcularMetaDiaria(0)).toThrow('El peso debe ser mayor a cero')
    expect(() => CalculadoraAgua.distribuirPorJornada(2000, 25)).toThrow('Las horas de trabajo no pueden exceder las horas despierto')
  })
})
